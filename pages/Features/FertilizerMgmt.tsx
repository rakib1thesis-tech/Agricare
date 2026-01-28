
import React, { useState } from 'react';

const FertilizerMgmt: React.FC = () => {
  const [targetN, setTargetN] = useState(150); // kg/ha
  const [soilN, setSoilN] = useState(40); // kg/ha
  const [bagSize, setBagSize] = useState(50); // kg
  const [nPercent, setNPercent] = useState(46); // Urea = 46%
  
  const calculateBags = () => {
    const deficit = Math.max(0, targetN - soilN);
    const amountInBag = bagSize * (nPercent / 100);
    return Math.ceil(deficit / amountInBag);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 mb-6 underline decoration-emerald-500/30">Scientific Nutrient Management</h1>
          <p className="text-lg text-slate-600 mb-10">Stop guessing and start measuring. Our NPK sensor arrays provide real-time nitrogen, phosphorus, and potassium levels in your root zones.</p>
          
          <div className="space-y-6">
            <div className="flex gap-6 items-start">
              <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center text-white shrink-0 font-bold">N</div>
              <div>
                <h4 className="font-bold text-slate-900 mb-1">Nitrogen Balance</h4>
                <p className="text-sm text-slate-500">Crucial for vegetative growth and chlorophyll production.</p>
              </div>
            </div>
            <div className="flex gap-6 items-start">
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center text-white shrink-0 font-bold">P</div>
              <div>
                <h4 className="font-bold text-slate-900 mb-1">Phosphorus Density</h4>
                <p className="text-sm text-slate-500">Essential for root development and seed formation.</p>
              </div>
            </div>
            <div className="flex gap-6 items-start">
              <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center text-white shrink-0 font-bold">K</div>
              <div>
                <h4 className="font-bold text-slate-900 mb-1">Potassium Quality</h4>
                <p className="text-sm text-slate-500">Improves disease resistance and overall plant vigor.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 rounded-[3rem] p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500 opacity-10 rounded-full translate-x-32 -translate-y-32"></div>
          <h2 className="text-2xl font-bold text-white mb-8">NPK Dosage Calculator</h2>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Target N (kg/ha)</label>
                <input type="number" value={targetN} onChange={e => setTargetN(Number(e.target.value))} className="w-full bg-slate-800 border-none text-white rounded-xl py-3 px-4 focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Soil N (kg/ha)</label>
                <input type="number" value={soilN} onChange={e => setSoilN(Number(e.target.value))} className="w-full bg-slate-800 border-none text-white rounded-xl py-3 px-4 focus:ring-2 focus:ring-emerald-500" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">N % in Fertilizer</label>
                <input type="number" value={nPercent} onChange={e => setNPercent(Number(e.target.value))} className="w-full bg-slate-800 border-none text-white rounded-xl py-3 px-4 focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Bag Size (kg)</label>
                <input type="number" value={bagSize} onChange={e => setBagSize(Number(e.target.value))} className="w-full bg-slate-800 border-none text-white rounded-xl py-3 px-4 focus:ring-2 focus:ring-emerald-500" />
              </div>
            </div>
            
            <div className="mt-10 p-8 bg-emerald-500 rounded-3xl text-center">
              <div className="text-emerald-100 text-xs font-bold uppercase mb-2">Recommended Application</div>
              <div className="text-6xl font-black text-white">{calculateBags()}</div>
              <div className="text-lg font-bold text-white mt-1">Bags per Hectare</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FertilizerMgmt;
