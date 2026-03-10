import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { chainAPI, executionAPI } from '../../contexts/api';
import { useApp } from '../../contexts/AppContext';
import StepLevel from '../../components/runChain/StepLevel';
import AddStepNode from '../../components/runChain/AddStepNode';
import ExecutionResult from '../../components/runChain/ExecutionResult';
import { LuPlay, LuSave, LuRotateCcw, LuChevronDown, LuHistory } from 'react-icons/lu';
import { BiLoaderCircle } from "react-icons/bi";

export default function RunChainPage() {
  const { id } = useParams();
  const { showToast } = useApp();
  
  // State
  const [chain, setChain] = useState(null);
  const [steps, setSteps] = useState([]);
  const [stepInputs, setStepInputs] = useState({}); // Stores { "1": "text", "2": "fileContent" }
  const [executionHistory, setExecutionHistory] = useState([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  
  // Execution & Polling State
  const [executingId, setExecutingId] = useState(null);
  const [status, setStatus] = useState('idle'); // idle, pending, processing, success, error
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
    } catch (err) {
      showToast("Failed to load chain", "error");
    }
  };

  const loadExecutionHistory = async () => {
    try {
      const res = await executionAPI.getAll({ chainId: id });
      setExecutionHistory(res.data.data);
    } catch (err) {
      console.error("History load error", err);
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
    if (status === 'processing' || status === 'pending') return;
    
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
            const res = await executionAPI.getStatus(execId);
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

    const resetExecution = () => {
        setStatus('idle');
        setCurrentStepProgress(0);
        setFinalResponse(null);
        setExecutingId(null);
        showToast("Editor unlocked");
    };

  if (!chain) return <div className="flex h-full items-center justify-center"><BiLoaderCircle className="animate-spin text-blue-500" size={48} /></div>;

  return (
    <div className="flex flex-col h-full relative">
      {/* Title Bar */}
      <div className="flex justify-between items-center mb-8 border-b border-gray-800 pb-4 sticky top-0 bg-[#0f1117] z-20">
        <h2 className="text-3xl font-bold text-blue-400 uppercase tracking-tighter">{chain.name}</h2>
        
        {/* Preload Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setIsHistoryOpen(!isHistoryOpen)}
            className="flex items-center gap-2 bg-[#161922] px-4 py-2 rounded-xl border border-gray-700 hover:border-blue-500 transition-all text-sm"
          >
            <LuHistory size={18} /> Preload Inputs <LuChevronDown size={16} />
          </button>
          
          {isHistoryOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-[#1a1d26] border border-gray-700 rounded-2xl shadow-2xl z-50 max-h-96 overflow-y-auto">
              <div className="p-4 border-b border-gray-800 text-xs font-bold text-gray-500">PAST EXECUTIONS</div>
              {executionHistory.length === 0 && <div className="p-4 text-sm text-gray-500">No history found</div>}
              {executionHistory.map(item => (
                <div 
                  key={item._id} 
                  onClick={() => preloadInputs(item)}
                  className="p-4 hover:bg-blue-500/10 cursor-pointer border-b border-gray-800/50 transition-colors"
                >
                  <p className="text-sm font-semibold truncate">{Object.values(item.stepInputs)[0] || "No Input"}</p>
                  <p className="text-[10px] text-gray-500">{new Date(item.createdAt).toLocaleString()}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {(status === 'success' || status === 'error') && (
            <button 
              onClick={resetExecution}
              className="flex items-center gap-2 bg-gray-800 px-4 py-2 rounded-xl border border-gray-600 hover:bg-gray-700 transition-all text-sm text-white"
            >
              <LuRotateCcw size={18} /> Edit Chain
            </button>
          )}
      </div>

      {/* Main Flow Canvas */}
      <div className="flex-1 space-y-6 pb-40 max-w-4xl mx-auto w-full">
        {steps.map((step, index) => (
          <StepLevel 
            key={index} 
            step={step} 
            inputValue={stepInputs[step.order] || ""}
            onInputChange={(val) => handleInputChange(step.order, val)}
            onPromptChange={(val) => handlePromptChange(step.order - 1, val)}
            isActive={status === 'pending' && currentStepProgress === step.order}
            isCompleted={currentStepProgress > step.order || (status === 'success' && currentStepProgress >= step.order)}
            onDelete={() => handleStepDelete(index)}
          />
        ))}

        {finalResponse && (
          <ExecutionResult response={finalResponse} onClear={() => setFinalResponse(null)} />
        )}

        <AddStepNode onAdd={(type) => {
            const newSteps = [...steps, { order: steps.length + 1, type: type, prompt: "" }];
            setSteps(newSteps);
            setHasChanges(true);
        }} />
      </div>

      {/* Control Bottom Bar */}
      <div className="fixed bottom-0 left-20 right-0 h-24 bg-[#161922] border-t border-gray-800 flex items-center justify-between px-12 z-40 backdrop-blur-md bg-opacity-90">
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
            <LuLoader2 className="animate-spin text-white" size={32} />
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