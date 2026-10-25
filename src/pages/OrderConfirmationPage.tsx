import { useEffect, useState } from 'react';
import { CheckCircle2, Package, MessageCircle, ArrowRight, Home, Copy } from 'lucide-react';
import { useStore } from '../store/StoreContext';
import { paths, useRouter } from '../lib/router';
import { buildWhatsApp, formatDate, formatINR, paymentLabels } from '../lib/utils';
import SmartImage from '../components/SmartImage';

interface Props { orderId: string }

export default function OrderConfirmationPage({ orderId }: Props) {
  const { orders, getArtisan } = useStore();
  const { navigate } = useRouter();
  const order = orders.find((o) => o.id === orderId);
  const [copied, setCopied] = useState(false);

  useEffect(() => { window.scrollTo({ top: 0 }); }, [orderId]);

  if (!order) {
    return (
      <div className="container-page py-20 text-center">
        <h1 className="font-serif text-3xl font-semibold text-indigo-900">Order not found</h1>
        <p className="mt-2 text-indigo-600">We could not find this order in your demo history.</p>
        <button onClick={() => navigate(paths.orders)} className="mt-6 btn-primary">View your orders</button>
      </div>
    );
  }

  const wa = order.method === 'whatsapp' ? buildWhatsApp(order) : null;

  const copyMsg = async () => {
    if (!wa) return;
    try {
      await navigator.clipboard.writeText(wa.message);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch { /* ignore */ }
  };

  return (
    <div className="container-page py-10">
      <div className="mx-auto max-w-2xl">
        <div className="rounded-3xl border border-moss-200 bg-moss-50 p-8 text-center animate-scale-in">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-moss-500 text-cream-50">
            <CheckCircle2 className="h-9 w-9" />
          </span>
          <h1 className="mt-4 font-serif text-3xl font-semibold text-indigo-900">
            {order.method === 'whatsapp' ? 'Order Request Created' : 'Order Confirmed'}
          </h1>
          <p className="mt-2 text-indigo-600">
            {order.method === 'whatsapp'
              ? 'Your order has been recorded as a pending request. Send it to the artisan to confirm.'
              : 'Your demo payment was successful and your order has been placed.'}
          </p>
          <p className="mt-4 text-sm text-indigo-500">Your order ID</p>
          <p className="font-mono text-2xl font-bold text-terracotta-500">{order.id}</p>
        </div>

        {/* WhatsApp CTA for whatsapp orders */}
        {order.method === 'whatsapp' && wa && (
          <div className="mt-6 card p-6">
            <h2 className="font-serif text-xl font-semibold text-indigo-900">Send Your Order on WhatsApp</h2>
            {wa.url ? (
              <>
                <p className="mt-2 text-sm text-indigo-600">
                  Open WhatsApp with your prefilled order summary. Sending this message does not confirm stock or payment.
                </p>
                <a href={wa.url} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-2.5 text-sm font-semibold text-white hover:brightness-95">
                  <MessageCircle className="h-4 w-4" /> Open WhatsApp
                </a>
              </>
            ) : (
              <>
                <p className="mt-2 text-sm text-indigo-600">No WhatsApp number is configured. Copy the summary below to send manually:</p>
                <pre className="mt-3 max-h-60 overflow-auto whitespace-pre-wrap rounded-xl border border-cream-200 bg-cream-100 p-4 text-xs text-indigo-700">{wa.message}</pre>
                <button onClick={copyMsg} className="mt-3 inline-flex items-center gap-2 btn-outline">
                  <Copy className="h-4 w-4" /> {copied ? 'Copied!' : 'Copy summary'}
                </button>
              </>
            )}
          </div>
        )}

        {/* Order details */}
        <div className="mt-6 card p-6">
          <h2 className="mb-4 flex items-center gap-2 font-serif text-xl font-semibold text-indigo-900">
            <Package className="h-5 w-5 text-terracotta-500" /> Order Details
          </h2>
          <ul className="space-y-3">
            {order.items.map((it) => {
              const artisan = getArtisan(it.artisanId);
              return (
                <li key={it.productId} className="flex gap-3">
                  <SmartImage src={it.image} alt={it.productName} className="h-16 w-16 rounded-xl object-cover" />
                  <div className="flex-1">
                    <p className="font-medium text-indigo-900">{it.productName}</p>
                    <p className="text-xs text-indigo-500">{artisan?.name ?? it.artisanName}</p>
                    <p className="text-xs text-indigo-500">{it.quantity} × {formatINR(it.price)}</p>
                  </div>
                  <span className="font-semibold text-indigo-900">{formatINR(it.price * it.quantity)}</span>
                </li>
              );
            })}
          </ul>
          <div className="mt-4 space-y-1.5 border-t border-cream-200 pt-4 text-sm">
            <div className="flex justify-between"><span className="text-indigo-600">Subtotal</span><span>{formatINR(order.subtotal)}</span></div>
            <div className="flex justify-between"><span className="text-indigo-600">Delivery</span><span>{order.deliveryCharge === 0 ? 'Free' : formatINR(order.deliveryCharge)}</span></div>
            <div className="flex justify-between border-t border-cream-200 pt-2 text-base font-semibold"><span className="text-indigo-900">Total</span><span className="text-indigo-900">{formatINR(order.total)}</span></div>
          </div>

          <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
            <div className="rounded-xl bg-cream-100 p-3">
              <p className="text-xs uppercase tracking-wider text-indigo-500">Delivery To</p>
              <p className="mt-1 font-medium text-indigo-900">{order.customer.name}</p>
              <p className="text-indigo-600">{order.customer.address}, {order.customer.city}, {order.customer.state} - {order.customer.pincode}</p>
              <p className="text-indigo-600">{order.customer.phone}</p>
            </div>
            <div className="rounded-xl bg-cream-100 p-3">
              <p className="text-xs uppercase tracking-wider text-indigo-500">Payment</p>
              <p className="mt-1 font-medium text-indigo-900">{paymentLabels[order.paymentStatus]}</p>
              <p className="text-indigo-600">{order.method === 'whatsapp' ? 'WhatsApp order request' : 'Demo online payment'}</p>
              <p className="text-indigo-600">Placed on {formatDate(order.createdAt)}</p>
            </div>
          </div>

          {order.note && (
            <p className="mt-3 text-sm text-indigo-600"><span className="font-medium">Note:</span> {order.note}</p>
          )}
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button onClick={() => navigate(paths.orders)} className="btn-primary">View Order History <ArrowRight className="h-4 w-4" /></button>
          <button onClick={() => navigate(paths.home)} className="btn-outline"><Home className="h-4 w-4" /> Back Home</button>
        </div>
      </div>
    </div>
  );
}
