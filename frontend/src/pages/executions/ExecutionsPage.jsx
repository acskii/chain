import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../contexts/ToastContext';
import { executionAPI, chainAPI } from '../../contexts/APIContext';
import ExecutionRow from '../../components/executions/ExecutionRow';
import { 
  LuChevronDown, 
  LuChevronRight, 
  LuExternalLink, 
  LuSearch,
  LuLayers
} from 'react-icons/lu';
import { BiLoaderCircle } from "react-icons/bi";

export default function ExecutionsPage() {
  const [executions, setExecutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedChains, setExpandedChains] = useState({});
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    loadExecutions();
  }, []);

  const loadExecutions = async () => {
    try {
      const res = await executionAPI.getAll();
      setExecutions(res.data.data);
    } catch (error) {
      if (error.status && error.status == 500) {
        showToast("Couldn't load data from server, please try again later", "error", true);
      } else {
        showToast(error.message, "error", true);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await executionAPI.delete(id);
      setExecutions(prev => prev.filter(ex => ex._id !== id));
      showToast("Execution deleted");
    } catch (err) {
      showToast("Delete failed", "error");
    }
  };

  // Grouping Logic: Hash map of Chain Name -> Array of Executions
  const groupedExecutions = useMemo(() => {
    const groups = executions.reduce((acc, ex) => {
      const chainName = ex.chainId;
      if (!acc[chainName]) acc[chainName] = [];
      acc[chainName].push(ex);
      return acc;
    }, {});

    // Filter groups by search query (Chain name or Input content)
    return Object.keys(groups)
      .filter(name => name.toLowerCase().includes(searchQuery.toLowerCase()))
      .reduce((obj, key) => {
        obj[key] = groups[key];
        return obj;
      }, {});
  }, [executions, searchQuery]);

  const toggleGroup = (name) => {
    setExpandedChains(prev => ({ ...prev, [name]: !prev[name] }));
  };

  if (loading) return <div className="flex justify-center mt-20"><BiLoaderCircle className="animate-spin text-blue-500" size={48} /></div>;

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h2 className="text-4xl font-bold mb-2">Execution History</h2>
          <p className="text-gray-500 text-lg">Review past runs, inputs, and AI responses grouped by chain.</p>
        </div>
        
        <div className="flex gap-4">
          <div className="relative">
            <LuSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
            <input 
              type="text" 
              placeholder="Filter by chain name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[#161922] border border-gray-800 rounded-2xl py-3 pl-12 pr-6 focus:border-blue-500 outline-none w-80 text-lg transition-all"
            />
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {Object.entries(groupedExecutions).length === 0 && (
          <div className="text-center py-20 bg-[#161922] rounded-[2.5rem] border border-dashed border-gray-800">
             <LuLayers className="mx-auto text-gray-700 mb-4" size={64} />
             <p className="text-gray-500 text-xl">No executions found matching your criteria.</p>
          </div>
        )}

        {Object.entries(groupedExecutions).map(([chainName, items]) => (
          <div key={chainName} className="bg-[#161922] rounded-[2.5rem] border border-gray-800 overflow-hidden transition-all">
            {/* Group Header */}
            <div 
              onClick={() => toggleGroup(chainName)}
              className="p-6 px-8 flex items-center justify-between cursor-pointer hover:bg-gray-800/30 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="bg-blue-500/10 p-3 rounded-xl">
                  {expandedChains[chainName] ? <LuChevronDown className="text-blue-400" /> : <LuChevronRight className="text-gray-500" />}
                </div>
                <div>
                  <h3 className="text-2xl font-bold">{chainName}</h3>
                  <span className="text-sm text-gray-500 font-mono uppercase tracking-widest">{items.length} Total Runs</span>
                </div>
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); navigate(`/run/${items[0].chainId}`); }}
                className="text-gray-500 hover:text-blue-400 flex items-center gap-2 text-sm font-bold uppercase"
              >
                Go to Builder <LuExternalLink size={16} />
              </button>
            </div>

            {/* Group Content (List of Executions) */}
            {expandedChains[chainName] && (
              <div className="border-t border-gray-800/50 bg-black/10 animate-in slide-in-from-top-2 duration-300">
                <div className="overflow-x-auto flex flex-col gap-3">
                      {items.map((ex) => (
                        <ExecutionRow 
                          key={ex._id} 
                          execution={ex} 
                          onDelete={() => handleDelete(ex._id)} 
                        />
                      ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}