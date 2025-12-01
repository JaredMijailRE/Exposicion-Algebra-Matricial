'use client';

import { Download } from 'lucide-react';

export default function AdminPage() {
    const handleDownload = () => {
        window.location.href = '/api/download';
    };

    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
            <h1 className="text-3xl font-bold mb-8">Panel de Administración</h1>

            <div className="bg-white/10 p-8 rounded-2xl border border-white/20 text-center max-w-md w-full">
                <p className="text-white/70 mb-8">
                    Descarga los datos recolectados en formato CSV para su análisis.
                </p>

                <button
                    onClick={handleDownload}
                    className="w-full py-4 bg-green-500 hover:bg-green-400 text-black font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(74,222,128,0.3)]"
                >
                    <Download size={20} />
                    Descargar CSV
                </button>
            </div>
        </div>
    );
}
