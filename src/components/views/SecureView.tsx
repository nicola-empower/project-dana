'use client';

import React, { useState } from 'react';
import { useView } from '@/context/ViewContext';
import {
    LogOut, Shield, LayoutDashboard, PenTool, Baby, FolderOpen, LifeBuoy, Menu,
    AlertCircle, Calendar, Activity, Clock, Save, MapPin, Eye, Mic, Image, Phone, HeartHandshake,
    MessageCircle, ClipboardCheck, Sparkles, ArrowRight, Upload, UploadCloud, Video, FileText, X, Lock,
    Globe, Users, Plus, Trash2, User, Mail, ChevronDown, Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type TabType = 'dashboard' | 'log' | 'child' | 'archive' | 'safety';

// Helper: Generate SHA-256 Hash for Digital Fingerprint
async function generateFileHash(file: File): Promise<string> {
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

export default function SecureView() {
    const { setView } = useView();
    const [activeTab, setActiveTab] = useState<TabType>('dashboard');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Global Evidence State (Lifted from ArchiveTab)
    const [files, setFiles] = useState<{ name: string, type: string, size: string, date: string, hash?: string, timestamp?: string }[]>([
        { name: 'threat_nov12.mp3', type: 'audio', size: '2.4MB', date: '12 Nov', hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', timestamp: '2023-11-12T14:30:00Z' },
        { name: 'bruise_arm.jpg', type: 'image', size: '4.1MB', date: '10 Nov', hash: 'a591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f146e', timestamp: '2023-11-10T09:15:00Z' },
    ]);

    const addFile = (newFile: { name: string, type: string, size: string, date: string, hash?: string, timestamp?: string }) => {
        setFiles(prev => [newFile, ...prev]);
    };

    // Helper: Generate SHA-256 Hash for Digital Fingerprint
    const generateFileHash = async (file: File): Promise<string> => {
        const buffer = await file.arrayBuffer();
        const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        return hashHex;
    };

    // Mock Incidents State
    const [incidents, setIncidents] = useState([
        { date: 'Today, 09:30 AM', category: 'Physical Threat', text: 'Threw the remote at the wall near my head...', color: 'bg-red-50 text-red-600', marker: 'bg-red-600', location: 'Living Room' },
        { date: 'Yesterday, Pay Day', category: 'Financial Control', text: 'Demanded login details for my personal account...', color: 'bg-indigo-50 text-indigo-600', marker: 'bg-indigo-400', location: 'Home' },
        { date: '2 days ago', category: 'Stalking', text: 'Texted me asking who I was with at Tesco...', color: 'bg-amber-50 text-amber-600', marker: 'bg-amber-400', location: 'Tesco Car Park' }
    ]);

    const addIncident = (newIncident: any) => {
        setIncidents([newIncident, ...incidents]);
        setActiveTab('dashboard');
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full h-full secure-bg flex flex-col md:flex-row relative"
        >
            {/* QUICK EXIT */}
            <button onClick={() => setView('decoy')} className="fixed bottom-6 right-6 z-100 bg-dana-danger hover:bg-red-700 text-white px-6 py-4 rounded-full shadow-2xl shadow-red-900/40 flex items-center gap-3 font-bold transition-all hover:scale-105 active:scale-95 group">
                <LogOut className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                <span className="hidden md:inline tracking-wide">QUICK EXIT</span>
            </button>

            {/* Sidebar */}
            <aside className={`${mobileMenuOpen ? 'flex absolute inset-0 z-50 bg-white/95 backdrop-blur-xl' : 'hidden'} md:flex md:relative w-full md:w-72 flex-col p-6 pr-0 md:bg-transparent`}>
                {mobileMenuOpen && (
                    <button onClick={() => setMobileMenuOpen(false)} className="absolute top-6 right-6 p-2 bg-gray-100 rounded-lg md:hidden">
                        <LogOut className="w-5 h-5 text-gray-500" />
                    </button>
                )}
                <div className="glass-panel h-full rounded-2xl flex flex-col p-6">
                    <div className="flex items-center gap-3 mb-10">
                        <div className="w-10 h-10 rounded-xl bg-dana-purple text-white flex items-center justify-center shadow-lg shadow-dana-purple/30">
                            <Shield className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="font-bold text-xl text-gray-800 tracking-tight leading-none">Project DANA</h1>
                            <span className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold">Secure Archive</span>
                        </div>
                    </div>
                    <nav className="space-y-2 flex-1">
                        <NavButton active={activeTab === 'dashboard'} onClick={() => { setActiveTab('dashboard'); setMobileMenuOpen(false); }} icon={<LayoutDashboard size={20} />} label="Dashboard" />
                        <NavButton active={activeTab === 'log'} onClick={() => { setActiveTab('log'); setMobileMenuOpen(false); }} icon={<PenTool size={20} />} label="New Entry" />
                        <NavButton active={activeTab === 'child'} onClick={() => { setActiveTab('child'); setMobileMenuOpen(false); }} icon={<Baby size={20} />} label="Child Welfare" />
                        <NavButton active={activeTab === 'archive'} onClick={() => { setActiveTab('archive'); setMobileMenuOpen(false); }} icon={<FolderOpen size={20} />} label="Evidence Locker" />
                        <NavButton active={activeTab === 'safety'} onClick={() => { setActiveTab('safety'); setMobileMenuOpen(false); }} icon={<LifeBuoy size={20} />} label="Safety Plan" />
                    </nav>
                </div>
            </aside>

            <main className="flex-1 p-4 md:p-6 h-full overflow-hidden flex flex-col">
                <div className="md:hidden mb-4 flex justify-between items-center glass-panel p-4 rounded-xl">
                    <span className="font-bold text-gray-800 flex items-center gap-2"><Shield className="w-4 h-4 text-dana-purple" /> DANA</span>
                    <button className="p-2 bg-gray-100 rounded-lg" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}><Menu className="w-5 h-5" /></button>
                </div>

                <div className="flex-1 overflow-y-auto rounded-2xl hide-scrollbar pb-24 md:pb-0">
                    <AnimatePresence mode="wait">
                        {activeTab === 'dashboard' && <DashboardTab key="dashboard" incidents={incidents} />}
                        {activeTab === 'log' && <LogEntryTab key="log" onSave={addIncident} onAddFile={addFile} />}
                        {activeTab === 'child' && <ChildWelfareTab key="child" onSave={addIncident} onAddFile={addFile} />}
                        {activeTab === 'archive' && <ArchiveTab key="archive" files={files} onAddFile={addFile} />}
                        {activeTab === 'safety' && <SafetyTab key="safety" />}
                    </AnimatePresence>
                </div>
            </main>
        </motion.div>
    );
}

function NavButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all text-left ${active ? 'bg-dana-purple/10 text-dana-purple font-semibold' : 'text-gray-500 hover:bg-white/50 hover:text-gray-800 font-medium'}`}
        >
            {icon} {label}
        </button>
    )
}

function DashboardTab({ incidents }: { incidents: any[] }) {
    const [selectedIncident, setSelectedIncident] = useState<any>(null);

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
            <div className="glass-panel p-8 rounded-3xl relative overflow-hidden">
                <div className="relative z-10">
                    <h2 className="text-3xl font-serif font-bold text-gray-800 mb-2">Course of Conduct</h2>
                    <p className="text-gray-500 mb-6 max-w-md text-sm">
                        Your logs show a developing pattern. This timeline is crucial evidence for proving "Course of Conduct" under Scottish Law.
                    </p>
                    <div className="flex gap-3">
                        <div className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {incidents.length} Incidents recorded</div>
                        <div className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"><Calendar className="w-3 h-3" /> Escalation detected</div>
                    </div>
                </div>
                <Activity className="absolute -right-6 -bottom-6 w-64 h-64 text-dana-purple/5 z-0" />
            </div>

            <div className="glass-card p-6 rounded-2xl">
                <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2"><Clock className="w-4 h-4" /> Recent Pattern</h3>
                <div className="space-y-0">
                    {incidents.map((inc, i) => (
                        <div key={i} className="relative pl-8 pb-6 border-l-2 border-dana-purple/20 last:border-0 last:pb-0">
                            <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full ${inc.marker} border-2 border-white shadow-sm`}></div>
                            <div
                                onClick={() => setSelectedIncident(inc)}
                                className="bg-white/60 p-4 rounded-xl border border-white/50 hover:bg-white hover:shadow-md transition-all cursor-pointer group"
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <span className={`text-xs font-bold ${inc.color} px-2 py-0.5 rounded`}>{inc.category}</span>
                                    <span className="text-xs text-gray-400 font-medium group-hover:text-dana-purple transition-colors flex items-center gap-1">
                                        {inc.date} <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </span>
                                </div>
                                <p className="text-sm text-gray-700 font-medium line-clamp-2">"{inc.rawText || inc.text}"</p>
                                {inc.location && <div className="mt-2 flex items-center gap-1 text-xs text-gray-400"><MapPin className="w-3 h-3" /> {inc.location}</div>}

                                {/* Tags Preview */}
                                {inc.tags && inc.tags.length > 0 && (
                                    <div className="mt-2 flex flex-wrap gap-1">
                                        {inc.tags.slice(0, 3).map((tag: string, idx: number) => (
                                            <span key={idx} className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                                                <Sparkles className="w-2 h-2" /> {tag}
                                            </span>
                                        ))}
                                        {inc.tags.length > 3 && <span className="text-[10px] text-gray-400">+{inc.tags.length - 3}</span>}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Detail Modal */}
            <AnimatePresence>
                {selectedIncident && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
                        onClick={() => setSelectedIncident(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl p-6 md:p-8"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-800">{selectedIncident.category}</h3>
                                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                                        <Calendar className="w-4 h-4" /> {selectedIncident.date}
                                        {selectedIncident.location && <><span className="text-gray-300">•</span> <MapPin className="w-4 h-4" /> {selectedIncident.location}</>}
                                    </div>
                                </div>
                                <button onClick={() => setSelectedIncident(null)} className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors">
                                    <X className="w-5 h-5 text-gray-600" />
                                </button>
                            </div>

                            <div className="grid md:grid-cols-2 gap-8">
                                {/* Raw Text */}
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Original Entry</label>
                                    <div className="bg-gray-50 p-6 rounded-2xl text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                                        "{selectedIncident.rawText || selectedIncident.text}"
                                    </div>
                                </div>

                                {/* Legal Summary */}
                                <div>
                                    <label className="text-xs font-bold text-dana-purple uppercase tracking-wider mb-2 block flex items-center gap-1">
                                        <Shield className="w-3 h-3" /> Legal Summary
                                    </label>
                                    <div className="bg-dana-purple/5 border border-dana-purple/10 p-6 rounded-2xl text-gray-800 text-sm leading-relaxed whitespace-pre-wrap font-medium">
                                        {selectedIncident.legalSummary || "No legal summary available for this entry."}
                                    </div>
                                </div>
                            </div>

                            {/* Tags & Evidence */}
                            <div className="mt-8 pt-8 border-t border-gray-100 grid md:grid-cols-2 gap-8">
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Legal Tags</label>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedIncident.tags && selectedIncident.tags.length > 0 ? (
                                            selectedIncident.tags.map((tag: string) => (
                                                <span key={tag} className="bg-white border border-gray-200 text-gray-600 px-3 py-1 rounded-lg text-xs font-bold shadow-sm flex items-center gap-1">
                                                    <Sparkles className="w-3 h-3 text-yellow-500" /> {tag}
                                                </span>
                                            ))
                                        ) : <span className="text-sm text-gray-400 italic">No tags</span>}
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Attached Evidence</label>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedIncident.attachments && selectedIncident.attachments.length > 0 ? (
                                            selectedIncident.attachments.map((file: string, idx: number) => (
                                                <div key={idx} className="bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 border border-gray-200">
                                                    <FolderOpen className="w-3 h-3" /> {file}
                                                </div>
                                            ))
                                        ) : <span className="text-sm text-gray-400 italic">No attachments</span>}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    )
}

function LogEntryTab({ onSave, onAddFile }: { onSave: (data: any) => void, onAddFile: (file: any) => void }) {
    const [step, setStep] = useState(1);
    const [rawText, setRawText] = useState('');
    const [analyzing, setAnalyzing] = useState(false);
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [time, setTime] = useState(new Date().toTimeString().split(' ')[0].slice(0, 5));
    const [location, setLocation] = useState('');
    const [category, setCategory] = useState('Coercive Control');
    const [attachedFiles, setAttachedFiles] = useState<string[]>([]);

    // Analysis Result
    const [analysis, setAnalysis] = useState<{
        legalSummary: string;
        validation: string;
        tags: string[];
        selectedTags?: string[]; // Added optional selectedTags
        category: string;
    } | null>(null);

    // Initial Categories
    const categories = [
        "Coercive Control",
        "Financial Abuse",
        "Physical Abuse",
        "Sexual Abuse / Coercion",
        "Stalking / Harassment",
        "Threats / Intimidation",
        "Emotional / Psychological Abuse",
        "Isolation / Control",
        "Technology-Facilitated Abuse",
        "Property Damage",
        "Substance Abuse (Drugs/Alcohol)",
        "Legal Bullying",
        "Child-Related Concern"
    ];

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const hash = await generateFileHash(file);

            const newFile = {
                name: file.name,
                type: file.type.startsWith('image/') ? 'image' : 'file',
                size: (file.size / (1024 * 1024)).toFixed(1) + 'MB',
                date: 'Just now',
                hash: hash,
                timestamp: new Date().toISOString()
            };
            onAddFile(newFile);
            setAttachedFiles(prev => [...prev, file.name]);
        }
    };

    const handleAnalyze = async () => {
        if (!rawText) return;
        setStep(2);
        setAnalyzing(true);

        try {
            const response = await fetch('/api/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    text: rawText,
                    type: category,
                    context: { date, time, location }
                })
            });

            if (response.ok) {
                const data = await response.json();
                setAnalysis({
                    legalSummary: data.legalSummary,
                    validation: data.validation,
                    tags: data.tags || [],
                    selectedTags: data.tags || [],
                    category: data.category || category
                });
                // Auto-update category if AI suggests a better one
                if (data.category && categories.includes(data.category)) {
                    setCategory(data.category);
                }
            } else {
                setAnalysis({
                    legalSummary: "Could not connect to AI. Please perform manual review.",
                    validation: "We are unable to validate right now, but your experience matters.",
                    tags: [category],
                    selectedTags: [category],
                    category: category
                });
            }
        } catch (e) {
            console.error(e);
            setAnalysis({
                legalSummary: "Analysis failed. You can still save your log.",
                validation: "Error interacting with AI.",
                tags: [category],
                selectedTags: [category],
                category: category
            });
        }
    };

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="max-w-5xl mx-auto">
            <div className="glass-panel rounded-2xl overflow-hidden shadow-2xl shadow-black/5">
                <div className="px-8 py-6 border-b border-gray-100 bg-white/50">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-dana-purple" />
                        AI Evidence Logger
                    </h2>
                </div>
                <div className="p-8">
                    {step === 1 && (
                        <div className="space-y-6">
                            {/* Category Selection */}
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Category</label>
                                <div className="relative">
                                    <select
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        className="w-full p-4 bg-white/60 border border-white rounded-xl focus:ring-2 focus:ring-dana-purple/50 outline-none text-gray-700 font-bold appearance-none shadow-sm cursor-pointer hover:bg-white transition-colors"
                                    >
                                        {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                    </select>
                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                                </div>
                            </div>

                            {/* Date time and location inputs */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Date & Time of Incident</label>
                                    <div className="flex gap-2">
                                        <div className="relative flex-1">
                                            <input
                                                type="date"
                                                value={date}
                                                onChange={(e) => setDate(e.target.value)}
                                                className="w-full p-3 bg-white/60 border border-white rounded-xl focus:ring-2 focus:ring-dana-purple/50 outline-none text-sm font-bold text-gray-700 shadow-sm"
                                            />
                                        </div>
                                        <div className="relative w-32">
                                            <input
                                                type="time"
                                                value={time}
                                                onChange={(e) => setTime(e.target.value)}
                                                className="w-full p-3 bg-white/60 border border-white rounded-xl focus:ring-2 focus:ring-dana-purple/50 outline-none text-sm font-bold text-gray-700 shadow-sm"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Location</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="e.g. Kitchen, Tesco Car Park"
                                            value={location}
                                            onChange={(e) => setLocation(e.target.value)}
                                            className="w-full p-3 pl-10 bg-white/60 border border-white rounded-xl focus:ring-2 focus:ring-dana-purple/50 outline-none text-sm font-medium text-gray-700 shadow-sm"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Description</label>
                                <textarea
                                    value={rawText}
                                    onChange={(e) => setRawText(e.target.value)}
                                    className="w-full h-48 p-5 bg-white/60 border border-white rounded-xl focus:ring-2 focus:ring-dana-purple/50 focus:bg-white outline-none resize-none text-gray-700 leading-relaxed shadow-inner"
                                    placeholder="Write exactly what happened. Don't worry about legal terms..."
                                ></textarea>
                            </div>

                            {/* Evidence Upload */}
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Attach Evidence (Optional)</label>
                                <div className="flex flex-wrap gap-2 mb-2">
                                    {attachedFiles.map((f, i) => (
                                        <span key={i} className="text-xs bg-dana-purple/10 text-dana-purple px-2 py-1 rounded-lg border border-dana-purple/20 flex items-center gap-1 font-bold">
                                            <Check className="w-3 h-3" /> {f}
                                        </span>
                                    ))}
                                </div>
                                <label className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 border border-gray-200 rounded-xl cursor-pointer hover:bg-white hover:border-dana-purple/30 transition-all group">
                                    <div className="p-1.5 bg-gray-100 rounded-lg group-hover:bg-dana-purple/10 text-gray-500 group-hover:text-dana-purple transition-colors">
                                        <UploadCloud className="w-4 h-4" />
                                    </div>
                                    <span className="text-sm font-medium text-gray-600 group-hover:text-gray-800">Upload Photo / Video / Audio</span>
                                    <input type="file" className="hidden" accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt" onChange={handleFileUpload} />
                                </label>
                                <p className="text-[10px] text-gray-400 mt-2 ml-1">Files are automatically encrypted and stored in the Evidence Locker.</p>
                            </div>

                            <div className="flex justify-end pt-2">
                                <button onClick={handleAnalyze} className="bg-dana-purple text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:translate-y-[-2px] transition-transform flex items-center gap-2">
                                    Analyse & Encrypt <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="py-12 flex flex-col items-center justify-center">
                            <div className="loader-dots block relative w-20 h-5 mb-6">
                                <div className="absolute top-0 w-3 h-3 rounded-full bg-dana-purple"></div>
                                <div className="absolute top-0 w-3 h-3 rounded-full bg-dana-purple"></div>
                                <div className="absolute top-0 w-3 h-3 rounded-full bg-dana-purple"></div>
                                <div className="absolute top-0 w-3 h-3 rounded-full bg-dana-purple"></div>
                            </div>
                            <p className="text-sm text-gray-500">Processing with Gemini AI (Scottish Law Model)...</p>
                        </div>
                    )}

                    {step === 3 && analysis && (
                        <div className="animate-fade-in space-y-6">

                            {/* Validation Layer (User Only) */}
                            <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-6 relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-1 h-full bg-indigo-400"></div>
                                <div className="flex items-start gap-4 relaitve z-10">
                                    <div className="bg-white p-2 rounded-full shadow-sm text-indigo-600 hidden md:block">
                                        <HeartHandshake className="w-6 h-6" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-indigo-900 mb-2">Our Validation</h4>
                                        <p className="text-sm text-indigo-800 leading-relaxed italic">"{analysis.validation}"</p>
                                        <p className="text-[10px] text-indigo-400 mt-3 font-bold uppercase tracking-widest">For your eyes only • Not included in reports</p>
                                    </div>
                                </div>
                            </div>

                            {/* Split View: Raw vs Legal */}
                            <div className="grid md:grid-cols-2 gap-6">
                                {/* Left: User's Raw Words */}
                                <div className="flex flex-col h-full">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex justify-between">
                                        <span>Your Words</span>
                                        <span className="text-xs normal-case text-gray-400">Original</span>
                                    </label>
                                    <textarea
                                        value={rawText}
                                        onChange={(e) => setRawText(e.target.value)}
                                        className="flex-1 min-h-[200px] w-full p-4 bg-gray-50 border border-gray-100 rounded-xl text-sm text-gray-600 resize-none focus:outline-none focus:ring-2 focus:ring-gray-200"
                                    ></textarea>
                                </div>

                                {/* Right: Legal Translation */}
                                <div className="flex flex-col h-full">
                                    <label className="text-xs font-bold text-dana-purple uppercase tracking-wider mb-2 flex justify-between">
                                        <span className="flex items-center gap-1"><Shield className="w-3 h-3" /> Legal Summary</span>
                                        <span className="text-xs normal-case text-dana-purple/60">Family Court Ready</span>
                                    </label>
                                    <textarea
                                        value={analysis.legalSummary}
                                        onChange={(e) => setAnalysis({ ...analysis, legalSummary: e.target.value })}
                                        className="flex-1 min-h-[200px] w-full p-4 bg-white border-2 border-dana-purple/10 rounded-xl text-sm text-gray-800 font-medium resize-none focus:outline-none focus:ring-2 focus:ring-dana-purple/30 shadow-sm"
                                    ></textarea>
                                </div>
                            </div>

                            {/* Tags */}
                            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 block">Suggested Legal Tags (Click to Toggle)</label>
                                <div className="flex flex-wrap gap-2">
                                    {analysis.tags.map((t: string) => (
                                        <button
                                            key={t}
                                            onClick={() => toggleTag(t)}
                                            className={`text-xs font-bold px-3 py-1.5 rounded-lg border shadow-sm flex items-center gap-1 transition-all ${analysis.selectedTags?.includes(t)
                                                ? 'bg-white border-dana-purple text-dana-purple ring-2 ring-dana-purple/10'
                                                : 'bg-gray-100 border-gray-200 text-gray-400 hover:bg-gray-200'
                                                }`}
                                        >
                                            <Sparkles className={`w-3 h-3 ${analysis.selectedTags?.includes(t) ? 'text-yellow-500' : 'text-gray-400'}`} /> {t}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex justify-between items-center pt-2">
                                <button onClick={() => setStep(1)} className="text-gray-500 font-medium text-sm hover:text-gray-800 px-4">Back to Edit</button>
                                <button onClick={handleSave} className="bg-dana-purple text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:translate-y-[-2px] transition-transform flex items-center gap-2">
                                    <Save className="w-4 h-4" /> Save to Log
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
}

function ChildWelfareTab({ onSave, onAddFile }: { onSave: (data: any) => void, onAddFile: (file: any) => void }) {
    // 0. Date & Time
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [time, setTime] = useState(new Date().toTimeString().split(' ')[0].slice(0, 5));

    // 1. Handover Context
    const [handoverTime, setHandoverTime] = useState('On Time');
    const [parentState, setParentState] = useState<string[]>([]);
    const [thirdParty, setThirdParty] = useState('');

    // 2. The Child's Voice & Welfare
    const [quote, setQuote] = useState('');
    const [preContact, setPreContact] = useState<string[]>([]); // Anticipatory anxiety
    const [postContact, setPostContact] = useState<string[]>([]); // Condition upon return
    const [recoveryTime, setRecoveryTime] = useState('');

    // 3. Legal/Behavioral Tags
    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    // 4. Evidence
    const [details, setDetails] = useState('');
    const [attachedFiles, setAttachedFiles] = useState<string[]>([]);

    const toggleSelection = (list: string[], setList: any, item: string) => {
        if (list.includes(item)) setList(list.filter(i => i !== item));
        else setList([...list, item]);
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const hash = await generateFileHash(file);

            const newFile = {
                name: file.name,
                type: file.type.startsWith('image/') ? 'image' : 'file',
                size: (file.size / (1024 * 1024)).toFixed(1) + 'MB',
                date: 'Just now',
                hash: hash,
                timestamp: new Date().toISOString()
            };
            onAddFile(newFile);
            setAttachedFiles(prev => [...prev, file.name]);
        }
    };

    const handleSave = () => {
        // Auto-Categorization Logic
        let category = "Child Welfare";
        let color = 'bg-blue-50 text-blue-700';
        let marker = 'bg-blue-500';

        if (selectedTags.some(t => ['Interrogation', 'Instructed to Spy', 'Items Taken'].includes(t))) {
            category = "Coercive Control (Child)";
            color = 'bg-purple-50 text-purple-700'; marker = 'bg-purple-600';
        } else if (selectedTags.some(t => ['Denigration', 'Adult Knowledge', 'Forced Secrecy'].includes(t))) {
            category = "Alienation Risk";
            color = 'bg-red-50 text-red-700'; marker = 'bg-red-600';
        } else if (postContact.includes('Hungry') || postContact.includes('Dirty') || postContact.includes('Unsafe')) {
            category = "Neglect Concern";
            color = 'bg-orange-50 text-orange-700'; marker = 'bg-orange-600';
        }

        // Construct Narrative
        let narrative = `**Handover:** ${handoverTime}. `;
        if (parentState.length > 0) narrative += `Parent appeared: ${parentState.join(', ')}. `;
        if (thirdParty) narrative += `Third party present: ${thirdParty}. `;
        if (preContact.length > 0) narrative += `\n**Pre-Contact:** Child was ${preContact.join(', ')}. `;
        if (quote) narrative += `\n**Child Said:** "${quote}" `;
        if (postContact.length > 0) narrative += `\n**Returned:** ${postContact.join(', ')}. `;
        if (recoveryTime) narrative += `took ${recoveryTime} to settle. `;
        if (selectedTags.length > 0) narrative += `\n**Tags:** ${selectedTags.join(', ')}. `;
        if (details) narrative += `\n**Notes:** ${details}`;

        onSave({
            date: new Date(`${date}T${time}`).toLocaleString('en-GB'),
            category,
            text: narrative,
            color,
            marker,
            location: 'Post-Contact',
            attachments: attachedFiles
        });

        // Reset Form
        setQuote(''); setDetails(''); setParentState([]); setPreContact([]); setPostContact([]); setSelectedTags([]); setAttachedFiles([]);
    };

    const TagSection = ({ title, tags, helpText }: any) => (
        <div className="mb-4">
            <div className="flex items-center gap-2 mb-2 group relative">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest">{title}</h4>
                <div className="hidden group-hover:block absolute left-0 bottom-6 w-64 p-3 bg-gray-800 text-white text-xs rounded-xl shadow-xl z-50">
                    <span className="font-bold text-yellow-400">💡 Legal Lens:</span> {helpText}
                </div>
                <AlertCircle className="w-3 h-3 text-gray-400 cursor-help" />
            </div>
            <div className="flex flex-wrap gap-2">
                {tags.map((tag: string) => (
                    <button
                        key={tag}
                        onClick={() => toggleSelection(selectedTags, setSelectedTags, tag)}
                        className={`text-[10px] font-bold px-3 py-1.5 rounded-lg border transition-all ${selectedTags.includes(tag) ? 'bg-dana-purple text-white border-dana-purple shadow-md scale-105' : 'bg-white text-gray-600 border-gray-200 hover:border-dana-purple/50'}`}
                    >
                        {tag}
                    </button>
                ))}
            </div>
        </div>
    );

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="max-w-4xl mx-auto pb-20">
            <div className="glass-panel rounded-2xl overflow-hidden shadow-2xl shadow-black/5 mb-6">
                <div className="px-8 py-6 border-b border-gray-100 bg-white/50 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <Baby className="w-5 h-5 text-dana-purple" /> Child Welfare Log
                    </h2>
                    <span className="text-[10px] font-bold bg-indigo-50 text-indigo-600 px-2 py-1 rounded border border-indigo-100">Scottish Law Aligned</span>
                </div>

                <div className="p-8 space-y-8">
                    {/* 1. Context & Handover */}
                    <div className="bg-gray-50/50 p-5 rounded-xl border border-gray-100">
                        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><Clock className="w-4 h-4 text-gray-400" /> Handover Context</h3>

                        {/* Date & Time Picker */}
                        <div className="flex gap-4 mb-4 pb-4 border-b border-gray-200">
                            <div className="flex-1">
                                <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Date</label>
                                <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full p-2 bg-white rounded-lg border border-gray-200 text-sm font-bold text-gray-700" />
                            </div>
                            <div className="w-32">
                                <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Time</label>
                                <input type="time" value={time} onChange={e => setTime(e.target.value)} className="w-full p-2 bg-white rounded-lg border border-gray-200 text-sm font-bold text-gray-700" />
                            </div>
                        </div>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Timeliness</label>
                                <select value={handoverTime} onChange={e => setHandoverTime(e.target.value)} className="w-full p-2 bg-white rounded-lg border border-gray-200 text-sm">
                                    <option>On Time</option>
                                    <option>Late (15m+)</option>
                                    <option>Late (1hr+)</option>
                                    <option>Did not show</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Parent's State</label>
                                <div className="flex flex-wrap gap-2">
                                    {['Calm', 'Hostile', 'Under Influence', 'Aggressive'].map(s => (
                                        <button key={s} onClick={() => toggleSelection(parentState, setParentState, s)}
                                            className={`text-xs px-2 py-1 rounded border ${parentState.includes(s) ? 'bg-red-50 border-red-200 text-red-600 font-bold' : 'bg-white border-gray-200'}`}>
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 2. Before & After */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="text-sm font-bold text-gray-700 mb-2 block">Pre-Contact Behaviour</label>
                            <div className="flex flex-wrap gap-2 mb-2">
                                {['Clinging', 'Crying', 'Tummy Ache', 'Hiding', 'Silent'].map(b => (
                                    <button key={b} onClick={() => toggleSelection(preContact, setPreContact, b)}
                                        className={`text-xs px-3 py-1 rounded-full border ${preContact.includes(b) ? 'bg-orange-100 text-orange-700 border-orange-200' : 'bg-white border-gray-200'}`}>{b}</button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="text-sm font-bold text-gray-700 mb-2 block">Condition on Return</label>
                            <div className="flex flex-wrap gap-2 mb-2">
                                {['Hungry', 'Dirty', 'Wrong Clothes', 'Items Missing', 'Exhausted', 'Upset'].map(c => (
                                    <button key={c} onClick={() => toggleSelection(postContact, setPostContact, c)}
                                        className={`text-xs px-3 py-1 rounded-full border ${postContact.includes(c) ? 'bg-red-100 text-red-700 border-red-200' : 'bg-white border-gray-200'}`}>{c}</button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* 3. Legal Tags */}
                    <div>
                        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><Shield className="w-4 h-4 text-gray-400" /> Legal Red Flags</h3>
                        <div className="glass-card p-4 rounded-xl space-y-2">
                            <TagSection title="Monitoring & Control" tags={['Interrogation', 'Instructed to Spy', 'Items Taken']} helpText="Using the child to gather info about you is considered 'Coercive Control' under the 2018 Act." />
                            <TagSection title="Alienation / Emotional" tags={['Denigration', 'Adult Knowledge', 'Forced Secrecy', 'Love Withdrawal']} helpText="Turning a child against a parent (Alienation) is a significant welfare concern in family court." />
                            <TagSection title="Neglect (GIRFEC)" tags={['Basic Needs Unmet', 'Medical Neglect', 'Unsafe Environment']} helpText="Consistent failure to meet 'Safe, Healthy, Nurtured' needs is a safety issue." />
                            <TagSection title="Handover Abuse" tags={['Abusive at Handover', 'Refusal to Return', 'Third Party Intimidation']} helpText="Abuse towards you in front of a child is legally abuse of the child." />
                        </div>
                    </div>

                    {/* 4. Child's Voice & Evidence */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                            <MessageCircle className="w-4 h-4 text-dana-purple" /> The Child's Voice (Direct Quotes)
                        </label>
                        <textarea value={quote} onChange={(e) => setQuote(e.target.value)} className="w-full h-20 p-4 bg-white/60 border border-white rounded-xl focus:ring-2 focus:ring-dana-purple/50 text-sm mb-4" placeholder='Exact words: "Dad said you are crazy..."'></textarea>

                        <div className="flex items-center gap-4">
                            <div className="flex-1">
                                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Time to Settle</label>
                                <input type="text" value={recoveryTime} onChange={e => setRecoveryTime(e.target.value)} className="w-full p-2 bg-white/60 rounded-lg border border-white text-sm" placeholder="e.g. 2 hours, overnight" />
                            </div>
                            <div className="flex-1">
                                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Photo Evidence</label>
                                <label className="flex items-center justify-center gap-2 w-full p-2 bg-white/60 border border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-white transition-colors">
                                    <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                                    <UploadCloud className="w-4 h-4 text-gray-400" />
                                    <span className="text-xs text-gray-500 font-medium">Add Photo</span>
                                </label>
                            </div>
                        </div>
                        {attachedFiles.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                                {attachedFiles.map((f, i) => <span key={i} className="text-[10px] bg-dana-purple/10 text-dana-purple px-2 py-1 rounded border border-dana-purple/20 font-bold flex items-center gap-1"><Check className="w-3 h-3" /> {f}</span>)}
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end pt-4">
                        <button onClick={handleSave} className="bg-dana-purple text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-dana-purple/20 hover:scale-105 transition-all flex items-center gap-2">
                            <Save className="w-4 h-4" /> Save to Log
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}

function ArchiveTab({ files, onAddFile }: { files: any[], onAddFile: (file: any) => void }) {

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            let type = 'file';
            if (file.type.startsWith('image/')) type = 'image';
            else if (file.type.startsWith('video/')) type = 'video';
            else if (file.type.startsWith('audio/')) type = 'audio';

            const hash = await generateFileHash(file);

            const newFile = {
                name: file.name,
                type: type,
                size: (file.size / (1024 * 1024)).toFixed(1) + 'MB',
                date: 'Just now',
                hash: hash,
                timestamp: new Date().toISOString()
            };
            onAddFile(newFile);
        }
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'audio': return <Mic className="w-6 h-6" />;
            case 'image': return <Image className="w-6 h-6" />;
            case 'video': return <Video className="w-6 h-6" />;
            default: return <FileText className="w-6 h-6" />;
        }
    };

    const getColor = (type: string) => {
        switch (type) {
            case 'audio': return 'bg-red-50 text-red-500';
            case 'image': return 'bg-blue-50 text-blue-500';
            case 'video': return 'bg-purple-50 text-purple-500';
            default: return 'bg-gray-50 text-gray-500';
        }
    };

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <div className="flex justify-between items-end mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Evidence Locker</h2>
                <div className="flex gap-2">
                    <label className="bg-dana-purple text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-opacity-90 flex items-center gap-2 shadow-sm cursor-pointer transition-transform hover:scale-105 active:scale-95">
                        <Upload className="w-4 h-4" /> Upload Evidence
                        <input type="file" className="hidden" accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt" onChange={handleFileSelect} />
                    </label>
                </div>
            </div>

            {/* Upload Area Visual Hint */}
            <div className="mb-8 border-2 border-dashed border-dana-purple/30 bg-white/80 backdrop-blur-md rounded-2xl p-8 text-center transition-colors hover:bg-white hover:border-dana-purple/50">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 text-dana-purple shadow-sm">
                    <UploadCloud className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-1">Upload Secure Files</h3>
                <p className="text-sm text-gray-600 mb-4">Support for Video, Audio, Photos, and Documents. <br />Files are encrypted client-side before storage.</p>
                <p className="text-xs font-bold text-dana-purple uppercase tracking-wider">Drag & Drop Supported</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {files.map((file, i) => (
                    <div key={i} className="glass-card p-4 rounded-xl flex flex-col items-center justify-center text-center cursor-pointer group relative overflow-hidden">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform ${getColor(file.type)}`}>
                            {getIcon(file.type)}
                        </div>
                        <span className="text-xs font-bold text-gray-700 truncate w-full">{file.name}</span>
                        <span className="text-[10px] text-gray-400 mb-1">{file.date} • {file.size}</span>
                        {file.hash && (
                            <div className="w-full bg-gray-50 rounded p-1 text-[8px] text-gray-400 break-all font-mono border border-gray-100 text-center" title="SHA-256 Digital Fingerprint">
                                <span className="font-bold text-dana-purple">SHA-256:</span> {file.hash.substring(0, 12)}...
                            </div>
                        )}
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="p-1 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded"><X className="w-3 h-3" /></button>
                        </div>
                    </div>
                ))}

                <div className="border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-center min-h-[140px] opacity-75">
                    <Lock className="w-6 h-6 text-gray-300 mb-2" />
                    <span className="text-xs text-gray-400">Vault is<br />Encrypted</span>
                </div>
            </div>
        </motion.div>
    )
}

function SafetyTab() {
    const [customContacts, setCustomContacts] = useState<{ name: string, phone: string, email: string, address: string }[]>([]);
    const [newContact, setNewContact] = useState({ name: '', phone: '', email: '', address: '' });
    const [showForm, setShowForm] = useState(false);

    const handleAddContact = () => {
        if (!newContact.name) return;
        setCustomContacts([...customContacts, newContact]);
        setNewContact({ name: '', phone: '', email: '', address: '' });
        setShowForm(false);
    };

    const handleDeleteContact = (index: number) => {
        const updated = customContacts.filter((_, i) => i !== index);
        setCustomContacts(updated);
    };

    const SupportCard = ({ title, whoFor, phone, website, icon: Icon, colorClass = "bg-purple-50 text-dana-purple" }: any) => (
        <div className="bg-white/60 p-4 rounded-xl border border-white/50 hover:bg-white transition-colors">
            <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-lg ${colorClass}`}>
                        <Icon className="w-4 h-4" />
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-800 text-sm">{title}</h4>
                        <p className="text-[10px] text-gray-500">{whoFor}</p>
                    </div>
                </div>
            </div>
            <div className="space-y-1 mt-3">
                {phone && (
                    <div className="flex items-center gap-2 text-xs text-gray-700 font-bold bg-gray-50 p-2 rounded">
                        <Phone className="w-3 h-3 text-gray-400" /> {phone}
                    </div>
                )}
                {website && (
                    <a href={`https://${website}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs text-blue-600 hover:underline px-2">
                        <Globe className="w-3 h-3 text-blue-400" /> {website}
                    </a>
                )}
            </div>
        </div>
    );

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="pb-20">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Shield className="w-6 h-6 text-dana-purple" /> Safety Plan
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
                {/* LEFT COLUMN: Emergency & Specialized Support */}
                <div className="space-y-6">
                    {/* Critical Emergency */}
                    <div className="glass-panel p-6 rounded-2xl border-l-4 border-red-500">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-red-700 flex items-center gap-2">
                                <AlertCircle className="w-5 h-5" /> Immediate Danger
                            </h3>
                            <span className="text-xs font-bold bg-red-100 text-red-700 px-2 py-1 rounded">24/7</span>
                        </div>
                        <div className="flex items-center justify-between bg-red-500 text-white p-4 rounded-xl shadow-lg shadow-red-500/20 mb-3">
                            <div>
                                <p className="text-sm font-medium opacity-90">Police Emergency</p>
                                <p className="text-xs opacity-75">When in immediate danger</p>
                            </div>
                            <span className="text-3xl font-black tracking-widest">999</span>
                        </div>
                        <div className="bg-white/80 p-3 rounded-xl border border-red-100">
                            <p className="font-bold text-gray-800 text-sm">National Domestic Abuse Helpline</p>
                            <p className="text-xs text-gray-500 mb-2">For everyone: women, men, LGBTQ+, children</p>
                            <div className="flex items-center justify-between">
                                <span className="text-lg font-bold text-dana-purple">0800 027 1234</span>
                                <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">Open 24/7</span>
                            </div>
                        </div>
                    </div>

                    {/* My Safe People */}
                    <div className="glass-panel p-6 rounded-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-gray-800 flex items-center gap-2">
                                <Users className="w-5 h-5 text-dana-purple" /> My Safe People
                            </h3>
                            <button
                                onClick={() => setShowForm(!showForm)}
                                className="text-xs bg-dana-purple text-white px-3 py-1.5 rounded-lg font-bold hover:bg-opacity-90 flex items-center gap-1 transition-colors"
                            >
                                <Plus className="w-3 h-3" /> Add Person
                            </button>
                        </div>

                        {showForm && (
                            <div className="bg-gray-50 p-4 rounded-xl mb-4 border border-gray-200 animate-fade-in">
                                <div className="space-y-3 mb-3">
                                    <input placeholder="Name (e.g., Safe Neighbour)" className="w-full text-sm p-2 rounded border border-gray-300"
                                        value={newContact.name} onChange={e => setNewContact({ ...newContact, name: e.target.value })} />
                                    <input placeholder="Phone Number" className="w-full text-sm p-2 rounded border border-gray-300"
                                        value={newContact.phone} onChange={e => setNewContact({ ...newContact, phone: e.target.value })} />
                                    <input placeholder="Email Address" className="w-full text-sm p-2 rounded border border-gray-300"
                                        value={newContact.email} onChange={e => setNewContact({ ...newContact, email: e.target.value })} />
                                    <textarea placeholder="Address / Notes" className="w-full text-sm p-2 rounded border border-gray-300 resize-none h-20"
                                        value={newContact.address} onChange={e => setNewContact({ ...newContact, address: e.target.value })} ></textarea>
                                </div>
                                <div className="flex justify-end gap-2">
                                    <button onClick={() => setShowForm(false)} className="text-xs text-gray-500 font-medium px-3 py-1.5">Cancel</button>
                                    <button onClick={handleAddContact} className="text-xs bg-gray-800 text-white px-4 py-1.5 rounded-lg font-bold shadow hover:bg-black">Save Contact</button>
                                </div>
                            </div>
                        )}

                        <div className="space-y-3">
                            {customContacts.length === 0 && !showForm && (
                                <p className="text-sm text-gray-400 text-center py-4 italic">No personal contacts added yet.</p>
                            )}
                            {customContacts.map((contact, idx) => (
                                <div key={idx} className="bg-white border border-gray-100 p-4 rounded-xl shadow-sm group relative">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                                            <User className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-800 text-sm">{contact.name}</p>
                                            <p className="text-[10px] text-gray-400">Trusted Contact</p>
                                        </div>
                                        <button onClick={() => handleDeleteContact(idx)} className="absolute top-4 right-4 text-gray-300 hover:text-red-500 transition-colors">
                                            <Trash2 className="w-3 h-3" />
                                        </button>
                                    </div>
                                    <div className="space-y-1 pl-11">
                                        {contact.phone && <div className="flex items-center gap-2 text-xs text-gray-600"><Phone className="w-3 h-3 text-gray-400" /> {contact.phone}</div>}
                                        {contact.email && <div className="flex items-center gap-2 text-xs text-gray-600"><Mail className="w-3 h-3 text-gray-400" /> {contact.email}</div>}
                                        {contact.address && <div className="flex items-center gap-2 text-xs text-gray-600"><MapPin className="w-3 h-3 text-gray-400" /> {contact.address}</div>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN: Specialized Support Directory */}
                <div className="glass-panel p-6 rounded-2xl h-fit">
                    <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <HeartHandshake className="w-5 h-5 text-dana-purple" /> Specialized Support
                    </h3>

                    <div className="space-y-6">
                        {/* Women */}
                        <div>
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Support for Women</h4>
                            <div className="grid gap-3">
                                <SupportCard title="Scottish Women's Aid" whoFor="Women, children, and young people" phone="0800 027 1234" website="womensaid.scot" icon={HeartHandshake} colorClass="bg-pink-100 text-pink-600" />
                                <SupportCard title="Rape Crisis Scotland" whoFor="Sexual violence support (5pm - Midnight)" phone="08088 01 03 02" website="rapecrisisscotland.org.uk" icon={Shield} colorClass="bg-pink-100 text-pink-600" />
                                <SupportCard title="Scottish Women's Rights Centre" whoFor="Free legal advice" phone="08088 010 789" website="scottishwomensrightscentre.org.uk" icon={FileText} colorClass="bg-pink-100 text-pink-600" />
                            </div>
                        </div>

                        {/* Men */}
                        <div>
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Support for Men</h4>
                            <div className="grid gap-3">
                                <SupportCard title="AMIS (Abused Men in Scotland)" whoFor="Men experiencing domestic abuse" phone="03300 949 395" website="abusedmeninscotland.org" icon={User} colorClass="bg-blue-100 text-blue-600" />
                                <SupportCard title="Respect Men's Advice Line" whoFor="Male victims across UK" phone="0808 801 0327" website="mensadviceline.org.uk" icon={User} colorClass="bg-blue-100 text-blue-600" />
                            </div>
                        </div>

                        {/* LGBTQ+ */}
                        <div>
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">LGBTQ+ Support</h4>
                            <div className="grid gap-3">
                                <SupportCard title="Galop" whoFor="LGBT+ people experiencing abuse" phone="0800 999 5428" website="galop.org.uk" icon={Users} colorClass="bg-purple-100 text-purple-600" />
                                <SupportCard title="FearFree" whoFor="Men & LGBT+ persons in Scotland" phone="0131 624 7270" website="fearfree.scot" icon={Users} colorClass="bg-purple-100 text-purple-600" />
                            </div>
                        </div>

                        {/* BME */}
                        <div>
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">BME Specialist Support</h4>
                            <div className="grid gap-3">
                                <SupportCard title="Shakti Women's Aid" whoFor="BME women & children" phone="0131 475 2399" website="shaktiedinburgh.co.uk" icon={Globe} colorClass="bg-orange-100 text-orange-600" />
                                <SupportCard title="Hemat Gryffe Women's Aid" whoFor="BME women (Glasgow based / Referrals)" phone="0141 353 0859" website="hematgryffe.org.uk" icon={Globe} colorClass="bg-orange-100 text-orange-600" />
                                <SupportCard title="Amina (MWRC)" whoFor="Muslim and BME women" phone="0808 801 0301" website="mwrc.org.uk" icon={Globe} colorClass="bg-orange-100 text-orange-600" />
                            </div>
                        </div>

                        {/* Other */}
                        <div>
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Other Useful Contacts</h4>
                            <div className="grid gap-3">
                                <SupportCard title="Victim Support Scotland" whoFor="Practical help & emotional support" phone="0800 160 1985" icon={LifeBuoy} colorClass="bg-teal-100 text-teal-600" />
                                <SupportCard title="Childline" whoFor="Children & young people under 19" phone="0800 1111" icon={Baby} colorClass="bg-teal-100 text-teal-600" />
                                <SupportCard title="Breathing Space" whoFor="Low mood, anxiety, depression" phone="0800 83 85 87" icon={Activity} colorClass="bg-teal-100 text-teal-600" />
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </motion.div>
    );
}
