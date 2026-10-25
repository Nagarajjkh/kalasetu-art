import { useState } from 'react';
import { ShoppingBag, ChevronRight, AlertCircle, Package, Clock, Truck, CheckCircle2, XCircle } from 'lucide-react';
import { useStore } from '../store/StoreContext';
import { paths, useRouter } from '../lib/router';
import { formatDate, formatDateTime, formatINR, fulfillmentFlows, fulfillmentLabels, paymentLabels } from '../lib/utils';
import type { FulfillmentStatus, Order } from '../types';
import SmartImage from '../components/SmartImage';

const statusStyles: Record<string, string> = {
  'pending-confirmation': 'bg-cream-200 text-indigo-700',
  confirmed: 'bg-indigo-100 text-indigo-700',
  processing: 'bg-gold-400/20 text-gold-600',
  shipped: 'bg-moss-100 text-moss-700',
  delivered: 'bg-moss-500 text-cream-50',
  cancelled: 'bg-terracotta-100 text-terracotta-600',
};

export default function ManageOrdersPage() {
  const { activeArtisan, products, orders, updateOrder } = useStore();
  const { navigate } = useRouter();
  const [expanded, setExpanded] = useState<string | null>(null);

  if (!activeArtisan) {
    return (
      <div className="container-page py-16 text-center">
        <h1 className="font-serif text-2xl font-semibold text-indigo-900">No Artisan Profile</h1>
        <p className="mt-2 text-indigo-600">Register as an artisan first.</p>
        <button onClick={() => navigate(paths.register)} className="mt-5 btn-primary">Become an Artisan</button>
      </div>
    );
  }

  const myProductIds = new Set(products.filter((p) => p.artisanId === activeArtisan.id).map((p) => p.id));
  const myOrders = orders.filter((o) => o.items.some((it) => myProductIds.has(it.productId)));
  const myOrderTotal = myOrders.reduce((sum, o) => sum + o.total, 0);

  const setStatus = (orderId: string, status: FulfillmentStatus) => {
    updateOrder(orderId, { fulfillmentStatus: status });
  };

  const statusIcon = (s: string) => {
    switch (s) {
      case 'pending-confirmation': return <Clock className="h-4 w-4" />;
      case 'confirmed': return <Package className="h-4 w-4" />;
      case 'processing': return <Package className="h-4 w-4" />;
      case 'shipped': return <Truck className="h-4 w-4" />;
      case 'delivered': return <CheckCircle2 className="h-4 w-4" />;
      case 'cancelled': return <XCircle className="h-4 w-4" />;
      default: return null;
    }
  };

  return (
    <div className="container-page py-10">
      <nav className="mb-6 text-sm text-indigo-500">
        <button onClick={() => navigate(paths.home)} className="hover:text-terracotta-500">Home</button>
        <span className="mx-2">/</span>
        <button onClick={() => navigate(paths.dashboard)} className="hover:text-terracotta-500">Dashboard</button>
        <span className="mx-2">/</span>
        <span className="text-indigo-700">Manage Orders</span>
      </nav>

      <h1 className="mb-2 font-serif text-4xl font-semibold text-indigo-900">Manage Orders</h1>
      <p className="mb-6 text-indigo-600">Demo orders that include your products. Update fulfillment status below.</p>

      <div className="mb-6 flex flex-wrap gap-3">
        <div className="card px-4 py-3">
          <p className="text-xs text-indigo-500">Total Orders</p>
          <p className="font-serif text-2xl font-semibold text-indigo-900">{myOrders.length}</p>
        </div>
        <div className="card px-4 py-3">
          <p className="text-xs text-indigo-500">Pending</p>
          <p className="font-serif text-2xl font-semibold text-indigo-900">{myOrders.filter((o) => o.fulfillmentStatus === 'pending-confirmation').length}</p>
        </div>
        <div className="card px-4 py-3">
          <p className="text-xs text-indigo-500">Order Value (all)</p>
          <p className="font-serif text-2xl font-semibold text-indigo-900">{formatINR(myOrderTotal)}</p>
        </div>
      </div>

      <div className="mb-4 rounded-xl border border-cream-200 bg-cream-100 p-3 text-xs text-indigo-600">
        <p className="flex items-start gap-2"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-terracotta-500" /> Payment status is a mock simulation label only — KalaSetu never processes real payments. Fulfillment status is updated manually here.</p>
      </div>

      {myOrders.length === 0 ? (
        <div className="card flex flex-col items-center justify-center gap-4 p-12 text-center">
          <ShoppingBag className="h-12 w-12 text-cream-400" />
          <h3 className="font-serif text-xl text-indigo-900">No orders yet</h3>
          <p className="text-indigo-600">When customers buy your products, their orders appear here.</p>
          <button onClick={() => navigate(paths.explore)} className="btn-primary">Browse Marketplace</button>
        </div>
      ) : (
        <ul className="space-y-3">
          {myOrders.map((order: Order) => {
            const isOpen = expanded === order.id;
            const myItems = order.items.filter((it) => myProductIds.has(it.productId));
            return (
              <li key={order.id} className="card overflow-hidden">
                <button
                  onClick={() => setExpanded(isOpen ? null : order.id)}
                  className="flex w-full flex-wrap items-center justify-between gap-3 p-5 text-left"
                >
                  <div>
                    <p className="font-mono text-sm font-semibold text-indigo-900">{order.id}</p>
                    <p className="text-xs text-indigo-500">{formatDate(order.createdAt)} · {order.customer.name}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`chip ${statusStyles[order.fulfillmentStatus]}`}>{statusIcon(order.fulfillmentStatus)} {fulfillmentLabels[order.fulfillmentStatus]}</span>
                    <span className="chip bg-cream-200 text-indigo-700">{paymentLabels[order.paymentStatus]}</span>
                    <span className="font-semibold text-indigo-900">{formatINR(order.total)}</span>
                    <ChevronRight className={`h-5 w-5 text-indigo-400 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
                  </div>
                </button>

                {isOpen && (
                  <div className="border-t border-cream-200 bg-cream-100/50 p-5 animate-fade-in">
                    <h4 className="mb-3 font-serif text-sm font-semibold uppercase tracking-wider text-indigo-500">Items in this order</h4>
                    <ul className="space-y-2">
                      {myItems.map((it) => (
                        <li key={it.productId} className="flex items-center gap-3 rounded-xl bg-cream-50 p-2">
                          <SmartImage src={it.image} alt={it.productName} className="h-12 w-12 rounded-lg object-cover" />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-indigo-900">{it.productName}</p>
                            <p className="text-xs text-indigo-500">{it.quantity} × {formatINR(it.price)}</p>
                          </div>
                          <span className="text-sm font-semibold text-indigo-900">{formatINR(it.price * it.quantity)}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                      <div className="rounded-xl bg-cream-50 p-4">
                        <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-indigo-500">Customer</h4>
                        <p className="text-sm font-medium text-indigo-900">{order.customer.name}</p>
                        <p className="text-xs text-indigo-600">{order.customer.phone}</p>
                        <p className="text-xs text-indigo-600">{order.customer.email}</p>
                        <p className="mt-1 text-xs text-indigo-600">{order.customer.address}, {order.customer.city}, {order.customer.state} - {order.customer.pincode}</p>
                      </div>
                      <div className="rounded-xl bg-cream-50 p-4">
                        <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-indigo-500">Order Details</h4>
                        <p className="text-xs text-indigo-600">Placed: {formatDateTime(order.createdAt)}</p>
                        <p className="text-xs text-indigo-600">Method: {order.method === 'whatsapp' ? 'WhatsApp request' : 'Demo payment'}</p>
                        <p className="text-xs text-indigo-600">Payment: {paymentLabels[order.paymentStatus]}</p>
                        {order.note && <p className="mt-1 text-xs text-indigo-600">Note: {order.note}</p>}
                      </div>
                    </div>

                    <div className="mt-4">
                      <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-indigo-500">Update Fulfillment Status</h4>
                      <div className="flex flex-wrap gap-2">
                        {fulfillmentFlows.map((s) => (
                          <button
                            key={s}
                            onClick={() => setStatus(order.id, s as FulfillmentStatus)}
                            disabled={order.fulfillmentStatus === s}
                            className={`chip border transition-colors ${
                              order.fulfillmentStatus === s
                                ? `${statusStyles[s]} border-transparent cursor-default`
                                : 'border-cream-300 bg-cream-50 text-indigo-700 hover:bg-cream-200'
                            }`}
                          >
                            {fulfillmentLabels[s]}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
