import React, { useState } from 'react';
import { Zap, Target, Recycle, Database, Info, FileText, Download } from 'lucide-react';

// Custom Components
import MetricCard from './components/MetricCard';
import EfficiencyGauge from './components/EfficiencyGauge';
import CompositionChart from './components/CompositionChart';
import MethodDetails from './components/MethodDetails';

// Utilities
import { wastePresets } from './utils/presets';
import { generatePDF } from './utils/exportReport';

function App() {
  const [formData, setFormData] = useState({
    waste_category: "MSW",
    moisture_content_pct: 52.6,
    HHV_MJ_kg: 6.9,
    carbon_content_pct: 29.4,
    ash_content_pct: 21.3,
    volatile_matter_pct: 51.8,
    fixed_carbon_pct: 26.9,
    volume: 12000
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // Constants for Impact Metrics
  const AVG_HOME_USAGE_DAY = 8; // kWh
  const CO2_FACTOR = 0.4; // kg offset per kWh

  const handlePredict = async () => {
    // Basic validation: Check for empty number fields
    const isInvalid = Object.keys(formData).some(key => 
      key !== "waste_category" && (formData[key] === "" || formData[key] === null)
    );

    if (isInvalid) {
      alert("Please fill in all composition values before predicting.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('http://127.0.0.1:8000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      setResult(data);
    } catch (error) {
      console.error("Backend Error:", error);
      alert("Server connection failed. Ensure FastAPI is running on port 8000.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans antialiased text-gray-900">
      
      {/* SIDEBAR: INPUTS & PRESETS */}
      <aside className="w-85 bg-white border-r border-gray-200 p-6 overflow-y-auto shadow-sm flex-shrink-0">
        <div className="flex items-center space-x-3 mb-10">
          <div className="p-2 bg-blue-600 rounded-xl">
            <Zap className="text-white" fill="currentColor" size={24} />
          </div>
          <h1 className="text-2xl font-black text-gray-800 tracking-tighter italic">EnergyAI</h1>
        </div>

        {/* PRESETS SECTION */}
        <div className="mb-8">
          <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 px-1">Quick Presets</h2>
          <div className="grid grid-cols-1 gap-2 max-h-56 overflow-y-auto pr-2 scrollbar-hide">
            {wastePresets.map((preset) => (
              <button
                key={preset.label}
                onClick={() => setFormData(preset.data)}
                className="group flex items-center justify-between text-left text-xs p-3 rounded-xl border border-gray-100 hover:bg-blue-50 hover:border-blue-200 transition-all bg-gray-50/50 text-gray-700 font-semibold"
              >
                <span>{preset.label}</span>
                <Download size={12} className="opacity-0 group-hover:opacity-100 text-blue-500 transition-opacity" />
              </button>
            ))}
          </div>
        </div>
        
        {/* FORM SECTION */}
        <div className="space-y-4 pt-6 border-t border-gray-100">
          <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">Waste Parameters</h2>
          
          {Object.keys(formData).map(key => (
            <div key={key} className="flex flex-col">
              <label className="text-[11px] text-gray-500 font-bold mb-1 capitalize px-1">
                {key.replace(/_/g, ' ')}
              </label>
              <input 
                type={key === "waste_category" ? "text" : "number"} 
                value={formData[key]} 
                onFocus={(e) => e.target.select()}
                onChange={(e) => {
                  const rawValue = e.target.value;
                  if (key === "waste_category") {
                    setFormData({ ...formData, [key]: rawValue });
                    return;
                  }
                  if (rawValue === "") {
                    setFormData({ ...formData, [key]: "" });
                    return;
                  }
                  setFormData({ ...formData, [key]: parseFloat(rawValue) });
                }}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-transparent outline-none transition-all"
              />
            </div>
          ))}

          <button 
            onClick={handlePredict}
            disabled={loading}
            className={`w-full mt-6 py-4 rounded-2xl font-bold text-sm text-white shadow-xl transition-all ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 hover:shadow-blue-200 active:scale-95"
            }`}
          >
            {loading ? "Analyzing Data..." : "Run ML Prediction"}
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT: DASHBOARD */}
      <main className="flex-1 p-10 overflow-y-auto">
        {!result ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-400 bg-white rounded-[2rem] border-2 border-dashed border-gray-200">
            <Database size={80} className="mb-6 opacity-5" />
            <h3 className="text-xl font-bold text-gray-600">Awaiting Simulation</h3>
            <p className="max-w-xs text-center text-sm mt-2">Select a preset or adjust chemical values on the left to begin analysis.</p>
          </div>
        ) : (
          <div id="report-content" className="max-w-6xl mx-auto space-y-10">
            
            {/* HEADER & PDF EXPORT */}
            <header className="flex justify-between items-start">
              <div>
                <h2 className="text-4xl font-black text-gray-900 tracking-tight">Analysis Report</h2>
                <p className="text-gray-500 font-medium mt-1">Classification Match: <span className="text-blue-600 font-bold">{result.waste_type}</span></p>
              </div>
              
              <div className="flex items-center space-x-3">
                <button 
                  onClick={() => generatePDF('report-content', `EnergyAI-${result.waste_type}-Report.pdf`)}
                  className="flex items-center space-x-2 bg-white px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-bold text-gray-700 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all shadow-sm"
                >
                  <FileText size={18} />
                  <span>Export PDF</span>
                </button>
                <div className="bg-gray-900 text-white px-4 py-2.5 rounded-xl text-[10px] font-mono shadow-lg">
                  VER: RF_ENGINE_2026
                </div>
              </div>
            </header>

            {/* TOP METRICS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <MetricCard title="Total Energy" value={result.total_energy_kwh.toLocaleString()} unit="kWh" icon={Zap} colorClass="bg-blue-600" />
              <MetricCard title="Energy Yield" value={result.energy_per_kg_kwh} unit="kWh/kg" icon={Target} colorClass="bg-indigo-600" />
              <MetricCard title="Optimized Method" value={result.recommended_method} unit="" icon={Recycle} colorClass="bg-emerald-600" />
            </div>

            {/* ANALYTICS ROW */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white p-10 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col items-center">
                <h3 className="w-full font-bold text-gray-800 mb-8 flex items-center text-lg">
                  <span className="w-3 h-3 bg-emerald-500 rounded-full mr-3"></span>
                  Conversion Efficiency
                </h3>
                <EfficiencyGauge score={result.efficiency_pct} />
              </div>

              <div className="bg-white p-10 rounded-[2rem] shadow-sm border border-gray-100">
                <h3 className="w-full font-bold text-gray-800 mb-8 flex items-center text-lg">
                  <span className="w-3 h-3 bg-blue-500 rounded-full mr-3"></span>
                  Chemical Profile
                </h3>
                <CompositionChart data={formData} />
              </div>
            </div>

            {/* LOWER CONTENT: INSIGHTS & IMPACT (Full-Width Layout) */}
            <div className="flex flex-col space-y-8 mt-8">
              
              {/* Method Detail Component (Now Full Width) */}
              <div className="w-full">
                <MethodDetails method={result.recommended_method} />
              </div>

              {/* IMPACT BANNER (HORIZONTAL FULL WIDTH STYLE) */}
              <div className="bg-blue-700 rounded-[2rem] p-10 text-white shadow-2xl shadow-blue-200 flex flex-col md:flex-row items-center justify-between gap-8 w-full">
                
                {/* Left Side: Title and Icon */}
                <div className="flex items-center space-x-6">
                  <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm">
                    <Zap size={40} className="text-white" />
                  </div>
                  <div>
                    <h4 className="text-3xl font-black tracking-tight">Community Impact</h4>
                    <p className="text-blue-200 text-sm mt-1 font-medium">Predicted utility value for this waste batch.</p>
                  </div>
                </div>
                
                {/* Right Side: Metrics */}
                <div className="flex flex-wrap justify-center gap-8 md:gap-16 items-center">
                  <div className="text-center">
                    <p className="text-5xl font-black tracking-tighter">
                      {(result.total_energy_kwh / AVG_HOME_USAGE_DAY).toFixed(0)}
                    </p>
                    <p className="text-[11px] uppercase font-bold tracking-widest text-blue-300 mt-2">Homes Powered / Day</p>
                  </div>
                  
                  {/* Divider Line */}
                  <div className="hidden md:block w-px h-16 bg-white/20"></div>
                  
                  <div className="text-center">
                    <p className="text-5xl font-black tracking-tighter">
                      {(result.total_energy_kwh * CO2_FACTOR).toFixed(1)}
                    </p>
                    <p className="text-[11px] uppercase font-bold tracking-widest text-blue-300 mt-2">KG CO2 Offset</p>
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;