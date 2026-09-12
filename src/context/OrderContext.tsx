import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Order, OrderStatus } from '../types/order';
import { orderRepository } from '../services/orderRepository';

interface OrderContextType {
  orders: Order[];
  getOrder: (id: string) => Order | undefined;
  updateOrderStatus: (id: string, status: OrderStatus) => void;
  createOrder: (orderData: Omit<Order, 'id' | 'status' | 'createdAt' | 'estimatedReadyAt'> & { id?: string }) => Order;
  resetDemoData: () => void;
  activeView: 'customer' | 'shop';
  setActiveView: (view: 'customer' | 'shop') => void;
  selectedOrderId: string;
  setSelectedOrderId: (id: string) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>(() => orderRepository.getOrders());
  const [activeView, setActiveView] = useState<'customer' | 'shop'>('customer');
  const [selectedOrderId, setSelectedOrderId] = useState<string>('DC1024');

  // Keep state synchronized with repository changes (and other tabs/components)
  useEffect(() => {
    const unsubscribe = orderRepository.subscribe(() => {
      setOrders([...orderRepository.getOrders()]);
    });
    return unsubscribe;
  }, []);

  const getOrder = useCallback(
    (id: string) => {
      return orderRepository.getOrderById(id);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [orders]
  );

  const updateOrderStatus = useCallback((id: string, status: OrderStatus) => {
    orderRepository.updateOrderStatus(id, status);
  }, []);

  const createOrder = useCallback(
    (orderData: Omit<Order, 'id' | 'status' | 'createdAt' | 'estimatedReadyAt'> & { id?: string }) => {
      const created = orderRepository.createOrder(orderData);
      setSelectedOrderId(created.id);
      return created;
    },
    []
  );

  const resetDemoData = useCallback(() => {
    orderRepository.resetDemoData();
    setSelectedOrderId('DC1024');
  }, []);

  return (
    <OrderContext.Provider
      value={{
        orders,
        getOrder,
        updateOrderStatus,
        createOrder,
        resetDemoData,
        activeView,
        setActiveView,
        selectedOrderId,
        setSelectedOrderId,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export function useOrders(): OrderContextType {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
}
