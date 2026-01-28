
import React, { useState, useEffect } from 'react';
import { User, Field, CropRecommendation } from '../../types';
import { 
  getCropAnalysis, 
  getSoilHealthSummary, 
  getDetailedManagementPlan, 
  SoilInsight
} from '../../services/gemini';
import { syncFields, syncSensorsFromDb, addFieldToDb } from '../../services/db';

interface ManagementTask {
  priority: string;
  title: string;
  description: string;
  icon: string;
}

const UserFields: React.FC<{ user: User }> = ({ user }) => {
  const [fields, setFields] = useState<Field[]>([]);
  const [selectedField, setSelectedField] = useState<Field | null>(null);
  const [recommendations, setRecommendations] = useState<CropRecommendation[] | null>(null);
  const [soilInsight, setSoilInsight] = useState<SoilInsight | null>(null);
  const [managementPlan, setManagementPlan] = useState<ManagementTask[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentDataState, setCurrentDataState] = useState<any>(null);
  const [showAddFieldModal, setShowAddFieldModal] = useState(false);
  const [newFieldData, setNewFieldData] = useState({ name: '', location: '', size: '', soilType: 'Loamy' });

  useEffect(() => {
    const init = async () => {
      const userFields = await syncFields(user.id);
      setFields(userFields);
      if (userFields.length > 0) {
        handleFieldSelect(userFields[0]);
      }
    };
    init();
  }, [user.id]);

  const handleFieldSelect = async (field: Field) => {
    setSelectedField(field);
    setLoading(true);
    setRecommendations(null);
    setSoilInsight(null);
    setManagementPlan(null);
    
    try {
      const fieldSensors = await syncSensorsFromDb([field]);
      
      // Strict data state - only values from registered sensors will be present
      const stats: any = {};
      
      fieldSensors.forEach(s => {
        if (!s.last_reading) return;
        const t = s.sensor_type.toLowerCase();
        if (t.includes('moisture')) stats.moisture = s.last_reading.value;
        if (t.includes('temp')) stats.temperature = s.last_reading.value;
        if (t.includes('ph')) stats.ph_level = s.last_reading.value;
        if (t.includes('npk')) { 
          stats.npk_n = s.last_reading.n; 
          stats.npk_p = s.last_reading.p; 
          stats.npk_k = s.last_reading.k; 
        }
      });
      setCurrentDataState(stats);

      const [analysis, insight, plan] = await Promise.all([
        getCropAnalysis(field, stats),
        getSoilHealthSummary(field, stats),
        getDetailedManagementPlan(field, stats)
      ]);
      
      setRecommendations(analysis);
      setSoilInsight(insight);
      setManagementPlan(plan);
    } catch (err) {
      console.error("Critical AI node error", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddField = async (e: React.FormEvent) => {
    e.preventDefault();
    const f: Field = { 
      field_id: Date.now(), 
      user_id: user.id, 
      field_name: newFieldData.name, 
      location: newFieldData.location, 
      size: parseFloat(newFieldData.size) || 0, 
      soil_type: newFieldData.soilType 
    };
    await addFieldToDb(f);
    setFields([...fields, f]);
    setShowAddFieldModal(false);
    setNewFieldData({ name: '', location: '', size: '', soilType: 'Loamy' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 min-h-screen">
      <div className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Agricare Intelligence Hub</h1>
          <p className="text-slate-500 text-sm mt-1">Real-time diagnostics synthesized from registered sensor pillars.</p>
        </div>
        <button 
          onClick={() => setShowAddFieldModal(true)} 
          className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-emerald-700 transition-all shadow-lg active:scale-95"
        >
          <i className="fas fa-plus"></i> Add New Plot
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <div className="flex justify-between items-center px-2">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Your Plots</h3>
            <span className="text-xs font-bold text-emerald-600">{fields.length} Active</span>
          </div>
          <div className="space-y-4 overflow-y-auto max-h-[70vh] pr-2 scrollbar-hide">
            {fields.map(f => (
              <button 
                key={f.field_id} 
                onClick={() => handleFieldSelect(f)} 
                className={`w-full text-left p-6 rounded-2xl border transition-all duration-300 transform ${
                  selectedField?.field_id === f.field_id 
                    ? 'border-emerald-500 bg-emerald-50 shadow-md scale-[1.02]' 
                    : 'bg-white border-slate-100 hover:border-emerald-200'
                }`}
              >
                <div className="font-bold text-slate-800 text-lg mb-1">{f.field_name}</div>
                <div className="text-sm text-slate-400 font-medium">{f.location}</div>
                <div className="mt-4 flex items-center gap-3">
                  <span className="text-[10px] font-black uppercase tracking-tighter bg-white px-2 py-1 rounded shadow-sm text-slate-500">{f.soil_type}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {!selectedField ? (
            <div className="bg-white rounded-[3rem] p-32 text-center border-dashed border-2 border-slate-200 flex flex-col items-center">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                <i className="fas fa-microscope text-4xl text-slate-200"></i>
              </div>
              <h3 className="text-slate-400 font-bold text-xl">Select a plot to activate AI reasoning.</h3>
            </div>
          ) : (
            <div className="space-y-8 animate-in fade-in duration-700">
              {/* Pillar Visualization Header */}
              <div className="bg-slate-900 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 blur-[100px] rounded-full"></div>
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-10">
                    <div>
                      <h2 className="text-5xl font-black tracking-tight mb-2">{selectedField.field_name}</h2>
                      <p className="text-slate-400 text-lg font-medium">{selectedField.location} • {selectedField.size} ha</p>
                    </div>
                    <div className="bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-xl flex items-center gap-2">
                       <i className="fas fa-bolt text-emerald-400"></i>
                       <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Live AI Stream</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { label: 'Moisture', val: currentDataState?.moisture != null ? `${currentDataState.moisture.toFixed(1)}%` : 'Sensor Required', icon: 'fa-droplet', color: 'text-blue-400', active: currentDataState?.moisture != null },
                      { label: 'pH Level', val: currentDataState?.ph_level != null ? currentDataState.ph_level.toFixed(1) : 'Sensor Required', icon: 'fa-scale-balanced', color: 'text-purple-400', active: currentDataState?.ph_level != null },
                      { label: 'Temperature', val: currentDataState?.temperature != null ? `${currentDataState.temperature.toFixed(1)}°C` : 'Sensor Required', icon: 'fa-temperature-half', color: 'text-orange-400', active: currentDataState?.temperature != null },
                      { label: 'NPK Balance', val: currentDataState?.npk_n != null ? 'Synced' : 'Sensor Required', icon: 'fa-vial', color: 'text-emerald-400', active: currentDataState?.npk_n != null }
                    ].map((p, i) => (
                      <div key={i} className={`bg-white/5 border border-white/10 p-4 rounded-2xl flex items-center gap-4 backdrop-blur-sm transition-opacity ${p.active ? 'opacity-100' : 'opacity-40'}`}>
                        <i className={`fas ${p.icon} ${p.color} text-lg`}></i>
                        <div>
                          <div className="text-[8px] font-black uppercase text-slate-400 tracking-widest">{p.label}</div>
                          <div className="text-sm font-bold">{p.val}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {loading ? (
                <div className="bg-white p-32 text-center rounded-[3rem] border border-slate-100 shadow-sm flex flex-col items-center">
                  <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-8"></div>
                  <h3 className="text-2xl font-black text-slate-800">Processing Registered Telemetry...</h3>
                  <p className="text-slate-400 mt-2">Gemini 2.5 Flash is analyzing your specific field pillars.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Strategy Column */}
                  <div className="lg:col-span-2 space-y-8">
                    {/* Restoration Card */}
                    <div className="bg-white p-10 rounded-[3rem] border border-emerald-50 shadow-sm hover:shadow-xl transition-shadow relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-8 text-emerald-500/5 text-8xl transition-transform group-hover:scale-110">
                        <i className="fas fa-dna"></i>
                      </div>
                      <h3 className="font-black text-2xl text-slate-900 mb-6 flex items-center gap-3">
                        <i className="fas fa-seedling text-emerald-600"></i> Soil Restoration Strategy
                      </h3>
                      
                      <div className="space-y-6">
                        <div className="p-8 rounded-[2rem] bg-emerald-50/50 text-slate-700 border border-emerald-50">
                          <p className="text-lg leading-relaxed font-bold italic text-slate-800">
                            "{soilInsight?.summary || "Analyzing sensor intersections..."}"
                          </p>
                        </div>
                        
                        <div className="bg-slate-900 text-white p-6 rounded-[2.5rem] flex items-center justify-between shadow-2xl group-hover:bg-slate-800 transition-colors">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center">
                              <i className="fas fa-hand-holding-droplet text-white"></i>
                            </div>
                            <div>
                              <div className="text-[10px] font-black uppercase text-emerald-400 tracking-widest">Recommended Treatment</div>
                              <div className="font-bold text-lg">{soilInsight?.soil_fertilizer || "Calculating..."}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Crop Index */}
                    <div>
                      <h3 className="font-black text-2xl text-slate-900 mb-8 flex items-center gap-3 px-4">
                        <i className="fas fa-microscope text-emerald-600"></i> Harvest Compatibility Index
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {recommendations && recommendations.length > 0 ? recommendations.map((r, i) => (
                          <div key={i} className="bg-white p-8 rounded-[3rem] border border-slate-100 hover:shadow-2xl transition-all hover:-translate-y-1">
                            <div className="flex justify-between items-start mb-8">
                              <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center shadow-inner">
                                <i className={`fas ${r.icon || 'fa-seedling'} text-2xl`}></i>
                              </div>
                              <div className="text-right">
                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Match</div>
                                <div className="text-2xl font-black text-slate-900">{r.suitability}%</div>
                              </div>
                            </div>
                            <h4 className="font-black text-slate-900 text-xl mb-4">{r.name}</h4>
                            <div className="space-y-4">
                              <div className="bg-emerald-600 p-5 rounded-[1.5rem] shadow-lg shadow-emerald-100">
                                <div className="text-[10px] font-black text-emerald-200 uppercase mb-2 flex items-center gap-2">
                                  <i className="fas fa-flask-vial"></i> Optimal Supplement
                                </div>
                                <p className="text-xs font-bold text-white leading-relaxed">{r.fertilizer}</p>
                              </div>
                              <p className="text-[11px] text-slate-500 leading-tight italic pt-2">"{r.requirements}"</p>
                            </div>
                          </div>
                        )) : (
                          <div className="col-span-full py-20 bg-slate-50 rounded-[3rem] border border-dashed text-center text-slate-300">
                             <p>Awaiting harvest correlation data...</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Roadmap Column */}
                  <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm h-fit sticky top-24">
                    <h3 className="font-black text-2xl text-slate-900 mb-10 flex items-center gap-3">
                      <i className="fas fa-route text-emerald-600"></i> Operational Roadmap
                    </h3>
                    <div className="space-y-10">
                      {managementPlan && managementPlan.length > 0 ? (
                        managementPlan.map((p, i) => (
                          <div key={i} className="relative pl-8">
                            <div className={`absolute left-0 top-0 bottom-0 w-1.5 rounded-full ${
                              p.priority.toLowerCase().includes('crit') || p.priority.toLowerCase().includes('high') ? 'bg-red-500' : 'bg-emerald-500'
                            }`}></div>
                            <div className={`text-[10px] font-black uppercase tracking-widest mb-2 ${
                              p.priority.toLowerCase().includes('crit') || p.priority.toLowerCase().includes('high') ? 'text-red-500' : 'text-emerald-500'
                            }`}>
                              {p.priority} Priority
                            </div>
                            <h4 className="font-black text-slate-900 mb-2 leading-tight">{p.title}</h4>
                            <p className="text-xs text-slate-500 leading-relaxed font-medium">{p.description}</p>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-20 opacity-30">
                           <i className="fas fa-list-check text-4xl mb-4"></i>
                           <p className="font-bold text-sm">Building roadmap...</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {showAddFieldModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-[3rem] w-full max-w-md p-10 shadow-2xl animate-in zoom-in duration-300">
            <h2 className="text-3xl font-black mb-8 text-slate-900">New Plot Deployment</h2>
            <form onSubmit={handleAddField} className="space-y-6">
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase mb-2 ml-1">Plot Name</label>
                <input required type="text" value={newFieldData.name} onChange={e => setNewFieldData({...newFieldData, name: e.target.value})} className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none outline-none focus:ring-2 focus:ring-emerald-500 font-medium" placeholder="Rice Paddy A" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase mb-2 ml-1">Size (ha)</label>
                  <input required type="number" step="0.1" value={newFieldData.size} onChange={e => setNewFieldData({...newFieldData, size: e.target.value})} className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none outline-none focus:ring-2 focus:ring-emerald-500 font-medium" placeholder="1.2" />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase mb-2 ml-1">Soil Type</label>
                  <select value={newFieldData.soilType} onChange={e => setNewFieldData({...newFieldData, soilType: e.target.value})} className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none outline-none focus:ring-2 focus:ring-emerald-500 font-black">
                    <option value="Loamy">Loamy</option>
                    <option value="Clay">Clay</option>
                    <option value="Sandy">Sandy</option>
                  </select>
                </div>
              </div>
              <button type="submit" className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-emerald-200 hover:bg-emerald-700 transition-all">Register Plot</button>
              <button type="button" onClick={() => setShowAddFieldModal(false)} className="w-full py-2 text-slate-400 font-bold text-xs uppercase hover:text-slate-600">Cancel</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserFields;
