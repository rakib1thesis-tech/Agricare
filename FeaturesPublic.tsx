
import React from 'react';

const FeaturesPublic: React.FC<{ onNavigate: (tab: string) => void }> = ({ onNavigate }) => {
  const offerings = [
    {
      title: "Predictive Irrigation",
      desc: "By modeling soil moisture tensors at three different root-zone depths, our system predicts plant water stress 48 hours before it occurs.",
      icon: "fa-droplet",
      image: "https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?q=80&w=800&auto=format&fit=crop"
    },
    {
      title: "Molecular NPK Analysis",
      desc: "Our Ion-Selective sensors analyze nitrogen, phosphorus, and potassium levels in real-time, providing stoichiometric dosage recommendations.",
      icon: "fa-flask",
      image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?q=80&w=800&auto=format&fit=crop"
    },
    {
      title: "Crop Suitability AI",
      desc: "Using the Gemini-3 engine, we correlate historical soil data with genetic cultivar requirements to recommend the highest-yielding crop for your specific location.",
      icon: "fa-robot",
      image: "https://images.unsplash.com/photo-1595841696677-54897f28bc12?q=80&w=800&auto=format&fit=crop"
    }
  ];

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h1 className="text-5xl font-black text-slate-900 mb-6">Cutting-Edge AgriTech Features</h1>
          <p className="text-xl text-slate-500 max-w-3xl mx-auto">Agricare isn't just a dashboard; it's a complete ecosystem of hardware and software designed to maximize your yield.</p>
        </div>

        <div className="space-y-32">
          {offerings.map((off, i) => (
            <div key={i} className={`flex flex-col ${i % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-16`}>
              <div className="flex-1">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-6">
                  <i className={`fas ${off.icon} text-3xl`}></i>
                </div>
                <h2 className="text-4xl font-bold text-slate-900 mb-6">{off.title}</h2>
                <p className="text-lg text-slate-600 leading-relaxed mb-8">{off.desc}</p>
                <ul className="space-y-4 mb-10">
                  <li className="flex gap-3 items-center text-slate-700 font-medium">
                    <i className="fas fa-check text-emerald-500"></i> Cloud-Sync Capability
                  </li>
                  <li className="flex gap-3 items-center text-slate-700 font-medium">
                    <i className="fas fa-check text-emerald-500"></i> Real-time Push Alerts
                  </li>
                </ul>
                <button 
                  onClick={() => onNavigate('signup')}
                  className="bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100"
                >
                  Deploy in Your Field
                </button>
              </div>
              <div className="flex-1 w-full">
                <img src={off.image} className="rounded-[3rem] shadow-2xl object-cover h-[500px] w-full" alt={off.title} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Process CTA */}
      <section className="bg-slate-900 py-24 px-4 text-center mt-20">
        <h2 className="text-3xl font-bold text-white mb-6">Want to see the science behind it?</h2>
        <p className="text-slate-400 mb-10 max-w-2xl mx-auto">Explore how our sensors transmit data from the soil to the cloud through our interactive process guide.</p>
        <button 
          onClick={() => onNavigate('how-it-works')}
          className="bg-white text-slate-900 px-10 py-4 rounded-2xl font-bold hover:bg-slate-100 transition-all flex items-center gap-3 mx-auto"
        >
          <i className="fas fa-project-diagram"></i> Explore How It Works
        </button>
      </section>
    </div>
  );
};

export default FeaturesPublic;
