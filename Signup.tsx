
import React, { useState } from 'react';
import { User, Field } from '../types';
import { registerUser, addFieldToDb } from '../services/db';

interface SignupProps {
  onSignup: (user: User) => void;
  onSwitchToLogin: () => void;
}

const Signup: React.FC<SignupProps> = ({ onSignup, onSwitchToLogin }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    plan: 'premium',
    fieldName: '',
    location: '',
    size: '',
    soilType: 'Loamy'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const tempUser: User = {
        id: '', // Will be assigned by Firebase
        name: formData.name,
        email: formData.email,
        subscriptionPlan: formData.plan as any,
        subscriptionEnd: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0]
      };

      const newUser = await registerUser(tempUser, formData.password);

      // Create the initial field for the user
      const initialField: Field = {
        field_id: Math.floor(Math.random() * 100000),
        user_id: newUser.id,
        field_name: formData.fieldName || 'My First Field',
        location: formData.location || 'Bangladesh',
        size: parseFloat(formData.size) || 1.0,
        soil_type: formData.soilType
      };

      await addFieldToDb(initialField);
      onSignup(newUser);
    } catch (error: any) {
      alert("Signup Error: " + (error.message || "Could not create account."));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-slate-50/50">
      <div className="max-w-2xl w-full space-y-8 bg-white p-8 md:p-12 rounded-[2.5rem] border border-slate-100 shadow-2xl">
        <div className="text-center">
          <div className="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-emerald-100">
            <i className="fas fa-user-plus text-white text-2xl"></i>
          </div>
          <h2 className="text-3xl font-black text-slate-900">Start Your Agri-Journey</h2>
          <p className="mt-2 text-sm text-slate-500">Create your cloud-synced account in minutes.</p>
        </div>
        
        <form className="mt-8 space-y-10" onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold">1</span>
              <h3 className="font-bold text-slate-800 uppercase tracking-widest text-xs">Account Information</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Full Name</label>
                <input
                  type="text"
                  required
                  className="appearance-none block w-full px-4 py-3 border border-slate-200 rounded-2xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all sm:text-sm"
                  placeholder="e.g. Arif Hossain"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Email address</label>
                <input
                  type="email"
                  required
                  className="appearance-none block w-full px-4 py-3 border border-slate-200 rounded-2xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all sm:text-sm"
                  placeholder="arif@gmail.com"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Password</label>
                <input
                  type="password"
                  required
                  className="appearance-none block w-full px-4 py-3 border border-slate-200 rounded-2xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all sm:text-sm"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Subscription Plan</label>
                <select 
                  className="block w-full px-4 py-3 border border-slate-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all sm:text-sm"
                  value={formData.plan}
                  onChange={e => setFormData({...formData, plan: e.target.value})}
                >
                  <option value="basic">Basic (৳1,500/mo)</option>
                  <option value="premium">Premium (৳5,000/mo)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-6 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-3 mb-2">
              <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">2</span>
              <h3 className="font-bold text-slate-800 uppercase tracking-widest text-xs">Initial Farm Setup</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Field Name</label>
                <input
                  type="text"
                  required
                  className="appearance-none block w-full px-4 py-3 border border-slate-200 rounded-2xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all sm:text-sm"
                  placeholder="e.g. Rajshahi Mango Plot A"
                  value={formData.fieldName}
                  onChange={e => setFormData({...formData, fieldName: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">District / Location</label>
                <input
                  type="text"
                  required
                  className="appearance-none block w-full px-4 py-3 border border-slate-200 rounded-2xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all sm:text-sm"
                  placeholder="e.g. Puthia, Rajshahi"
                  value={formData.location}
                  onChange={e => setFormData({...formData, location: e.target.value})}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Size (Hectares)</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  className="appearance-none block w-full px-4 py-3 border border-slate-200 rounded-2xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all sm:text-sm"
                  placeholder="e.g. 5.5"
                  value={formData.size}
                  onChange={e => setFormData({...formData, size: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Soil Type</label>
                <select 
                  className="block w-full px-4 py-3 border border-slate-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all sm:text-sm"
                  value={formData.soilType}
                  onChange={e => setFormData({...formData, soilType: e.target.value})}
                >
                  <option value="Loamy">Loamy (উর্বর দোআঁশ)</option>
                  <option value="Clay">Clay (এঁটেল)</option>
                  <option value="Sandy">Sandy (বেলে)</option>
                  <option value="Alluvial">Alluvial (পলি)</option>
                  <option value="Peaty">Peaty (পিট)</option>
                </select>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-sm font-black rounded-2xl text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 shadow-xl shadow-emerald-200 transition-all transform hover:-translate-y-0.5 active:scale-95 disabled:opacity-50"
          >
            {isLoading ? <i className="fas fa-spinner fa-spin mr-2"></i> : null}
            Deploy My Farm Dashboard
          </button>
        </form>

        <div className="text-center">
          <p className="text-sm text-slate-500">
            Already registered?{' '}
            <button onClick={onSwitchToLogin} className="font-bold text-emerald-600 hover:text-emerald-500 transition-colors">Sign in here</button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
