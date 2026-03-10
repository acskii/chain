/* Imports */
/* React */
import { useEffect, useState } from 'react';

/* Contexts */
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../contexts/ToastContext';

/* API Backend */
import { chainAPI, executionAPI } from '../../contexts/api';

/* Components */
import Pagination from '../../components/general/Pagination';
import LoadingIcon from '../../components/general/LoadingIcon';

/* Icons */
import { LuPlay, LuPlus, LuClock, LuList } from 'react-icons/lu';
import { FaQuestion } from "react-icons/fa";
/* --- */

export default function ChainsPage() {
  /* Contexts */
  const navigate = useNavigate();
  const { showToast } = useToast();

  /* States */
  const [loading, setLoading] = useState(true);
  const [chains, setChains] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  /* Get user chains based on pagination */ 
  const fetchChains = async (pageNumber) => {
    try {
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

  /* At first load */
  useEffect(() => {
    // Load first page of chains
    fetchChains(1);
  }, []);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-4xl font-bold">Your Chains</h2>
        <button 
          onClick={() => chainAPI.create("New Chain").then(res => navigate(`/run/${res.data._id}`))}
          className="bg-emerald-600 text-xl font-semibold hover:bg-emerald-500 px-6 py-3 rounded-xl flex items-center gap-2 cursor-pointer transition-all"
        >
          <LuPlus size={24} /> New Chain
        </button>
      </div>

      {loading && <LoadingIcon />}

      {(chains.length == 0) && (
        <div className="flex flex-col items-center justify-center text-center">
          <div className="bg-gray-800/30 p-10 rounded-full mb-4">
            <FaQuestion size={60} className="text-gray-600 animate-pulse" />
          </div>
          <h2 className="text-4xl font-bold mb-4">No chains found!</h2>
          <p className="text-gray-500 text-xl max-w-md">
            You seem to not have a chain made before, no worries! Just create a new one.
          </p>
        </div>
      )}

      {chains.length != 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {chains.map((chain) => (
            <div
              key={chain._id}
              onClick={() => navigate(`/run/${chain._id}`)}
              className="relative overflow-hidden bg-[#1c212c] hover:bg-[#222936] p-6 rounded-2xl border border-gray-800/50 hover:border-blue-500/50 cursor-pointer transition-all duration-300 group"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-100 group-hover:text-white transition-colors">
                    {chain.name}
                  </h3>
                  <p className="text-sm flex items-center gap-3 mt-3 text-gray-400 uppercase tracking-wider font-medium">
                    <LuClock size={14} className="text-white font-semibold" />
                    {new Date(chain.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="p-2 bg-gray-800/50 rounded-lg group-hover:bg-blue-500/10 transition-colors">
                  <LuPlay className="text-emerald-500 group-hover:text-blue-400 transform group-hover:scale-110 transition-all" />
                </div>
              </div>

              {/* Stats Row */}
              <div className="flex items-center gap-6 border-t border-gray-800/50 pt-5 mt-auto">
                <div className="flex items-center gap-2 group/stat">
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
          ))}
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