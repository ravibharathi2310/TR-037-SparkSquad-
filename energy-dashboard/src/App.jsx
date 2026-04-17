import React, { useState } from 'react';
import { Zap, Target, Recycle, Database, Info } from 'lucide-react';
import MetricCard from './components/MetricCard';
import EfficiencyGauge from './components/EfficiencyGauge';
import { wastePresets } from './utils/presets';
import MethodDetails from './components/MethodDetails';
import CompositionChart from './components/CompositionChart';

function App() {
  // We keep the state object ordered with waste_category first
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

  const handlePredict = async () => {
    // Basic validation: Check if any number fields are empty
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
      console.error("Connection to Backend Failed:", error);
      alert("Make sure your Python server is running on port 8000!");
    } finally {
      setLoading(false);
    }
  };

  // Helper function to safely format numbers for the UI
  const formatNum = (val) => (val !== undefined && val !== null ? val.toLocaleString() : "0");
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* SIDEBAR: INPUTS */}
      <aside className="w-80 bg-white border-r p-6 overflow-y-auto shadow-xl">
        <div className="flex items-center space-x-2 mb-8">
          <Zap className="text-blue-600" fill="currentColor" size={28} />
          <h1 className="text-xl font-bold text-gray-800 tracking-tight">EnergyAI</h1>
        </div>

        {/* STEP 7: INPUT PRESETS */}
        <div className="mb-8">
  <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-1">Quick Presets</h2>
  {/* Added max-height and custom scrollbar styling */}
  <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-200">
    {wastePresets.map((preset) => (
      <button
        key={preset.label}
        onClick={() => setFormData(preset.data)}
        className="text-left text-xs p-2.5 rounded-xl border border-gray-100 hover:bg-blue-50 hover:border-blue-200 transition-all bg-gray-50 text-gray-700 font-medium hover:text-blue-700 active:scale-95"
      >
        {preset.label}
      </button>
    ))}
  </div>
</div>
        
        <div className="space-y-4 pt-4 border-t border-gray-100">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-1">Waste Composition</h2>
          
          {Object.keys(formData).map(key => (
            <div key={key} className="flex flex-col">
              <label className="text-xs text-gray-500 font-medium mb-1 capitalize px-1">
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
                className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                placeholder={`Enter ${key.replace(/_/g, ' ')}`}
              />
            </div>
          ))}

          <button 
            onClick={handlePredict}
            disabled={loading}
            className={`w-full mt-4 py-3 rounded-xl font-semibold text-white shadow-lg transition-all ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 active:scale-95 shadow-blue-200"
            }`}
          >
            {loading ? "Processing..." : "Run Prediction"}
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT: DASHBOARD */}
      <main className="flex-1 p-8 overflow-y-auto">
        {!result ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-400 bg-white rounded-3xl border-2 border-dashed border-gray-200">
            <Database size={64} className="mb-4 opacity-10" />
            <p className="text-lg font-medium">Ready for Data Input</p>
            <p className="text-sm">Adjust parameters or use a preset to see the ML analysis</p>
          </div>
        ) : (
          <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
            <header className="flex justify-between items-end">
              <div>
                <h2 className="text-3xl font-extrabold text-gray-800 tracking-tight">Analysis Summary</h2>
                <p className="text-gray-500 font-medium">Dataset Match: <span className="text-blue-600 uppercase font-bold">{result.waste_type}</span></p>
              </div>
              <div className="bg-white px-4 py-2 rounded-lg border border-gray-200 text-xs font-mono text-gray-400 shadow-sm">
                MODEL: RANDOM_FOREST_V2
              </div>
            </header>

            {/* TOP CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <MetricCard 
                title="Total Energy" 
                value={result.total_energy_kwh.toLocaleString()} 
                unit="kWh" 
                icon={Zap} 
                colorClass="bg-blue-500" 
              />
              <MetricCard 
                title="Energy Yield" 
                value={result.energy_per_kg_kwh} 
                unit="kWh/kg" 
                icon={Target} 
                colorClass="bg-purple-500" 
              />
              <MetricCard 
                title="Recommended Strategy" 
                value={result.recommended_method} 
                unit="" 
                icon={Recycle} 
                colorClass="bg-emerald-500" 
              />
            </div>

            {/* CHARTS SECTION */}
<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
  {/* Left: Efficiency Gauge */}
  <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
    <h3 className="font-bold text-gray-700 mb-6 flex items-center">
      <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></span>
      System Efficiency
    </h3>
    <EfficiencyGauge score={result.efficiency_pct} />
  </div>

  {/* Right: NEW Composition Radar Chart */}
  <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
    <h3 className="font-bold text-gray-700 mb-6 flex items-center">
      <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
      Chemical Profile
    </h3>
    <CompositionChart data={formData} />
  </div>
</div>

{/* NEXT ROW: METHOD DETAILS */}
<div className="grid grid-cols-1 gap-8">
  <MethodDetails method={result.recommended_method} />
</div>

            {/* STEP 8: PREDICTED IMPACT SECTION (FOOTER) */}
            <div className="bg-blue-600 rounded-3xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-blue-100">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
                  <Zap size={32} />
                </div>
                <div>
                  <h4 className="text-xl font-bold">Real-World Impact</h4>
                  <p className="text-blue-100 text-sm">Translating energy metrics to utility value.</p>
                </div>
              </div>
              <div className="flex gap-8">
                <div className="text-center">
                  <p className="text-3xl font-bold">{(result.total_energy_kwh / 8).toFixed(0)}</p>
                  <p className="text-xs uppercase tracking-widest opacity-80 font-semibold">Homes Powered/Day</p>
                </div>
                <div className="w-px h-12 bg-white/20"></div>
                <div className="text-center">
                  <p className="text-3xl font-bold">{(result.total_energy_kwh * 0.4).toFixed(1)}</p>
                  <p className="text-xs uppercase tracking-widest opacity-80 font-semibold">kg CO2 Offset</p>
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