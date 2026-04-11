import { useState, useEffect } from 'react';
import API from '../services/api';
import Navbar from '../components/Navbar';
import { Calendar, MapPin, XCircle, Ticket, QrCode } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRegistrations();
    }, []);

    const fetchRegistrations = async () => {
        try {
            const { data } = await API.get('/events/my-registrations');
            setRegistrations(data.data);
        } catch (error) {
            toast.error('Failed to fetch registrations');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async (id) => {
        if (!window.confirm('Are you sure you want to cancel this registration?')) return;
        try {
            await API.delete(`/events/registration/${id}`);
            toast.success('Registration cancelled');
            fetchRegistrations();
        } catch (error) {
            toast.error('Failed to cancel registration');
        }
    };

    if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white text-2xl animate-pulse">Loading Dashboard...</div>;

    return (
        <div className="min-h-screen bg-slate-950 text-white pb-20">
            <Navbar />
            
            <div className="pt-24 max-w-7xl mx-auto px-4">
                <header className="mb-12 border-b border-slate-800 pb-8">
                    <h1 className="text-4xl font-extrabold mb-4 uppercase tracking-tight">Your NEXUS dashboard</h1>
                    <p className="text-slate-400">Manage all your event registrations and tickets here.</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {registrations.length > 0 ? (
                        registrations.map((reg, index) => (
                            <motion.div 
                                key={reg._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="glass rounded-3xl overflow-hidden border border-slate-800 hover:border-primary-500/50 transition-all duration-300 shadow-2xl"
                            >
                                <div className="p-8">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="bg-primary-600/20 p-3 rounded-2xl">
                                            <Ticket className="w-8 h-8 text-primary-500" />
                                        </div>
                                        <span className="bg-green-500/10 text-green-500 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest border border-green-500/20">
                                            Active Pass
                                        </span>
                                    </div>
                                    
                                    <h3 className="text-xl font-bold mb-4 uppercase leading-snug h-14 line-clamp-2">{reg.event.title}</h3>
                                    
                                    <div className="space-y-3 mb-8 text-slate-400">
                                        <div className="flex items-center gap-3">
                                            <Calendar className="w-4 h-4 text-primary-500" />
                                            <span className="text-sm font-medium">{new Date(reg.event.date).toLocaleDateString()} at {reg.event.time}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <MapPin className="w-4 h-4 text-primary-500" />
                                            <span className="text-sm font-medium">{reg.event.location}</span>
                                        </div>
                                    </div>

                                    <div className="bg-slate-900/50 p-4 rounded-2xl mb-8 flex items-center justify-center border border-slate-800 group hover:bg-slate-900 transition-colors">
                                        {reg.qrCode ? (
                                            <img src={reg.qrCode} alt="Ticket QR" className="w-32 h-32 grayscale group-hover:grayscale-0 transition-all" />
                                        ) : (
                                            <QrCode className="w-24 h-24 text-slate-700" />
                                        )}
                                    </div>

                                    <div className="flex items-center justify-between gap-4 pt-4 border-t border-slate-800">
                                        <button 
                                            onClick={() => handleCancel(reg._id)}
                                            className="text-red-400 hover:text-red-300 text-xs font-bold flex items-center gap-1 uppercase tracking-wider transition-colors"
                                        >
                                            <XCircle className="w-4 h-4" /> Cancel Pass
                                        </button>
                                        <span className="text-[10px] text-slate-500 font-mono">ID: {reg.ticketId.slice(0, 8)}...</span>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <div className="col-span-full py-20 text-center glass rounded-3xl border border-slate-800">
                            <Ticket className="w-16 h-16 text-slate-700 mx-auto mb-6" />
                            <h2 className="text-2xl font-bold mb-2">No registered events!</h2>
                            <p className="text-slate-500">You haven't registered for any events yet.</p>
                            <Link to="/" className="mt-8 btn btn-primary px-8 inline-block">Browse All Events</Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
