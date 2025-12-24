import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [text, setText] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!text) return alert("Hiba: Üres adatfolyam! Írj be szöveget.");
    setLoading(true);
    try {
      // Figyelj a portra! Ha uvicorn-nál 8001-et írtál, itt is írd át!
      const res = await axios.post('http://127.0.0.1:8001/analyze', { text });
      setResult(res.data.analysis);
    } catch (err) {
      setResult("KRITIKUS HIBA: A kapcsolat a neurális hálózattal megszakadt. (Indítsd el a Pythont!)");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-cyan-400 p-6 font-mono selection:bg-pink-500 selection:text-white">
      {/* KERET ÉS CÍM */}
      <div className="max-w-6xl mx-auto border border-cyan-500/30 p-8 shadow-[0_0_30px_rgba(0,255,255,0.05)] relative overflow-hidden">
        
        {/* Dekorációs elem a sarokban */}
        <div className="absolute top-0 right-0 p-2 text-[10px] text-cyan-900 select-none">
          SYSTEM_STATUS: ONLINE // ENCRYPTED_LINK
        </div>

        <h1 className="text-4xl font-black text-center mb-12 uppercase tracking-[0.4em] text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-500 drop-shadow-[0_0_15px_rgba(6,182,212,0.5)]">
          Jegyzet // Analizátor
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* BAL OLDAL: BEVITEL */}
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center text-[10px] uppercase tracking-tighter text-cyan-600">
              <span>&gt; Bemeneti_adatok</span>
              <span className="animate-pulse">Szkennelésre vár...</span>
            </div>
            <textarea 
              className="w-full h-96 bg-black border border-cyan-500/40 p-5 focus:outline-none focus:border-pink-500 text-cyan-100 shadow-[inset_0_0_20px_rgba(0,0,0,1)] transition-all resize-none"
              placeholder="Ide másold a leckét..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <button 
              onClick={handleAnalyze}
              className="group relative w-full py-4 bg-transparent border border-cyan-500 overflow-hidden transition-all hover:shadow-[0_0_30px_rgba(6,182,212,0.4)]"
              disabled={loading}
            >
              <div className="absolute inset-0 w-0 bg-cyan-500 transition-all duration-300 group-hover:w-full"></div>
              <span className="relative z-10 font-bold uppercase tracking-[0.2em] group-hover:text-black">
                {loading ? "Művelet folyamatban..." : "[ Elemzés indítása ]"}
              </span>
            </button>
          </div>

          {/* JOBB OLDAL: EREDMÉNY */}
          <div className="flex flex-col gap-4">
             <div className="flex justify-between items-center text-[10px] uppercase tracking-tighter text-pink-600">
              <span>&gt; AI_Kimeneti_vázlat</span>
              <span>v1.5_Flash</span>
            </div>
            <div className="w-full h-[452px] bg-black border border-pink-500/40 p-6 overflow-y-auto shadow-[0_0_20px_rgba(236,72,153,0.05)] custom-scrollbar">
              {result ? (
                <div className="text-sm text-cyan-50 whitespace-pre-wrap leading-relaxed prose prose-invert">
                  {result}
                </div>
              ) : (
                <div className="h-full flex items-center justify-center opacity-20">
                   <p className="text-xs uppercase tracking-[0.5em] animate-pulse italic">Rendszer készenlétben...</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default App;