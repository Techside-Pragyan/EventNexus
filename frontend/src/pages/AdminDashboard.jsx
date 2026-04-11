import { useState, useEffect } from 'react';
import API from '../services/api';
import Navbar from '../components/Navbar';
import { Plus, Trash2, Edit, Calendar, MapPin, Tag, Users, AlertTriangle, Briefcase, Music, Laptop, Trash, FileEdit, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const AdminDashboard = () => {
    const [events, setEvents] = useState([]);
    const [stats, setStats] = useState({ totalUsers: 0, totalEvents: 0, totalRegistrations: 0 });
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingEvent, setEditingEvent] = useState(null);
    const [formData, setFormData] = useState({
        title: '', description: '', date: '', time: '', location: '', category: 'Tech', ticketType: 'Free', price: 0, maxAttendees: 100
    });

    useEffect(() => {
        fetchAdminData();
    }, []);

    const fetchAdminData = async () => {
        try {
            setLoading(true);
            const [eventsRes, statsRes] = await Promise.all([
                API.get('/events'),
                API.get('/admin/stats')
            ]);
            setEvents(eventsRes.data.data);
            setStats(statsRes.data.data);
        } catch (error) {
            toast.error('Failed to load admin data');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateUpdate = async (e) => {
        e.preventDefault();
        try {
            if (editingEvent) {
                await API.put(`/admin/events/${editingEvent._id}`, formData);
                toast.success('Event updated!');
            } else {
                await API.post('/admin/events', formData);
                toast.success('Event created!');
            }
            setShowModal(false);
            setEditingEvent(null);
            setFormData({ title: '', description: '', date: '', time: '', location: '', category: 'Tech', ticketType: 'Free', price: 0, maxAttendees: 100 });
            fetchAdminData();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Action failed');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this event?')) return;
        try {
            await API.delete(`/admin/events/${id}`);
            toast.success('Event deleted');
            fetchAdminData();
        } catch (error) {
            toast.error('Failed to delete event');
        }
    };

    const handleEdit = (event) => {
        setEditingEvent(event);
        setFormData({
            title: event.title,
            description: event.description,
            date: event.date.split('T')[0],
            time: event.time,
            location: event.location,
            category: event.category,
            ticketType: event.ticketType,
            price: event.price,
            maxAttendees: event.maxAttendees
        });
        setShowModal(true);
    };

    if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white animate-pulse text-2xl">Loading Admin Nexus...</div>;

    return (
        <div className="min-h-screen bg-slate-950 text-white pb-20">
            <Navbar />
            
            <div className="pt-24 max-w-7xl mx-auto px-4">
                <header className="mb-12 flex justify-between items-end border-b border-slate-800 pb-8">
                    <div>
                        <h1 className="text-4xl font-extrabold mb-4 uppercase tracking-tight">Admin <span className="text-primary-500">Nexus</span></h1>
                        <p className="text-slate-400">Total analytics and event management across the platform.</p>
                    </div>
                    <button 
                        onClick={() => { setEditingEvent(null); setShowModal(true); }}
                        className="btn btn-primary px-8 py-3 rounded-2xl flex items-center gap-2 font-bold uppercase tracking-widest shadow-2xl"
                    >
                        <Plus className="w-5 h-5" /> Create Nexus Event
                    </button>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    <div className="glass p-8 rounded-3xl border border-slate-800 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                            <Users className="w-20 h-20" />
                        </div>
                        <h3 className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-2">Total Nexus Users</h3>
                        <p className="text-4xl font-extrabold text-white">{stats.totalUsers}</p>
                    </div>
                    <div className="glass p-8 rounded-3xl border border-slate-800 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                            <Calendar className="w-20 h-20" />
                        </div>
                        <h3 className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-2">Live Nexus Events</h3>
                        <p className="text-4xl font-extrabold text-primary-500">{stats.totalEvents}</p>
                    </div>
                    <div className="glass p-8 rounded-3xl border border-slate-800 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                            <Tag className="w-20 h-20" />
                        </div>
                        <h3 className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-2">Nexus Registrations</h3>
                        <p className="text-4xl font-extrabold text-blue-500">{stats.totalRegistrations}</p>
                    </div>
                </div>

                <div className="glass rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
                    <div className="p-8 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
                        <h2 className="text-2xl font-bold uppercase tracking-tight flex items-center gap-3">
                           <Briefcase className="w-6 h-6 text-primary-500" /> Managed Events
                        </h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-900">
                                <tr>
                                    <th className="px-8 py-5 text-xs font-black text-slate-500 uppercase tracking-widest">Event Title</th>
                                    <th className="px-8 py-5 text-xs font-black text-slate-500 uppercase tracking-widest text-center">Date</th>
                                    <th className="px-8 py-5 text-xs font-black text-slate-500 uppercase tracking-widest text-center">Reservations</th>
                                    <th className="px-8 py-5 text-xs font-black text-slate-500 uppercase tracking-widest text-right">Settings</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/50">
                                {events.map((event) => (
                                    <tr key={event._id} className="hover:bg-slate-800/30 transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="font-bold text-white text-lg group-hover:text-primary-400 transition-colors uppercase truncate max-w-xs">{event.title}</div>
                                            <div className="text-sm text-slate-500">{event.category} • {event.location}</div>
                                        </td>
                                        <td className="px-8 py-6 text-center font-medium font-mono text-slate-300">
                                            {event.date.split('T')[0]}
                                        </td>
                                        <td className="px-8 py-6 text-center">
                                            <span className="bg-primary-900/30 text-primary-400 text-xs font-bold px-3 py-1 rounded-lg border border-primary-500/20">
                                                {event.attendees.length} / {event.maxAttendees}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-right space-x-4">
                                            <button onClick={() => handleEdit(event)} className="text-slate-500 hover:text-primary-500 transition-colors">
                                                <FileEdit className="w-5 h-5" />
                                            </button>
                                            <button onClick={() => handleDelete(event._id)} className="text-slate-500 hover:text-red-500 transition-colors">
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal */}
            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 overflow-y-auto pt-20 pb-10">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-slate-950/90 backdrop-blur-xl"
                            onClick={() => setShowModal(false)}
                        ></motion.div>
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="p-8 border-b border-slate-800">
                                <h3 className="text-2xl font-bold uppercase tracking-widest">{editingEvent ? 'Update Event' : 'Create New Event'}</h3>
                            </div>
                            <form onSubmit={handleCreateUpdate} className="p-8 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2 col-span-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase">Nexus Title</label>
                                        <input 
                                            value={formData.title}
                                            onChange={(e) => setFormData({...formData, title: e.target.value})}
                                            className="input-field"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2 col-span-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase">Description</label>
                                        <textarea 
                                            value={formData.description}
                                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                                            className="input-field h-32 py-4"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase">Event Date</label>
                                        <div className="relative">
                                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                            <input 
                                                type="date"
                                                value={formData.date}
                                                onChange={(e) => setFormData({...formData, date: e.target.value})}
                                                className="input-field pl-12"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase">Launch Time</label>
                                        <div className="relative">
                                            <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                            <input 
                                                type="time"
                                                value={formData.time}
                                                onChange={(e) => setFormData({...formData, time: e.target.value})}
                                                className="input-field pl-12"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase">Category</label>
                                        <select 
                                            value={formData.category}
                                            onChange={(e) => setFormData({...formData, category: e.target.value})}
                                            className="input-field bg-slate-900"
                                        >
                                            <option>Tech</option>
                                            <option>Music</option>
                                            <option>Sports</option>
                                            <option>Art</option>
                                            <option>Food</option>
                                            <option>Business</option>
                                            <option>Other</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase">Nexus Capacity</label>
                                        <input 
                                            type="number"
                                            value={formData.maxAttendees}
                                            onChange={(e) => setFormData({...formData, maxAttendees: e.target.value})}
                                            className="input-field"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2 col-span-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase">Nexus Location</label>
                                        <div className="relative">
                                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                            <input 
                                                value={formData.location}
                                                onChange={(e) => setFormData({...formData, location: e.target.value})}
                                                className="input-field pl-12"
                                                placeholder="Venue name or city"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="flex justify-end gap-4 pt-4 border-t border-slate-800">
                                    <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary px-8 font-bold">Cancel</button>
                                    <button type="submit" className="btn btn-primary px-8 font-bold uppercase tracking-widest">{editingEvent ? 'Update Nexus' : 'Launch Nexus'}</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminDashboard;
