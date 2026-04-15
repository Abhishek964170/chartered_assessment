'use client';
import { MainLayout } from '@/components/MainLayout';
import { useStore } from '@/store/useStore';
import { AnimatePresence, motion } from 'framer-motion';

import Stage1 from '@/components/stages/Stage1';
import Stage2 from '@/components/stages/Stage2';
import Stage3 from '@/components/stages/Stage3';
import Stage4 from '@/components/stages/Stage4';
import Stage5 from '@/components/stages/Stage5';
import { useState, useEffect } from 'react';

export default function Home() {
  const currentStage = useStore((state) => state.currentStage);
  const [mounted, setMounted] = useState(false);

  // Wait until client hydration is complete before rendering persisted UI
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <MainLayout>
      <div className="w-full h-full min-h-[60vh] relative">
        {!mounted ? (
           <div className="w-full h-64 flex items-center justify-center">
             <div className="w-8 h-8 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin"></div>
           </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStage}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="w-full"
            >
              {currentStage === 1 && <Stage1 />}
              {currentStage === 2 && <Stage2 />}
              {currentStage === 3 && <Stage3 />}
              {currentStage === 4 && <Stage4 />}
              {currentStage === 5 && <Stage5 />}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </MainLayout>
  );
}
