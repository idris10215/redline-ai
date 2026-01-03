import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck, Zap, Split } from 'lucide-react';
import { useState, useEffect } from 'react';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';

const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
};

const stagger = {
    visible: { transition: { staggerChildren: 0.1 } }
};

export default function LandingPage() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribe();
    }, []);

    return (
        <div className="min-h-screen pt-24 pb-20 px-6 max-w-7xl mx-auto">
            {/* Hero Section */}
            <motion.div
                initial="hidden"
                animate="visible"
                variants={stagger}
                className="text-center max-w-4xl mx-auto mb-32"
            >
                <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-6">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                    </span>
                    v2.0 Now Live
                </motion.div>

                <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl font-bold tracking-tight mb-8">
                    Superhuman <br />
                    <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent bg-[200%_auto] animate-gradient">
                        Contract Intelligence
                    </span>
                </motion.h1>

                <motion.p variants={fadeInUp} className="text-xl text-zinc-400 mb-10 max-w-2xl mx-auto leading-relaxed">
                    Detect contradictions and risks across legal documents instantly using Google Vertex AI.
                    The future of legal audit is here.
                </motion.p>

                <motion.div variants={fadeInUp}>
                    <Link to={user ? "/dashboard" : "/login"}>
                        <button className="group relative px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-semibold transition-all shadow-[0_0_40px_-10px_rgba(59,130,246,0.5)] hover:shadow-[0_0_60px_-10px_rgba(59,130,246,0.6)]">
                            {user ? "Go to Console" : "Launch Console"}
                            <ArrowRight className="inline-block ml-2 size-5 transition-transform group-hover:translate-x-1" />
                        </button>
                    </Link>
                </motion.div>
            </motion.div>

            {/* Bento Grid Section */}
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto"
            >
                {/* Card 1: Conflict Detection (Spans 2 cols) */}
                <div className="md:col-span-2 relative group overflow-hidden rounded-3xl glass-card p-8 min-h-[320px] flex flex-col justify-between">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <div className="relative z-10">
                        <div className="size-12 rounded-xl bg-blue-500/20 flex items-center justify-center mb-4 text-blue-400">
                            <Split className="size-6" />
                        </div>
                        <h3 className="text-2xl font-bold mb-2">Conflict Detection</h3>
                        <p className="text-zinc-400">Instantly visualizes contradictions between master agreements and addendums.</p>
                    </div>

                    {/* Mock UI for Conflict */}
                    <div className="relative mt-8 p-4 rounded-xl bg-zinc-950/50 border border-white/5 flex gap-4 items-center">
                        <div className="flex-1 space-y-2 opacity-50">
                            <div className="h-2 bg-zinc-700 rounded w-3/4"></div>
                            <div className="h-2 bg-zinc-700 rounded w-full"></div>
                        </div>
                        <div className="h-px bg-red-500/50 w-16 relative">
                            <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 bg-zinc-950 border border-red-500/50 text-[10px] text-red-400 px-2 rounded-full">
                                CONFLICT
                            </div>
                        </div>
                        <div className="flex-1 space-y-2">
                            <div className="h-2 bg-zinc-700 rounded w-full"></div>
                            <div className="h-2 bg-red-500/20 rounded w-2/3 border border-red-500/20"></div>
                        </div>
                    </div>
                </div>

                {/* Card 2: Privacy (1 col) */}
                <div className="md:col-span-1 relative group overflow-hidden rounded-3xl glass-card p-8 flex flex-col justify-between h-full">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <div>
                        <div className="size-12 rounded-xl bg-purple-500/20 flex items-center justify-center mb-4 text-purple-400">
                            <ShieldCheck className="size-6" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Privacy First</h3>
                        <p className="text-zinc-400 text-sm">Enterprise-grade security with Google Cloud. GDPR Compliant.</p>
                    </div>
                    <div className="mt-4 flex items-center justify-end text-purple-400/50">
                        <ShieldCheck className="size-16 opacity-20 rotate-12" />
                    </div>
                </div>

                {/* Card 3: Instant Analysis (1 col) */}
                <div className="md:col-span-1 relative group overflow-hidden rounded-3xl glass-card p-8 flex flex-col justify-between h-full">
                    <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <div>
                        <div className="size-12 rounded-xl bg-yellow-500/20 flex items-center justify-center mb-4 text-yellow-400">
                            <Zap className="size-6" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Instant Analysis</h3>
                        <p className="text-zinc-400 text-sm">Process complex PDFs in under 2 seconds.</p>
                    </div>

                    <div className="mt-6">
                        <div className="flex items-center gap-2 text-3xl font-mono font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
                            1.8s <span className="text-sm self-end mb-1 text-zinc-500">avg</span>
                        </div>
                    </div>
                </div>

                {/* Card 4: Compliance (1 col) - NEW */}
                <div className="md:col-span-1 relative group overflow-hidden rounded-3xl glass-card p-8 flex flex-col justify-between h-full">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <div>
                        <div className="size-12 rounded-xl bg-emerald-500/20 flex items-center justify-center mb-4 text-emerald-400">
                            <ShieldCheck className="size-6" />
                            {/* Reuse icon or new one */}
                        </div>
                        <h3 className="text-xl font-bold mb-2">Audit Logs</h3>
                        <p className="text-zinc-400 text-sm">Full traceability of every change.</p>
                    </div>
                </div>

                {/* Card 5: Smart Exports (1 col) - NEW */}
                <div className="md:col-span-1 relative group overflow-hidden rounded-3xl glass-card p-8 flex flex-col justify-between h-full">
                    <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <div>
                        <div className="size-12 rounded-xl bg-pink-500/20 flex items-center justify-center mb-4 text-pink-400">
                            <Zap className="size-6" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Smart Export</h3>
                        <p className="text-zinc-400 text-sm">Export to Word, PDF, or JSON.</p>
                    </div>
                </div>

                {/* Card 6: AI Assistant (2 cols) - NEW to balance */}
                <div className="md:col-span-2 relative group overflow-hidden rounded-3xl glass-card p-8 flex flex-col justify-between h-full">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative z-10 flex flex-col h-full">
                        <div className="size-12 rounded-xl bg-indigo-500/20 flex items-center justify-center mb-4 text-indigo-400">
                            <Split className="size-6" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Contextual AI Assistant</h3>
                        <p className="text-zinc-400 flex-1">Ask questions about your contracts in plain English.</p>

                        <div className="mt-4 bg-zinc-900/50 p-3 rounded-lg border border-white/5 flex gap-3 items-center">
                            <div className="size-2 rounded-full bg-indigo-500 animate-pulse"></div>
                            <span className="text-xs text-zinc-300">"What are the termination clauses?"</span>
                        </div>
                    </div>
                </div>

            </motion.div>
        </div>
    );
}

