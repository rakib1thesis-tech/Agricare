
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
  const [hasActiveSensors, setHasActiveSensors] = useState(false);
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
      const activeSensors = fieldSensors.filter(s => s.last_reading !== undefined);
      const isPrecision = activeSensors.length > 0;
      setHasActiveSensors(isPrecision);
      
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

      // AI now receives context about whether this is precision or baseline
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
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-3">
          {!selectedField ? (
            <div className="bg-white rounded-[3rem] p-32 text-center border-dashed border-2 border-slate-200 flex flex-col items-center">
              <i className="fas fa-microscope text-4xl text-slate-200 mb-6"></i>
              <h3 className="text-slate-400 font-bold text-xl">Select a plot to activate AI reasoning.</h3>
            </div>
          ) : (
            <div className="space-y-8 animate-in fade-in duration-700">
              <div className="bg-slate-900 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-10">
                    <div>
                      <h2 className="text-5xl font-black tracking-tight mb-2">{selectedField.field_name}</h2>
                      <div className="flex items-center gap-3">
                        <p className="text-slate-400 text-lg font-medium">{selectedField.location} • {selectedField.size} ha</p>
                        {hasActiveSensors ? (
                          <span className="bg-emerald-500 text-white text-[10px] font-black uppercase px-2 py-1 rounded-md tracking-widest shadow-lg shadow-emerald-500/20">Precision Analysis</span>
                        ) : (
                          <span className="bg-amber-500 text-white text-[10px] font-black uppercase px-2 py-1 rounded-md tracking-widest shadow-lg shadow-amber-500/30">Regional Baseline</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {!hasActiveSensors && (
                    <div className="bg-amber-500/10 border border-amber-500/30 p-5 rounded-2xl mb-8 flex items-center gap-4">
                      <div className="w-10 h-10 bg-amber-500/20 rounded-xl flex items-center justify-center shrink-0">
                        <i className="fas fa-info-circle text-amber-400 text-xl"></i>
                      </div>
                      <p className="text-sm text-amber-100 font-medium leading-relaxed">
                        <strong>Note:</strong> No sensors are registered to this plot. The analysis below is generated using <strong>regional agricultural defaults</strong> for <strong>{selectedField.soil_type}</strong> soil in <strong>{selectedField.location}</strong>.
                      </p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { label: 'Moisture', val: currentDataState?.moisture != null ? `${currentDataState.moisture.toFixed(1)}%` : 'Offline', icon: 'fa-droplet', color: 'text-blue-400', active: currentDataState?.moisture != null },
                      { label: 'pH Level', val: currentDataState?.ph_level != null ? currentDataState.ph_level.toFixed(1) : 'Offline', icon: 'fa-scale-balanced', color: 'text-purple-400', active: currentDataState?.ph_level != null },
                      { label: 'Temperature', val: currentDataState?.temperature != null ? `${currentDataState.temperature.toFixed(1)}°C` : 'Offline', icon: 'fa-temperature-half', color: 'text-orange-400', active: currentDataState?.temperature != null },
                      { label: 'NPK Balance', val: currentDataState?.npk_n != null ? 'Synced' : 'Offline', icon: 'fa-vial', color: 'text-emerald-400', active: currentDataState?.npk_n != null }
                    ].map((p, i) => (
                      <div key={i} className={`bg-white/5 border border-white/10 p-4 rounded-2xl flex items-center gap-4 backdrop-blur-sm transition-all duration-500 ${p.active ? 'opacity-100 border-white/20' : 'opacity-30'}`}>
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
                <div className="bg-white p-32 text-center rounded-[3rem] flex flex-col items-center">
                  <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-8"></div>
                  <h3 className="text-2xl font-black text-slate-800">Processing Insights...</h3>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm relative overflow-hidden group">
                      {!hasActiveSensors && (
                        <div className="absolute top-0 right-0 p-4">
                           <span className="text-[8px] font-black uppercase bg-slate-100 text-slate-400 px-2 py-1 rounded">Estimated Data</span>
                        </div>
                      )}
                      <h3 className="font-black text-2xl text-slate-900 mb-6 flex items-center gap-3">
                        <i className="fas fa-seedling text-emerald-600"></i> Soil Management Strategy
                      </h3>
                      <div className="p-8 rounded-[2rem] bg-emerald-50/50 text-slate-700 border border-emerald-50 mb-6">
                        <p className="text-lg leading-relaxed font-bold italic text-slate-800">
                          "{soilInsight?.summary || "Generating analysis..."}"
                        </p>
                      </div>
                      <div className="bg-slate-900 text-white p-6 rounded-[2.5rem] flex items-center gap-4">
                        <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center">
                          <i className="fas fa-hand-holding-droplet"></i>
                        </div>
                        <div>
                          <div className="text-[10px] font-black uppercase text-emerald-400 tracking-widest">Recommended Action</div>
                          <div className="font-bold text-lg">{soilInsight?.soil_fertilizer || "Awaiting Data"}</div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-end mb-8 px-4">
                        <h3 className="font-black text-2xl text-slate-900 flex items-center gap-3">
                          <i className="fas fa-chart-line text-emerald-600"></i> Harvest Compatibility Index
                        </h3>
                        {!hasActiveSensors && (
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 px-2 py-1 rounded-md mb-1">Regional Avg Analysis</span>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {recommendations?.map((r, i) => (
                          <div key={i} className="bg-white p-8 rounded-[3rem] border border-slate-100 hover:shadow-xl transition-all hover:-translate-y-1">
                            <div className="flex justify-between items-start mb-6">
                              <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center">
                                <i className={`fas ${r.icon} text-2xl text-emerald-600`}></i>
                              </div>
                              <div className="text-right">
                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Suitability</div>
                                <div className="text-2xl font-black text-slate-900">{r.suitability}%</div>
                              </div>
                            </div>
                            <h4 className="font-black text-slate-900 text-xl mb-4">{r.name}</h4>
                            <div className="bg-slate-50 p-4 rounded-2xl mb-4">
                               <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Primary Feed</div>
                               <div className="text-xs font-bold text-slate-700">{r.fertilizer}</div>
                            </div>
                            <p className="text-[11px] text-slate-500 leading-relaxed italic">"{r.requirements}"</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm h-fit sticky top-24">
                    <h3 className="font-black text-2xl text-slate-900 mb-10 flex items-center gap-3">
                       <i className="fas fa-route text-emerald-600"></i> Operational Roadmap
                    </h3>
                    <div className="space-y-10">
                      {managementPlan?.map((p, i) => (
                        <div key={i} className="relative pl-8">
                          <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-full ${p.priority === 'HIGH' || p.priority === 'URGENT' ? 'bg-red-500' : 'bg-emerald-500'}`}></div>
                          <div className={`text-[10px] font-black uppercase mb-1 ${p.priority === 'HIGH' || p.priority === 'URGENT' ? 'text-red-500' : 'text-emerald-500'}`}>{p.priority} Priority</div>
                          <h4 className="font-black text-slate-900 mb-1">{p.title}</h4>
                          <p className="text-xs text-slate-500 leading-relaxed">{p.description}</p>
                        </div>
                      ))}
                    </div>
                    {!hasActiveSensors && (
                      <div className="mt-10 p-6 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-center">
                         <p className="text-[10px] text-slate-400 font-bold leading-tight">Install moisture and NPK sensors to unlock precision tasks.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserFields;
