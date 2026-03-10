import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../contexts/ToastContext';
import { chainAPI } from '../../contexts/api';
import Pagination from '../../components/general/Pagination';
import { LuPlay, LuPlus, LuClock, LuList } from 'react-icons/lu';
import { FaQuestion } from "react-icons/fa";
import { BiLoaderCircle } from "react-icons/bi";

export default function ChainsPage() {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [chains, setChains] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchChains = async (pageNumber) => {
    try {
      const res = await chainAPI.getAll(pageNumber);
      setChains(res.data.data);
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

  useEffect(() => {
    fetchChains(page);
  }, []);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-4xl font-bold">Your Prompt Chains</h2>
        <button 
          onClick={() => chainAPI.create("New Chain").then(res => navigate(`/run/${res.data._id}`))}
          className="bg-emerald-600 hover:bg-emerald-500 px-6 py-3 rounded-xl flex items-center gap-2 transition-all"
        >
          <LuPlus size={24} /> New Chain
        </button>
      </div>

      {loading && (
        <div className="flex h-full items-center justify-center">
          <BiLoaderCircle className="animate-spin text-blue-500" size={48} />
        </div>
      )}

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

      {chains.length != 0 && (<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {chains.map(chain => (
          <div 
            key={chain._id}
            onClick={() => navigate(`/run/${chain._id}`)}
            className="bg-[#161922] p-8 rounded-3xl border border-gray-800 hover:border-blue-500 cursor-pointer transition-all group"
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-2xl font-semibold group-hover:text-blue-400">{chain.name}</h3>
              <LuPlay className="text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            
            <div className="space-y-3 text-gray-400">
              <div className="flex items-center gap-2"><LuList size={20}/> {chain.steps?.length || 0} Steps</div>
              <div className="flex items-center gap-2"><LuPlay size={20}/> Executed {chain.executionCount || 0} times</div>
              <div className="flex items-center gap-2"><LuClock size={20}/> Created: {new Date(chain.createdAt).toLocaleDateString()}</div>
            </div>
          </div>
        ))}
      </div>)}

      <Pagination 
        currentPage={page} 
        totalPages={totalPages} 
        onPageChange={(newPage) => fetchChains(newPage)} 
      />
    </div>
  );
}