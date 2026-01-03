import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User, LogOut, FileSearch, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '../lib/utils';
import { auth } from '../firebase'; // Import auth
import { onAuthStateChanged, signOut } from 'firebase/auth'; // Import Firebase methods

export default function Navbar() {
    const [user, setUser] = useState(null);
    const [isSigningOut, setIsSigningOut] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    // Listen for auth changes
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribe();
    }, []);

    const handleLogout = async () => {
        setIsSigningOut(true);
        // Artificial delay for the "good looking" animation effect
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        try {
            await signOut(auth);
            navigate('/');
        } catch (error) {
            console.error("Error signing out:", error);
        } finally {
            setIsSigningOut(false);
        }
    };

    const isActive = (path) => location.pathname === path;

    // Define navigation links based on auth state
    const navLinks = user ? [
        { name: 'Home', path: '/' },
        { name: 'Dashboard', path: '/dashboard' },
        { name: 'History', path: '/history' },
    ] : [
        { name: 'Home', path: '/' },
    ];

    return (
        <>
            <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b bg-zinc-950/50 backdrop-blur-xl border-white/10">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="relative flex items-center justify-center size-8 rounded-lg bg-gradient-to-tr from-blue-600 to-cyan-500 shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-all">
                            <FileSearch className="size-5 text-white" />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-white group-hover:text-blue-100 transition-colors">
                            LegalLens
                        </span>
                    </Link>

                    {/* Navigation Links */}
                    <div className="hidden md:flex items-center gap-6">
                        {navLinks.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={cn(
                                    "relative text-sm font-medium transition-colors hover:text-white",
                                    isActive(item.path) ? "text-white" : "text-zinc-400"
                                )}
                            >
                                {item.name}
                                {isActive(item.path) && (
                                    <motion.div
                                        layoutId="navbar-indicator"
                                        className="absolute -bottom-6 left-0 right-0 h-0.5 bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                                    />
                                )}
                            </Link>
                        ))}
                    </div>

                    {/* Auth Section */}
                    <div className="flex items-center gap-4">
                        {user ? (
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-3 pr-4 border-r border-white/10">
                                    <div className="size-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 p-[1px]">
                                        <div className="size-full rounded-full bg-zinc-900 flex items-center justify-center">
                                            <img 
                                                src={user.photoURL || `https://ui-avatars.com/api/?name=${user.email}`} 
                                                alt="Profile" 
                                                className="size-full rounded-full object-cover" 
                                            />
                                        </div>
                                    </div>
                                    <div className="text-xs hidden sm:block">
                                        <div className="text-white font-medium max-w-[100px] truncate">{user.displayName || user.email}</div>
                                        <div className="text-zinc-500">Pro Plan</div>
                                    </div>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="text-zinc-400 hover:text-red-400 transition-colors"
                                    title="Logout"
                                >
                                    <LogOut className="size-5" />
                                </button>
                            </div>
                        ) : (
                            <Link to="/login">
                                <button className="px-4 py-2 text-sm font-medium text-white bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-all hover:border-white/20">
                                    Sign In
                                </button>
                            </Link>
                        )}
                    </div>
                </div>
            </nav>

            {/* Sign Out Overlay */}
            <AnimatePresence>
                {isSigningOut && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-zinc-950/60 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            className="bg-zinc-900 border border-white/10 p-6 rounded-2xl shadow-2xl flex flex-col items-center gap-4 min-w-[200px]"
                        >
                            <div className="relative">
                                <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full"></div>
                                <Loader2 className="size-8 text-blue-500 animate-spin relative z-10" />
                            </div>
                            <div className="text-center">
                                <h3 className="text-lg font-medium text-white">Signing out</h3>
                                <p className="text-sm text-zinc-500">See you soon</p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
