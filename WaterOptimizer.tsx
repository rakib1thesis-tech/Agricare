
import React, { useState } from 'react';

const WaterOptimizer: React.FC = () => {
  const [area, setArea] = useState(1); // ha
  const [et, setEt] = useState(5); // mm/day
  const [efficiency, setEfficiency] = useState(0.8); // 80%
  
  const calculateWater = () => {
    // IWR = (ETc - Pe) / Eie
    // Liters = ha * 10000 * mm / Efficiency
    return Math.round((area * 10000 * et) / efficiency);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-20">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Precision Water Optimization</h1>
        <p className="text-xl text-slate-500">Maximize every drop with scientific irrigation modeling.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
        <div className="lg:col-span-2 bg-white p-10 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="text-2xl font-bold text-slate-900 mb-8">Irrigation Water Requirement (IWR) Calculator</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Field Area (Hectares)</label>
                <input type="number" value={area} onChange={e => setArea(Number(e.target.value))} className="w-full px-4 py-3 border rounded-xl" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Daily Evapotranspiration (ETc in mm)</label>
                <input type="number" value={et} onChange={e => setEt(Number(e.target.value))} className="w-full px-4 py-3 border rounded-xl" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">System Efficiency (0.1 - 1.0)</label>
                <input type="number" step="0.1" value={efficiency} onChange={e => setEfficiency(Number(e.target.value))} className="w-full px-4 py-3 border rounded-xl" />
              </div>
            </div>
            <div className="bg-slate-900 rounded-2xl p-8 text-white flex flex-col justify-center items-center">
              <div className="text-emerald-400 text-sm font-bold uppercase tracking-widest mb-2">Total Daily Need</div>
              <div className="text-5xl font-black mb-2">{calculateWater().toLocaleString()}</div>
              <div className="text-xl text-slate-400">Liters per Day</div>
              <div className="mt-8 pt-8 border-t border-slate-800 w-full text-center text-xs text-slate-500">
                Formula: (Area × ETc × 10,000) / η
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-emerald-600 rounded-3xl p-8 text-white shadow-lg">
            <i className="fas fa-droplet text-3xl mb-4"></i>
            <h4 className="text-xl font-bold mb-4">Smart Scheduling</h4>
            <p className="text-emerald-50 text-sm leading-relaxed">Our AI analyzes soil moisture tensors across three depths to determine if irrigation is required, saving up to 40% more water than fixed timers.</p>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8">
            <h4 className="text-lg font-bold text-slate-900 mb-4 italic">Theory: Penman-Monteith</h4>
            <p className="text-slate-600 text-sm leading-relaxed">We utilize the standardized Penman-Monteith equation to estimate reference evapotranspiration ($ET_o$) based on solar radiation, temperature, and wind speed.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaterOptimizer;
