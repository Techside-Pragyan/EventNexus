import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster, toast as hotToast } from 'react-hot-toast';
import { io } from 'socket.io-client';
import { useAuth } from './context/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import EventDetails from './pages/EventDetails';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';

const ProtectedRoute = ({ children, adminOnly = false }) => {
    const { user, loading, isAdmin } = useAuth();
    
    if (loading) return null;
    if (!user) return <Navigate to="/login" />;
    if (adminOnly && !isAdmin) return <Navigate to="/" />;
    
    return children;
};

function App() {
    useEffect(() => {
        const socket = io('http://localhost:5000');

        socket.on('newRegistration', (data) => {
            hotToast(`${data.userName} just registered for ${data.eventTitle}!`, {
                icon: '🎫',
                style: {
                    borderRadius: '10px',
                    background: '#1e293b',
                    color: '#fff',
                    border: '1px solid #334155'
                },
            });
        });

        return () => socket.disconnect();
    }, []);

    return (
        <Router>
            <Toaster position="top-right" />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/event/:id" element={<EventDetails />} />
                
                <Route path="/dashboard" element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                } />
                
                <Route path="/admin" element={
                    <ProtectedRoute adminOnly={true}>
                        <AdminDashboard />
                    </ProtectedRoute>
                } />
            </Routes>
        </Router>
    );
}

export default App;
