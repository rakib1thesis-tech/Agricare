
import React, { useState } from 'react';

const WeatherIntegration: React.FC = () => {
  const [tMax, setTMax] = useState(32);
  const [tMin, setTMin] = useState(24);
  const [tBase, setTBase] = useState(10);
  
  const calculateGDD = () => {
    const avg = (Math.max(tMax, tBase) + Math.max(tMin, tBase)) / 2;
    return Math.max(0, avg - tBase);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-20">
      <div className="relative rounded-[3rem] overflow-hidden bg-slate-900 h-[400px] mb-20 flex items-center p-12 lg:p-24 shadow-2xl">
        <img src="https://images.unsplash.com/photo-1594398901394-4e34939a4fe0?q=80&w=1600&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover opacity-40" alt="Stormy Sky" />
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-5xl font-black text-white mb-6">Meteorological Precision</h1>
          <p className="text-xl text-slate-300">We don't just predict rain; we calculate the thermal time accumulation for crops like Rice and Jute varieties.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        <div className="bg-white p-12 rounded-[3rem] border border-slate-100 shadow-sm">
          <h2 className="text-3xl font-bold text-slate-900 mb-8">Growing Degree Days (GDD) Calculator</h2>
          <p className="text-slate-500 mb-10 leading-relaxed">
            GDD is used to predict Rice development stages and harvest timing based on heat accumulation in Bangladesh's climate.
          </p>
          
          <div className="space-y-8">
            <div className="bg-slate-50 p-6 rounded-2xl">
              <label className="block text-sm font-bold text-slate-700 mb-4">Daily Max Temperature (°C)</label>
              <input type="range" min="0" max="50" value={tMax} onChange={e => setTMax(Number(e.target.value))} className="w-full accent-emerald-500" />
              <div className="text-right font-mono font-bold text-emerald-600 mt-2">{tMax}°C</div>
            </div>
            <div className="bg-slate-50 p-6 rounded-2xl">
              <label className="block text-sm font-bold text-slate-700 mb-4">Daily Min Temperature (°C)</label>
              <input type="range" min="0" max="50" value={tMin} onChange={e => setTMin(Number(e.target.value))} className="w-full accent-emerald-500" />
              <div className="text-right font-mono font-bold text-emerald-600 mt-2">{tMin}°C</div>
            </div>
            <div className="bg-slate-50 p-6 rounded-2xl">
              <label className="block text-sm font-bold text-slate-700 mb-4">Base Temperature for Crop (°C)</label>
              <input type="number" value={tBase} onChange={e => setTBase(Number(e.target.value))} className="w-full px-4 py-3 border rounded-xl" />
              <p className="text-[10px] text-slate-400 mt-2 italic">Common base temps: Rice (10°C), Wheat (4°C), Jute (15°C)</p>
            </div>
          </div>
        </div>

        <div className="lg:sticky lg:top-24">
          <div className="bg-emerald-500 rounded-[3rem] p-12 text-white shadow-2xl text-center">
            <h3 className="text-2xl font-bold mb-4 uppercase tracking-widest">Calculated Heat Units</h3>
            <div className="text-8xl font-black mb-4">{calculateGDD().toFixed(1)}</div>
            <div className="text-xl font-bold text-emerald-100">Daily Heat Accumulation (GDD)</div>
            
            <div className="mt-12 bg-white/10 rounded-3xl p-6 text-left border border-white/20">
              <div className="font-mono text-sm leading-relaxed">
                Formula used:<br/>
                GDD = [(T<sub>max</sub> + T<sub>min</sub>) / 2] - T<sub>base</sub>
              </div>
            </div>
          </div>
          
          <div className="mt-8 bg-slate-100 rounded-3xl p-8 flex gap-6 items-center">
            <i className="fas fa-info-circle text-emerald-600 text-3xl"></i>
            <p className="text-sm text-slate-600 font-medium">Accumulate daily GDD values to estimate the date of maturity for your crops with 95% accuracy in the delta region.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherIntegration;
