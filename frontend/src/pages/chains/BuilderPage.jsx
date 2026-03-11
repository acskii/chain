/* Imports */
/* React */
import { useState, useEffect, useRef } from 'react';

/* Contexts */
import { useToast } from '../../contexts/ToastContext';
import { useParams } from 'react-router-dom';

/* API Backend */
import { chainAPI, executionAPI } from '../../contexts/api';

/* Components */
import StepLevel from '../../components/runChain/StepLevel';
import AddStepNode from '../../components/runChain/AddStepNode';
import ExecutionResult from '../../components/runChain/ExecutionResult';
import LoadingIcon from '../../components/general/LoadingIcon';
import ChainHead from '../../components/runChain/ChainHead';

/* Icons */
import { LuPlay, LuSave, LuRotateCcw, LuChevronDown, LuHistory } from 'react-icons/lu';
import { BiLoader } from "react-icons/bi";
import Dropdown from '../../components/general/Dropdown';
/* --- */

export default function BuilderPage() {
  const { id } = useParams();
  const { showToast } = useToast();
  
  /* States */
  const [chain, setChain] = useState(null);
  const [steps, setSteps] = useState([]);

  const [stepInputs, setStepInputs] = useState({});
  
  const [executionHistory, setExecutionHistory] = useState([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  
  const [executingId, setExecutingId] = useState(null);
  
  const [status, setStatus] = useState('idle');
  const [currentStepProgress, setCurrentStepProgress] = useState(0);
  const [finalResponse, setFinalResponse] = useState(null);
  
  const [hasChanges, setHasChanges] = useState(false);
  
  const pollTimer = useRef(null);

  useEffect(() => {
    loadChainData();
    loadExecutionHistory();
    return () => clearInterval(pollTimer.current);
  }, [id]);

  const loadChainData = async () => {
    try {
      const res = await chainAPI.getOne(id);
      setChain(res.data);
      setSteps(res.data.steps.sort((a, b) => a.order - b.order));
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

    const handleInputChange = (order, value) => {
        setStepInputs(prev => ({ ...prev, [order]: value }));
    };

    const handlePromptChange = (index, newValue) => {
        const updatedSteps = [...steps];
        updatedSteps[index].prompt = newValue;
        setSteps(updatedSteps);
        setHasChanges(true);    
    };

    const handleNameChange = (newName) => {
      setChain(prev => ({ ...prev, name: newName }));
      setHasChanges(true);
    };

  const preloadInputs = (historyItem) => {
    setStepInputs(historyItem.stepInputs || {});
    setIsHistoryOpen(false);
    showToast("Inputs preloaded from history");
  };

    const handleStepDelete = (index) => {
        const filteredSteps = steps.filter((_, i) => i !== index);
        // Re-map orders so they are sequential (1, 2, 3...)
        const reindexedSteps = filteredSteps.map((step, i) => ({
            ...step,
            order: i + 1
        }));
        setSteps(reindexedSteps);
        setHasChanges(true);
    };

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
        setExecutingId(res.data.executionId);
        startPolling(res.data.executionId);
      }
    } catch (err) {
      setStatus('error');
      showToast(err.response?.data?.error || "Execution failed", "error");
    }
  };

    const startPolling = (execId) => {
        // Clear any existing timer first to prevent memory leaks
        if (pollTimer.current) clearInterval(pollTimer.current);

        pollTimer.current = setInterval(async () => {
            try {
            const res = await executionAPI.getOne(execId);
            const { status: serverStatus, progress, response } = res.data;

            // Force React to acknowledge the change by using the functional update
            setStatus(serverStatus);
            
            if (progress) {
                // Ensure this is treated as a Number for comparison
                setCurrentStepProgress(Number(progress.currentStep));
            }

            if (serverStatus === 'success') {
                setFinalResponse(response);
                setCurrentStepProgress(steps.length + 1); // Mark all as complete
                clearInterval(pollTimer.current);
                showToast("Chain execution complete!", "success");
            } else if (serverStatus === 'error') {
                clearInterval(pollTimer.current);
                showToast("Background execution failed", "error");
            }
            } catch (err) {
            console.error("Polling error:", err);
            clearInterval(pollTimer.current);
            }
        }, 2000); // 2-second interval is standard for 2026 UX
        };

    const saveChainChanges = async () => {
        try {
            await chainAPI.update(id, { 
                name: chain.name, 
                steps: steps 
            });
            setHasChanges(false);
            showToast("Chain structure updated successfully");
        } catch (err) {
            showToast("Error saving chain structure", "error");
        }
    };

  /* Clear all sign of previous run */
  const resetExecution = () => {
    setStatus('idle');
    setCurrentStepProgress(0);
    setFinalResponse(null);
    setExecutingId(null);
  };

  /* Show load until chain loads from server */
  if (!chain) return <LoadingIcon />;

  return (
    <div className="flex flex-col h-full relative">
      <div className="fixed right-1/5 top-1/4 -translate-y-1/2 z-50 flex flex-col gap-4">
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
      </div>

      {/* Main Flow Canvas */}
      <div className="flex-1 pb-40 max-w-4xl mx-auto w-full">
          <ChainHead 
            name={chain.name} 
            onChange={handleNameChange} 
          />

          <div className="space-y-0 flex flex-col items-center">
            {steps.map((step, index) => (
              <div key={index} className="w-full flex flex-col items-center">
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
                  onDelete={() => handleStepDelete(index)}
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
              <ExecutionResult response={finalResponse} onClear={resetExecution} />
            )}

            <AddStepNode onAdd={(type) => {
                const newSteps = [...steps, { order: steps.length + 1, type: type, prompt: "" }];
                setSteps(newSteps);
                setHasChanges(true);
            }} />
          </div>
      </div>

      {/* Control Bottom Bar */}
      <div className="fixed bottom-0 left-18 right-0 h-24 bg-[#161922] border-t border-gray-800 flex items-center justify-between px-12 z-40 backdrop-blur-md bg-opacity-90">
        <div className="flex items-center gap-4 bg-gray-950 p-2 rounded-2xl border border-gray-800">
           <select className="bg-transparent outline-none text-sm px-4 py-1 text-gray-300">
              <option>google/gemini-2.0-flash:free</option>
           </select>
        </div>

        <button 
          onClick={handleRun}
          disabled={status === 'pending'}
          className={`${
            status === 'processing' ? 'bg-amber-600' : 'bg-blue-600 hover:bg-blue-500'
          } w-20 h-20 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(37,99,235,0.3)] transform active:scale-95 transition-all disabled:opacity-50`}
        >
          {status === 'pending' ? (
            <BiLoader className="animate-spin text-white" size={32} />
          ) : (
            <LuPlay fill="white" size={32} className="ml-1" />
          )}
        </button>

        <div className="flex gap-4">
           <button 
             onClick={() => setStepInputs({})}
             className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
           >
             <LuRotateCcw size={20} /> Clear Inputs
           </button>
           {hasChanges && (
             <button 
               onClick={saveChainChanges}
               className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 px-6 py-3 rounded-2xl font-bold transition-all shadow-lg"
             >
               <LuSave size={20} /> Save Changes
             </button>
           )}
        </div>
      </div>
    </div>
  );
}