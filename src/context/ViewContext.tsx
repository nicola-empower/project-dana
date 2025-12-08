'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

export type ViewType = 'decoy' | 'secure' | 'duress';

interface ViewContextType {
    currentView: ViewType;
    setView: (view: ViewType) => void;
    isMagicSearch: (query: string) => boolean;
}

const ViewContext = createContext<ViewContextType | undefined>(undefined);

export function ViewProvider({ children }: { children: ReactNode }) {
    const [currentView, setCurrentView] = useState<ViewType>('decoy');

    const isMagicSearch = (query: string): boolean => {
        const q = query.toLowerCase().trim();
        if (q.includes('blueberry')) {
            setCurrentView('secure');
            return true;
        } else if (q.includes('burnt toast')) {
            setCurrentView('duress');
            return true;
        } else if (q.includes('decoy') || q.includes('chef')) {
            // Optional: Manual trigger back to decoy for debugging
            setCurrentView('decoy');
            return true;
        }
        return false;
    };

    const setView = (view: ViewType) => {
        setCurrentView(view);
    };

    return (
        <ViewContext.Provider value={{ currentView, setView, isMagicSearch }}>
            {children}
        </ViewContext.Provider>
    );
}

export function useView() {
    const context = useContext(ViewContext);
    if (context === undefined) {
        throw new Error('useView must be used within a ViewProvider');
    }
    return context;
}
