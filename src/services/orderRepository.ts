import { Order, OrderStatus } from '../types/order';
import { estimateReadyTime } from './aiEstimator';

const STORAGE_KEY = 'cleantrack_orders_v1';

function isValidOrder(value: unknown): value is Order {
  if (!value || typeof value !== 'object') return false;
  const order = value as Partial<Order>;
  return typeof order.id === 'string' && order.id.trim().length > 0
    && typeof order.customerName === 'string' && typeof order.customerContact === 'string'
    && typeof order.garment === 'string' && typeof order.service === 'string'
    && typeof order.status === 'string' && ['RECEIVED', 'CLEANING', 'QUALITY_CHECK', 'READY_FOR_PICKUP', 'COLLECTED'].includes(order.status)
    && typeof order.createdAt === 'string';
}

function createUniqueOrderId(orders: Order[]): string {
  let id = '';
  do { id = `DC${Math.floor(1000 + Math.random() * 9000)}`; }
  while (orders.some((order) => order.id.toUpperCase() === id));
  return id;
}

export function getInitialDemoOrders(): Order[] {
  const now = new Date();

  return [
    {
      id: 'DC1024',
      customerName: 'Marcus Vance',
      customerContact: '(555) 234-5678',
      garment: 'Blazer',
      service: 'Dry Cleaning',
      notes: 'Delicate horn buttons — use protective foil wraps.',
      status: 'CLEANING',
      createdAt: new Date(now.getTime() - 2.5 * 3600 * 1000).toISOString(),
      estimatedReadyAt: 'Today around 6:30 PM',
      estimationReason: 'Based on Dry Cleaning service, structured garment shaping, and 2 orders ahead in queue.',
    },
    {
      id: 'DC1025',
      customerName: 'Elena Rostova',
      customerContact: '(555) 876-5432',
      garment: 'Suit',
      service: 'Dry Cleaning',
      notes: 'Press lapels with sharp crease; wooden hanger requested.',
      status: 'READY_FOR_PICKUP',
      createdAt: new Date(now.getTime() - 6 * 3600 * 1000).toISOString(),
      estimatedReadyAt: '', // HARD UX RULE: MUST NOT have estimated ready time once ready for pickup
      readySince: '3:15 PM',
      estimationReason: '',
    },
    {
      id: 'DC1026',
      customerName: 'David Kim',
      customerContact: '(555) 345-6789',
      garment: '3 Shirts',
      service: 'Ironing',
      notes: 'Medium starch on collar and cuffs.',
      status: 'RECEIVED',
      createdAt: new Date(now.getTime() - 0.5 * 3600 * 1000).toISOString(),
      estimatedReadyAt: 'Today around 5:00 PM',
      estimationReason: 'Based on Ironing service, standard garment batching, and clear workshop queue.',
    },
  ];
}

class OrderRepository {
  private listeners: Set<() => void> = new Set();

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', (e) => {
        if (e.key === STORAGE_KEY) {
          this.notifyListeners();
        }
      });
    }
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach((fn) => fn());
  }

  public getOrders(): Order[] {
    if (typeof window === 'undefined') return getInitialDemoOrders();
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial = getInitialDemoOrders();
      this.saveOrders(initial);
      return initial;
    }
    try {
      const parsed: unknown = JSON.parse(raw);
      if (!Array.isArray(parsed)) throw new Error('Stored orders are not an array');
      const validOrders = parsed.filter(isValidOrder);
      // Recover valid records instead of discarding the entire collection.
      if (validOrders.length !== parsed.length) this.saveOrders(validOrders);
      return validOrders;
    } catch {
      const initial = getInitialDemoOrders();
      this.saveOrders(initial);
      return initial;
    }
  }

  public saveOrders(orders: Order[]): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
      this.notifyListeners();
    } catch (error) {
      console.error('CleanTrack could not save orders to browser storage.', error);
      throw new Error('Your browser could not save this order. Check available storage and try again.');
    }
  }

  public getOrderById(id: string): Order | undefined {
    const trimmedId = id.trim().toUpperCase();
    return this.getOrders().find((o) => o.id.toUpperCase() === trimmedId);
  }

  public updateOrderStatus(id: string, newStatus: OrderStatus): Order | undefined {
    const orders = this.getOrders();
    const index = orders.findIndex((o) => o.id.toUpperCase() === id.toUpperCase());
    if (index === -1) return undefined;

    const currentOrder = orders[index];
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

    const updated: Order = {
      ...currentOrder,
      status: newStatus,
    };

    if (newStatus === 'READY_FOR_PICKUP') {
      // Hard UX Rule: Blank out estimatedReadyAt and set readySince
      updated.readySince = timeStr;
      updated.collectedAt = undefined;
      updated.estimatedReadyAt = '';
      updated.estimationReason = '';
    } else if (newStatus === 'COLLECTED') {
      // Hard UX Rule: Blank out estimatedReadyAt and record collected timestamp
      updated.collectedAt = timeStr;
      updated.estimatedReadyAt = '';
      updated.estimationReason = '';
    } else if (newStatus === 'RECEIVED' || newStatus === 'CLEANING' || newStatus === 'QUALITY_CHECK') {
      // For in-progress states (including if moving backwards in a demo)
      updated.readySince = undefined;
      updated.collectedAt = undefined;

      const est = estimateReadyTime(
        { garment: updated.garment, service: updated.service, createdAt: updated.createdAt },
        orders
      );
      updated.estimatedReadyAt = est.estimatedReadyAt;
      updated.estimationReason = est.explanation;
    }

    orders[index] = updated;
    this.saveOrders(orders);
    return updated;
  }

  public createOrder(newOrderData: Omit<Order, 'id' | 'status' | 'createdAt' | 'estimatedReadyAt'> & { id?: string }): Order {
    const orders = this.getOrders();
    const requestedId = newOrderData.id?.trim().toUpperCase();
    if (!newOrderData.customerName.trim()) throw new Error('Customer name is required.');
    if (!newOrderData.customerContact.trim()) throw new Error('Customer contact is required.');
    if (!newOrderData.garment.trim()) throw new Error('Garment details are required.');
    if (requestedId && orders.some((order) => order.id.toUpperCase() === requestedId)) {
      throw new Error(`Order ${requestedId} already exists. Choose a different order ID.`);
    }
    const id = requestedId || createUniqueOrderId(orders);

    const est = estimateReadyTime(
      { garment: newOrderData.garment.trim(), service: newOrderData.service },
      orders
    );

    const created: Order = {
      id,
      customerName: newOrderData.customerName.trim(),
      customerContact: newOrderData.customerContact.trim(),
      garment: newOrderData.garment.trim(),
      service: newOrderData.service,
      notes: newOrderData.notes || '',
      status: 'RECEIVED',
      createdAt: new Date().toISOString(),
      estimatedReadyAt: est.estimatedReadyAt,
      estimationReason: est.explanation,
    };

    const updatedOrders = [created, ...orders];
    this.saveOrders(updatedOrders);
    return created;
  }

  public resetDemoData(): void {
    const initial = getInitialDemoOrders();
    this.saveOrders(initial);
  }
}

export const orderRepository = new OrderRepository();
