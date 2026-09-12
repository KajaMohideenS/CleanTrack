import React from 'react';
import { OrderStatus, STATUS_SEQUENCE, STATUS_LABELS, getStepState } from '../../types/order';
import { Check } from 'lucide-react';

interface StatusTimelineProps {
  currentStatus: OrderStatus;
}

export const StatusTimeline: React.FC<StatusTimelineProps> = ({ currentStatus }) => {
  return (
    <div className="w-full py-4">
      {/* Horizontal Progress bar on medium+ screens, responsive vertical stack on small screens */}
      <div className="hidden sm:block">
        <div className="relative flex items-center justify-between">
          {/* Background Track Line */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 w-full bg-slate-200 z-0" />

          {/* Dynamic Active Fill Track */}
          {(() => {
            const activeIdx = STATUS_SEQUENCE.indexOf(currentStatus);
            const percent = currentStatus === 'COLLECTED' ? 100 : (activeIdx / (STATUS_SEQUENCE.length - 1)) * 100;
            return (
              <div
                className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-sky-600 transition-all duration-500 ease-out z-0"
                style={{ width: `${percent}%` }}
              />
            );
          })()}

          {STATUS_SEQUENCE.map((status, index) => {
            const state = getStepState(status, currentStatus);
            const label = STATUS_LABELS[status];

            return (
              <div key={status} className="relative z-10 flex flex-col items-center group">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                    state === 'completed'
                      ? 'bg-sky-600 text-white shadow-xs'
                      : state === 'current'
                      ? 'bg-white border-2 border-sky-600 text-sky-700 shadow-md ring-4 ring-sky-100'
                      : 'bg-white border-2 border-slate-300 text-slate-400'
                  }`}
                  aria-label={`Step ${index + 1}: ${label} (${state})`}
                >
                  {state === 'completed' ? (
                    <Check className="w-4 h-4 stroke-[2.5]" />
                  ) : state === 'current' ? (
                    <span className="w-2.5 h-2.5 rounded-full bg-sky-600 animate-pulse" />
                  ) : (
                    <span className="text-xs font-semibold text-slate-400">{index + 1}</span>
                  )}
                </div>

                <div className="absolute top-10 flex flex-col items-center w-28 text-center">
                  <span
                    className={`text-xs tracking-tight ${
                      state === 'current'
                        ? 'font-bold text-sky-950'
                        : state === 'completed'
                        ? 'font-semibold text-slate-700'
                        : 'font-normal text-slate-400'
                    }`}
                  >
                    {label}
                  </span>
                  {state === 'current' && (
                    <span className="text-[10px] font-medium text-sky-600 mt-0.5 bg-sky-50 px-1.5 py-0.2 rounded">
                      Current
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        {/* Spacer for bottom labels */}
        <div className="h-10" />
      </div>

      {/* Vertical Timeline on Mobile Screens */}
      <div className="sm:hidden space-y-4 relative">
        <div className="absolute left-4 top-3 bottom-3 w-0.5 bg-slate-200 -translate-x-1/2 z-0" />

        {STATUS_SEQUENCE.map((status, index) => {
          const state = getStepState(status, currentStatus);
          const label = STATUS_LABELS[status];

          return (
            <div key={status} className="relative z-10 flex items-start gap-3.5">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all ${
                  state === 'completed'
                    ? 'bg-sky-600 text-white shadow-xs'
                    : state === 'current'
                    ? 'bg-white border-2 border-sky-600 text-sky-700 shadow-md ring-4 ring-sky-100'
                    : 'bg-white border-2 border-slate-300 text-slate-400'
                }`}
              >
                {state === 'completed' ? (
                  <Check className="w-4 h-4 stroke-[2.5]" />
                ) : state === 'current' ? (
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-600 animate-pulse" />
                ) : (
                  <span className="text-xs font-semibold text-slate-400">{index + 1}</span>
                )}
              </div>

              <div className="pt-1 flex-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-sm ${
                      state === 'current'
                        ? 'font-bold text-sky-950'
                        : state === 'completed'
                        ? 'font-semibold text-slate-800'
                        : 'text-slate-400 font-normal'
                    }`}
                  >
                    {label}
                  </span>
                  {state === 'current' && (
                    <span className="text-[10px] font-semibold text-sky-700 bg-sky-100 px-2 py-0.5 rounded-full">
                      In Progress
                    </span>
                  )}
                  {state === 'completed' && (
                    <span className="text-[10px] font-medium text-slate-400">Completed</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
