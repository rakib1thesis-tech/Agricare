
import React, { useState, useMemo } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import { MOCK_FIELDS, generateMockSensorData } from '../constants';

const PublicDashboard: React.FC = () => {
  const [selectedFieldId, setSelectedFieldId] = useState(MOCK_FIELDS[0].field_id);
  
  const field = MOCK_FIELDS.find(f => f.field_id === selectedFieldId) || MOCK_FIELDS[0];
  const data = useMemo(() => generateMockSensorData(selectedFieldId), [selectedFieldId]);
  
  const latest = data[data.length - 1];

  const handleExportCSV = () => {
    const headers = ['Timestamp', 'Temperature (°C)', 'Moisture (%)', 'pH Level', 'Nitrogen (N)', 'Phosphorus (P)', 'Potassium (K)'];
    
    const rows = data.map(row => [
      row.timestamp,
      row.temperature.toFixed(2),
      row.moisture.toFixed(2),
      row.ph_level.toFixed(2),
      row.npk_n,
      row.npk_p,
      row.npk_k
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(e => e.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `agricare_data_${field.field_name.toLowerCase().replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Public Demo Dashboard</h1>
          <p className="text-slate-500">View real-time sample data for Temperature, pH, Moisture, and NPK.</p>
        </div>
        
        <div className="flex p-1 bg-slate-100 rounded-xl">
          {MOCK_FIELDS.map(f => (
            <button
              key={f.field_id}
              onClick={() => setSelectedFieldId(f.field_id)}
              className={`${
                selectedFieldId === f.field_id 
                  ? 'bg-white shadow-sm text-emerald-600' 
                  : 'text-slate-500 hover:text-slate-800'
              } px-4 py-2 rounded-lg text-sm font-semibold transition-all`}
            >
              {f.field_name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Temperature', value: `${latest.temperature.toFixed(1)}°C`, icon: 'fa-temperature-high', color: 'text-orange-500' },
          { label: 'Soil Moisture', value: `${latest.moisture.toFixed(1)}%`, icon: 'fa-droplet', color: 'text-blue-500' },
          { label: 'pH Level', value: latest.ph_level.toFixed(1), icon: 'fa-flask', color: 'text-purple-500' },
          { label: 'Nitrogen (N)', value: `${latest.npk_n} ppm`, icon: 'fa-leaf', color: 'text-emerald-500' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-500 text-sm font-medium">{stat.label}</span>
              <i className={`fas ${stat.icon} ${stat.color}`}></i>
            </div>
            <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm h-[400px]">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Temperature & Moisture (Last 7 Days)</h3>
          <ResponsiveContainer width="100%" height="85%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="timestamp" />
              <YAxis yAxisId="left" orientation="left" stroke="#f97316" />
              <YAxis yAxisId="right" orientation="right" stroke="#3b82f6" />
              <Tooltip />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="temperature" stroke="#f97316" strokeWidth={3} name="Temp (°C)" dot={{ r: 4 }} />
              <Line yAxisId="right" type="monotone" dataKey="moisture" stroke="#3b82f6" strokeWidth={3} name="Moisture (%)" dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm h-[400px]">
          <h3 className="text-lg font-bold text-slate-900 mb-6">NPK Soil Nutrients (Current Trends)</h3>
          <ResponsiveContainer width="100%" height="85%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="timestamp" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="npk_n" fill="#10b981" name="Nitrogen (N)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="npk_p" fill="#3b82f6" name="Phosphorus (P)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="npk_k" fill="#8b5cf6" name="Potassium (K)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h3 className="text-lg font-bold text-slate-900">Historical Sensor Logs</h3>
          <button 
            onClick={handleExportCSV}
            className="text-emerald-600 text-sm font-semibold hover:underline flex items-center gap-2"
          >
            <i className="fas fa-file-csv"></i> Export to CSV
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Timestamp</th>
                <th className="px-6 py-4">Temp (°C)</th>
                <th className="px-6 py-4">Moisture (%)</th>
                <th className="px-6 py-4">pH</th>
                <th className="px-6 py-4">NPK (N-P-K)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
              {data.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium">{row.timestamp}</td>
                  <td className="px-6 py-4">{row.temperature.toFixed(1)}</td>
                  <td className="px-6 py-4">{row.moisture.toFixed(1)}</td>
                  <td className="px-6 py-4">{row.ph_level.toFixed(1)}</td>
                  <td className="px-6 py-4">
                    <span className="bg-emerald-50 text-emerald-700 px-2 py-1 rounded">{row.npk_n}</span>
                    <span className="mx-1">-</span>
                    <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded">{row.npk_p}</span>
                    <span className="mx-1">-</span>
                    <span className="bg-purple-50 text-purple-700 px-2 py-1 rounded">{row.npk_k}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PublicDashboard;
