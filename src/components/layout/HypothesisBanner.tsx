import React, { useState } from 'react';
import { Info, ChevronDown, ChevronUp, AlertCircle, FlaskConical } from 'lucide-react';

export const HypothesisBanner: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-amber-50/90 border-b border-amber-200/80 text-amber-900 text-xs px-4 py-2">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 font-semibold px-2 py-0.5 rounded bg-amber-200/80 text-amber-900 text-[11px] tracking-wide uppercase">
            <FlaskConical className="w-3.5 h-3.5" /> Working Hypothesis
          </span>
          <span className="font-medium text-amber-950">
            Project Better Tomorrow • Design Thinking Prototype Phase (Pre-Field Visit)
          </span>
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center gap-1 font-medium text-amber-800 hover:text-amber-950 underline underline-offset-2 transition-colors focus:outline-none focus:ring-1 focus:ring-amber-500 rounded"
        >
          {isOpen ? 'Hide Research Notice' : 'View Academic Research Context'}
          {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {isOpen && (
        <div className="max-w-5xl mx-auto mt-2 pt-2 border-t border-amber-200 text-amber-900 leading-relaxed text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="font-semibold flex items-center gap-1.5 text-amber-950">
                <AlertCircle className="w-3.5 h-3.5 text-amber-700" /> Pre-Research Working Hypothesis
              </p>
              <p className="text-amber-800">
                "Customers experience uncertainty regarding garment status after leaving items at local cleaners, while shop staff rely on manual tracking."
              </p>
            </div>
            <div className="space-y-1">
              <p className="font-semibold flex items-center gap-1.5 text-amber-950">
                <Info className="w-3.5 h-3.5 text-amber-700" /> Academic & Design Thinking Integrity
              </p>
              <p className="text-amber-800">
                This prototype has <strong>not yet undergone field validation</strong>. Actual user interviews and shop observations will follow. Problem definitions and features will adapt based on empirical evidence.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
