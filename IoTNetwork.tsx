
import React, { useState } from 'react';

const IoTNetwork: React.FC = () => {
  const [area, setArea] = useState(10); // Hectares
  const [radius, setRadius] = useState(100); // Meters
  
  const calculateNodes = () => {
    const areaSqM = area * 10000;
    const nodeCoverage = Math.PI * Math.pow(radius, 2);
    // Mesh network requires ~30% overlap for reliability
    const overlapFactor = 1.4; 
    return Math.ceil((areaSqM / nodeCoverage) * overlapFactor);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 mb-6">IoT Sensor Network Architecture</h1>
          <p className="text-lg text-slate-600 mb-8 leading-relaxed">
            Our sensors utilize a <strong>LoRaWAN mesh topology</strong> designed for maximum coverage with minimal power consumption. By deploying high-density nodes, we create a digital nervous system for your field.
          </p>
          <div className="bg-emerald-50 border-l-4 border-emerald-500 p-6 rounded-r-2xl mb-8">
            <h4 className="font-bold text-emerald-900 mb-2">Sensor Density Formula</h4>
            <div className="text-2xl font-mono text-emerald-700 bg-white p-4 rounded border border-emerald-100 text-center">
              D = (A / (π × r²)) × k
            </div>
            <p className="mt-3 text-sm text-emerald-800 italic">Where D is Density, A is Area, r is Node Radius, and k is the Mesh Overlap Factor (1.4).</p>
          </div>
        </div>
        <div>
          <img src="https://images.unsplash.com/photo-1628157588553-5eeea00af15c?q=80&w=1200&auto=format&fit=crop" className="rounded-3xl shadow-2xl" alt="IoT Nodes" />
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
        <div className="p-8 md:p-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-10 text-center">Node Deployment Calculator</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-center">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Field Area (Hectares)</label>
                <input 
                  type="range" min="1" max="500" value={area} 
                  onChange={(e) => setArea(Number(e.target.value))} 
                  className="w-full accent-emerald-600"
                />
                <div className="text-right font-mono font-bold text-emerald-600 mt-2">{area} ha</div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Node Transmission Radius (m)</label>
                <input 
                  type="range" min="50" max="500" value={radius} 
                  onChange={(e) => setRadius(Number(e.target.value))} 
                  className="w-full accent-emerald-600"
                />
                <div className="text-right font-mono font-bold text-emerald-600 mt-2">{radius} m</div>
              </div>
            </div>
            
            <div className="text-center">
              <div className="w-48 h-48 rounded-full border-8 border-emerald-500 flex flex-col items-center justify-center mx-auto shadow-inner bg-emerald-50">
                <span className="text-5xl font-black text-emerald-900">{calculateNodes()}</span>
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest mt-1">Nodes Required</span>
              </div>
            </div>

            <div className="space-y-4 text-slate-600 text-sm">
              <div className="flex gap-3">
                <i className="fas fa-check-circle text-emerald-500 mt-1"></i>
                <span>Ensures 99.9% uptime for time-critical data packets.</span>
              </div>
              <div className="flex gap-3">
                <i className="fas fa-check-circle text-emerald-500 mt-1"></i>
                <span>Calculated for multi-hop mesh routing efficiency.</span>
              </div>
              <div className="flex gap-3">
                <i className="fas fa-check-circle text-emerald-500 mt-1"></i>
                <span>Optimized for 2.4GHz and 868MHz frequency bands.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IoTNetwork;
