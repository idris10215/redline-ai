import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, FileText, ArrowRight, Zap, Target, Search, FileSearch, History, AlertTriangle, CheckCircle, MoreHorizontal } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';

export default function Dashboard() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeSection, setActiveSection] = useState('conflict');
    const [masterFile, setMasterFile] = useState(null);
    const [comparisonFile, setComparisonFile] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    // Auth Guard
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                setLoading(false);
            } else {
                setLoading(false);
                navigate('/login');
            }
        });
        return () => unsubscribe();
    }, [navigate]);

    const navItems = [
        { id: 'conflict', label: 'Conflict Analysis', icon: Target },
        { id: 'extraction', label: 'Clause Extraction', icon: Search },
        { id: 'risk', label: 'Risk Map', icon: FileSearch },
        { id: 'history', label: 'Recent Activity', icon: History },
    ];

    const handleScrollTo = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            setActiveSection(id);
        }
    };

    // Optional: Update active section on scroll
    useEffect(() => {
        const handleScroll = () => {
            const sections = navItems.map(item => document.getElementById(item.id));
            const scrollPosition = window.scrollY + 200; // Offset

            for (const section of sections) {
                if (section && section.offsetTop <= scrollPosition && (section.offsetTop + section.offsetHeight) > scrollPosition) {
                    setActiveSection(section.id);
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    if (loading) {
         return (
             <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white">
                 <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
             </div>
         );
    }

    const handleDrop = (e, type) => {
        e.preventDefault();
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            if (type === 'master') setMasterFile(files[0]);
            else setComparisonFile(files[0]);
        }
    };

    const handleFileSelect = (e, type) => {
        const files = e.target.files;
        if (files.length > 0) {
            if (type === 'master') setMasterFile(files[0]);
            else setComparisonFile(files[0]);
        }
    }

    const handleClick = (type) => {
        document.getElementById(`file-input-${type}`).click();
    }

    const handleAnalysis = async () => {
        if (!masterFile || !comparisonFile || !user) return;

        setIsAnalyzing(true);
        const formData = new FormData();
        formData.append('master', masterFile);
        formData.append('candidate', comparisonFile);

        try {
            const idToken = await user.getIdToken();
            const response = await fetch('http://localhost:3000/api/analyze', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${idToken}`
                },
                body: formData
            });

            if (response.ok) {
                const data = await response.json();
                navigate('/results', { state: { analysisResult: data } });
            } else {
                console.error("Analysis failed");
                alert("Analysis failed. Please try again.");
            }
        } catch (error) {
            console.error("Error during analysis:", error);
            alert("Network error occurred.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="min-h-screen pt-24 px-6 max-w-7xl mx-auto pb-40">

            {/* Hidden Inputs for File Selection */}
            <input 
                type="file" 
                id="file-input-master" 
                className="hidden" 
                accept=".pdf" 
                onChange={(e) => handleFileSelect(e, 'master')} 
            />
            <input 
                type="file" 
                id="file-input-comparison" 
                className="hidden" 
                accept=".pdf" 
                onChange={(e) => handleFileSelect(e, 'comparison')} 
            />

            {/* Sticky Header / Sub-Navbar */}
            <div className="sticky top-20 z-40 bg-zinc-950/80 backdrop-blur-xl py-4 mb-8 -mx-6 px-6 border-b border-white/5">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Workspace</h1>
                    <div className="flex items-center gap-1 p-1 rounded-xl bg-zinc-900/80 border border-white/5 overflow-x-auto">
                        {navItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => handleScrollTo(item.id)}
                                className={cn(
                                    "relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 whitespace-nowrap",
                                    activeSection === item.id
                                        ? "text-white bg-white/10 shadow-lg"
                                        : "text-zinc-500 hover:text-zinc-300 hover:bg-white/5"
                                )}
                            >
                                <item.icon className="size-4" />
                                {item.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="space-y-24">

                {/* SECTION 1: CONFLICT ANALYSIS */}
                <section id="conflict" className="scroll-mt-40">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400"><Target className="size-6" /></div>
                        <div>
                            <h2 className="text-xl font-bold">Conflict Analysis</h2>
                            <p className="text-sm text-zinc-400">Detect contradictions between documents</p>
                        </div>
                    </div>

                    <div className="glass-panel p-1 rounded-3xl overflow-hidden">
                        <div className="bg-zinc-950/80 p-8 rounded-[22px]">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Master Dropzone */}
                                <div
                                    onDrop={(e) => handleDrop(e, 'master')}
                                    onDragOver={(e) => e.preventDefault()}
                                    onClick={() => handleClick('master')}
                                    className={cn(
                                        "group relative h-64 rounded-2xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center cursor-pointer overflow-hidden bg-zinc-900/30",
                                        masterFile ? "border-blue-500/50 bg-blue-500/5" : "border-zinc-700 hover:border-blue-500/40 hover:bg-zinc-800/50"
                                    )}
                                >
                                    <AnimatePresence mode="wait">
                                        {masterFile ? (
                                            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center relative z-10">
                                                <div className="size-16 bg-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-3 text-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.25)]">
                                                    <FileText className="size-8" />
                                                </div>
                                                <p className="font-medium text-white">{masterFile.name}</p>
                                                <p className="text-xs text-zinc-500 mt-1">{(masterFile.size / 1024 / 1024).toFixed(2)} MB</p>
                                            </motion.div>
                                        ) : (
                                            <motion.div className="text-center relative z-10 p-6">
                                                <div className="size-14 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                                                    <UploadCloud className="size-6 text-zinc-400 group-hover:text-blue-400 transition-colors" />
                                                </div>
                                                <h3 className="font-medium text-zinc-300">Master Agreement</h3>
                                                <p className="text-xs text-zinc-500 mt-1 max-w-[200px] mx-auto">Drag & drop your primary contract here</p>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Comparison Dropzone */}
                                <div
                                    onDrop={(e) => handleDrop(e, 'comparison')}
                                    onDragOver={(e) => e.preventDefault()}
                                    onClick={() => handleClick('comparison')}
                                    className={cn(
                                        "group relative h-64 rounded-2xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center cursor-pointer overflow-hidden bg-zinc-900/30",
                                        comparisonFile ? "border-purple-500/50 bg-purple-500/5" : "border-zinc-700 hover:border-purple-500/40 hover:bg-zinc-800/50"
                                    )}
                                >
                                    <AnimatePresence mode="wait">
                                        {comparisonFile ? (
                                            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center relative z-10">
                                                <div className="size-16 bg-purple-500/20 rounded-2xl flex items-center justify-center mx-auto mb-3 text-purple-400 shadow-[0_0_30px_rgba(168,85,247,0.25)]">
                                                    <FileText className="size-8" />
                                                </div>
                                                <p className="font-medium text-white">{comparisonFile.name}</p>
                                                <p className="text-xs text-zinc-500 mt-1">{(comparisonFile.size / 1024 / 1024).toFixed(2)} MB</p>
                                            </motion.div>
                                        ) : (
                                            <motion.div className="text-center relative z-10 p-6">
                                                <div className="size-14 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                                                    <UploadCloud className="size-6 text-zinc-400 group-hover:text-purple-400 transition-colors" />
                                                </div>
                                                <h3 className="font-medium text-zinc-300">New Version / Addendum</h3>
                                                <p className="text-xs text-zinc-500 mt-1 max-w-[200px] mx-auto">Drag & drop the document to compare against master</p>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                            {/* Footer Action */}
                            <div className="mt-8 flex items-center justify-end border-t border-white/5 pt-6">
                                
                                    <button
                                        onClick={handleAnalysis}
                                        disabled={!masterFile || !comparisonFile || isAnalyzing}
                                        className={cn(
                                            "flex items-center gap-2 px-8 py-3 rounded-xl font-medium transition-all duration-300",
                                            masterFile && comparisonFile && !isAnalyzing
                                                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg hover:shadow-blue-500/25 hover:scale-[1.02]"
                                                : "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                                        )}
                                    >
                                        {isAnalyzing ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/20 border-t-white"></div>
                                                Analyzing...
                                            </>
                                        ) : (
                                            <>
                                                <Zap className="size-4 fill-current" />
                                                Run Analysis
                                            </>
                                        )}
                                    </button>
                                
                            </div>
                        </div>
                    </div>
                </section>

                {/* SECTION 2: CLAUSE EXTRACTION */}
                <section id="extraction" className="scroll-mt-40">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400"><Search className="size-6" /></div>
                        <div>
                            <h2 className="text-xl font-bold">Clause Extraction</h2>
                            <p className="text-sm text-zinc-400">Automated key-value pair identification</p>
                        </div>
                    </div>

                    <div className="glass-panel rounded-2xl overflow-hidden min-h-[300px] relative">
                        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>
                        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="p-4 rounded-xl bg-zinc-900 border border-white/5 space-y-3">
                                <div className="text-xs text-zinc-500 font-medium uppercase">Indemnification</div>
                                <div className="h-2 bg-zinc-800 rounded w-3/4"></div>
                                <div className="h-2 bg-zinc-800 rounded w-1/2"></div>
                                <div className="h-2 bg-zinc-800 rounded w-full"></div>
                            </div>
                            <div className="p-4 rounded-xl bg-zinc-900 border border-white/5 space-y-3">
                                <div className="text-xs text-zinc-500 font-medium uppercase">Termination</div>
                                <div className="h-2 bg-zinc-800 rounded w-2/3"></div>
                                <div className="h-2 bg-zinc-800 rounded w-full"></div>
                            </div>
                            <div className="p-4 rounded-xl bg-zinc-900 border border-white/5 space-y-3">
                                <div className="text-xs text-zinc-500 font-medium uppercase">Jurisdiction</div>
                                <div className="flex items-center gap-2">
                                    <span className="px-2 py-1 rounded bg-blue-500/10 text-blue-400 text-xs">California</span>
                                    <ArrowRight className="size-3 text-zinc-600" />
                                    <span className="px-2 py-1 rounded bg-purple-500/10 text-purple-400 text-xs">New York</span>
                                </div>
                            </div>
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center backdrop-blur-[1px]">
                            <button className="px-6 py-2 rounded-full border border-zinc-700 bg-zinc-900/80 text-zinc-400 text-sm hover:text-white hover:border-zinc-500 transition-colors">
                                Connect Data Source to View Live
                            </button>
                        </div>
                    </div>
                </section>

                {/* SECTION 3: RISK MAP */}
                <section id="risk" className="scroll-mt-40">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-red-500/10 rounded-lg text-red-400"><FileSearch className="size-6" /></div>
                        <div>
                            <h2 className="text-xl font-bold">Risk Map</h2>
                            <p className="text-sm text-zinc-400">Visual hotspot analysis of contract liabilities</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-4 gap-4">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="h-32 rounded-xl bg-zinc-900/50 border border-white/5 relative overflow-hidden group">
                                <div className={cn(
                                    "absolute inset-0 opacity-20 transition-opacity group-hover:opacity-40",
                                    i === 1 || i === 5 ? "bg-red-500" : i === 3 ? "bg-yellow-500" : "bg-green-500"
                                )} />
                                <div className="absolute bottom-3 left-3 right-3">
                                    <div className="flex justify-between items-end">
                                        <span className="text-xs font-medium text-zinc-300">Section {i + 1}.0</span>
                                        {(i === 1 || i === 5) && <AlertTriangle className="size-4 text-red-500" />}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* SECTION 4: RECENT ACTIVITY */}
                <section id="history" className="scroll-mt-40">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400"><History className="size-6" /></div>
                        <div>
                            <h2 className="text-xl font-bold">Recent Activity</h2>
                            <p className="text-sm text-zinc-400">Past analyses and audit logs</p>
                        </div>
                    </div>

                    <div className="glass-panel overflow-hidden rounded-2xl">
                        <table className="w-full text-left text-sm text-zinc-400">
                            <thead className="bg-zinc-900/50 text-xs uppercase font-medium text-zinc-500">
                                <tr>
                                    <th className="px-6 py-4">Document Name</th>
                                    <th className="px-6 py-4">Analysis Type</th>
                                    <th className="px-6 py-4">Risk Score</th>
                                    <th className="px-6 py-4">Date</th>
                                    <th className="px-6 py-4"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {[
                                    { name: "Vendor_Agreement_v2.pdf", type: "Conflict Check", risk: "Low", date: "2 mins ago" },
                                    { name: "NDA_Green_Corp.pdf", type: "Risk Scan", risk: "High", date: "4 hours ago" },
                                    { name: "Service_Level_Addendum.pdf", type: "Clause Extraction", risk: "Safe", date: "Yesterday" },
                                ].map((row, i) => (
                                    <tr key={i} className="hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4 font-medium text-white flex items-center gap-2">
                                            <FileText className="size-4 text-zinc-500" />
                                            {row.name}
                                        </td>
                                        <td className="px-6 py-4">{row.type}</td>
                                        <td className="px-6 py-4">
                                            <span className={cn(
                                                "px-2 py-1 rounded text-xs",
                                                row.risk === 'High' ? "bg-red-500/10 text-red-400 border border-red-500/20" :
                                                    row.risk === 'Low' ? "bg-green-500/10 text-green-400 border border-green-500/20" :
                                                        "bg-zinc-800 text-zinc-400"
                                            )}>{row.risk}</span>
                                        </td>
                                        <td className="px-6 py-4">{row.date}</td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                                                <MoreHorizontal className="size-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="p-4 border-t border-white/5 text-center">
                            <button className="text-xs text-zinc-500 hover:text-white transition-colors">View All History</button>
                        </div>
                    </div>
                </section>

            </div>
        </div>
    );
}
