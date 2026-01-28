
import React, { useState } from 'react';

const CropAnalysisPage: React.FC = () => {
  const [ph, setPh] = useState(6.2);
  const [nitrogen, setNitrogen] = useState(120);
  const [moisture, setMoisture] = useState(55);
  
  const calculateSuitability = () => {
    const phScore = 100 - Math.abs(6.5 - ph) * 15;
    const nScore = Math.min(100, (nitrogen / 150) * 100);
    const mScore = Math.min(100, (moisture / 60) * 100);
    return Math.max(0, Math.round((phScore + nScore + mScore) / 3));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 mb-8">AI-Powered Crop Diagnostics</h1>
          <div className="space-y-6">
            {[
              { title: 'Genetic Potential Mapping', text: 'Our system compares soil health markers against known Rice and Jute cultivar requirements.' },
              { title: 'Pathogen Risk Profiles', text: 'Predict fungal outbreaks common in high-humidity delta environments.' },
              { title: 'Harvest Window Prediction', text: 'Mathematical modeling of fruit ripeness through multi-spectral imagery for mangoes and litchis.' }
            ].map((item, i) => (
              <div key={i} className="flex gap-4">
                <div className="shrink-0 w-10 h-10 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center font-bold">{i+1}</div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-1">{item.title}</h4>
                  <p className="text-sm text-slate-500">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-12 rounded-[4rem] shadow-2xl border border-slate-100">
          <h3 className="text-2xl font-bold text-slate-900 mb-8">Crop Suitability Index (S<sub>i</sub>)</h3>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Soil pH Level</label>
              <input type="number" step="0.1" value={ph} onChange={e => setPh(Number(e.target.value))} className="w-full px-4 py-3 border rounded-2xl bg-slate-50" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Nitrogen Levels (ppm)</label>
              <input type="number" value={nitrogen} onChange={e => setNitrogen(Number(e.target.value))} className="w-full px-4 py-3 border rounded-2xl bg-slate-50" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Volumetric Water Content (%)</label>
              <input type="number" value={moisture} onChange={e => setMoisture(Number(e.target.value))} className="w-full px-4 py-3 border rounded-2xl bg-slate-50" />
            </div>
            
            <div className="mt-10 p-10 bg-emerald-600 rounded-[3rem] text-center text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-12 translate-x-12"></div>
              <div className="text-emerald-100 text-xs font-bold uppercase tracking-widest mb-2">Field Suitability Score</div>
              <div className="text-7xl font-black">{calculateSuitability()}%</div>
              <div className="mt-4 text-sm font-medium">Optimal for: Rice / Lentils</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CropAnalysisPage;
