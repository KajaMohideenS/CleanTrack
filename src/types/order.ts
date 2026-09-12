export type OrderStatus =
  | 'RECEIVED'
  | 'CLEANING'
  | 'QUALITY_CHECK'
  | 'READY_FOR_PICKUP'
  | 'COLLECTED';

export type ServiceType =
  | 'Dry Cleaning'
  | 'Washing'
  | 'Ironing'
  | 'Steam Press'
  | 'Other';

export interface Order {
  id: string;
  customerName: string;
  customerContact: string;
  garment: string;
  service: ServiceType;
  notes?: string;
  status: OrderStatus;
  createdAt: string;
  estimatedReadyAt: string;
  readySince?: string;
  collectedAt?: string;
  estimatedDurationHours?: number;
  estimationReason?: string;
}

export const STATUS_SEQUENCE: readonly OrderStatus[] = [
  'RECEIVED',
  'CLEANING',
  'QUALITY_CHECK',
  'READY_FOR_PICKUP',
  'COLLECTED',
] as const;

export const STATUS_LABELS: Record<OrderStatus, string> = {
  RECEIVED: 'Received',
  CLEANING: 'Cleaning',
  QUALITY_CHECK: 'Quality Check',
  READY_FOR_PICKUP: 'Ready for Pickup',
  COLLECTED: 'Collected',
};

export const STATUS_DESCRIPTIONS: Record<OrderStatus, string> = {
  RECEIVED: 'Garment received and inspected at our workshop counter.',
  CLEANING: 'Garment is undergoing careful treatment and cleaning.',
  QUALITY_CHECK: 'Undergoing final detail inspection and pressing. Almost ready!',
  READY_FOR_PICKUP: 'Your order is ready for pickup.',
  COLLECTED: 'Order collected.',
};

export const SERVICE_OPTIONS: ServiceType[] = [
  'Dry Cleaning',
  'Washing',
  'Ironing',
  'Steam Press',
  'Other',
];

/**
 * Helper to determine progression state of a step relative to the current status
 */
export function getStepState(stepStatus: OrderStatus, currentStatus: OrderStatus): 'completed' | 'current' | 'future' {
  if (currentStatus === 'COLLECTED') {
    return 'completed';
  }
  const stepIndex = STATUS_SEQUENCE.indexOf(stepStatus);
  const currentIndex = STATUS_SEQUENCE.indexOf(currentStatus);

  if (stepIndex < currentIndex) return 'completed';
  if (stepIndex === currentIndex) return 'current';
  return 'future';
}

/**
 * Determine if estimated ready time should be displayed.
 * CRITICAL UX RULE:
 * Show estimated ready time ONLY for RECEIVED, CLEANING, and QUALITY_CHECK.
 * NEVER show estimated ready time for READY_FOR_PICKUP or COLLECTED.
 */
export function shouldShowEstimatedTime(status: OrderStatus): boolean {
  return status === 'RECEIVED' || status === 'CLEANING' || status === 'QUALITY_CHECK';
}
