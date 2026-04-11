import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import API from '../services/api';
import Navbar from '../components/Navbar';
import { Calendar, MapPin, Tag, Users, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const EventDetails = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [registering, setRegistering] = useState(false);

    useEffect(() => {
        fetchEvent();
    }, [id]);

    const fetchEvent = async () => {
        try {
            const { data } = await API.get(`/events/${id}`);
            setEvent(data.data);
        } catch (error) {
            toast.error('Event not found');
            navigate('/');
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async () => {
        if (!user) {
            toast.error('Please login to register');
            return navigate('/login');
        }

        try {
            setRegistering(true);
            await API.post(`/events/${id}/register`);
            toast.success('Successfully registered!');
            fetchEvent(); // Refresh to update attendee count
        } catch (error) {
            toast.error(error.response?.data?.message || 'Registration failed');
        } finally {
            setRegistering(false);
        }
    };

    if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white text-2xl animate-pulse">Loading Event...</div>;

    const isAlreadyRegistered = user && event.attendees.includes(user.id);
    const isFull = event.attendees.length >= event.maxAttendees;

    return (
        <div className="min-h-screen bg-slate-950 text-white pb-20">
            <Navbar />
            
            <div className="pt-24 max-w-7xl mx-auto px-4">
                <Link to="/" className="flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors">
                    <ArrowLeft className="w-5 h-5" /> Back to Dashboard
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Event Content */}
                    <div className="lg:col-span-2 space-y-8">
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-slate-900 rounded-3xl overflow-hidden border border-slate-800"
                        >
                            <div className="h-[400px] w-full bg-slate-800 relative">
                                {event.image?.secure_url ? (
                                    <img src={event.image.secure_url} alt={event.title} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-700">
                                        <Calendar className="w-32 h-32" />
                                    </div>
                                )}
                                <div className="absolute top-6 left-6 flex gap-3">
                                    <div className="bg-primary-600 px-4 py-2 rounded-xl text-sm font-bold shadow-xl backdrop-blur-md">
                                        {event.category}
                                    </div>
                                    <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl text-sm font-bold shadow-xl">
                                        {event.ticketType}
                                    </div>
                                </div>
                            </div>

                            <div className="p-10">
                                <h1 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight leading-tight uppercase">
                                    {event.title}
                                </h1>
                                
                                <div className="flex flex-wrap gap-6 mb-10 text-slate-300">
                                    <div className="flex items-center gap-3 glass px-5 py-3 rounded-2xl">
                                        <Calendar className="w-6 h-6 text-primary-500" />
                                        <div>
                                            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Date & Time</p>
                                            <p className="font-semibold">{new Date(event.date).toLocaleDateString()} at {event.time}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 glass px-5 py-3 rounded-2xl">
                                        <MapPin className="w-6 h-6 text-red-500" />
                                        <div>
                                            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Location</p>
                                            <p className="font-semibold">{event.location}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 glass px-5 py-3 rounded-2xl">
                                        <Users className="w-6 h-6 text-blue-500" />
                                        <div>
                                            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Availability</p>
                                            <p className="font-semibold">{event.maxAttendees - event.attendees.length} / {event.maxAttendees} Left</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="prose prose-invert max-w-none">
                                    <h3 className="text-2xl font-bold mb-4 text-white uppercase border-b border-slate-800 pb-2 inline-block">About the Event</h3>
                                    <p className="text-slate-300 text-lg leading-relaxed whitespace-pre-line">
                                        {event.description}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Sidebar / Registration Form */}
                    <div className="lg:col-span-1">
                        <motion.div 
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="sticky top-28 glass p-8 rounded-3xl border border-slate-800"
                        >
                            <h3 className="text-2xl font-bold mb-6">Booking Details</h3>
                            
                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between items-center text-slate-400">
                                    <span>Ticket Price</span>
                                    <span className="text-white font-bold text-xl">{event.ticketType === 'Free' ? 'FREE' : `$${event.price}`}</span>
                                </div>
                                <div className="flex justify-between items-center text-slate-400 pt-4 border-t border-slate-800">
                                    <span>Service Fee</span>
                                    <span className="text-white">$0.00</span>
                                </div>
                                <div className="flex justify-between items-center text-slate-400">
                                    <span>Total</span>
                                    <span className="text-primary-500 font-extrabold text-2xl">{event.ticketType === 'Free' ? 'FREE' : `$${event.price}`}</span>
                                </div>
                            </div>

                            {isAlreadyRegistered ? (
                                <div className="bg-green-500/10 border border-green-500/50 p-6 rounded-2xl flex flex-col items-center text-center space-y-4">
                                    <CheckCircle className="w-12 h-12 text-green-500" />
                                    <h4 className="text-lg font-bold text-green-400 uppercase tracking-wider">Already Registered</h4>
                                    <p className="text-slate-400 text-sm">You've secured your spot! Check your dashboard for the ticket.</p>
                                    <Link to="/dashboard" className="w-full btn btn-primary py-3">View Ticket</Link>
                                </div>
                            ) : isFull ? (
                                <div className="bg-red-500/10 border border-red-500/50 p-6 rounded-2xl flex flex-col items-center text-center space-y-4">
                                    <AlertCircle className="w-12 h-12 text-red-500" />
                                    <h4 className="text-lg font-bold text-red-400 italic">Registration Closed</h4>
                                    <p className="text-slate-400 text-sm">Sorry, all spots have been taken for this event.</p>
                                </div>
                            ) : (
                                <button 
                                    onClick={handleRegister}
                                    disabled={registering}
                                    className="w-full btn btn-primary py-4 rounded-xl text-lg font-extrabold tracking-widest shadow-2xl uppercase"
                                >
                                    {registering ? 'Processing...' : 'Register Now'}
                                </button>
                            )}

                            <p className="text-center text-slate-500 text-xs mt-6">
                                By registering, you agree to our Terms of Service and Privacy Policy.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventDetails;
