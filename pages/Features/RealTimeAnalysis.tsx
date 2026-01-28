
import React, { useState } from 'react';

const RealTimeAnalysis: React.FC = () => {
  const [sensors, setSensors] = useState(25);
  const [frequency, setFrequency] = useState(1); // Hz (per second)
  const [resolution, setResolution] = useState(16); // bits
  
  const calculateBandwidth = () => {
    // Total bits = sensors * freq * bits
    const totalBitsPerSec = sensors * frequency * resolution;
    return (totalBitsPerSec / 1000).toFixed(2); // kbps
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-20">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Digital Pulse of the Farm</h1>
        <p className="text-xl text-slate-500">Processing millions of data points to deliver sub-second field insights.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="space-y-8">
          <div className="bg-white p-8 rounded-3xl border border-emerald-100 shadow-sm">
            <h4 className="text-xl font-bold text-slate-900 mb-4">Nyquist-Shannon Theorem</h4>
            <p className="text-slate-600 leading-relaxed mb-6">To accurately reconstruct a field condition signal, our sampling frequency must be at least twice the highest frequency component of the environmental change.</p>
            <div className="text-xl font-mono text-emerald-700 bg-emerald-50 p-4 rounded-xl border border-emerald-100 text-center">
              f<sub>s</sub> > 2 × f<sub>max</sub>
            </div>
          </div>
          <img src="https://images.unsplash.com/photo-1551288049-bbbda540d70a?q=80&w=1200&auto=format&fit=crop" className="rounded-3xl shadow-xl border-8 border-white" alt="Data Chart" />
        </div>

        <div className="bg-white p-12 rounded-[3rem] shadow-2xl border border-slate-100">
          <h3 className="text-2xl font-bold text-slate-900 mb-8 text-center">Data Throughput Calculator</h3>
          <div className="space-y-8">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-4">Number of Active Nodes</label>
              <input type="range" min="1" max="1000" value={sensors} onChange={e => setSensors(Number(e.target.value))} className="w-full accent-emerald-500" />
              <div className="text-right font-mono font-bold text-emerald-600 mt-2">{sensors} nodes</div>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-4">Sampling Frequency (Hz)</label>
              <input type="range" min="1" max="60" value={frequency} onChange={e => setFrequency(Number(e.target.value))} className="w-full accent-emerald-500" />
              <div className="text-right font-mono font-bold text-emerald-600 mt-2">{frequency} Hz</div>
            </div>
            
            <div className="mt-12 p-10 bg-slate-900 rounded-3xl text-center">
              <div className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Estimated Data Bandwidth</div>
              <div className="text-6xl font-black text-emerald-500 mb-2">{calculateBandwidth()}</div>
              <div className="text-xl text-white font-bold">kbps (Stream Speed)</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealTimeAnalysis;
