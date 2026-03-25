/* React */
import { useEffect, useState } from 'react';

/* Contexts */
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../contexts/ToastContext';
import { useAuth } from '../../contexts/AuthContext';
import { chainAPI, executionAPI } from '../../contexts/APIContext';

/* Components */
import Pagination from '../../components/general/Pagination';
import LoadingIcon from '../../components/general/LoadingIcon';

/* Icons */
import { LuPlay, LuPlus, LuClock, LuList, LuTrash2, LuArrowRight } from 'react-icons/lu';
import { FaBan, FaQuestion, FaCheckSquare, FaRegCheckSquare } from "react-icons/fa";

export default function ChainsPage() {
  // Contexts
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { user } = useAuth();

  // Loading State
  const [loading, setLoading] = useState(true);

  // Chain Data
  const [chains, setChains] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Deletion mode states
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedChains, setSelectedChains] = useState([]);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchChains = async (pageNumber) => {
    if (!user) return;

    try {
      setLoading(true);

      const res = await chainAPI.getAll(pageNumber);
  
      const cs = res.data.data;
      const complete = await Promise.all(
        cs.map(async (chain) => {
          const exs = await executionAPI.getByChain(chain._id);
          return { ...chain, executionCount: exs.data.data.length };
        })
      );

      setChains(complete);
      setTotalPages(res.data.totalPages);
      setPage(pageNumber);
      setSelectedChains([]);
    } catch (error) {
      showToast(error.message || "Failed to load chains", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchChains(1);
  }, [user]);

  /* Selection Logic */
  const toggleSelect = (id) => {
    setSelectedChains(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  /* Bulk Delete Logic */
  const handleDeleteSelected = async () => {
    if (!window.confirm(`Are you sure you want to delete ${selectedChains.length} chains?`)) return;
    
    setIsDeleting(true);
    try {
      // Execute all delete requests in parallel
      await Promise.all(selectedChains.map(id => chainAPI.delete(id)));
      
      showToast(`Successfully deleted ${selectedChains.length} chains`, "success");
      fetchChains(page); // Refresh current page
    } catch (error) {
      showToast("Some chains could not be deleted", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  /* Toggle between browsing and deleting modes */
  const toggleSelectionMode = () => {
    setIsSelectionMode(!isSelectionMode);
    setSelectedChains([]);
  };

  // Just in case
  if (!user) return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center">
      <div className="bg-gray-800/30 p-10 rounded-full mb-8">
        <FaBan size={80} className="text-gray-600 animate-pulse" />
      </div>
      <h2 className="text-4xl font-bold mb-4">Need Log in</h2>
        <p className="text-gray-500 text-xl max-w-md">
          You cannot access this page unless you are logged in.
        </p>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4">
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-4xl font-bold text-white">Your Chains</h2>
        
        <div className="flex gap-3">
          {isSelectionMode ? (
            <>
              <button 
                onClick={toggleSelectionMode}
                className="px-6 py-3 cursor-pointer rounded-xl font-semibold text-gray-400 hover:text-white transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={handleDeleteSelected}
                disabled={selectedChains.length === 0 || isDeleting}
                className="cursor-pointer text-lg font-semibold bg-rose-600 hover:bg-rose-500 disabled:bg-gray-800 disabled:text-gray-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-all"
              >
                <LuTrash2 size={20} /> 
                {isDeleting ? "Deleting..." : `Confirm Delete (${selectedChains.length})`}
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={toggleSelectionMode}
                className="p-3 cursor-pointer rounded-xl text-gray-400 hover:text-rose-500 transition-all"
                title="Select multiple to delete"
              >
                <LuTrash2 size={24} />
              </button>
              <button 
                onClick={() => chainAPI.create("New Chain").then(res => navigate(`/run/${res.data._id}`))}
                className="bg-emerald-600 cursor-pointer text-xl text-white font-semibold hover:bg-emerald-500 px-6 py-3 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-emerald-900/20"
              >
                <LuPlus size={24} /> New Chain
              </button>
            </>
          )}
        </div>
      </div>

      {loading && <LoadingIcon />}

      {(chains.length === 0 && !loading) && (
        <div className="flex flex-col items-center justify-center text-center py-20">
          <div className="bg-gray-800/30 p-10 rounded-full mb-4 text-gray-600">
            <FaQuestion size={60} className="animate-pulse" />
          </div>
          <h2 className="text-3xl font-bold mb-2 text-white">No chains found!</h2>
          <p className="text-gray-500 text-lg max-w-md">Create a new one to get started.</p>
        </div>
      )}

      {chains.length !== 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {chains.map((chain) => {
            const isSelected = selectedChains.includes(chain._id);
            return (
              <div
                key={chain._id}
                onClick={() => (!isSelectionMode && navigate(`/run/${chain._id}`)) || (isSelectionMode && toggleSelect(chain._id))}
                className={`relative overflow-hidden bg-[#1c212c] hover:bg-[#222936] p-6 rounded-2xl border transition-all duration-300 group cursor-pointer
                  ${isSelected ? 'border-blue-500 ring-1 ring-blue-500/50 bg-[#222936]' : 'border-gray-800/50 hover:border-blue-500/30'}`}
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-start gap-4">
                    {isSelectionMode && (
                      <button className={`mt-1 transition-all duration-300 animate-in fade-in zoom-in-75 transition-colors ${isSelected ? 'text-blue-500' : 'text-gray-600 group-hover:text-gray-400'}`}>
                        {isSelected ? <FaCheckSquare size={22} /> : <FaRegCheckSquare size={22} />}
                      </button>
                    )}
                    
                    <div>
                      <h3 className="text-xl font-bold text-gray-100 group-hover:text-white transition-colors">
                        {chain.name}
                      </h3>
                      <p className="text-xs flex items-center gap-2 mt-2 text-gray-500 uppercase tracking-widest font-medium">
                        <LuClock size={12} />
                        {new Date(chain.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  {!isSelectionMode && (
                    <div className="p-2 bg-gray-800/50 rounded-lg group-hover:bg-blue-500/10 transition-colors">
                      <LuPlay className="text-emerald-500 group-hover:text-blue-400 transform group-hover:scale-110 transition-all" />
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-6 border-t border-gray-800/50 pt-5 mt-auto">
                  <div className="flex items-center gap-2">
                    <LuList size={16} className="text-blue-400" />
                    <span className="text-sm font-semibold text-gray-300">
                      {chain.steps?.length || 0} <span className="text-gray-500 font-normal">Steps</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <LuPlay size={16} className="text-emerald-400" />
                    <span className="text-sm font-semibold text-gray-300">
                      {chain.executionCount || 0} <span className="text-gray-500 font-normal">Runs</span>
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Pagination 
        currentPage={page} 
        totalPages={totalPages} 
        onPageChange={(newPage) => fetchChains(newPage)} 
      />
    </div>
  );
}