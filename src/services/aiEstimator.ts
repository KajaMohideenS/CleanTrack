import { Order, ServiceType } from '../types/order';

export interface EstimationResult {
  estimatedReadyAt: string; // Formatted date/time, e.g. "Today around 6:30 PM"
  estimatedReadyAtISO: string; // ISO string for sorting/data
  estimatedHours: number;
  explanation: string; // Transparent factor explanation
  confidenceLevel: 'Standard Estimate' | 'High Workload Estimate';
  disclaimer: string;
}

/**
 * AI-Assisted Ready-Time Estimation Service (Prototype Local Simulation)
 *
 * NOTE: This is an intentional heuristic simulation designed for this local prototype.
 * It demonstrates the user experience and architectural seam for AI-assisted scheduling
 * without fabricating machine learning claims or querying paid external APIs.
 *
 * It considers:
 * 1. Base duration by Service type
 * 2. Fabric complexity heuristic from garment title
 * 3. Shop queue backlog (active unfinished orders ahead in queue)
 */
export function estimateReadyTime(
  params: {
    garment: string;
    service: ServiceType;
    createdAt?: string;
  },
  existingOrders: Order[] = []
): EstimationResult {
  const baseDate = params.createdAt ? new Date(params.createdAt) : new Date();

  // 1. Base hours per service
  let baseHours = 4;
  switch (params.service) {
    case 'Ironing':
      baseHours = 2;
      break;
    case 'Steam Press':
      baseHours = 3;
      break;
    case 'Washing':
      baseHours = 5;
      break;
    case 'Dry Cleaning':
      baseHours = 6;
      break;
    case 'Other':
      baseHours = 8;
      break;
  }

  // 2. Garment complexity factor (heuristic)
  const garmentLower = params.garment.toLowerCase();
  let complexityAdjustment = 0;
  let complexityReason = 'standard garment profile';

  if (garmentLower.includes('suit') || garmentLower.includes('tuxedo')) {
    complexityAdjustment = 2;
    complexityReason = 'multi-piece tailoring requiring dedicated press';
  } else if (garmentLower.includes('silk') || garmentLower.includes('wool') || garmentLower.includes('cashmere')) {
    complexityAdjustment = 1.5;
    complexityReason = 'delicate fabric requiring low-temp gentle cycle';
  } else if (garmentLower.includes('blazer') || garmentLower.includes('coat') || garmentLower.includes('jacket')) {
    complexityAdjustment = 1;
    complexityReason = 'structured garment requiring form shaping';
  } else if (garmentLower.includes('shirt') || garmentLower.includes('t-shirt')) {
    complexityAdjustment = -0.5;
    complexityReason = 'standard cotton batching';
  }

  // 3. Shop backlog factor (active orders not yet ready)
  const activeOrdersInQueue = existingOrders.filter(
    (o) => o.status === 'RECEIVED' || o.status === 'CLEANING'
  ).length;

  // Add 0.5 hours per 2 queued orders (up to max 4 hours)
  const queueAdjustment = Math.min(4, Math.round(activeOrdersInQueue * 0.4 * 10) / 10);

  const totalHours = Math.max(1, Math.round((baseHours + complexityAdjustment + queueAdjustment) * 10) / 10);

  const targetDate = new Date(baseDate.getTime() + totalHours * 60 * 60 * 1000);

  // Format friendly ready time
  const isToday = targetDate.toDateString() === new Date().toDateString();
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const isTomorrow = targetDate.toDateString() === tomorrow.toDateString();

  const timeString = targetDate.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  let formattedTime = '';
  if (isToday) {
    formattedTime = `Today around ${timeString}`;
  } else if (isTomorrow) {
    formattedTime = `Tomorrow around ${timeString}`;
  } else {
    const dayString = targetDate.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
    formattedTime = `${dayString} around ${timeString}`;
  }

  const queueText = activeOrdersInQueue > 0
    ? `${activeOrdersInQueue} active order${activeOrdersInQueue > 1 ? 's' : ''} in queue`
    : 'clear workshop queue';

  const explanation = `Calculated from ${params.service} protocol, ${complexityReason}, and ${queueText}.`;

  return {
    estimatedReadyAt: formattedTime,
    estimatedReadyAtISO: targetDate.toISOString(),
    estimatedHours: totalHours,
    explanation,
    confidenceLevel: activeOrdersInQueue > 4 ? 'High Workload Estimate' : 'Standard Estimate',
    disclaimer: 'AI-assisted estimate based on workload and garment profile. Actual completion may vary slightly.',
  };
}
