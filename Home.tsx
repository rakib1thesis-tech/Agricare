
import React, { useState, useEffect } from 'react';
import CommentSection from '../components/CommentSection';

interface HomeProps {
  onGetStarted: () => void;
}

const Home: React.FC<HomeProps> = ({ onGetStarted }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);

  const heroImages = [
    'https://images.unsplash.com/photo-1590496793907-39b56f3a763c?q=80&w=2000&auto=format&fit=crop', // Bangladeshi farmer in field
    'https://images.unsplash.com/photo-1508808788246-7dc977ff3b52?q=80&w=2000&auto=format&fit=crop', // Traditional agricultural landscape
    'https://images.unsplash.com/photo-1615811361523-6bd03d7748e7?q=80&w=2000&auto=format&fit=crop', // South Asian farming culture
    'https://images.unsplash.com/photo-1611003228941-98a52e6dc425?q=80&w=2000&auto=format&fit=crop', // Green paddy field workers
    'https://images.unsplash.com/photo-1589923188900-85dae523342b?q=80&w=2000&auto=format&fit=crop'  // Lush agricultural greenery
  ];

  useEffect(() => {
    const slideInterval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);

    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      clearInterval(slideInterval);
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, [heroImages.length]);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User response to the install prompt: ${outcome}`);
      setDeferredPrompt(null);
    } else {
      setShowInstallModal(true);
    }
  };

  const features = [
    { icon: 'fa-microchip', title: 'IoT Sensor Network', desc: 'Precision sensors monitoring every inch of your soil.' },
    { icon: 'fa-chart-line', title: 'Real-time Analysis', desc: 'Watch your field health live through interactive dashboards.' },
    { icon: 'fa-robot', title: 'Smart Crop Analysis', desc: 'AI-powered crop recommendations tailored for your soil.' },
    { icon: 'fa-droplet', title: 'Water Optimizer', desc: 'Smart irrigation scheduling based on moisture and weather.' },
    { icon: 'fa-flask', title: 'Fertilizer Management', desc: 'NPK data tracking to optimize your soil nutrient balance.' },
    { icon: 'fa-cloud-sun', title: 'Weather Integration', desc: 'Hyper-local weather forecasts and extreme conditions alerts.' },
  ];

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section with Slideshow */}
      <section className="relative h-[700px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          {heroImages.map((img, index) => (
            <div
              key={index}
              className={`absolute inset-0 bg-cover bg-center transition-opacity duration-[2000ms] ease-in-out ${
                index === activeSlide ? 'opacity-100 scale-105 transition-transform duration-[10000ms]' : 'opacity-0 scale-100'
              }`}
              style={{ backgroundImage: `url(${img})` }}
            />
          ))}
          <div className="absolute inset-0 bg-emerald-950/60 backdrop-blur-[1px]"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left">
          <div className="max-w-3xl animate-in fade-in slide-in-from-left-8 duration-1000">
            <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight mb-6">
              The Future of <span className="text-emerald-400 underline decoration-emerald-500/30">Yield Optimization</span> is Here
            </h1>
            <p className="text-xl text-emerald-50 mb-10 leading-relaxed max-w-2xl opacity-90">
              Empowering farmers across Bangladesh with high-precision IoT telemetry and AI insights. Agricare bridges the gap between traditional wisdom and modern data science.
            </p>
            <div className="flex flex-col sm:flex-row gap-5 justify-center sm:justify-start">
              <button 
                onClick={onGetStarted}
                className="px-10 py-5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-bold text-xl shadow-2xl shadow-emerald-900/50 transition-all hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3"
              >
                <i className="fas fa-rocket"></i> Start Free Trial
              </button>
              
              <button 
                onClick={handleInstallClick}
                className="bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/20 flex items-center gap-4 text-white hover:bg-white/20 transition-colors text-left group"
              >
                <i className="fas fa-mobile-screen-button text-2xl group-hover:scale-110 transition-transform"></i>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-emerald-300">Available as PWA</div>
                  <div className="text-sm font-medium">Add to Home Screen</div>
                </div>
              </button>
            </div>
            
            {/* Slide Indicators */}
            <div className="mt-12 flex gap-3 justify-center sm:justify-start">
              {heroImages.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveSlide(idx)}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    idx === activeSlide ? 'w-8 bg-emerald-400' : 'w-4 bg-white/30'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Trust Banner */}
      <section className="max-w-7xl mx-auto px-4 py-12 flex flex-wrap justify-center items-center gap-12 opacity-40 grayscale hover:grayscale-0 transition-all">
        <div className="text-2xl font-black text-slate-400">AGRO-SYNC</div>
        <div className="text-2xl font-black text-slate-400">FARM-LYNX</div>
        <div className="text-2xl font-black text-slate-400">ECO-GROW</div>
        <div className="text-2xl font-black text-slate-400">TERRA-DATA</div>
      </section>

      {/* Quick App Access Guide */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="bg-emerald-50 rounded-[3rem] p-10 border border-emerald-100 flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">No App Store Required</h2>
            <p className="text-slate-600 leading-relaxed mb-6">
              Agricare uses Progressive Web App (PWA) technology. To "download" it, simply visit this site on your mobile browser and select <strong>"Add to Home Screen"</strong>. It works offline and provides real-time push notifications.
            </p>
            <div className="flex gap-4">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-700">
                <i className="fas fa-check-circle"></i> Instant Updates
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-700">
                <i className="fas fa-check-circle"></i> Low Data Usage
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-700">
                <i className="fas fa-check-circle"></i> Cross-Platform
              </div>
            </div>
            <button 
              onClick={handleInstallClick}
              className="mt-6 px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all flex items-center gap-2"
            >
              <i className="fas fa-plus-circle"></i> Install Now
            </button>
          </div>
          <div className="w-48 h-48 bg-white rounded-3xl shadow-xl border border-slate-100 flex items-center justify-center rotate-3 shrink-0">
             <i className="fas fa-cloud-arrow-down text-6xl text-emerald-500 animate-bounce"></i>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-emerald-600 font-bold uppercase tracking-widest text-sm bg-emerald-50 px-4 py-2 rounded-full mb-4 inline-block">Our Ecosystem</span>
          <h2 className="text-4xl font-bold text-slate-900 mb-4 mt-4">Scientific Precision in Every Seed</h2>
          <p className="text-slate-500 max-w-2xl mx-auto text-lg">Harness the power of mathematical models and IoT to transform your agricultural production.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <div key={i} className="p-10 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-emerald-200 transition-all duration-300 group">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-emerald-600 group-hover:text-white transition-all transform group-hover:rotate-6">
                <i className={`fas ${f.icon} text-3xl`}></i>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">{f.title}</h3>
              <p className="text-slate-600 leading-relaxed text-lg">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Comment Section */}
      <CommentSection />

      {/* Install Modal (Fallback) */}
      {showInstallModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl animate-in zoom-in duration-200">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-bold text-slate-900">Install Agricare</h2>
              <button onClick={() => setShowInstallModal(false)} className="text-slate-400 hover:text-slate-600">
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>
            
            <div className="space-y-6 text-slate-600">
              <p className="font-medium">To install Agricare on your home screen:</p>
              
              <div className="space-y-4">
                <div className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 font-bold">1</div>
                  <p className="text-sm">Open this site in your mobile browser (Safari for iOS, Chrome for Android).</p>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 font-bold">2</div>
                  <p className="text-sm">
                    Tap the <i className="fas fa-share-square text-blue-500"></i> (iOS) or <i className="fas fa-ellipsis-v"></i> (Android) button.
                  </p>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 font-bold">3</div>
                  <p className="text-sm">Select <strong>"Add to Home Screen"</strong> from the menu.</p>
                </div>
              </div>
            </div>

            <button 
              onClick={() => setShowInstallModal(false)}
              className="w-full mt-8 py-4 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all"
            >
              Got it!
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
