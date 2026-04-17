import React from 'react';
import { BookOpen, AlertCircle } from 'lucide-react';

const methodInfo = {
  "Incineration": "Best for high-volume, non-recyclable MSW. Uses high-temperature combustion to create steam for electricity.",
  "Anaerobic Digestion": "Ideal for high-moisture organic waste. Microorganisms break down material to produce biogas.",
  "Pyrolysis": "Thermal decomposition in the absence of oxygen. Produces bio-oil and syngas with high efficiency.",
  "Gasification": "Converts carbonaceous materials into syngas using limited oxygen/steam. Highly efficient for biomass.",
  "Default": "Selection based on chemical composition and moisture optimization."
};

const MethodDetails = ({ method }) => {
  const description = methodInfo[method] || methodInfo["Default"];

  return (
    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
      <div className="flex items-center space-x-2 text-blue-600 mb-3">
        <BookOpen size={20} />
        <h4 className="font-bold">Process Explanation</h4>
      </div>
      <p className="text-gray-600 text-sm leading-relaxed mb-4">
        {description}
      </p>
      <div className="bg-amber-50 p-3 rounded-xl flex items-start space-x-2 border border-amber-100">
        <AlertCircle size={16} className="text-amber-600 mt-0.5" />
        <p className="text-xs text-amber-800 italic">
          Note: This recommendation focuses on maximizing the HHV (Higher Heating Value) conversion.
        </p>
      </div>
    </div>
  );
};

export default MethodDetails;