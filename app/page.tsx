'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Background from '@/components/Background';
import FormWizard from '@/components/FormWizard';
import { ArrowRight, CheckCircle } from 'lucide-react';

export default function Home() {
  const [view, setView] = useState<'landing' | 'wizard' | 'completed'>('landing');

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden font-sans text-white selection:bg-green-500/30">
      <Background />

      <AnimatePresence mode="wait">
        {view === 'landing' && (
          <motion.div
            key="landing"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center z-10 px-4"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-green-300 to-emerald-500 tracking-tight">
              Regresión Lineal
            </h1>
            <p className="text-xl md:text-2xl text-white/70 mb-12 max-w-2xl mx-auto">
              Ayúdanos a recolectar datos para nuestra exposición de Álgebra Matricial.
            </p>
            <button
              onClick={() => setView('wizard')}
              className="group relative px-8 py-4 bg-white text-black rounded-full font-bold text-lg hover:bg-green-400 transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-[0_0_50px_rgba(74,222,128,0.5)] flex items-center gap-2 mx-auto"
            >
              Comenzar Encuesta
              <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        )}

        {view === 'wizard' && (
          <motion.div
            key="wizard"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="z-10 w-full flex justify-center px-4"
          >
            <FormWizard onComplete={() => setView('completed')} />
          </motion.div>
        )}

        {view === 'completed' && (
          <motion.div
            key="completed"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center z-10 px-4"
          >
            <div className="mb-6 flex justify-center">
              <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(74,222,128,0.5)]">
                <CheckCircle size={48} className="text-black" />
              </div>
            </div>
            <h2 className="text-4xl font-bold mb-4">¡Gracias!</h2>
            <p className="text-xl text-white/60">
              Tus respuestas han sido registradas correctamente.
            </p>
            <button
              onClick={() => setView('landing')}
              className="mt-8 text-white/40 hover:text-white transition-colors text-sm"
            >
              Volver al inicio
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
