
import React, { useState, useEffect } from 'react';
import { User, Field } from '../../types';
import { syncFields, syncSensorsFromDb } from '../../services/db';
import { getManagementPrescriptions, ManagementPrescription } from '../../services/gemini';

interface FieldWithAI extends ManagementPrescription {
  field: Field;
  data: any;
  aiLoading: boolean;
}

const Management: React.FC<{ user: User }> = ({ user }) => {
  const [fieldData, setFieldData] = useState<FieldWithAI[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const userFields = await syncFields(user.id);
        
        if (userFields.length > 0) {
          const allSensors = await syncSensorsFromDb(userFields);
          
          const initialData: FieldWithAI[] = userFields.map(f => {
            const fieldSensors = allSensors.filter(s => s.field_id === f.field_id);
            
            // Strictly sensor-driven data aggregation (no defaults)
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

            return {
              field: f,
              data: stats,
              aiLoading: true,
              irrigation: { needed: false, volume: '...', schedule: '...' },
              nutrient: { needed: false, fertilizers: [], advice: '...' }
            };
          });
          
          setFieldData(initialData);
          setLoading(false);

          // Trigger AI prescriptions
          initialData.forEach(async (item, index) => {
            try {
              const prescriptions = await getManagementPrescriptions(item.field, item.data);
              setFieldData(prev => {
                const updated = [...prev];
                if (updated[index]) {
                  updated[index] = { ...updated[index], ...prescriptions, aiLoading: false };
                }
                return updated;
              });
            } catch (err) {
              console.error(`AI sync failed for field ${item.field.field_id}`, err);
              setFieldData(prev => {
                const updated = [...prev];
                if (updated[index]) {
                  updated[index].aiLoading = false;
                }
                return updated;
              });
            }
          });
        } else {
          setLoading(false);
        }
      } catch (err) {
        console.error("Management sync error:", err);
        setLoading(false);
      }
    };
    loadData();
  }, [user.id]);

  const handleDownloadReport = () => {
    const now = new Date();
    const dateStr = now.toLocaleDateString() + ' ' + now.toLocaleTimeString();
    
    let reportContent = `AGRICARE - AI FARM MANAGEMENT ADVISORY\n`;
    reportContent += `Generated on: ${dateStr}\n`;
    reportContent += `============================================================\n\n`;

    fieldData.forEach(({ field, data, irrigation, nutrient }) => {
      reportContent += `FIELD: ${field.field_name}\n`;
      reportContent += `Location: ${field.location}\n`;
      reportContent += `Size: ${field.size} ha | Soil: ${field.soil_type}\n`;
      reportContent += `------------------------------------------------------------\n`;
      reportContent += `REGISTERED SENSOR TELEMETRY:\n`;
      reportContent += `- Temperature: ${data.temperature !== undefined ? data.temperature.toFixed(1) + '°C' : 'N/A'}\n`;
      reportContent += `- Moisture: ${data.moisture !== undefined ? data.moisture.toFixed(1) + '%' : 'N/A'}\n`;
      reportContent += `- pH Level: ${data.ph_level !== undefined ? data.ph_level.toFixed(1) : 'N/A'}\n`;
      reportContent += `- NPK Profile: ${data.npk_n !== undefined ? `${data.npk_n}-${data.npk_p}-${data.npk_k}` : 'N/A'}\n\n`;

      reportContent += `AI PRESCRIPTIVE ACTIONS:\n`;
      
      if (data.moisture !== undefined) {
        if (irrigation.needed) {
          reportContent += `[!] IRRIGATION: Required. Apply ${irrigation.volume}. Timing: ${irrigation.schedule}.\n`;
        } else {
          reportContent += `[✓] IRRIGATION: Not required. Moisture levels are sufficient.\n`;
        }
      } else {
        reportContent += `[?] IRRIGATION: Unable to prescribe. Moisture sensor not detected.\n`;
      }

      if (data.npk_n !== undefined) {
        if (nutrient.needed) {
          reportContent += `[!] FERTILIZER PLAN:\n`;
          nutrient.fertilizers.forEach(f => {
            reportContent += `    - ${f.type}: ${f.amount}\n`;
          });
          reportContent += `    Advice: ${nutrient.advice}\n`;
        } else {
          reportContent += `[✓] FERTILIZER: Nutrient balance is currently optimal.\n`;
        }
      } else {
        reportContent += `[?] FERTILIZER: Unable to prescribe. NPK Analyzer not detected.\n`;
      }

      reportContent += `\n============================================================\n\n`;
    });

    reportContent += `End of Advisory.\n`;

    const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Agricare_Advisory_Report_${now.toISOString().split('T')[0]}.txt`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-10">
        <h1 className="text-3xl font-black text-slate-900">AI Farm Management Hub</h1>
        <p className="text-slate-500 mt-1">Real-time agricultural prescriptions synthesized from registered sensors.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <i className="fas fa-microscope text-emerald-600"></i> Active Management Directives
          </h2>
          
          {loading ? (
            <div className="py-20 text-center bg-white rounded-[2.5rem] border border-slate-100 shadow-sm">
               <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
               <p className="text-slate-400 font-medium">Synchronizing Intelligence Nodes...</p>
            </div>
          ) : fieldData.length > 0 ? fieldData.map((item) => {
            const { field, data, irrigation, nutrient, aiLoading } = item;
            const hasMoisture = data.moisture !== undefined;
            const hasNPK = data.npk_n !== undefined;
            
            return (
              <div key={field.field_id} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-2">
                <div className="p-8 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                  <div>
                    <div className="font-black text-slate-900 text-xl">{field.field_name}</div>
                    <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">{field.location} • {field.size} ha</div>
                  </div>
                  {aiLoading ? (
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase text-emerald-600 animate-pulse">
                      <i className="fas fa-spinner fa-spin"></i> Processing...
                    </div>
                  ) : (
                    <div className="text-[10px] bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full font-black uppercase tracking-widest">AI Status: Verified</div>
                  )}
                </div>
                
                <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Irrigation Card */}
                  <div className={`p-6 rounded-[2rem] border transition-all ${!hasMoisture ? 'bg-slate-50 opacity-40 grayscale' : irrigation.needed ? 'bg-blue-50 border-blue-100' : 'bg-slate-50 border-slate-50'}`}>
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${!hasMoisture ? 'bg-slate-200' : irrigation.needed ? 'bg-blue-500 text-white shadow-lg' : 'bg-slate-200 text-slate-400'}`}>
                        <i className="fas fa-droplet text-lg"></i>
                      </div>
                      <h4 className="font-black text-slate-900 uppercase text-sm tracking-tight">Irrigation Strategy</h4>
                    </div>
                    {aiLoading ? (
                      <div className="space-y-2">
                        <div className="h-4 bg-blue-200/20 rounded animate-pulse w-3/4"></div>
                        <div className="h-4 bg-blue-200/20 rounded animate-pulse w-1/2"></div>
                      </div>
                    ) : !hasMoisture ? (
                      <p className="text-xs text-slate-500 font-bold uppercase tracking-tight">Moisture Sensor Required</p>
                    ) : irrigation.needed ? (
                      <div>
                        <div className="text-[10px] font-black text-blue-700 uppercase mb-2 tracking-widest">Soil Deficit Warning</div>
                        <p className="text-sm text-blue-900 mb-1 font-bold">Recommended: {irrigation.volume}</p>
                        <p className="text-xs text-blue-600 italic">Preferred: {irrigation.schedule}</p>
                      </div>
                    ) : (
                      <p className="text-xs text-slate-500 font-medium">Field hydration optimal ({data.moisture.toFixed(1)}%).</p>
                    )}
                  </div>

                  {/* Nutrient Cycle Card */}
                  <div className={`p-6 rounded-[2rem] border transition-all ${!hasNPK ? 'bg-slate-50 opacity-40 grayscale' : nutrient.needed ? 'bg-emerald-50 border-emerald-100' : 'bg-slate-50 border-slate-50'}`}>
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${!hasNPK ? 'bg-slate-200' : nutrient.needed ? 'bg-emerald-500 text-white shadow-lg' : 'bg-slate-200 text-slate-400'}`}>
                        <i className="fas fa-vial text-lg"></i>
                      </div>
                      <h4 className="font-black text-slate-900 uppercase text-sm tracking-tight">Nutrient Cycle</h4>
                    </div>
                    {aiLoading ? (
                      <div className="space-y-2">
                        <div className="h-4 bg-emerald-200/20 rounded animate-pulse w-3/4"></div>
                        <div className="h-4 bg-emerald-200/20 rounded animate-pulse w-1/2"></div>
                      </div>
                    ) : !hasNPK ? (
                      <p className="text-xs text-slate-500 font-bold uppercase tracking-tight">NPK Analyzer Required</p>
                    ) : nutrient.needed ? (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          {nutrient.fertilizers.map((f, i) => (
                            <div key={i} className="flex justify-between items-center bg-white p-3 rounded-xl border border-emerald-100 shadow-sm">
                              <span className="text-[10px] font-black text-emerald-800 uppercase tracking-tight">{f.type}</span>
                              <span className="text-[10px] bg-emerald-100 px-3 py-1 rounded-full font-black text-emerald-700">{f.amount}</span>
                            </div>
                          ))}
                        </div>
                        <p className="text-[11px] text-emerald-800 leading-tight italic">"{nutrient.advice}"</p>
                      </div>
                    ) : (
                      <p className="text-xs text-slate-500 font-medium">N-P-K concentration balance established.</p>
                    )}
                  </div>
                </div>
              </div>
            );
          }) : (
            <div className="bg-white p-20 rounded-[3rem] border border-dashed border-slate-200 text-center text-slate-400">
              <i className="fas fa-folder-open text-5xl mb-6 opacity-20"></i>
              <p className="text-lg font-bold">No active fields detected.</p>
              <p className="text-sm mt-1">Please register a field to initialize AI algorithms.</p>
            </div>
          )}
        </div>

        <div className="space-y-8">
          <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute bottom-0 right-0 w-48 h-48 bg-emerald-500 opacity-5 rounded-full translate-x-10 translate-y-10"></div>
            <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
              <i className="fas fa-brain text-emerald-400"></i> AI Advisory Context
            </h3>
            <div className="space-y-6 text-sm text-slate-400">
              <p>The Gemini 2.5 Flash engine analyzes registered sensor data to prevent resource waste.</p>
              <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                <i className="fas fa-info-circle text-emerald-400 mr-2"></i>
                If a metric is missing, the AI defaults to "Safety First" monitoring mode.
              </div>
            </div>
            <button 
              onClick={handleDownloadReport}
              disabled={fieldData.length === 0}
              className="w-full mt-10 py-4 bg-emerald-600 hover:bg-emerald-500 rounded-2xl text-sm font-black transition-all shadow-lg active:scale-95 disabled:opacity-50"
            >
              <i className="fas fa-file-pdf mr-2"></i> Export Advisory Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Management;
