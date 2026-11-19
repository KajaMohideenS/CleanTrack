import React from 'react';
import { Order } from '../../types/order';
import { Package, Clock, CheckCircle2, Archive } from 'lucide-react';

interface OrderMetricsProps {
  orders: Order[];
}

export const OrderMetrics: React.FC<OrderMetricsProps> = ({ orders }) => {
  const total = orders.length;
  const inProgress = orders.filter(
    (o) => o.status === 'RECEIVED' || o.status === 'CLEANING' || o.status === 'QUALITY_CHECK'
  ).length;
  const ready = orders.filter((o) => o.status === 'READY_FOR_PICKUP').length;
  const collected = orders.filter((o) => o.status === 'COLLECTED').length;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between text-slate-500 mb-1">
          <span className="text-xs font-semibold uppercase tracking-wider">Today's Orders</span>
          <Package className="w-4 h-4 text-slate-400" />
        </div>
        <div className="text-2xl font-bold text-slate-900">{total}</div>
        <div className="text-[11px] text-slate-400 mt-0.5">Active shop batch</div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between text-sky-700 mb-1">
          <span className="text-xs font-semibold uppercase tracking-wider">In Progress</span>
          <Clock className="w-4 h-4 text-sky-600" />
        </div>
        <div className="text-2xl font-bold text-sky-950">{inProgress}</div>
        <div className="text-[11px] text-slate-400 mt-0.5">Washing & quality check</div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-emerald-200 shadow-xs bg-emerald-50/20">
        <div className="flex items-center justify-between text-emerald-700 mb-1">
          <span className="text-xs font-semibold uppercase tracking-wider">Ready for Pickup</span>
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
        </div>
        <div className="text-2xl font-bold text-emerald-950">{ready}</div>
        <div className="text-[11px] text-emerald-600/90 mt-0.5">Awaiting customer collection</div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between text-slate-500 mb-1">
          <span className="text-xs font-semibold uppercase tracking-wider">Collected</span>
          <Archive className="w-4 h-4 text-slate-400" />
        </div>
        <div className="text-2xl font-bold text-slate-700">{collected}</div>
        <div className="text-[11px] text-slate-400 mt-0.5">Finished today</div>
      </div>
    </div>
  );
};
