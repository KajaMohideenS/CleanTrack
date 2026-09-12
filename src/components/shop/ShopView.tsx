import React, { useState } from 'react';
import { useOrders } from '../../context/OrderContext';
import { OrderMetrics } from './OrderMetrics';
import { OrderRow } from './OrderRow';
import { CreateOrderModal } from './CreateOrderModal';
import { Plus, RotateCcw, Filter, Layers } from 'lucide-react';

export const ShopView: React.FC = () => {
  const { orders, resetDemoData } = useOrders();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'READY' | 'COLLECTED'>('ALL');

  const filteredOrders = orders.filter((order) => {
    if (statusFilter === 'ALL') return true;
    if (statusFilter === 'ACTIVE') {
      return order.status === 'RECEIVED' || order.status === 'CLEANING' || order.status === 'QUALITY_CHECK';
    }
    if (statusFilter === 'READY') return order.status === 'READY_FOR_PICKUP';
    if (statusFilter === 'COLLECTED') return order.status === 'COLLECTED';
    return true;
  });

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 sm:py-10 space-y-6">
      {/* Shop Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Counter Order Management
            </h1>
            <span className="text-[10px] font-semibold uppercase bg-amber-100 text-amber-900 px-2 py-0.5 rounded border border-amber-200">
              Shop Demo Mode
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage garment queue, advance processing stages, and test live customer tracking updates.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => {
              if (window.confirm('Reset demo orders to initial state (DC1024 Cleaning, DC1025 Ready, DC1026 Received)?')) {
                resetDemoData();
              }
            }}
            className="px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 transition-colors shadow-2xs flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span>Reset Demo</span>
          </button>

          <button
            onClick={() => setIsCreateOpen(true)}
            className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold rounded-xl transition-all shadow-xs flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>New Order</span>
          </button>
        </div>
      </div>

      {/* Summary Metrics */}
      <OrderMetrics orders={orders} />

      {/* Filter and Order List Container */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <span className="text-xs font-medium text-slate-400 mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3" /> Filter:
            </span>
            {(['ALL', 'ACTIVE', 'READY', 'COLLECTED'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setStatusFilter(filter)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                  statusFilter === filter
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {filter === 'ALL'
                  ? `All Orders (${orders.length})`
                  : filter === 'ACTIVE'
                  ? 'In Progress'
                  : filter === 'READY'
                  ? 'Ready for Pickup'
                  : 'Collected'}
              </button>
            ))}
          </div>

          <span className="text-xs text-slate-400 font-medium self-end sm:self-auto">
            Showing {filteredOrders.length} order{filteredOrders.length === 1 ? '' : 's'}
          </span>
        </div>

        {/* Order Cards List */}
        {filteredOrders.length > 0 ? (
          <div className="space-y-3">
            {filteredOrders.map((order) => (
              <OrderRow key={order.id} order={order} />
            ))}
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-xl p-8 text-center space-y-2">
            <Layers className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-sm font-semibold text-slate-700">No orders in this view</p>
            <p className="text-xs text-slate-400">Try changing the filter or create a new counter order.</p>
          </div>
        )}
      </div>

      {/* Create Order Modal */}
      <CreateOrderModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
    </div>
  );
};
