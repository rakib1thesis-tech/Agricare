
import React, { useState } from 'react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isLoggedIn: boolean;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, isLoggedIn, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);

  const links = isLoggedIn 
    ? [
        { id: 'dashboard', label: 'Dashboard' },
        { id: 'fields', label: 'My Fields' },
        { id: 'management', label: 'Management' },
        { id: 'sensors', label: 'Sensors' }
      ]
    : [
        { id: 'home', label: 'Home' },
        { id: 'features-public', label: 'Features' },
        { id: 'how-it-works', label: 'How it Works' },
        { id: 'public-dashboard', label: 'Public Demo' },
        { id: 'pricing', label: 'Pricing' }
      ];

  return (
    <nav className="bg-white border-b border-emerald-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center cursor-pointer" onClick={() => setActiveTab('home')}>
            <div className="flex-shrink-0 flex items-center gap-2">
              <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center">
                <i className="fas fa-leaf text-white text-xl"></i>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-green-500 bg-clip-text text-transparent">Agricare</span>
            </div>
          </div>
          
          <div className="hidden md:ml-6 md:flex md:space-x-8 items-center">
            {links.map(link => (
              <button
                key={link.id}
                onClick={() => setActiveTab(link.id)}
                className={`${
                  activeTab === link.id
                    ? 'border-emerald-500 text-slate-900'
                    : 'border-transparent text-slate-500 hover:text-emerald-600 hover:border-emerald-300'
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium h-16 transition-all duration-200`}
              >
                {link.label}
              </button>
            ))}
            
            {isLoggedIn ? (
              <button 
                onClick={onLogout}
                className="ml-4 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
              >
                Logout
              </button>
            ) : (
              <div className="flex items-center gap-3 ml-4">
                <button 
                  onClick={() => setActiveTab('login')}
                  className="text-slate-600 hover:text-emerald-600 text-sm font-semibold"
                >
                  Login
                </button>
                <button 
                  onClick={() => setActiveTab('signup')}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-lg text-sm font-semibold shadow-md transition-all active:scale-95"
                >
                  Get Started
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 focus:outline-none"
            >
              <i className={`fas ${isOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white border-b border-emerald-50">
          <div className="pt-2 pb-3 space-y-1">
            {links.map(link => (
              <button
                key={link.id}
                onClick={() => {
                  setActiveTab(link.id);
                  setIsOpen(false);
                }}
                className={`${
                  activeTab === link.id
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-700'
                    : 'border-transparent text-slate-600 hover:bg-slate-50 hover:text-emerald-600'
                } block pl-3 pr-4 py-2 border-l-4 text-base font-medium w-full text-left`}
              >
                {link.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
