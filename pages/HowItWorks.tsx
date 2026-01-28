
import React from 'react';

const HowItWorks: React.FC = () => {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero Header */}
      <section className="bg-emerald-900 py-24 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-emerald-400 rounded-full blur-3xl"></div>
        </div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6">
            Real-Life Field Hardware
          </h1>
          <p className="text-xl text-emerald-100/80 leading-relaxed">
            The bridge between the soil and the cloud. Explore the industrial-grade telemetry devices that power our precision agriculture ecosystem.
          </p>
        </div>
      </section>

      {/* Main Content Sections */}
      <div className="max-w-7xl mx-auto px-4 py-20 space-y-32">
        
        {/* 1. Temperature Sensor */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <img 
              src="https://how2electronics.com/wp-content/uploads/2023/09/Soil-Temperature-Moisture-Sensor.jpg" 
              className="rounded-3xl shadow-2xl border-4 border-slate-100 object-cover h-[500px] w-full transform hover:rotate-1 transition-transform duration-500" 
              alt="Real-life Soil Temperature Transmitter" 
            />
            <div className="absolute top-4 left-4 bg-orange-600 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg">
              Industrial Grade
            </div>
          </div>
          <div>
            <h2 className="text-3xl font-black text-slate-900 mb-6 flex items-center gap-4">
              <span className="bg-orange-100 text-orange-600 w-12 h-12 rounded-2xl flex items-center justify-center font-bold">01</span>
              Soil Temperature Transmitter
            </h2>
            <div className="space-y-6 text-slate-600 leading-relaxed">
              <p className="text-lg font-medium text-slate-800">
                The industrial RS485 transmitter is the primary sensory organ for tracking deep-soil thermal dynamics.
              </p>
              <div className="bg-slate-50 p-8 rounded-[2rem] border-l-8 border-orange-500 shadow-sm">
                <h4 className="font-bold text-slate-900 mb-4 uppercase text-sm tracking-widest">How it works:</h4>
                <p className="text-base mb-4">
                  Encased in high-density black epoxy, this sensor utilizes a high-precision <strong>NTC Thermistor</strong>. As the soil temperature changes, the internal electrical resistance of the thermistor shifts in a predictable, non-linear way.
                </p>
                <p className="text-base">
                  The integrated circuit inside the transmitter filters out ground noise and converts this physical resistance into a stable 4-20mA or RS485 digital signal. This allows data to travel over long field cables without losing accuracy to electrical interference.
                </p>
              </div>
              <div className="flex gap-4 items-center p-4 bg-orange-50 rounded-2xl">
                <i className="fas fa-microchip text-orange-500 text-xl"></i>
                <span className="text-sm font-bold text-orange-900">Precision: &plusmn;0.1&deg;C calibration for Bangladeshi tropical soil.</span>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Moisture Sensor */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1">
            <h2 className="text-3xl font-black text-slate-900 mb-6 flex items-center gap-4">
              <span className="bg-blue-100 text-blue-600 w-12 h-12 rounded-2xl flex items-center justify-center font-bold">02</span>
              Multi-Depth Moisture Probes
            </h2>
            <div className="space-y-6 text-slate-600 leading-relaxed">
              <p className="text-lg font-medium text-slate-800">
                Dual-probe PCB technology (Top/Bottom) allows for vertical water profiling in the root zone.
              </p>
              <div className="bg-slate-50 p-8 rounded-[2rem] border-l-8 border-blue-500 shadow-sm">
                <h4 className="font-bold text-slate-900 mb-4 uppercase text-sm tracking-widest">How it works:</h4>
                <p className="text-base mb-4">
                  The green PCB prongs operate using <strong>FDR (Frequency Domain Reflectometry)</strong>. By creating a high-frequency electromagnetic field around the 'Top' and 'Bottom' prongs, the sensor measures the soil's dielectric constant.
                </p>
                <p className="text-base">
                  Since water has a much higher dielectric constant than soil or air, the frequency of the oscillation changes in direct proportion to the volume of water present. Having two prongs allows farmers to see if water is successfully penetrating to the deep root zone ('Bottom') or merely staying on the surface ('Top').
                </p>
              </div>
            </div>
          </div>
          <div className="order-1 lg:order-2 relative">
            <img 
              src="https://static.tildacdn.com/tild3034-3533-4638-a530-363033663165/Picture_33.jpg" 
              className="rounded-3xl shadow-2xl border-4 border-slate-100 object-cover h-[500px] w-full transform hover:-rotate-1 transition-transform duration-500" 
              alt="Real-life Dual PCB Soil Moisture Probe" 
            />
            <div className="absolute -bottom-4 -right-4 bg-blue-600 text-white p-4 rounded-xl shadow-xl font-bold text-xs uppercase">
              Capacitive Sensing
            </div>
          </div>
        </section>

        {/* 3. NPK Sensor */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <img 
              src="https://www.electronics.com.bd/9310-large_default/vms-3002-tr-npk.webp" 
              className="rounded-3xl shadow-2xl border-4 border-slate-100 object-cover h-[500px] w-full" 
              alt="Real-life NPK Sensor" 
            />
          </div>
          <div>
            <h2 className="text-3xl font-black text-slate-900 mb-6 flex items-center gap-4">
              <span className="bg-emerald-100 text-emerald-600 w-12 h-12 rounded-2xl flex items-center justify-center font-bold">03</span>
              Electrochemical NPK Profiler
            </h2>
            <div className="space-y-6 text-slate-600 leading-relaxed">
              <p className="text-lg font-medium text-slate-800">
                Direct in-situ analysis of Nitrogen, Phosphorus, and Potassium using Ion-Selective Electrode technology.
              </p>
              <div className="bg-slate-50 p-8 rounded-[2rem] border-l-8 border-emerald-500 shadow-sm">
                <h4 className="font-bold text-slate-900 mb-4 uppercase text-sm tracking-widest">How it works:</h4>
                <p className="text-base mb-4">
                  Traditional testing requires soil to be sent to a lab. Our sensors use <strong>Ion-Selective Membranes</strong> that only permit specific nutrients—like Nitrate (NO<sub>3</sub><sup>-</sup>)—to pass. When these ions interact with the electrode, they generate a tiny millivolt (mV) potential.
                </p>
                <p className="text-base">
                  By measuring these specific electrical potentials across multiple electrodes, the system calculates the "Plant Available" N-P-K concentrations in parts per million (ppm). This allows for dynamic fertilization, adding nutrients only when the soil truly lacks them.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 4. pH Sensor */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1">
            <h2 className="text-3xl font-black text-slate-900 mb-6 flex items-center gap-4">
              <span className="bg-purple-100 text-purple-600 w-12 h-12 rounded-2xl flex items-center justify-center font-bold">04</span>
              Glass Electrode pH Transmitter
            </h2>
            <div className="space-y-6 text-slate-600 leading-relaxed">
              <p className="text-lg font-medium text-slate-800">
                The critical regulator of nutrient solubility and soil microbial health.
              </p>
              <div className="bg-slate-50 p-8 rounded-[2rem] border-l-8 border-purple-500 shadow-sm">
                <h4 className="font-bold text-slate-900 mb-4 uppercase text-sm tracking-widest">How it works:</h4>
                <p className="text-base mb-4">
                  The sensor features a specialized pH-sensitive glass bulb filled with a standard buffer solution. When pressed into the moist field, Hydrogen ions (H<sup>+</sup>) in the soil moisture react with the outer surface of the glass.
                </p>
                <p className="text-base">
                  This creates an electrical potential relative to a stable internal reference electrode. The transmitter converts this millivolt reading into the 0-14 pH scale. Monitoring this in real-time is vital: if pH is off, plants cannot absorb the NPK nutrients even if they are present in the soil.
                </p>
              </div>
            </div>
          </div>
          <div className="order-1 lg:order-2 relative">
            <img 
              src="https://gardenerspath.com/wp-content/uploads/2021/02/Reading-a-Two-Prong-Moisture-Meter.jpg" 
              className="rounded-3xl shadow-2xl border-4 border-slate-100 object-cover h-[500px] w-full" 
              alt="Real-life pH Sensing Probe" 
            />
          </div>
        </section>

      </div>

      {/* Connectivity Banner */}
      <section className="bg-slate-900 py-24 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-8">Integrated Intelligence</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-3xl bg-white/5 border border-white/10">
              <i className="fas fa-tower-broadcast text-emerald-400 text-3xl mb-4"></i>
              <h4 className="text-white font-bold mb-2">LoRaWAN</h4>
              <p className="text-slate-400 text-xs">Reliable 10km data range through rice paddies.</p>
            </div>
            <div className="p-6 rounded-3xl bg-white/5 border border-white/10">
              <i className="fas fa-battery-full text-emerald-400 text-3xl mb-4"></i>
              <h4 className="text-white font-bold mb-2">3-Year Battery</h4>
              <p className="text-slate-400 text-xs">Self-contained power for multi-season monitoring.</p>
            </div>
            <div className="p-6 rounded-3xl bg-white/5 border border-white/10">
              <i className="fas fa-shield-halved text-emerald-400 text-3xl mb-4"></i>
              <h4 className="text-white font-bold mb-2">IP68 Rated</h4>
              <p className="text-slate-400 text-xs">Full waterproofing for monsoon-heavy climates.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HowItWorks;
