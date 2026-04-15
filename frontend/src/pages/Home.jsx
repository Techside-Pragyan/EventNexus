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
            <header className="relative pt-32 pb-20 overflow-hidden bg-cover bg-center">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,#4c1d95_0%,transparent_50%)] opacity-30"></div>
                <div className="absolute inset-0 bg-[#0f172a]/70 backdrop-blur-sm"></div>
                
                <div className="relative max-w-7xl mx-auto px-4 text-center">
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-6xl font-extrabold mb-6 tracking-tight"
                    >
                        Nexus for <span className="text-primary-500">Events.</span>
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto"
                    >
                        Discover, explore and join world-class events from across the globe. Seamlessly manage your registrations and more.
                    </motion.p>
                    
                    {/* Search Bar */}
                    <div className="max-w-4xl mx-auto glass p-2 rounded-2xl shadow-2xl flex flex-col md:flex-row gap-2">
                        <div className="flex-1 relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                            <input 
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={handleSearch}
                                placeholder="Search events..."
                                className="w-full pl-12 pr-4 py-3 bg-transparent border-none focus:ring-0 text-white font-medium"
                            />
                        </div>
                        <div className="w-px bg-slate-700 hidden md:block"></div>
                        <div className="flex-1 px-4 py-3 flex items-center space-x-2">
                            <Tag className="text-slate-500 w-5 h-5" />
                            <select 
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="bg-transparent border-none text-slate-300 w-full focus:ring-0 appearance-none cursor-pointer"
                            >
                                <option value="" className="bg-slate-900">All Categories</option>
                                {categories.map(c => <option key={c} value={c} className="bg-slate-900">{c}</option>)}
                            </select>
                        </div>
                        <div className="w-px bg-slate-700 hidden md:block"></div>
                        <div className="flex-1 px-4 py-3 flex items-center space-x-2">
                            <MapPin className="text-slate-500 w-5 h-5" />
                            <input 
                                type="text"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                placeholder="Location..."
                                className="bg-transparent border-none focus:ring-0 text-white w-full"
                            />
                        </div>
                        <button 
                            onClick={fetchEvents}
                            className="bg-primary-600 px-8 py-3 rounded-xl font-bold hover:bg-primary-500 transition-all shadow-lg active:scale-95"
                        >
                            Find
                        </button>
                    </div>
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
                    <div className="text-center py-20 glass rounded-3xl">
                        <Calendar className="w-20 h-20 text-slate-700 mx-auto mb-4" />
                        <h3 className="text-2xl font-bold mb-2">No events found.</h3>
                        <p className="text-slate-500">Try adjusting your filters or check back later.</p>
                        <button onClick={() => { setCategory(''); setLocation(''); setSearch(''); }} className="mt-6 text-primary-500 font-bold hover:underline">Clear all filters</button>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Home;
