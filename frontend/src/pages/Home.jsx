import { useState, useEffect } from 'react';
import API from '../services/api';
import { Search, MapPin, Calendar, Tag, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Home = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');
    const [location, setLocation] = useState('');

    const categories = ['Tech', 'Music', 'Sports', 'Art', 'Food', 'Business', 'Marriage', 'Birthday', 'Ceremony', 'Anniversary', 'Concert', 'Other'];

    useEffect(() => {
        fetchEvents();
    }, [category, location]);

    const fetchEvents = async () => {
        try {
            setLoading(true);
            const { data } = await API.get('/events', {
                params: {
                    search, category, location
                }
            });
            setEvents(data.data);
        } catch (error) {
            console.error('Error fetching events', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        if (e.key === 'Enter') {
            fetchEvents();
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white pb-12">
            <Navbar />
            
            {/* Hero Section */}
            <header className="relative pt-48 pb-32 overflow-hidden">
                {/* Background Blobs */}
                <div className="absolute top-0 -left-20 w-96 h-96 bg-primary-600/30 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute top-40 -right-20 w-80 h-80 bg-blue-600/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }}></div>
                
                <div className="relative max-w-7xl mx-auto px-4 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="text-7xl md:text-8xl font-black mb-6 tracking-tighter leading-none uppercase italic">
                            The Nex<span className="text-primary-500">us</span> of <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-blue-500 to-purple-600">Experiences.</span>
                        </h1>
                    </motion.div>
                    
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-lg text-slate-400 mb-16 max-w-2xl mx-auto font-medium uppercase tracking-[0.3em]"
                    >
                        Protocol for discovery, entry, and management of global events.
                    </motion.p>
                    
                    {/* Search Bar */}
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="max-w-5xl mx-auto glass p-3 rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col md:flex-row gap-2 border border-white/5"
                    >
                        <div className="flex-[1.5] relative group">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary-500 transition-colors" />
                            <input 
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={handleSearch}
                                placeholder="Search the Nexus..."
                                className="w-full pl-16 pr-6 py-5 bg-slate-900/50 rounded-2xl border-none focus:ring-2 focus:ring-primary-500/50 text-white font-bold placeholder:text-slate-600 transition-all"
                            />
                        </div>
                        
                        <div className="flex-1 px-4 py-3 flex items-center space-x-3 bg-slate-900/30 rounded-2xl border border-white/5">
                            <Tag className="text-primary-500 w-5 h-5" />
                            <select 
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="bg-transparent border-none text-slate-300 w-full focus:ring-0 appearance-none cursor-pointer font-bold text-sm uppercase tracking-widest"
                            >
                                <option value="" className="bg-slate-900">All Sectors</option>
                                {categories.map(c => <option key={c} value={c} className="bg-slate-900">{c}</option>)}
                            </select>
                        </div>
                        
                        <div className="flex-1 px-4 py-3 flex items-center space-x-3 bg-slate-900/30 rounded-2xl border border-white/5">
                            <MapPin className="text-blue-500 w-5 h-5" />
                            <input 
                                type="text"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                placeholder="Coordinates..."
                                className="bg-transparent border-none focus:ring-0 text-white w-full font-bold text-sm uppercase tracking-widest placeholder:text-slate-600"
                            />
                        </div>
                        
                        <button 
                            onClick={fetchEvents}
                            className="bg-primary-600 px-10 py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-primary-500 transition-all shadow-[0_0_30px_rgba(124,58,237,0.4)] active:scale-95 text-sm"
                        >
                            Sync
                        </button>
                    </motion.div>
                </div>
            </header>

            {/* Event Listing */}
            <main className="max-w-7xl mx-auto px-4 mt-20">
                <div className="flex justify-between items-end mb-10">
                    <div>
                        <h2 className="text-3xl font-bold mb-2">Upcoming Events</h2>
                        <p className="text-slate-400">Discover what's happening around you.</p>
                    </div>
                    <div className="hidden md:flex gap-4">
                        <button className="text-primary-400 font-semibold hover:text-white transition-colors">View All</button>
                    </div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-96 bg-slate-900 rounded-3xl animate-pulse"></div>
                        ))}
                    </div>
                ) : events.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {events.map((event, index) => (
                            <motion.div 
                                key={event._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="group glass rounded-3xl overflow-hidden hover:shadow-primary-500/20 hover:shadow-[0_0_50px_-12px_rgba(var(--primary-rgb),0.3)] transition-all duration-500 border border-slate-800/50 hover:border-primary-500/50 relative"
                            >
                                <div className="h-52 bg-slate-800 relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent opacity-0 group-hover:opacity-60 transition-opacity duration-500 z-10"></div>
                                    {event.image?.secure_url ? (
                                        <img src={event.image.secure_url} alt={event.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-600 bg-slate-900">
                                            <Calendar className="w-12 h-12 opacity-20" />
                                        </div>
                                    )}
                                    <div className="absolute top-4 right-4 z-20">
                                        <div className="bg-slate-950/80 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-primary-400 border border-primary-500/20 shadow-xl">
                                            {event.category}
                                        </div>
                                    </div>
                                </div>
                                <div className="p-8 relative">
                                    <div className="flex items-center gap-2 text-primary-500/70 text-[10px] mb-4 font-black uppercase tracking-[0.2em]">
                                        <Calendar className="w-3.5 h-3.5" />
                                        {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </div>
                                    <h3 className="text-2xl font-black mb-3 group-hover:text-primary-400 transition-colors uppercase leading-tight line-clamp-1">
                                        {event.title}
                                    </h3>
                                    <p className="text-slate-400 text-sm line-clamp-2 mb-8 h-10 leading-relaxed font-medium">
                                        {event.description}
                                    </p>
                                    <div className="flex items-center justify-between pt-6 border-t border-slate-800/50">
                                        <div className="flex items-center text-slate-400 text-[11px] font-bold uppercase tracking-wider">
                                            <MapPin className="w-3.5 h-3.5 mr-2 text-primary-500" />
                                            {event.location}
                                        </div>
                                        <span className="font-black text-lg text-white">
                                            {event.ticketType === 'Free' ? (
                                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-600">FREE</span>
                                            ) : `$${event.price}`}
                                        </span>
                                    </div>
                                    <Link to={`/event/${event._id}`} className="mt-8 w-full group/btn relative overflow-hidden bg-slate-800 hover:bg-primary-600 px-6 py-4 rounded-2xl flex justify-center items-center gap-3 transition-all duration-300">
                                        <span className="relative z-10 font-black uppercase tracking-widest text-sm">View Experience</span>
                                        <ArrowRight className="w-4 h-4 relative z-10 group-hover/btn:translate-x-1 transition-transform" />
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-32 glass rounded-[40px] border border-white/5 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-b from-primary-500/5 to-transparent"></div>
                        <Calendar className="w-24 h-24 text-slate-800 mx-auto mb-8 group-hover:scale-110 group-hover:text-primary-900/40 transition-all duration-700" />
                        <h3 className="text-3xl font-black mb-4 uppercase tracking-tighter">No Nexus Signals Found</h3>
                        <p className="text-slate-500 max-w-sm mx-auto font-medium uppercase text-xs tracking-[0.2em] leading-loose">
                            {loading ? 'Scanning global event protocols...' : 'Ensure your local MongoDB nexus is active or try adjusting your filters.'}
                        </p>
                        {(!loading && (category || location || search)) && (
                            <button onClick={() => { setCategory(''); setLocation(''); setSearch(''); }} className="mt-10 btn btn-primary px-8 py-3 rounded-2xl font-black uppercase tracking-widest text-xs">Reset All Nodes</button>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
};

export default Home;
