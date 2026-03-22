import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { useAuth } from '../../contexts/AuthContext';
import { chainAPI, userAPI } from '../../contexts/APIContext';
import { useToast } from '../../contexts/ToastContext';

import LoadingIcon from '../../components/general/LoadingIcon';
import Pagination from '../../components/general/Pagination';

import { LuLogOut, LuPlay, LuUser, LuClock, LuList } from 'react-icons/lu';

export default function ProfilePage() {
    const { id } = useParams();
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const { showToast } = useToast();

    const [loading, setLoading] = useState(false);
    const [profile, setProfile] = useState(null);
    const [publicChains, setPublicChains] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const isOwner = user?.userId === id;

    const fetchChains = async (pageNumber) => {
        try {
            setLoading(true);
            const res = await chainAPI.getByUser(id, pageNumber);
            setPublicChains(res.data.data);
            setTotalPages(res.data.totalPages);
            setPage(pageNumber);
        } catch (error) { 
            showToast(error.message || "Failed to load chains", "error");
        } finally {
            setLoading(false);
        }
    };

    const fetchProfile = async () => {
        try {
            const res = await userAPI.getProfile(id);
            setProfile(res.data);
        } catch (error) { 
            showToast(error.message || "Failed to load profile", "error");
        }
    };

    useEffect(() => {
        fetchChains(page);
    }, [page]);

    useEffect(() => {
        fetchProfile();
        fetchChains(page);
    }, [id]);

    if (loading) return <LoadingIcon />;
    
    return (
        <div className="min-h-screen bg-[#0f1117] text-white p-8 md:p-20">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start mb-20 gap-12">
                    <div className="flex items-center gap-8">
                        {/* Large Avatar Placeholder */}
                        <div className="w-24 h-24 md:w-32 md:h-32 rounded-[2.5rem] bg-gradient-to-br from-blue-600 to-blue-900 flex items-center justify-center shadow-[0_20px_50px_rgba(37,99,235,0.3)]">
                            <LuUser size={60} className="text-white/80" />
                        </div>
                        
                        <div>
                            <h1 className="text-5xl md:text-7xl font-black tracking-tighter mt-2 bg-gradient-to-r to-white from-blue-300 bg-clip-text text-transparent">
                                {profile?.email}
                            </h1>
                        </div>
                    </div>

                    {isOwner && (
                        <button 
                            onClick={() => { logout(); navigate('/'); }}
                            className="flex cursor-pointer items-center gap-3 px-10 py-5 bg-red-500/10 border border-red-500/20 text-red-500 rounded-[2rem] font-black hover:bg-red-500 hover:text-white transition-all shadow-xl active:scale-95"
                        >
                            <LuLogOut size={22} /> Logout
                        </button>
                    )}
                </div>

                <h2 className="text-2xl font-black uppercase tracking-widest text-gray-700 mb-10 border-b border-gray-800 pb-4">
                    Published Chains
                </h2>
                

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {!loading && publicChains.map(chain => (
                        <div
                            key={chain._id}
                            onClick={() => (navigate(`/run/${chain._id}`))}
                            className={"relative overflow-hidden bg-[#1c212c] hover:bg-[#222936] p-6 rounded-2xl transition-all duration-300 group cursor-pointer"}
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div className="flex items-start gap-4">
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
                                <div className="p-2 bg-gray-800/50 rounded-lg group-hover:bg-blue-500/10 transition-colors">
                                    <LuPlay className="text-emerald-500 group-hover:text-blue-400 transform group-hover:scale-110 transition-all" />
                                </div>
                            </div>
                        
                            <div className="flex items-center gap-6 border-t border-gray-800/50 pt-5 mt-auto">
                                <div className="flex items-center gap-2">
                                    <LuList size={16} className="text-blue-400" />
                                    <span className="text-sm font-semibold text-gray-300">
                                        {chain.steps?.length || 0} <span className="text-gray-500 font-normal">Steps</span>
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <Pagination 
                    currentPage={page} 
                    totalPages={totalPages} 
                    onPageChange={(newPage) => fetchChains(newPage)} 
                />
            </div>
        </div>
    );
}