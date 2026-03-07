import { LuHouse, LuLink, LuMemoryStick, LuMenu, LuSettings } from "react-icons/lu";
import { useApp } from '../../contexts/AppContext';
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

const MENU_ITEMS = [
    {route: "/", label: "Home", icon: LuHouse},
    {route: "/chains", label: "Chains", icon: LuLink},
    {route: "/executions", label: "Executions", icon: LuMemoryStick},
    {route: "/settings", label: "Settings", icon: LuSettings},
];

export default function SideMenu() {
    const { isSidebarExpanded, setSidebarExpanded } = useApp();
    const location = useLocation();

    return (
        <nav
            className={`${
                isSidebarExpanded ? 'w-42' : 'w-16'
            } bg-[#161922] transition-all duration-300 flex flex-col items-center py-6 gap-2 border-r border-gray-800 h-screen`}
        >
            {/* Toggle Button */}
            <button 
                onClick={() => setSidebarExpanded(!isSidebarExpanded)}
                className="flex cursor-pointer items-center mb-8 text-gray-400 hover:text-white transition-colors"
            >
                <LuMenu size={30} />
            </button>

            <div className="flex flex-col gap-2">
                {MENU_ITEMS.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.route;

                    return (
                        <Link 
                            key={item.route}
                            to={item.route} 
                            className={`
                                flex flex-row items-center w-full transition-all relative group py-4
                            `}
                        >
                            {/* Icon Column */}
                            <div className="flex">
                                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} className={isActive ? 'text-blue-400' : 'text-gray-400'}/>
                            </div>

                            {isSidebarExpanded && (
                                <span className={`text-lg whitespace-nowrap overflow-hidden ml-4 transition-all duration-300 ${isActive ? 'text-blue-400 font-semibold' : 'text-gray-400'}`}>
                                    {item.label}
                                </span>
                            )}
                            
                            {/* Tooltip */}
                            {!isSidebarExpanded && (
                                <div className="absolute left-full ml-4 px-3 py-1 bg-gray-800 text-white text-lg
                                    opacity-0 scale-95 pointer-events-none group-hover:opacity-100 group-hover:scale-100 
                                    transition-all z-50 whitespace-nowrap">
                                    {item.label}
                                    {/* Tooltip Arrow */}
                                    <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-gray-800 border-l border-b border-gray-700 rotate-45" />
                                </div>
                            )}
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
};