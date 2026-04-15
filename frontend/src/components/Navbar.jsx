import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Calendar, User, LogOut, LayoutDashboard, Settings, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const Navbar = () => {
    const { user, logout, isAdmin } = useAuth();
    const navigate = useNavigate();

    return (
        <nav className="fixed top-6 left-1/2 -translate-x-1/2 w-[90%] max-w-7xl z-50">
            <div className="glass border border-white/10 rounded-full px-6 py-3 shadow-2xl backdrop-blur-2xl">
                <div className="flex justify-between items-center h-12">
                    <Link to="/" className="flex items-center space-x-2 group">
                        <div className="bg-primary-500/20 p-2 rounded-xl group-hover:scale-110 transition-transform">
                            <Sparkles className="w-5 h-5 text-primary-400 group-hover:text-primary-300 transition-colors" />
                        </div>
                        <span className="text-xl font-black tracking-tighter uppercase italic">
                            Event<span className="text-primary-500">Nexus</span>
                        </span>
                    </Link>

                    <div className="flex items-center space-x-8">
                        <Link to="/" className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-white transition-all hover:scale-105">Events</Link>
                        
                        {user ? (
                            <div className="flex items-center space-x-6">
                                <Link to="/dashboard" className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-white transition-all flex items-center gap-2">
                                    <LayoutDashboard className="w-4 h-4" /> Dashboard
                                </Link>
                                {isAdmin && (
                                    <Link to="/admin" className="text-xs font-black uppercase tracking-widest text-primary-500 hover:text-primary-400 transition-all flex items-center gap-2">
                                        <Settings className="w-4 h-4" /> Nexus Core
                                    </Link>
                                )}
                                <div className="h-6 w-px bg-slate-800"></div>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-blue-600 flex items-center justify-center text-[10px] font-black border-2 border-slate-900 shadow-lg">
                                            {user.name.charAt(0).toUpperCase()}
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-300 hidden md:block">Nexus-_{user.name.split(' ')[0]}</span>
                                    </div>
                                    <button onClick={logout} className="p-2 hover:bg-red-500/10 rounded-full transition-colors text-slate-500 hover:text-red-400">
                                        <LogOut className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <Link to="/login" className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-white transition-all px-4">Login</Link>
                                <Link to="/signup" className="bg-primary-600 hover:bg-primary-500 text-white text-[10px] font-black uppercase tracking-[0.2em] px-6 py-2.5 rounded-full shadow-lg shadow-primary-500/20 active:scale-95 transition-all">
                                    Join Nexus
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
