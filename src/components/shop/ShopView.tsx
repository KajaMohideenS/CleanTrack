import React, { useState } from 'react';
import { useOrders } from '../../context/OrderContext';
import { OrderMetrics } from './OrderMetrics';
import { OrderRow } from './OrderRow';
import { CreateOrderModal } from './CreateOrderModal';
import { Plus, RotateCcw, Filter, Layers, Search, SlidersHorizontal, Download } from 'lucide-react';

export const ShopView: React.FC = () => {
  const { orders, resetDemoData } = useOrders();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'READY' | 'COLLECTED'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [serviceFilter, setServiceFilter] = useState('ALL');

  const exportOrders = () => {
    const columns = ['Order ID', 'Customer', 'Contact', 'Garment', 'Service', 'Status', 'Created At', 'Estimated Ready'];
    const escapeCell = (value: string) => `\"${String(value ?? '').replace(/\"/g, '\"\"')}\"`;
    const rows = orders.map((order) => [order.id, order.customerName, order.customerContact, order.garment, order.service, order.status, order.createdAt, order.estimatedReadyAt]);
    const csv = [columns, ...rows].map((row) => row.map((cell) => escapeCell(String(cell))).join(',')).join('\n');
    const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url; link.download = `cleantrack-orders-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link); link.click(); link.remove(); URL.revokeObjectURL(url);
  };

  const filteredOrders = orders.filter((order) => {
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch = !query || [order.id, order.customerName, order.customerContact, order.garment]
      .some((value) => value.toLowerCase().includes(query));
    const matchesService = serviceFilter === 'ALL' || order.service === serviceFilter;
    if (!matchesSearch || !matchesService) return false;
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

          <button onClick={exportOrders}
            className="px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 transition-colors flex items-center gap-1.5">
            <Download className="w-3.5 h-3.5" /><span>Export CSV</span>
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

      {/* Search and service filters */}
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_220px] gap-3">
        <label className="relative block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search by order ID, customer, phone or garment"
            aria-label="Search orders"
            className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500" />
        </label>
        <label className="relative">
          <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <select value={serviceFilter} onChange={(event) => setServiceFilter(event.target.value)}
            aria-label="Filter by service"
            className="w-full appearance-none pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500">
            <option value="ALL">All services</option>
            <option>Dry Cleaning</option><option>Washing</option><option>Ironing</option><option>Steam Press</option><option>Other</option>
          </select>
        </label>
      </div>

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
            <p className="text-xs text-slate-400">Try another search, clear a filter or create a new counter order.</p>
            {(searchQuery || serviceFilter !== 'ALL') && <button onClick={() => { setSearchQuery(''); setServiceFilter('ALL'); setStatusFilter('ALL'); }} className="mt-2 text-xs font-semibold text-sky-700 hover:text-sky-900">Clear all filters</button>}
          </div>
        )}
      </div>

      {/* Create Order Modal */}
      <CreateOrderModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
    </div>
  );
};
