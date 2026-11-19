import React from 'react';
import { OrderProvider, useOrders } from './context/OrderContext';
import { HypothesisBanner } from './components/layout/HypothesisBanner';
import { Header } from './components/layout/Header';
import { CustomerView } from './components/customer/CustomerView';
import { ShopView } from './components/shop/ShopView';

const MainContent: React.FC = () => {
  const { activeView } = useOrders();

  return (
    <main className="flex-1">
      {activeView === 'customer' ? <CustomerView /> : <ShopView />}
    </main>
  );
};

export function App() {
  return (
    <OrderProvider>
      <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-sky-100 selection:text-sky-900">
        <HypothesisBanner />
        <Header />
        <MainContent />

        <footer className="border-t border-slate-200 bg-white mt-auto py-6 px-4 text-center text-xs text-slate-500">
          <div className="max-w-4xl mx-auto space-y-1.5">
            <p className="font-medium text-slate-600">
              CleanTrack • Project Better Tomorrow Prototype
            </p>
            <p className="text-[11px] text-slate-400">
              Demonstrating customer garment tracking & shop queue state machine. Problem definitions remain working hypotheses until post-visit field interviews are conducted.
            </p>
          </div>
        </footer>
      </div>
    </OrderProvider>
  );
}

export default App;
