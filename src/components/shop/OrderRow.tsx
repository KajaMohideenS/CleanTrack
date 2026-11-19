import React from 'react';
import { Order, OrderStatus, STATUS_LABELS, STATUS_SEQUENCE } from '../../types/order';
import { useOrders } from '../../context/OrderContext';
import { ChevronRight, ExternalLink, Check, Clock, User, Phone } from 'lucide-react';

interface OrderRowProps {
  order: Order;
}

export const OrderRow: React.FC<OrderRowProps> = ({ order }) => {
  const { updateOrderStatus, setSelectedOrderId, setActiveView } = useOrders();

  const currentIndex = STATUS_SEQUENCE.indexOf(order.status);
  const nextStatus = currentIndex < STATUS_SEQUENCE.length - 1 ? STATUS_SEQUENCE[currentIndex + 1] : null;

  const handleAdvance = () => {
    if (nextStatus) {
      updateOrderStatus(order.id, nextStatus);
    }
  };

  const handleTrackAsCustomer = () => {
    setSelectedOrderId(order.id);
    setActiveView('customer');
  };

  // Badge color helper
  const getBadgeStyle = (status: OrderStatus) => {
    switch (status) {
      case 'RECEIVED':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'CLEANING':
        return 'bg-sky-50 text-sky-800 border-sky-200';
      case 'QUALITY_CHECK':
        return 'bg-purple-50 text-purple-800 border-purple-200';
      case 'READY_FOR_PICKUP':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'COLLECTED':
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs hover:border-slate-300 transition-all space-y-3">
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <span className="font-mono font-bold text-sm bg-slate-100 text-slate-800 px-2 py-0.5 rounded border border-slate-200">
            #{order.id}
          </span>
          <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${getBadgeStyle(order.status)}`}>
            {STATUS_LABELS[order.status]}
          </span>
          {order.status === 'READY_FOR_PICKUP' && order.readySince && (
            <span className="text-[11px] text-emerald-700 font-medium hidden sm:inline">
              (Ready since {order.readySince})
            </span>
          )}
        </div>

        {/* View in customer tracker shortcut */}
        <button
          onClick={handleTrackAsCustomer}
          className="inline-flex items-center gap-1 text-xs text-sky-600 hover:text-sky-800 font-medium self-start sm:self-auto"
        >
          <span>View Customer Screen</span>
          <ExternalLink className="w-3 h-3" />
        </button>
      </div>

      {/* Details Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs text-slate-600">
        <div>
          <span className="font-semibold text-slate-900 text-sm block">{order.garment}</span>
          <span className="text-slate-500 font-medium">{order.service}</span>
        </div>

        <div className="space-y-0.5">
          <div className="flex items-center gap-1.5 text-slate-700">
            <User className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-medium">{order.customerName}</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-500">
            <Phone className="w-3.5 h-3.5 text-slate-400" />
            <span>{order.customerContact}</span>
          </div>
        </div>

        <div>
          {order.status === 'READY_FOR_PICKUP' ? (
            <div className="text-emerald-700 font-semibold flex items-center gap-1">
              <Check className="w-3.5 h-3.5" />
              <span>Ready for collection</span>
            </div>
          ) : order.status === 'COLLECTED' ? (
            <div className="text-slate-500 italic">
              Order collected {order.collectedAt ? `at ${order.collectedAt}` : ''}
            </div>
          ) : (
            <div className="space-y-0.5">
              <div className="flex items-center gap-1 text-slate-700 font-medium">
                <Clock className="w-3.5 h-3.5 text-sky-600" />
                <span>Est: {order.estimatedReadyAt}</span>
              </div>
              {order.notes && (
                <p className="text-[11px] text-slate-500 italic truncate max-w-xs" title={order.notes}>
                  Note: {order.notes}
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Action Stepper Bar */}
      <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
        {/* Status Dropdown selector for complete flexibility */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500 font-medium">Set Status:</span>
          <select
            value={order.status}
            onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
            className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-sky-500 cursor-pointer"
          >
            {STATUS_SEQUENCE.map((s) => (
              <option key={s} value={s}>
                {STATUS_LABELS[s]}
              </option>
            ))}
          </select>
        </div>

        {/* Primary 1-Click Quick Advance Button */}
        {nextStatus && (
          <button
            onClick={handleAdvance}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg shadow-2xs transition-all flex items-center gap-1.5 ${
              nextStatus === 'READY_FOR_PICKUP'
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                : nextStatus === 'COLLECTED'
                ? 'bg-slate-800 hover:bg-slate-900 text-white'
                : 'bg-sky-600 hover:bg-sky-700 text-white'
            }`}
          >
            <span>Advance to {STATUS_LABELS[nextStatus]}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
