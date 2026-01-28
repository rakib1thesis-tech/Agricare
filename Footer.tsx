import React from 'react';

const Footer: React.FC<{ onNavigate: (tab: string) => void }> = ({ onNavigate }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 py-12 px-4 mt-auto border-t border-slate-800">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-emerald-500 rounded flex items-center justify-center">
              <i className="fas fa-leaf text-white text-sm"></i>
            </div>
            <span className="text-xl font-bold text-white">Agricare</span>
          </div>
          <p className="text-slate-400 mb-6 max-w-sm">
            Revolutionizing agriculture through real-time IoT monitoring and AI-driven insights. Maximize your yield with Agricare.
          </p>
          <div className="flex space-x-5 text-xl">
            <a href="https://facebook.com" className="hover:text-emerald-400 transition-colors" target="_blank" rel="noopener noreferrer"><i className="fab fa-facebook"></i></a>
            <a href="https://twitter.com" className="hover:text-emerald-400 transition-colors" target="_blank" rel="noopener noreferrer"><i className="fab fa-twitter"></i></a>
            <a href="https://instagram.com" className="hover:text-emerald-400 transition-colors" target="_blank" rel="noopener noreferrer"><i className="fab fa-instagram"></i></a>
            <a href="https://google.com/search?q=iot+agricultural+sensors" className="hover:text-emerald-400 transition-colors" target="_blank" rel="noopener noreferrer"><i className="fab fa-google"></i></a>
          </div>
        </div>
        
        <div>
          <h4 className="text-white font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><button onClick={() => onNavigate('home')} className="hover:text-emerald-400 transition-colors">Home</button></li>
            <li><button onClick={() => onNavigate('features-public')} className="hover:text-emerald-400 transition-colors">Features</button></li>
            <li><button onClick={() => onNavigate('how-it-works')} className="hover:text-emerald-400 transition-colors">How It Works</button></li>
            <li><button onClick={() => onNavigate('pricing')} className="hover:text-emerald-400 transition-colors">Pricing</button></li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto pt-8 mt-8 border-t border-slate-800 text-center text-xs text-slate-500 flex flex-col md:flex-row justify-between items-center gap-4">
        <p>&copy; {new Date().getFullYear()} Agricare Inc. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;