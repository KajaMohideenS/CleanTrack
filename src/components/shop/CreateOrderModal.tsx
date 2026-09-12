import React, { useState, useMemo } from 'react';
import { useOrders } from '../../context/OrderContext';
import { ServiceType, SERVICE_OPTIONS } from '../../types/order';
import { estimateReadyTime } from '../../services/aiEstimator';
import { X, Sparkles, Check, AlertCircle } from 'lucide-react';

interface CreateOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateOrderModal: React.FC<CreateOrderModalProps> = ({ isOpen, onClose }) => {
  const { createOrder, orders } = useOrders();

  const [customerName, setCustomerName] = useState('');
  const [customerContact, setCustomerContact] = useState('');
  const [garment, setGarment] = useState('');
  const [service, setService] = useState<ServiceType>('Dry Cleaning');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  // Preview estimation as user fills the form
  const estimationPreview = useMemo(() => {
    if (!garment.trim()) return null;
    return estimateReadyTime({ garment, service }, orders);
  }, [garment, service, orders]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim()) {
      setError('Please enter the customer name');
      return;
    }
    if (!garment.trim()) {
      setError('Please enter the garment description');
      return;
    }

    createOrder({
      customerName: customerName.trim(),
      customerContact: customerContact.trim() || '(555) 000-0000',
      garment: garment.trim(),
      service,
      notes: notes.trim(),
    });

    // Reset & close
    setCustomerName('');
    setCustomerContact('');
    setGarment('');
    setNotes('');
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Create New Counter Order</h2>
            <p className="text-xs text-slate-500">Record customer garment drop-off and initialize tracking</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-700 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="customerNameInput" className="block text-xs font-semibold text-slate-700 mb-1">
                Customer Name <span className="text-red-500">*</span>
              </label>
              <input
                id="customerNameInput"
                type="text"
                required
                value={customerName}
                onChange={(e) => {
                  setCustomerName(e.target.value);
                  setError('');
                }}
                placeholder="e.g. Jordan Miller"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white"
              />
            </div>

            <div>
              <label htmlFor="customerContactInput" className="block text-xs font-semibold text-slate-700 mb-1">
                Contact Phone
              </label>
              <input
                id="customerContactInput"
                type="text"
                value={customerContact}
                onChange={(e) => setCustomerContact(e.target.value)}
                placeholder="e.g. (555) 432-1098"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="garmentInput" className="block text-xs font-semibold text-slate-700 mb-1">
                Garment Description <span className="text-red-500">*</span>
              </label>
              <input
                id="garmentInput"
                type="text"
                required
                value={garment}
                onChange={(e) => {
                  setGarment(e.target.value);
                  setError('');
                }}
                placeholder="e.g. Trench Coat, Silk Dress"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white"
              />
            </div>

            <div>
              <label htmlFor="serviceInput" className="block text-xs font-semibold text-slate-700 mb-1">
                Service Type
              </label>
              <select
                id="serviceInput"
                value={service}
                onChange={(e) => setService(e.target.value as ServiceType)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white cursor-pointer"
              >
                {SERVICE_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* AI Estimate Live Preview Box */}
          {estimationPreview && (
            <div className="p-3 bg-sky-50/70 border border-sky-100 rounded-xl space-y-1">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-sky-800">
                <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                <span>AI Estimated Ready Time: {estimationPreview.estimatedReadyAt}</span>
              </div>
              <p className="text-[11px] text-sky-700 leading-tight">
                {estimationPreview.explanation}
              </p>
            </div>
          )}

          <div>
            <label htmlFor="notesInput" className="block text-xs font-semibold text-slate-700 mb-1">
              Special Handling Notes (Optional)
            </label>
            <textarea
              id="notesInput"
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Stain on left sleeve; delicate lining; wooden hanger."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white resize-none"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <Check className="w-4 h-4" />
              <span>Create Order</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
