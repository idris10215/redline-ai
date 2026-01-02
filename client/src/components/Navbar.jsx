import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, LogOut, FileSearch } from 'lucide-react';
import { useState } from 'react';
import { cn } from '../lib/utils';

export default function Navbar() {
    const [isLoggedIn, setIsLoggedIn] = useState(false); // Mock auth state
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    return (
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
                    {[
                        { name: 'Home', path: '/' },
                        { name: 'Dashboard', path: '/dashboard' },
                        { name: 'History', path: '/history' },
                    ].map((item) => (
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
                    {isLoggedIn ? (
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-3 pr-4 border-r border-white/10">
                                <div className="size-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 p-[1px]">
                                    <div className="size-full rounded-full bg-zinc-900 flex items-center justify-center">
                                        <User className="size-4 text-white" />
                                    </div>
                                </div>
                                <div className="text-xs">
                                    <div className="text-white font-medium">Demo User</div>
                                    <div className="text-zinc-500">Pro Plan</div>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsLoggedIn(false)}
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
    );
}
