import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Calendar, User, LogOut, LayoutDashboard, Settings } from 'lucide-react';

const Navbar = () => {
    const { user, logout, isAdmin } = useAuth();
    const navigate = useNavigate();

    return (
        <nav className="fixed top-0 w-full z-50 glass border-b border-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <Link to="/" className="flex items-center space-x-2">
                        <Calendar className="w-8 h-8 text-primary-500" />
                        <span className="text-xl font-bold bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
                            EventNexus
                        </span>
                    </Link>

                    <div className="flex items-center space-x-6">
                        <Link to="/" className="text-slate-300 hover:text-white transition-colors">Events</Link>
                        
                        {user ? (
                            <>
                                <Link to="/dashboard" className="text-slate-300 hover:text-white transition-colors flex items-center gap-1">
                                    <LayoutDashboard className="w-4 h-4" /> Dashboard
                                </Link>
                                {isAdmin && (
                                    <Link to="/admin" className="text-slate-300 hover:text-white transition-colors flex items-center gap-1">
                                        <Settings className="w-4 h-4" /> Admin
                                    </Link>
                                )}
                                <div className="flex items-center space-x-4 pl-4 border-l border-slate-700">
                                    <span className="text-sm font-medium text-slate-400">Welcome, {user.name.split(' ')[0]}</span>
                                    <button onClick={logout} className="text-slate-400 hover:text-red-400 transition-colors">
                                        <LogOut className="w-5 h-5" />
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center space-x-3">
                                <Link to="/login" className="btn btn-secondary text-sm">Login</Link>
                                <Link to="/signup" className="btn btn-primary text-sm font-bold">Sign Up</Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
