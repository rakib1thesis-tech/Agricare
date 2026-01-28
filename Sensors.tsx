
import React, { useState, useEffect } from 'react';
import { User, Field, Sensor } from '../../types';
import { syncFields, syncSensorsFromDb, addOrUpdateSensorInDb, deleteSensorFromDb } from '../../services/db';

const Sensors: React.FC<{ user: User }> = ({ user }) => {
  const [userFields, setUserFields] = useState<Field[]>([]);
  const [sensors, setSensors] = useState<Sensor[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState<Sensor | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [newSensorForm, setNewSensorForm] = useState({
    type: 'Moisture',
    fieldId: ''
  });

  const [readingInput, setReadingInput] = useState<any>({});

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const dbFields = await syncFields(user.id);
      setUserFields(dbFields);
      
      if (dbFields.length > 0) {
        setNewSensorForm(prev => ({ ...prev, fieldId: dbFields[0].field_id.toString() }));
        const dbSensors = await syncSensorsFromDb(dbFields);
        setSensors(dbSensors);
      }
      setLoading(false);
    };
    loadData();
  }, [user.id]);

  const handleUpdateReading = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!showUpdateModal) return;

    const updatedSensor: Sensor = {
      ...showUpdateModal,
      last_reading: readingInput,
      last_active: new Date().toISOString()
    };

    await addOrUpdateSensorInDb(updatedSensor);
    setSensors(sensors.map(s => s.sensor_id === updatedSensor.sensor_id ? updatedSensor : s));
    setShowUpdateModal(null);
    setReadingInput({});
  };

  const handleDeleteSensor = async (id: number) => {
    if (window.confirm("Remove this sensor?")) {
      await deleteSensorFromDb(id);
      setSensors(sensors.filter(s => s.sensor_id !== id));
    }
  };

  const handleAddSensor = async (e: React.FormEvent) => {
    e.preventDefault();
    const newSensor: Sensor = {
      sensor_id: Math.floor(1000 + Math.random() * 9000),
      field_id: parseInt(newSensorForm.fieldId),
      sensor_type: newSensorForm.type,
      battery_level: 100,
      status: 'active',
      last_active: new Date().toISOString()
    };
    await addOrUpdateSensorInDb(newSensor);
    setSensors([newSensor, ...sensors]);
    setShowAddModal(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Cloud Sensor Control</h1>
          <p className="text-slate-500 text-sm">Update specific sensor values to drive AI field analysis.</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="bg-emerald-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg active:scale-95">
          <i className="fas fa-plus mr-2"></i> Pair New Sensor
        </button>
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-500">Retrieving Device Network...</p>
        </div>
      ) : (
        <div className="w-full">
          <h2 className="text-lg font-bold mb-6 flex items-center gap-2 text-slate-700">
            <i className="fas fa-microchip text-emerald-600"></i> Active Sensor Matrix
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sensors.map(sensor => {
              const field = userFields.find(f => f.field_id === sensor.field_id);
              return (
                <div key={sensor.sensor_id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden">
                  <div className="flex justify-between items-start mb-6">
                    <div className="bg-slate-50 p-4 rounded-2xl group-hover:bg-emerald-50 transition-colors">
                      <i className={`fas ${sensor.sensor_type.toLowerCase().includes('moisture') ? 'fa-droplet text-blue-500' : sensor.sensor_type.toLowerCase().includes('temperature') ? 'fa-temperature-high text-orange-500' : sensor.sensor_type.toLowerCase().includes('npk') ? 'fa-vial text-emerald-500' : 'fa-flask text-purple-500'} text-xl`}></i>
                    </div>
                    <button onClick={() => handleDeleteSensor(sensor.sensor_id)} className="text-slate-200 hover:text-red-500 transition-colors p-2"><i className="fas fa-trash"></i></button>
                  </div>
                  <h3 className="font-bold text-slate-900 text-lg mb-1">{sensor.sensor_type}</h3>
                  <p className="text-xs text-slate-400 mb-6 font-medium uppercase tracking-tight">{field?.field_name || 'Unassigned Field'}</p>
                  
                  <div className="bg-slate-50 p-4 rounded-2xl mb-6 border border-slate-50">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Current Metric</div>
                    <div className="text-xl font-black text-slate-800">
                      {sensor.last_reading ? (
                        sensor.sensor_type.toLowerCase().includes('npk') 
                          ? `${sensor.last_reading.n || 0}-${sensor.last_reading.p || 0}-${sensor.last_reading.k || 0}`
                          : `${sensor.last_reading.value || 0}${sensor.sensor_type.toLowerCase().includes('moisture') ? '%' : sensor.sensor_type.toLowerCase().includes('temperature') ? '°C' : ''}`
                      ) : 'Awaiting Input'}
                    </div>
                  </div>

                  <button 
                    onClick={() => {
                      setShowUpdateModal(sensor);
                      setReadingInput(sensor.last_reading || {});
                    }}
                    className="w-full py-4 bg-emerald-50 text-emerald-700 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                  >
                    Update Sensor Data
                  </button>
                </div>
              );
            })}
            {sensors.length === 0 && (
              <div className="col-span-full py-24 text-center bg-white border border-dashed rounded-[3rem] text-slate-300">
                <i className="fas fa-satellite-dish text-5xl mb-4 opacity-20"></i>
                <p className="font-bold">No paired sensors detected in your account.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add Sensor Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-[2.5rem] w-full max-w-md p-10 shadow-2xl animate-in zoom-in duration-200">
            <h2 className="text-2xl font-black mb-8">Pair New Device</h2>
            <form onSubmit={handleAddSensor} className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2 ml-1">Sensor Type</label>
                <select className="w-full px-5 py-4 rounded-2xl border-none bg-slate-50 text-sm font-medium focus:ring-2 focus:ring-emerald-500" value={newSensorForm.type} onChange={e => setNewSensorForm({...newSensorForm, type: e.target.value})}>
                  <option value="Moisture">Moisture Sensor</option>
                  <option value="Temperature">Temperature Sensor</option>
                  <option value="NPK Analyzer">NPK Lab-on-Chip</option>
                  <option value="PH Probe">pH Diagnostic Probe</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2 ml-1">Assigned Plot</label>
                <select className="w-full px-5 py-4 rounded-2xl border-none bg-slate-50 text-sm font-medium focus:ring-2 focus:ring-emerald-500" value={newSensorForm.fieldId} onChange={e => setNewSensorForm({...newSensorForm, fieldId: e.target.value})}>
                  {userFields.map(f => (
                    <option key={f.field_id} value={f.field_id}>{f.field_name}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-4 pt-6">
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-4 rounded-2xl font-bold text-slate-500 bg-slate-100 transition-colors">Cancel</button>
                <button type="submit" className="flex-1 py-4 rounded-2xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-all shadow-lg">Activate</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Update Reading Modal */}
      {showUpdateModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-[3rem] w-full max-w-md p-10 shadow-2xl">
            <h2 className="text-xl font-bold mb-8">Update {showUpdateModal.sensor_type} Metrics</h2>
            <form onSubmit={handleUpdateReading} className="space-y-8">
              {showUpdateModal.sensor_type.toLowerCase().includes('npk') ? (
                <div className="grid grid-cols-3 gap-6">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Nitrogen</label>
                    <input type="number" className="w-full p-4 bg-slate-50 border-none rounded-2xl text-center font-bold" value={readingInput.n || 0} onChange={e => setReadingInput({...readingInput, n: Number(e.target.value)})} />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Phosphorus</label>
                    <input type="number" className="w-full p-4 bg-slate-50 border-none rounded-2xl text-center font-bold" value={readingInput.p || 0} onChange={e => setReadingInput({...readingInput, p: Number(e.target.value)})} />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Potassium</label>
                    <input type="number" className="w-full p-4 bg-slate-50 border-none rounded-2xl text-center font-bold" value={readingInput.k || 0} onChange={e => setReadingInput({...readingInput, k: Number(e.target.value)})} />
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-3">
                    Input Reading {showUpdateModal.sensor_type.toLowerCase().includes('moisture') ? '(%)' : showUpdateModal.sensor_type.toLowerCase().includes('temperature') ? '(°C)' : '(pH Scale)'}
                  </label>
                  <input type="number" step="0.1" className="w-full p-5 bg-slate-50 border-none rounded-2xl text-xl font-black text-center" value={readingInput.value || 0} onChange={e => setReadingInput({...readingInput, value: Number(e.target.value)})} />
                </div>
              )}
              <div className="flex gap-4">
                <button type="button" onClick={() => setShowUpdateModal(null)} className="flex-1 py-4 rounded-2xl font-bold bg-slate-100 text-slate-500">Cancel</button>
                <button type="submit" className="flex-1 py-4 rounded-2xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-all shadow-xl">Sync to Field</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sensors;
