'use client';

import React from 'react';
import { useView } from '@/context/ViewContext';
import { X, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

export default function DuressView() {
    const { setView } = useView();
    const [showForm, setShowForm] = React.useState(false);
    const [newEntry, setNewEntry] = React.useState({ text: '', date: '', time: '' });
    const [entries, setEntries] = React.useState([
        { id: 1, title: 'Date Night', date: 'Yesterday', text: "He surprised me with flowers and we went to that Italian place. He was so sweet all night." },
        { id: 2, title: 'Apology', date: '3 days ago', text: "He said sorry about the argument. He promised it wouldn't happen again and bought me chocolate." }
    ]);

    const handleSave = () => {
        if (!newEntry.text) return;
        setEntries([{
            id: Date.now(),
            title: 'New Memory',
            date: `${newEntry.date} ${newEntry.time}`,
            text: newEntry.text
        }, ...entries]);
        setNewEntry({ text: '', date: '', time: '' });
        setShowForm(false);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full h-full duress-bg flex flex-col overflow-y-auto"
        >
            <nav className="p-6 flex justify-between items-center">
                <h1 className="font-serif text-2xl text-rose-800">My Journal</h1>
                <button onClick={() => setView('decoy')} className="text-rose-400 hover:text-rose-600">
                    <X className="w-6 h-6" />
                </button>
            </nav>
            <main className="flex-1 max-w-2xl mx-auto w-full p-6">
                <div className="bg-white/80 p-8 rounded-3xl shadow-sm border border-rose-100 mb-8 text-center relative">
                    <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4 text-rose-500">
                        <Heart className="w-8 h-8 fill-rose-200" />
                    </div>
                    <h2 className="text-2xl font-serif text-gray-800 mb-2">Gratitude Log</h2>
                    <p className="text-gray-500 mb-6">Focusing on the good moments.</p>

                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="bg-rose-500 text-white px-6 py-2 rounded-full font-bold shadow-lg shadow-rose-500/20 hover:bg-rose-600 transition-colors text-sm"
                    >
                        {showForm ? 'Cancel' : '+ Add Memory'}
                    </button>
                </div>

                {showForm && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white p-6 rounded-2xl shadow-lg border border-rose-100 mb-6"
                    >
                        <textarea
                            placeholder="What happened today?"
                            className="w-full p-4 bg-rose-50 border border-rose-100 rounded-xl mb-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-rose-200 resize-none h-32 placeholder:text-rose-300"
                            value={newEntry.text}
                            onChange={e => setNewEntry({ ...newEntry, text: e.target.value })}
                        ></textarea>
                        <div className="flex gap-4 mb-4">
                            <input
                                type="date"
                                className="flex-1 p-2 bg-rose-50 border border-rose-100 rounded-lg text-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-rose-200"
                                value={newEntry.date}
                                onChange={e => setNewEntry({ ...newEntry, date: e.target.value })}
                            />
                            <input
                                type="time"
                                className="flex-1 p-2 bg-rose-50 border border-rose-100 rounded-lg text-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-rose-200"
                                value={newEntry.time}
                                onChange={e => setNewEntry({ ...newEntry, time: e.target.value })}
                            />
                        </div>
                        <button
                            onClick={handleSave}
                            className="w-full bg-rose-500 text-white py-3 rounded-xl font-bold shadow-md hover:bg-rose-600 transition-colors"
                        >
                            Save Memory
                        </button>
                    </motion.div>
                )}

                <div className="space-y-4">
                    {entries.map(entry => (
                        <div key={entry.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <div className="flex justify-between text-xs text-gray-400 mb-2 font-bold uppercase tracking-wider">
                                <span>{entry.title}</span>
                                <span>{entry.date}</span>
                            </div>
                            <p className="text-gray-600 italic">"{entry.text}"</p>
                        </div>
                    ))}
                </div>
            </main>
        </motion.div>
    );
}
