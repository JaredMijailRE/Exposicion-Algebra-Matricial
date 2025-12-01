'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Check, Loader2 } from 'lucide-react';
import clsx from 'clsx';

type FormData = {
    papa: string;
    ingreso: string;
    dependientes: string;
    traslado: string;
};

const questions = [
    {
        id: 'papa',
        label: '¿Cuál es tu PAPA (Promedio Académico)?',
        type: 'number',
        placeholder: 'Ej. 4.5',
        step: '0.1',
        min: '0',
        max: '5',
    },
    {
        id: 'ingreso',
        label: '¿Cuál es el ingreso familiar mensual aproximado?',
        type: 'number',
        placeholder: 'Ej. 2000000',
        min: '0',
    },
    {
        id: 'dependientes',
        label: '¿Cuántas personas dependen económicamente de este ingreso (incluyéndote)?',
        type: 'number',
        placeholder: 'Ej. 3',
        min: '1',
    },
    {
        id: 'traslado',
        label: '¿Tiempo de traslado a la universidad (en minutos)?',
        type: 'number',
        placeholder: 'Ej. 45',
        min: '0',
    },
];

export default function FormWizard({ onComplete }: { onComplete: () => void }) {
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState<FormData>({
        papa: '',
        ingreso: '',
        dependientes: '',
        traslado: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleNext = async () => {
        if (currentStep < questions.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            setIsSubmitting(true);
            try {
                const response = await fetch('/api/submit', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData),
                });

                if (response.ok) {
                    onComplete();
                } else {
                    console.error('Failed to submit');
                    alert('Error al enviar. Por favor intenta de nuevo.');
                }
            } catch (error) {
                console.error('Error submitting form:', error);
                alert('Error de conexión.');
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [questions[currentStep].id]: e.target.value });
    };

    const currentQuestion = questions[currentStep];
    const isLastStep = currentStep === questions.length - 1;
    const canProceed = formData[currentQuestion.id as keyof FormData] !== '';

    return (
        <div className="w-full max-w-md p-8 bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl text-white">
            <div className="mb-8 flex justify-between items-center">
                <span className="text-sm text-white/50">
                    Pregunta {currentStep + 1} de {questions.length}
                </span>
                <div className="h-1 w-24 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-green-400"
                        initial={{ width: 0 }}
                        animate={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
                    />
                </div>
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={currentStep}
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -20, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <h2 className="text-2xl font-bold mb-6 leading-tight">
                        {currentQuestion.label}
                    </h2>

                    <input
                        type={currentQuestion.type}
                        value={formData[currentQuestion.id as keyof FormData]}
                        onChange={handleChange}
                        placeholder={currentQuestion.placeholder}
                        step={currentQuestion.step}
                        min={currentQuestion.min}
                        max={currentQuestion.max}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-green-400/50 transition-all placeholder:text-white/20"
                        autoFocus
                    />
                </motion.div>
            </AnimatePresence>

            <button
                onClick={handleNext}
                disabled={!canProceed || isSubmitting}
                className={clsx(
                    "mt-8 w-full py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all",
                    canProceed
                        ? "bg-green-500 hover:bg-green-400 text-black shadow-[0_0_20px_rgba(74,222,128,0.3)]"
                        : "bg-white/10 text-white/30 cursor-not-allowed"
                )}
            >
                {isSubmitting ? (
                    <Loader2 className="animate-spin" />
                ) : isLastStep ? (
                    <>Finalizar <Check size={20} /></>
                ) : (
                    <>Siguiente <ChevronRight size={20} /></>
                )}
            </button>
        </div>
    );
}
