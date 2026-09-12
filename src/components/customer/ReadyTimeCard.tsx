import React from 'react';
import { Order } from '../../types/order';
import { Clock, CheckCircle2, PackageCheck, Sparkles, MapPin, AlertCircle } from 'lucide-react';

interface ReadyTimeCardProps {
  order: Order;
}

export const ReadyTimeCard: React.FC<ReadyTimeCardProps> = ({ order }) => {
  const { status, estimatedReadyAt, readySince, collectedAt, estimationReason } = order;

  // 1. When READY_FOR_PICKUP:
  // Hard Rule: NEVER show Estimated Ready Time here!
  if (status === 'READY_FOR_PICKUP') {
    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 sm:p-6 text-emerald-950 shadow-xs">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 bg-emerald-100 rounded-lg text-emerald-700 shrink-0">
            <CheckCircle2 className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div className="space-y-1">
            <span className="text-xs uppercase tracking-wider font-semibold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded">
              Ready For Collection
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-emerald-950 pt-1">
              Your order is ready for pickup.
            </h3>
            {readySince && (
              <p className="text-sm text-emerald-800 font-medium">
                Ready since {readySince}
              </p>
            )}
            <p className="text-xs text-emerald-700 pt-2 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              Available for pickup at main shop counter. Present Order #{order.id} upon arrival.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 2. When COLLECTED:
  // Hard Rule: NEVER show Estimated Ready Time here!
  if (status === 'COLLECTED') {
    return (
      <div className="bg-slate-100 border border-slate-200 rounded-xl p-5 sm:p-6 text-slate-800 shadow-xs">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 bg-slate-200 rounded-lg text-slate-700 shrink-0">
            <PackageCheck className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <span className="text-xs uppercase tracking-wider font-semibold text-slate-600 bg-slate-200 px-2 py-0.5 rounded">
              Completed
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 pt-1">
              Order collected
            </h3>
            <p className="text-sm text-slate-600">
              This order has been handed over and completed{collectedAt ? ` (${collectedAt})` : ''}.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 3. For In-Progress states (RECEIVED, CLEANING, QUALITY_CHECK):
  // Estimated Ready Time is displayed.
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2 text-slate-600">
          <Clock className="w-4 h-4 text-sky-600" />
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Estimated Ready Time
          </span>
        </div>

        {/* Subtle AI indicator pill */}
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-sky-50 border border-sky-100 rounded-full text-[11px] font-medium text-sky-700 w-fit">
          <Sparkles className="w-3 h-3 text-sky-600" />
          <span>AI estimated ready time</span>
        </div>
      </div>

      <div>
        <div className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          {estimatedReadyAt || 'Calculating estimate...'}
        </div>
        
        {status === 'QUALITY_CHECK' && (
          <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-50 border border-amber-200 text-amber-900 text-xs font-medium">
            <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
            <span>Garment is undergoing final pressing and inspection — almost ready!</span>
          </div>
        )}

        <p className="mt-2 text-xs text-slate-500 leading-relaxed">
          {estimationReason || 'Based on garment type, service and current workload.'}
        </p>
        <p className="text-[11px] text-slate-400 italic mt-1">
          * Transparent prototype estimate based on simulated queue length & garment profile. Not a guarantee.
        </p>
      </div>
    </div>
  );
};
