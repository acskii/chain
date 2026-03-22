/* Imports */
/* React */
import { useState, useEffect, useRef } from 'react';

/* Contexts */
import { useToast } from '../../contexts/ToastContext';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

/* API Backend */
import { chainAPI, executionAPI } from '../../contexts/APIContext';

/* Components */
import StepLevel from '../../components/runChain/StepLevel';
import AddStepNode from '../../components/runChain/AddStepNode';
import ExecutionResult from '../../components/runChain/ExecutionResult';
import LoadingIcon from '../../components/general/LoadingIcon';
import ChainHead from '../../components/runChain/ChainHead';

/* Icons */
import { LuLock, LuPlay, LuSave, LuRotateCcw, LuChevronDown, LuHistory, LuCpu } from 'react-icons/lu';
import { RiGlobalLine } from "react-icons/ri";
import { FaCheck } from "react-icons/fa";
import { BiLoader } from "react-icons/bi";

import Dropdown from '../../components/general/Dropdown';
/* --- */

export default function BuilderPage() {
  /* Contexts */
  const { id } = useParams();
  const { showToast } = useToast();
  const { user } = useAuth();
  
  /* States */
  const [chain, setChain] = useState(null);
  const [steps, setSteps] = useState([]);
  const [executionHistory, setExecutionHistory] = useState([]);
  const [stepInputs, setStepInputs] = useState({});
  const [isPublic, setPublic] = useState(false);

  // Booleans
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const isOwner = user.userId === chain?.userId;

  // Run Progress
  const [status, setStatus] = useState('idle');
  const [currentStepProgress, setCurrentStepProgress] = useState(0);
  const [finalResponse, setFinalResponse] = useState(null);

  /* Load saved data */
  useEffect(() => {
    loadChainData();
    loadExecutionHistory();
    return () => clearInterval(pollTimer.current);
  }, [id]);

  /* Load saved chain */
  const loadChainData = async () => {
    try {
      const res = await chainAPI.getOne(id);
      setChain(res.data);
      setSteps(res.data.steps.sort((a, b) => a.order - b.order));
      setPublic(res.data.public);
    } catch (error) {
      if (error.status && error.status == 500) {
        showToast("Server Connection Error, please try again later", "error", true);
      } else {
        showToast(error.message, "error", true);
      }
    }
  };

  /* Load Execution History for open chain */
  const loadExecutionHistory = async () => {
    try {
      const res = await executionAPI.getByChain(id);
      setExecutionHistory(res.data.data);
    } catch (error) {
      showToast("Unable to load past executions..", "error");
    }
  };

  /* Record user inputs in chain steps */
  const handleInputChange = (order, value) => {
    setStepInputs(prev => ({ ...prev, [order]: value }));
  };

  /* Update chain structure on prompt change before update */
  const handlePromptChange = (index, newValue) => {
    if (!isOwner) return;
    const updatedSteps = [...steps];
    updatedSteps[index].prompt = newValue;
    setSteps(updatedSteps);
    setHasChanges(true);    
  };

  /* Change chain name before update */
  const handleNameChange = (newName) => {
    if (!isOwner) return;
    setChain(prev => ({ ...prev, name: newName }));
    setHasChanges(true);
  };

  /* Load step inputs from past execution */
  const preloadInputs = (historyItem) => {
    setStepInputs(historyItem.stepInputs || {});
    showToast("Inputs preloaded from history");
  };

  /* Re-organise steps upon step delete */
  const handleStepDelete = (index) => {
    if (!isOwner) return;
    const filteredSteps = steps.filter((_, i) => i !== index);
    const reindexedSteps = filteredSteps.map((step, i) => ({
      ...step,
      order: i + 1
    }));
    setSteps(reindexedSteps);
    setHasChanges(true);
  };

  /* Request chain execution using API backend */
  const handleRun = async () => {
    if (status === 'pending') return;
    
    setFinalResponse(null);
    setCurrentStepProgress(0);
    setStatus('pending');

    try {
      const res = await chainAPI.run(id, { stepInputs });

      if (res.data.isCached) {
        setFinalResponse(res.data.response);
        setStatus('success');
        setCurrentStepProgress(steps.length);
        showToast("Result retrieved from cache");
      } else {
        if (res.data.error) {
          setStatus('error');
          const err = res.data.error;
          if (err == -1) {
            showToast("Chain has no steps", "error");
          } else if (err == -2) {
            showToast("API key limit exceeded", "error");
          }
        } else {
          startPolling(res.data.executionId);
        }
      }
    } catch (err) {
      setStatus('error');
      showToast(err.response?.data?.error || "Execution failed", "error");
    }
  };

  /* Request execution status from server every 2 seconds to show live step run */
  const pollTimer = useRef(null);

  const startPolling = (execId) => {
    // Clear any existing timer first to prevent memory leaks
    if (pollTimer.current) clearInterval(pollTimer.current);

    pollTimer.current = setInterval(async () => {
      try {
        const res = await executionAPI.getOne(execId);
        const { status: serverStatus, progress, response } = res.data;
        setStatus(serverStatus);
            
        if (progress) setCurrentStepProgress(Number(progress.currentStep));

        if (serverStatus === 'success') {
          setFinalResponse(response);
          setCurrentStepProgress(steps.length + 1); // Mark all as complete
          clearInterval(pollTimer.current);
          await loadExecutionHistory();
          showToast("Chain execution complete!", "success");
        } else if (serverStatus === 'error') {
            clearInterval(pollTimer.current);
            showToast("Background execution failed", "error");
        }
      } catch (err) {
        console.error("Polling error:", err);
        clearInterval(pollTimer.current);
      }
    }, 2000);
  };

  /* Update chain changes using API backend */
  const saveChainChanges = async () => {
    if (!isOwner) return;
    try {
      setIsSaving(true);
      await chainAPI.update(id, { 
        name: chain.name, 
        steps: steps,
        pub: isPublic
      });
      setHasChanges(false);
      setIsSaving(false);
      showToast("Updated chain successfully", "success");
      await loadExecutionHistory();
    } catch (err) {
      showToast("Error saving chain structure", "error");
    }
  };

  /* Clear all sign of previous run */
  const resetExecution = () => {
    setStatus('idle');
    setCurrentStepProgress(0);
    setFinalResponse(null);
  };

  /* Show load until chain loads from server */
  if (!chain) return <LoadingIcon />;

  return (
    <div className="flex flex-col h-full relative">
      <div className="fixed right-1/15 top-1/4 -translate-y-1/2 z-50 flex flex-col items-center gap-4">
        {isOwner && (
          <button 
            onClick={() => {
              setPublic(!isPublic); 
              setHasChanges(true);
            }}
            className={`flex items-center gap-2 cursor-pointer px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all border ${
              isPublic 
              ? 'bg-emerald-500/10 border-emerald-500 text-emerald-500' 
              : 'bg-gray-800 border-gray-700 text-gray-500'
            }`}
          >
            {isPublic ? <RiGlobalLine size={18} /> : <LuLock size={18} />}
            {isPublic ? "Public" : "Private"}
          </button>
        )}
        <Dropdown 
          icon={LuHistory}
          title="Execution History"
          data={executionHistory}
          onSelect={preloadInputs}
          renderItem={(item) => (
              <>
                  <p className="text-sm font-semibold text-gray-200 truncate">
                      {Object.values(item.stepInputs)[0] || "No Input Provided"}
                  </p>
                  <div className="flex justify-between items-center mt-1">
                      <p className="text-[10px] text-gray-500">
                          {new Date(item.createdAt).toLocaleDateString()}
                      </p>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded border ${
                          item.status === 'success' ? 'border-emerald-500/30 text-emerald-500' : 'border-rose-500/30 text-rose-500'
                      }`}>
                          {item.status}
                      </span>
                  </div>
              </>
          )}
        />
        <Dropdown 
          icon={LuCpu}
          title="AI Models"
          data={["qwen"]}
          onSelect={() => console.log("Load Model Feature Coming Soon")}
          renderItem={(item) => (
              <>
                  <p className="text-sm font-semibold text-gray-200 truncate">
                      {Object.values(item) || "No Input Provided"}
                  </p>
              </>
          )}
        />
      </div>

      {/* Main Flow Canvas */}
      <div className="flex-1 pb-40 px-4 flex flex-col items-center w-full">
          <ChainHead 
            name={chain.name} 
            onChange={handleNameChange} 
          />

          {steps.map((step, index) => (
            <div key={index} className="w-full max-w-5xl">
              {index == 0 && (
                <div className="relative h-12 flex flex-col items-center">
                  <div className="w-[2px] h-full bg-gray-800"></div>
                </div>
              )}
                
              <StepLevel 
                step={step} 
                inputValue={stepInputs[step.order] || ""}
                onInputChange={(val) => handleInputChange(step.order, val)}
                onPromptChange={(val) => handlePromptChange(step.order - 1, val)}
                isActive={status === 'pending' && currentStepProgress === step.order}
                isCompleted={currentStepProgress > step.order || (status === 'success' && currentStepProgress >= step.order)}
                onDelete={isOwner ? () => handleStepDelete(index) : null}
                readOnly={!isOwner}
              />
              {index < steps.length - 1 && (
                <div className="relative h-20 flex flex-col items-center">
                  <div className="w-[2px] h-full bg-gray-800"></div>
                    
                  <div className="absolute top-1/2 -translate-y-1/2 bg-[#0f1117] border border-gray-800 rounded-full p-1 shadow-sm">
                    <LuChevronDown size={14} className="text-gray-600" />
                  </div>
                </div>
              )}
            </div>
          ))}

          {finalResponse && (
            <div className="w-full max-w-5xl">
              <ExecutionResult response={finalResponse} onClear={resetExecution} />
            </div>
          )}

          {isOwner && (
            <AddStepNode 
              onAdd={(type) => {
                const newSteps = [...steps, { order: steps.length + 1, type: type, prompt: "" }];
                setSteps(newSteps);
                setHasChanges(true);
              }} 
            />
          )}
      </div>

      <div className="fixed bottom-0 left-[48px] right-0 h-24 bg-[#0f1117]/80 border-t border-gray-800 flex items-center justify-between px-12 z-50 backdrop-blur-xl">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mt-1">
            <div className={`w-2 h-2 rounded-full ${status === 'pending' ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`}></div>
            <span className="text-md font-bold text-gray-200">
              {status === 'pending' ? `Running Step ${currentStepProgress + 1}...` : "Ready to execute"}
            </span>
          </div>
        </div>

        <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
          <button 
            onClick={handleRun}
            disabled={status === 'pending' || status === 'success'}
            className={`
              group relative w-40 h-20 cursor-pointer rounded-xl flex items-center gap-2 justify-center transition-all duration-500 transform active:scale-90 disabled:opacity-50
              ${status === 'pending' 
                ? 'bg-amber-600 cursor-not-allowed' 
                : status === 'success' 
                ? 'bg-green-600 hover:bg-green-500'
                : 'bg-blue-600 hover:bg-blue-500'
              }
            `}
          >
            {status === 'pending' ? (
              <BiLoader className="animate-spin text-white" size={36} />
            ) : status === 'success' ? (
              <FaCheck fill="white" size={32} className="ml-1 group-hover:scale-110 transition-transform" />
            ) : (
              <LuPlay fill="white" size={32} className="ml-1 group-hover:scale-110 transition-transform" />
            )}
          </button>
        </div>

        <div className="flex items-center gap-6">
          <button 
            onClick={() => {
              setStepInputs({});
              showToast("Cleared step inputs");
            }}
            className="flex items-center gap-2 text-gray-500 hover:text-white font-bold cursor-pointer text-sm uppercase tracking-widest transition-all"
          >
            <LuRotateCcw size={18} /> Clear
          </button>

          {isOwner && hasChanges && (
            <button 
              onClick={saveChainChanges}
              disabled={isSaving}
              className="flex items-center gap-2 cursor-pointer bg-[#1c212c] hover:bg-emerald-600 border border-gray-700 hover:border-emerald-500 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-[0.1em] transition-all shadow-lg text-gray-300 hover:text-white"
            >
              {isSaving ? (
                <BiLoader className="animate-spin" size={18} />
              ) : (
                <LuSave size={18} />
              )}
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}