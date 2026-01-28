
import React, { useState, useEffect } from 'react';
import { User, Field } from '../../types';
import { syncFields, addFieldToDb } from '../../services/db';

const Overview: React.FC<{ user: User }> = ({ user }) => {
  const [fields, setFields] = useState<Field[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddFieldModal, setShowAddFieldModal] = useState(false);
  const [newFieldData, setNewFieldData] = useState({ name: '', location: '', size: '', soilType: 'Loamy' });

  useEffect(() => {
    const loadData = async () => {
      const userFields = await syncFields(user.id);
      setFields(userFields);
      setLoading(false);
    };
    loadData();
  }, [user.id]);

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
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900">Welcome, {user.name}</h1>
          <p className="text-slate-500 mt-1">Your agricultural monitoring system is live and syncing field telemetry.</p>
        </div>
        <div className="flex flex-col items-end gap-3">
          <div className="flex items-center gap-3 bg-emerald-50 px-4 py-2 rounded-2xl border border-emerald-100">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest">System Online</span>
          </div>
          <button 
            onClick={() => setShowAddFieldModal(true)}
            className="bg-emerald-600 text-white px-5 py-2 rounded-xl font-bold text-sm shadow-md hover:bg-emerald-700 transition-all flex items-center gap-2"
          >
            <i className="fas fa-plus"></i> Add New Field
          </button>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
            <i className="fas fa-map-location-dot text-xl"></i>
          </div>
          <div className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Total Fields</div>
          <div className="text-4xl font-black text-slate-900">{fields.length}</div>
        </div>
        
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6">
            <i className="fas fa-microchip text-xl"></i>
          </div>
          <div className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Status</div>
          <div className="text-xl font-bold text-slate-800">Telemetry Active</div>
          <div className="text-[10px] text-emerald-600 font-bold uppercase mt-1">Agricare AI Online</div>
        </div>
      </div>
      
      {/* Field List */}
      <div className="flex justify-between items-center mb-6 px-2">
        <h3 className="text-2xl font-bold text-slate-900">Your Managed Fields</h3>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-slate-100 h-48 rounded-[2rem] animate-pulse"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {fields.map(f => (
            <div key={f.field_id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
              <div className="flex justify-between items-start mb-6">
                <div className="w-14 h-14 bg-slate-50 text-emerald-600 rounded-2xl flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <i className="fas fa-seedling text-2xl"></i>
                </div>
                <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-3 py-1 rounded-full uppercase tracking-tighter">{f.soil_type}</span>
              </div>
              <div className="font-bold text-slate-900 text-xl mb-1">{f.field_name}</div>
              <div className="text-sm text-slate-500 flex items-center gap-2 mb-6">
                <i className="fas fa-location-dot text-emerald-500"></i> {f.location}
              </div>
              <div className="pt-6 border-t border-slate-50 flex justify-between items-center">
                <div className="text-xs font-bold text-slate-900">{f.size} Hectares</div>
                <div className="text-[10px] text-emerald-600 font-black uppercase tracking-widest">Live Monitoring</div>
              </div>
            </div>
          ))}
          {fields.length === 0 && (
            <div className="col-span-full py-20 bg-slate-50 rounded-[3rem] border border-dashed border-slate-200 text-center text-slate-400">
              <div className="mb-4 text-4xl opacity-20"><i className="fas fa-folder-open"></i></div>
              <p className="text-lg font-medium">No fields registered yet.</p>
              <button 
                onClick={() => setShowAddFieldModal(true)}
                className="mt-4 text-emerald-600 font-bold hover:underline"
              >
                Click here to add your first plot
              </button>
            </div>
          )}
        </div>
      )}

      {/* Add Field Modal */}
      {showAddFieldModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-[2rem] w-full max-w-md shadow-2xl animate-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-900">Add New Plot</h2>
              <button onClick={() => setShowAddFieldModal(false)} className="text-slate-400 hover:text-slate-600">
                <i className="fas fa-times"></i>
              </button>
            </div>
            <form onSubmit={handleAddField} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Field Name</label>
                <input required className="w-full p-3 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500" placeholder="e.g. Rice Paddy A" value={newFieldData.name} onChange={e => setNewFieldData({...newFieldData, name: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Location</label>
                <input required className="w-full p-3 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500" placeholder="e.g. Bogura, Bangladesh" value={newFieldData.location} onChange={e => setNewFieldData({...newFieldData, location: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Size (ha)</label>
                  <input required type="number" step="0.1" className="w-full p-3 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500" placeholder="1.5" value={newFieldData.size} onChange={e => setNewFieldData({...newFieldData, size: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Soil Type</label>
                  <select className="w-full p-3 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500" value={newFieldData.soilType} onChange={e => setNewFieldData({...newFieldData, soilType: e.target.value})}>
                    <option value="Loamy">Loamy</option>
                    <option value="Clay">Clay</option>
                    <option value="Sandy">Sandy</option>
                    <option value="Alluvial">Alluvial</option>
                  </select>
                </div>
              </div>
              <button type="submit" className="w-full py-4 bg-emerald-600 text-white rounded-xl font-bold shadow-lg hover:bg-emerald-700 transition-all mt-4">Register Field</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Overview;
