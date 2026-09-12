import React from 'react';
import { useOrders } from '../../context/OrderContext';
import { Sparkles, Store, Search, RotateCcw } from 'lucide-react';

export const Header: React.FC = () => {
  const { activeView, setActiveView, resetDemoData } = useOrders();

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo & Product Title */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-sky-600 flex items-center justify-center text-white shadow-xs">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 text-lg tracking-tight">CleanTrack</span>
              <span className="text-[10px] font-semibold uppercase tracking-wider bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded border border-slate-200">
                Prototype
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">Local Dry Cleaning & Laundry Tracker</p>
          </div>
        </div>

        {/* View / Mode Switcher */}
        <div className="flex items-center gap-2 sm:gap-3">
          <nav aria-label="Demo Views" className="bg-slate-100 p-1 rounded-lg flex items-center border border-slate-200">
            <button
              onClick={() => setActiveView('customer')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-all ${
                activeView === 'customer'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              aria-current={activeView === 'customer' ? 'page' : undefined}
            >
              <Search className="w-3.5 h-3.5" />
              <span>Customer</span>
            </button>
            <button
              onClick={() => setActiveView('shop')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-all ${
                activeView === 'shop'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              aria-current={activeView === 'shop' ? 'page' : undefined}
            >
              <Store className="w-3.5 h-3.5" />
              <span>Shop Demo</span>
            </button>
          </nav>

          {/* Quick Reset Demo Button in Header for easy testing/demo */}
          <button
            onClick={() => {
              if (window.confirm('Reset all demo orders back to default starting states?')) {
                resetDemoData();
              }
            }}
            title="Reset demo data to initial state"
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors border border-transparent hover:border-slate-200"
            aria-label="Reset demo data"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
