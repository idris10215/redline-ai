import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle, ChevronRight, MessageSquare, ArrowLeft, Zap } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../lib/utils';

export default function AnalysisResult() {
    const { state } = useLocation();
    const [selectedConflict, setSelectedConflict] = useState(0);

    // Fallback data if page is accessed directly
    const defaultData = {
        riskScore: 0,
        conflicts: []
    };

    const analysisData = state?.analysisResult?.mockAnalysis || defaultData;
    const { riskScore, conflicts } = analysisData;

    return (
        <div className="min-h-screen pt-20 pb-10 px-6 max-w-[1600px] mx-auto overflow-hidden">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <Link to="/dashboard" className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 transition-colors">
                    <ArrowLeft className="size-5 text-zinc-400" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-3">
                        Analysis Report: <span className="text-zinc-400 font-normal">Master_v1 vs Addendum_24</span>
                    </h1>
                    <p className="text-zinc-500 text-sm">Processed today at 10:42 AM • 3 Conflicts user detected</p>
                </div>
            </div>

            <div className="grid grid-cols-12 gap-6 h-[calc(100vh-180px)] min-h-[600px]">
                {/* Column 1: Risk Overview & List (25%) */}
                <div className="col-span-12 lg:col-span-3 flex flex-col gap-6">
                    <div className="glass-panel p-6 rounded-2xl">
                        <h2 className="text-sm font-medium text-zinc-400 uppercase tracking-wider mb-6">Risk Score</h2>
                        <div className="relative size-48 mx-auto flex items-center justify-center">
                            {/* Simple Radial Progress Mock */}
                            <svg className="size-full -rotate-90" viewBox="0 0 100 100">
                                <circle cx="50" cy="50" r="45" fill="none" stroke="#27272a" strokeWidth="8" />
                                <circle
                                    cx="50" cy="50" r="45"
                                    fill="none"
                                    stroke="#ef4444"
                                    strokeWidth="8"
                                    strokeDasharray="283"
                                    strokeDashoffset="70"
                                    strokeLinecap="round"
                                    className="drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]"
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-4xl font-bold text-white">{riskScore}</span>
                                <span className={cn(
                                    "text-xs font-bold uppercase mt-1",
                                    riskScore > 70 ? "text-red-400" : riskScore > 40 ? "text-yellow-400" : "text-green-400"
                                )}>{riskScore > 70 ? "High Risk" : riskScore > 40 ? "Medium Risk" : "Low Risk"}</span>
                            </div>
                        </div>
                    </div>

                    <div className="glass-panel p-4 rounded-2xl flex-1 overflow-y-auto">
                        <h2 className="text-sm font-medium text-zinc-400 uppercase tracking-wider mb-4 px-2">Detected Conflicts</h2>
                        <div className="space-y-2">
                            {conflicts.map((c, i) => (
                                <button
                                    key={c.id}
                                    onClick={() => setSelectedConflict(i)}
                                    className={cn(
                                        "w-full text-left p-4 rounded-xl transition-all border",
                                        selectedConflict === i
                                            ? "bg-blue-500/10 border-blue-500/50"
                                            : "bg-zinc-900/50 border-transparent hover:bg-zinc-900"
                                    )}
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <span className={cn(
                                            "text-xs px-2 py-0.5 rounded-full border",
                                            c.severity === 'High' ? "bg-red-500/10 border-red-500/20 text-red-400" :
                                                c.severity === 'Medium' ? "bg-yellow-500/10 border-yellow-500/20 text-yellow-400" :
                                                    "bg-green-500/10 border-green-500/20 text-green-400"
                                        )}>{c.severity}</span>
                                        <ChevronRight className={cn("size-4 text-zinc-500 transition-transform", selectedConflict === i && "rotate-90")} />
                                    </div>
                                    <p className={cn("text-sm font-medium", selectedConflict === i ? "text-white" : "text-zinc-400")}>{c.title}</p>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Column 2: The Conflict Viewer (50%) */}
                <div className="col-span-12 lg:col-span-6 flex flex-col gap-6">
                    <div className="glass-panel p-6 rounded-2xl h-full flex flex-col">
                        <h2 className="text-sm font-medium text-zinc-400 uppercase tracking-wider mb-6">Conflict Viewer</h2>

                        {conflicts.length > 0 ? (
                            <div className="flex-1 space-y-6">
                                {/* Doc A */}
                                <div className="group">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs font-semibold text-blue-400 bg-blue-500/10 px-2 py-1 rounded">MASTER AGREEMENT</span>
                                        {/* <span className="text-xs text-zinc-500">Page 4, Clause 3.2</span> */}
                                    </div>
                                    <div className="p-6 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-300 leading-relaxed font-mono text-sm relative overflow-hidden">
                                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500/50"></div>
                                        {conflicts[selectedConflict]?.masterText || "N/A"}
                                    </div>
                                </div>

                                <div className="flex justify-center">
                                    <div className="bg-zinc-900 rounded-full p-2 border border-zinc-700">
                                        <AlertTriangle className="size-5 text-red-500" />
                                    </div>
                                </div>

                                {/* Doc B */}
                                <div className="group">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs font-semibold text-purple-400 bg-purple-500/10 px-2 py-1 rounded">COMPARISON DOC</span>
                                        {/* <span className="text-xs text-zinc-500">Page 1, Clause 1.4</span> */}
                                    </div>
                                    <div className="p-6 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-300 leading-relaxed font-mono text-sm relative overflow-hidden">
                                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-purple-500/50"></div>
                                        <span className="bg-red-500/20 text-red-100 rounded px-1 py-0.5 border-b border-red-500/50">
                                            {conflicts[selectedConflict]?.candidateText || "N/A"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-zinc-500">
                                <CheckCircle className="size-12 mb-4 text-green-500" />
                                <p>No substantial conflicts detected.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Column 3: AI Explanation (25%) */}
                <div className="col-span-12 lg:col-span-3">
                    <div className="glass-panel p-6 rounded-2xl h-full flex flex-col relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent pointer-events-none" />

                        <div className="flex items-center gap-3 mb-6">
                            <div className="size-8 rounded-lg bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
                                <Zap className="size-4 text-white" />
                            </div>
                            <h2 className="text-sm font-bold text-white uppercase tracking-wider">AI Insight</h2>
                        </div>

                        <div className="flex-1 bg-zinc-900/50 rounded-xl p-4 border border-white/5 relative">
                            <div className="absolute -top-1.5 left-4 size-3 bg-zinc-800 border-l border-t border-white/5 rotate-45 transform"></div>
                            <div className="flex gap-3 text-sm text-zinc-300 leading-relaxed">
                                <MessageSquare className="size-5 text-blue-400 shrink-0 mt-0.5" />
                                <p>
                                    {conflicts[selectedConflict].explanation}
                                </p>
                            </div>
                            <div className="mt-4 pt-4 border-t border-white/5">
                                <p className="text-xs text-zinc-500 mb-2">Citations</p>
                                <div className="flex gap-2">
                                    <span className="text-[10px] bg-zinc-800 px-2 py-1 rounded text-zinc-400 border border-zinc-700">UCC § 2-207</span>
                                    <span className="text-[10px] bg-zinc-800 px-2 py-1 rounded text-zinc-400 border border-zinc-700">Internal Policy 4.2</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-4">
                            <button className="w-full py-3 bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 text-sm font-medium rounded-xl border border-blue-500/20 transition-colors">
                                Ask Gemini Follow-up
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
