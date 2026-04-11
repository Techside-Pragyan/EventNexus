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

    const categories = ['Tech', 'Music', 'Sports', 'Art', 'Food', 'Business', 'Other'];

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
                                className="group glass rounded-3xl overflow-hidden hover:shadow-primary-500/10 hover:shadow-2xl transition-all duration-300 border border-slate-800"
                            >
                                <div className="h-48 bg-slate-800 relative overflow-hidden">
                                    {event.image?.secure_url ? (
                                        <img src={event.image.secure_url} alt={event.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-600">
                                            <Calendar className="w-12 h-12" />
                                        </div>
                                    )}
                                    <div className="absolute top-4 right-4 bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-primary-400">
                                        {event.category}
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div className="flex items-center gap-2 text-slate-500 text-sm mb-3 font-medium uppercase tracking-wider">
                                        <Calendar className="w-4 h-4" />
                                        {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </div>
                                    <h3 className="text-xl font-bold mb-2 group-hover:text-primary-400 transition-colors uppercase truncate">
                                        {event.title}
                                    </h3>
                                    <p className="text-slate-400 text-sm line-clamp-2 mb-6 h-10">
                                        {event.description}
                                    </p>
                                    <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                                        <div className="flex items-center text-slate-300 text-sm">
                                            <MapPin className="w-4 h-4 mr-1 text-primary-500" />
                                            {event.location}
                                        </div>
                                        <span className="font-bold text-primary-400">
                                            {event.ticketType === 'Free' ? 'FREE' : `$${event.price}`}
                                        </span>
                                    </div>
                                    <Link to={`/event/${event._id}`} className="mt-6 w-full btn btn-primary flex justify-center items-center gap-2 py-3 rounded-2xl">
                                        View Details <ArrowRight className="w-4 h-4" />
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
