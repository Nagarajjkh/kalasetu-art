import { Package, ChevronRight, Search, Inbox } from 'lucide-react';
import { useStore } from '../store/StoreContext';
import { paths, useRouter } from '../lib/router';
import { formatDate, formatINR, fulfillmentLabels, paymentLabels } from '../lib/utils';
import SmartImage from '../components/SmartImage';
import { useState } from 'react';

const statusColors: Record<string, string> = {
  'pending-confirmation': 'bg-cream-200 text-indigo-700',
  confirmed: 'bg-indigo-100 text-indigo-700',
  processing: 'bg-gold-400/20 text-gold-600',
  shipped: 'bg-moss-100 text-moss-700',
  delivered: 'bg-moss-500 text-cream-50',
  cancelled: 'bg-terracotta-100 text-terracotta-600',
};

export default function OrdersPage() {
  const { orders } = useStore();
  const { navigate } = useRouter();
  const [query, setQuery] = useState('');

  const filtered = orders.filter((o) =>
    !query || o.id.toLowerCase().includes(query.toLowerCase()) ||
    o.items.some((it) => it.productName.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <div className="container-page py-10">
      <nav className="mb-6 text-sm text-indigo-500">
        <button onClick={() => navigate(paths.home)} className="hover:text-terracotta-500">Home</button>
        <span className="mx-2">/</span>
        <span className="text-indigo-700">My Orders</span>
      </nav>

      <h1 className="mb-2 font-serif text-4xl font-semibold text-indigo-900">My Orders</h1>
      <p className="mb-6 text-indigo-600">All demo orders placed in this browser.</p>

      <div className="relative mb-6 max-w-md">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-indigo-400" />
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by order ID or product" className="input pl-11" />
      </div>

      {filtered.length === 0 ? (
        <div className="card flex flex-col items-center justify-center gap-4 p-12 text-center">
          <Inbox className="h-12 w-12 text-cream-400" />
          <h3 className="font-serif text-xl text-indigo-900">{orders.length === 0 ? 'No orders yet' : 'No matching orders'}</h3>
          <p className="text-indigo-600">{orders.length === 0 ? 'Place your first order to see it here.' : 'Try a different search.'}</p>
          {orders.length === 0 && <button onClick={() => navigate(paths.explore)} className="btn-primary">Explore Crafts</button>}
        </div>
      ) : (
        <ul className="space-y-4">
          {filtered.map((order) => (
            <li key={order.id}>
              <button
                onClick={() => navigate(paths.confirmation(order.id))}
                className="card w-full p-5 text-left transition-all hover:-translate-y-0.5 hover:shadow-lift"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <Package className="h-5 w-5 text-terracotta-500" />
                      <span className="font-mono font-semibold text-indigo-900">{order.id}</span>
                    </div>
                    <p className="mt-1 text-xs text-indigo-500">Placed on {formatDate(order.createdAt)}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`chip ${statusColors[order.fulfillmentStatus]}`}>{fulfillmentLabels[order.fulfillmentStatus]}</span>
                    <span className="chip bg-cream-200 text-indigo-700">{paymentLabels[order.paymentStatus]}</span>
                    <span className="font-serif text-lg font-semibold text-indigo-900">{formatINR(order.total)}</span>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-1">
                  {order.items.slice(0, 4).map((it) => (
                    <SmartImage key={it.productId} src={it.image} alt={it.productName} className="h-12 w-12 shrink-0 rounded-lg object-cover" />
                  ))}
                  {order.items.length > 4 && (
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-cream-200 text-xs font-medium text-indigo-600">
                      +{order.items.length - 4}
                    </span>
                  )}
                  <span className="ml-auto inline-flex items-center gap-1 text-sm font-medium text-terracotta-500">
                    View details <ChevronRight className="h-4 w-4" />
                  </span>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
