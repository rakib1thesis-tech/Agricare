
import React from 'react';

const Pricing: React.FC = () => {
  const plans = [
    {
      name: 'Basic',
      price: '৳1,500',
      desc: 'Perfect for small hobby farms and greenhouses.',
      features: [
        'Up to 3 Fields Monitoring',
        'Manual Data Upload',
        'Email Alerts',
        'Basic Weather Integration',
        '7-Day History Tracking'
      ],
      cta: 'Start 30-Day Free Trial',
      popular: false
    },
    {
      name: 'Premium',
      price: '৳5,000',
      desc: 'Ideal for professional commercial agricultural operations.',
      features: [
        'Unlimited Fields',
        'Automatic IoT Data Sync',
        'AI Crop Recommendations',
        'Real-time Dashboard',
        'Advanced NPK Analysis',
        '30-Day History Tracking',
        'SMS & App Push Alerts'
      ],
      cta: 'Start 30-Day Free Trial',
      popular: true
    },
    {
      name: 'Custom',
      price: 'Custom',
      desc: 'Scale to enterprise level with dedicated support.',
      features: [
        'White-label Solutions',
        'Custom API Integrations',
        'Dedicated Support Team',
        'On-site Hardware Setup',
        'Satellite Imagery Data',
        'Full History Archive'
      ],
      cta: 'Contact Sales',
      popular: false
    }
  ];

  const reviews = [
    { name: 'Anisur Rahman', role: 'Tea Garden Owner, Sylhet', rating: 5, text: 'Agricare has been revolutionary for my tea estate. The real-time NPK tracking ensures the highest quality leaves.' },
    { name: 'Nusrat Jahan', role: 'Vegetable Farmer, Narsingdi', rating: 5, text: 'The NPK analysis feature changed the way I fertilize. My yields are up 15% this year.' },
    { name: 'Dr. Shafiqul Islam', role: 'Agri-Scientist, BARI', rating: 4, text: 'Great interface. The AI recommendations provide a solid baseline for multi-crop rotation in the delta region.' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Simple, Transparent Pricing</h1>
        <p className="text-xl text-slate-500">Choose the plan that fits your farm's scale in Bangladesh.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
        {plans.map((plan, i) => (
          <div key={i} className={`relative flex flex-col p-8 rounded-3xl border ${plan.popular ? 'border-emerald-500 ring-4 ring-emerald-50 shadow-xl' : 'border-slate-200'} bg-white transition-transform hover:scale-105`}>
            {plan.popular && (
              <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 bg-emerald-500 text-white text-xs font-bold uppercase tracking-widest py-1 px-3 rounded-full">
                Most Popular
              </div>
            )}
            <h3 className="text-2xl font-bold text-slate-900 mb-2">{plan.name}</h3>
            <div className="flex items-baseline mb-4">
              <span className="text-4xl font-extrabold text-slate-900">{plan.price}</span>
              {plan.price !== 'Custom' && <span className="ml-1 text-slate-500">/month</span>}
            </div>
            <p className="text-slate-500 mb-8">{plan.desc}</p>
            
            <ul className="space-y-4 mb-10 flex-grow">
              {plan.features.map((feature, j) => (
                <li key={j} className="flex items-start gap-3 text-slate-600">
                  <i className="fas fa-check-circle text-emerald-500 mt-1"></i>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            
            <button className={`w-full py-4 rounded-xl font-bold transition-all ${plan.popular ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-200' : 'bg-slate-100 text-slate-900 hover:bg-slate-200'}`}>
              {plan.cta}
            </button>
          </div>
        ))}
      </div>

      <div className="border-t border-slate-200 pt-20">
        <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">Trusted by Farmers Across the Delta</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((rev, i) => (
            <div key={i} className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm italic">
              <div className="flex gap-1 mb-4 text-yellow-400">
                {[...Array(rev.rating)].map((_, j) => <i key={j} className="fas fa-star"></i>)}
              </div>
              <p className="text-slate-600 mb-6">"{rev.text}"</p>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-200"></div>
                <div>
                  <div className="font-bold text-slate-900 not-italic">{rev.name}</div>
                  <div className="text-xs text-slate-500 not-italic">{rev.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Pricing;
