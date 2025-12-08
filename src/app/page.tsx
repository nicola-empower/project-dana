'use client';

import React from 'react';
import { useView } from '@/context/ViewContext';
import DecoyView from '@/components/views/DecoyView';
import SecureView from '@/components/views/SecureView';
import DuressView from '@/components/views/DuressView';
import { AnimatePresence } from 'framer-motion';

export default function Home() {
  const { currentView } = useView();

  return (
    <main className="w-full h-full bg-white relative">
      <AnimatePresence mode="wait">
        {currentView === 'decoy' && <DecoyView key="decoy" />}
        {currentView === 'secure' && <SecureView key="secure" />}
        {currentView === 'duress' && <DuressView key="duress" />}
      </AnimatePresence>
    </main>
  );
}
