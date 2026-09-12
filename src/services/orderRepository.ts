import { Order, OrderStatus } from '../types/order';
import { estimateReadyTime } from './aiEstimator';

const STORAGE_KEY = 'cleantrack_orders_v1';

export function getInitialDemoOrders(): Order[] {
  const now = new Date();
  const todayDateStr = now.toLocaleDateString([], { month: 'short', day: 'numeric' });

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
      estimationReason: 'Calculated from Dry Cleaning protocol, structured blazer tailoring, and 2 active orders ahead in queue.',
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
      estimatedReadyAt: '', // MUST NOT have estimated ready time once ready for pickup
      readySince: `${todayDateStr} at 3:15 PM`,
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
      estimationReason: 'Calculated from Ironing protocol, standard cotton batching, and clear workshop queue.',
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
      return JSON.parse(raw);
    } catch {
      const initial = getInitialDemoOrders();
      this.saveOrders(initial);
      return initial;
    }
  }

  public saveOrders(orders: Order[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
    this.notifyListeners();
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
      // Rule: Set readySince and blank out estimatedReadyAt
      updated.readySince = `Today at ${timeStr}`;
      updated.estimatedReadyAt = '';
    } else if (newStatus === 'COLLECTED') {
      updated.collectedAt = `Today at ${timeStr}`;
      updated.estimatedReadyAt = '';
    } else if (newStatus === 'CLEANING' || newStatus === 'QUALITY_CHECK' || newStatus === 'RECEIVED') {
      // If moving back or within processing, ensure estimate exists if blank
      if (!updated.estimatedReadyAt) {
        const est = estimateReadyTime(
          { garment: updated.garment, service: updated.service, createdAt: updated.createdAt },
          orders
        );
        updated.estimatedReadyAt = est.estimatedReadyAt;
        updated.estimationReason = est.explanation;
      }
    }

    orders[index] = updated;
    this.saveOrders(orders);
    return updated;
  }

  public createOrder(newOrderData: Omit<Order, 'id' | 'status' | 'createdAt' | 'estimatedReadyAt'> & { id?: string }): Order {
    const orders = this.getOrders();
    const id = newOrderData.id?.trim() || `DC${Math.floor(1000 + Math.random() * 9000)}`;

    const est = estimateReadyTime(
      { garment: newOrderData.garment, service: newOrderData.service },
      orders
    );

    const created: Order = {
      id,
      customerName: newOrderData.customerName,
      customerContact: newOrderData.customerContact,
      garment: newOrderData.garment,
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
