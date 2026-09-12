import React, { useState } from 'react';
import { useOrders } from '../../context/OrderContext';
import { StatusTimeline } from './StatusTimeline';
import { ReadyTimeCard } from './ReadyTimeCard';
import { STATUS_LABELS } from '../../types/order';
import { Search, Tag, FileText, AlertCircle, ArrowRight } from 'lucide-react';

export const CustomerView: React.FC = () => {
  const { orders, selectedOrderId, setSelectedOrderId, getOrder } = useOrders();
  const [searchInput, setSearchInput] = useState(selectedOrderId);
  const [hasSearched, setHasSearched] = useState(true);

  const currentOrder = getOrder(selectedOrderId);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    const formatted = searchInput.trim().toUpperCase();
    setSelectedOrderId(formatted);
    setHasSearched(true);
  };

  const handleQuickSelect = (id: string) => {
    setSearchInput(id);
    setSelectedOrderId(id);
    setHasSearched(true);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 sm:py-12 space-y-8">
      {/* Hero / Intro */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          Track Your Garment Order
        </h1>
        <p className="text-sm text-slate-500 max-w-md mx-auto">
          Enter your receipt order number below to check real-time workshop progress and estimated completion.
        </p>
      </div>

      {/* Search Input Box */}
      <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value.toUpperCase())}
              placeholder="e.g. DC1024"
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm font-semibold tracking-wider placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all uppercase"
              aria-label="Order Tracking ID"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold rounded-xl transition-all shadow-xs shrink-0 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 flex items-center gap-1.5"
          >
            <span>Track</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Demo Selector Chips for easy 2-minute evaluation */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs text-slate-500">
          <span className="font-medium text-slate-400">Demo orders:</span>
          {orders.slice(0, 4).map((o) => (
            <button
              key={o.id}
              onClick={() => handleQuickSelect(o.id)}
              className={`px-2.5 py-1 rounded-lg border text-xs font-medium transition-all ${
                selectedOrderId === o.id
                  ? 'bg-sky-50 border-sky-300 text-sky-800 font-semibold'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
            >
              #{o.id} ({o.garment})
            </button>
          ))}
        </div>
      </div>

      {/* Order Status Display Card */}
      {currentOrder ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100">
          {/* Order Header Summary */}
          <div className="p-5 sm:p-6 bg-gradient-to-b from-slate-50/70 to-white">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-sky-700 bg-sky-100/70 px-2 py-0.5 rounded tracking-wider">
                    ORDER #{currentOrder.id}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    {new Date(currentOrder.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mt-1">
                  {currentOrder.garment}
                </h2>
                <div className="flex items-center gap-3 mt-1 text-xs text-slate-500 font-medium">
                  <span className="flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5 text-slate-400" />
                    {currentOrder.service}
                  </span>
                  <span>•</span>
                  <span>Customer: {currentOrder.customerName}</span>
                </div>
              </div>

              {/* Status Badge */}
              <div className="sm:text-right">
                <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 block mb-0.5">
                  Current Status
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-slate-900 text-white">
                  {STATUS_LABELS[currentOrder.status]}
                </span>
              </div>
            </div>
          </div>

          {/* Real State Machine Progress Timeline */}
          <div className="p-5 sm:p-6 bg-white">
            <h3 className="text-xs uppercase tracking-wider font-semibold text-slate-400 mb-2">
              Progress Timeline
            </h3>
            <StatusTimeline currentStatus={currentOrder.status} />
          </div>

          {/* AI Estimate & Pickup Information */}
          <div className="p-5 sm:p-6 bg-slate-50/50">
            <ReadyTimeCard order={currentOrder} />

            {/* Special Instructions / Notes */}
            {currentOrder.notes && (
              <div className="mt-4 pt-4 border-t border-slate-200/70 flex items-start gap-2.5 text-xs text-slate-600">
                <FileText className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-700">Special Care Note: </span>
                  <span className="text-slate-600">{currentOrder.notes}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : hasSearched ? (
        /* Error / Not Found State */
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
            <AlertCircle className="w-6 h-6 text-slate-500" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Order Not Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
            We couldn't locate an order with ID <span className="font-semibold text-slate-700">"{selectedOrderId}"</span>. Please check the receipt paper ticket handed to you by the counter staff.
          </p>
          <div className="pt-2">
            <button
              onClick={() => handleQuickSelect('DC1024')}
              className="text-xs font-semibold text-sky-600 hover:text-sky-800 underline underline-offset-2"
            >
              Try demo order DC1024 instead
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
};
