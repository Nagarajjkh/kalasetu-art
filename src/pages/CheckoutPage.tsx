import { useState } from 'react';
import {
  ArrowLeft, ArrowRight, CreditCard, Smartphone, Banknote, MessageCircle, Loader2, CheckCircle2,
  XCircle, ShieldCheck, AlertCircle, Copy,
} from 'lucide-react';
import { useCartDetail, useStore, calcDeliveryCharge } from '../store/StoreContext';
import { CONFIG, WHATSAPP_UNCONFIGURED_MESSAGE } from '../config';
import { buildWhatsApp, formatINR, simulatePayment } from '../lib/utils';
import { paths, useRouter } from '../lib/router';
import SmartImage from '../components/SmartImage';
import type { CustomerInfo, FulfillmentStatus, Order, OrderMethod, PaymentMethod, PaymentStatus } from '../types';

const emptyCustomer: CustomerInfo = {
  name: '', email: '', phone: '', address: '', city: '', state: '', pincode: '',
};

export default function CheckoutPage() {
  const { createOrder, clearCart, cartSubtotal } = useStore();
  const items = useCartDetail();
  const { navigate } = useRouter();

  const [customer, setCustomer] = useState<CustomerInfo>(emptyCustomer);
  const [method, setMethod] = useState<OrderMethod>('mock-payment');
  const [payMethod, setPayMethod] = useState<PaymentMethod>('upi');
  const [note, setNote] = useState('');
  const [errors, setErrors] = useState<Partial<Record<keyof CustomerInfo, string>>>({});
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState('');
  const [whatsappResult, setWhatsappResult] = useState<{ url: string | null; message: string; orderId: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const delivery = calcDeliveryCharge(cartSubtotal);
  const total = cartSubtotal + delivery;

  if (items.length === 0 && !whatsappResult) {
    return (
      <div className="container-page py-20 text-center">
        <h1 className="font-serif text-3xl font-semibold text-indigo-900">Your cart is empty</h1>
        <p className="mt-2 text-indigo-600">Add some crafts before checking out.</p>
        <button onClick={() => navigate(paths.explore)} className="mt-6 btn-primary">Explore Crafts</button>
      </div>
    );
  }

  const validate = (): boolean => {
    const e: Partial<Record<keyof CustomerInfo, string>> = {};
    if (!customer.name.trim()) e.name = 'Name is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email)) e.email = 'Valid email is required';
    if (!/^[0-9]{10}$/.test(customer.phone.replace(/\D/g, '').slice(-10))) e.phone = 'Enter a valid 10-digit phone';
    if (!customer.address.trim()) e.address = 'Address is required';
    if (!customer.city.trim()) e.city = 'City is required';
    if (!customer.state.trim()) e.state = 'State is required';
    if (!/^[0-9]{6}$/.test(customer.pincode)) e.pincode = 'Enter a valid 6-digit pincode';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const buildOrderPayload = (
    paymentStatus: PaymentStatus,
    paymentMethod?: PaymentMethod,
    fulfillment: FulfillmentStatus = 'pending-confirmation'
  ): Omit<Order, 'id' | 'createdAt'> => ({
    items: items.map(({ item, product, artisan }) => ({
      productId: product.id,
      productName: product.name,
      artisanId: product.artisanId,
      artisanName: artisan?.name ?? 'Artisan',
      quantity: item.quantity,
      price: product.price,
      image: product.images[0],
    })),
    subtotal: cartSubtotal,
    deliveryCharge: delivery,
    total,
    customer,
    method,
    paymentMethod: method === 'mock-payment' ? paymentMethod : undefined,
    paymentStatus: method === 'mock-payment' ? paymentStatus : 'not-applicable',
    fulfillmentStatus: fulfillment,
    note: note.trim() || undefined,
  });

  const handleMockPayment = async (shouldFail: boolean) => {
    if (!validate()) return;
    setPaying(true);
    setPayError('');
    const result = await simulatePayment(shouldFail);
    setPaying(false);
    if (!result.ok) {
      setPayError(result.reason ?? 'Simulated payment failed.');
      return;
    }
    const order = createOrder(buildOrderPayload('success', payMethod));
    clearCart();
    navigate(paths.confirmation(order.id));
  };

  const handleWhatsAppOrder = () => {
    if (!validate()) return;
    const order = createOrder(buildOrderPayload('pending'));
    const { message, url } = buildWhatsApp(order);
    setWhatsappResult({ url, message, orderId: order.id });
    clearCart();
  };

  const copyMessage = async () => {
    if (!whatsappResult) return;
    try {
      await navigator.clipboard.writeText(whatsappResult.message);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setPayError('Could not copy to clipboard. Please select the text manually.');
    }
  };

  const setField = (k: keyof CustomerInfo, v: string) => {
    setCustomer((c) => ({ ...c, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }));
  };

  return (
    <div className="container-page py-10">
      <nav className="mb-6 text-sm text-indigo-500">
        <button onClick={() => navigate(paths.home)} className="hover:text-terracotta-500">Home</button>
        <span className="mx-2">/</span>
        <button onClick={() => navigate(paths.cart)} className="hover:text-terracotta-500">Cart</button>
        <span className="mx-2">/</span>
        <span className="text-indigo-700">Checkout</span>
      </nav>

      <button onClick={() => navigate(paths.cart)} className="mb-4 inline-flex items-center gap-1 text-sm text-indigo-600 hover:text-terracotta-500">
        <ArrowLeft className="h-4 w-4" /> Back to cart
      </button>

      <h1 className="mb-8 font-serif text-4xl font-semibold text-indigo-900">Checkout</h1>

      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          {/* WhatsApp success state */}
          {whatsappResult ? (
            <div className="card p-6">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-moss-100 text-moss-600"><CheckCircle2 className="h-6 w-6" /></span>
                <div>
                  <h2 className="font-serif text-xl font-semibold text-indigo-900">Order request created</h2>
                  <p className="text-sm text-indigo-600">Order ID: <span className="font-mono font-medium">{whatsappResult.orderId}</span></p>
                </div>
              </div>
              {whatsappResult.url ? (
                <div className="mt-5">
                  <p className="text-sm text-indigo-700">
                    Open WhatsApp to send your order request to the marketplace. Sending the message
                    does <strong>not</strong> automatically confirm stock or payment — your order
                    stays pending until the artisan confirms it.
                  </p>
                  <a
                    href={whatsappResult.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-2.5 text-sm font-semibold text-white hover:brightness-95"
                  >
                    <MessageCircle className="h-4 w-4" /> Open WhatsApp
                  </a>
                </div>
              ) : (
                <div className="mt-5">
                  <div className="rounded-xl border border-terracotta-200 bg-terracotta-50 p-4 text-sm text-terracotta-700">
                    <p className="flex items-start gap-2"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /> {WHATSAPP_UNCONFIGURED_MESSAGE}</p>
                  </div>
                  <p className="mt-4 text-sm text-indigo-600">Copy your order summary below to send manually:</p>
                  <pre className="mt-2 max-h-64 overflow-auto whitespace-pre-wrap rounded-xl border border-cream-200 bg-cream-100 p-4 text-xs text-indigo-700">{whatsappResult.message}</pre>
                  <button onClick={copyMessage} className="mt-3 inline-flex items-center gap-2 btn-outline">
                    <Copy className="h-4 w-4" /> {copied ? 'Copied!' : 'Copy summary'}
                  </button>
                </div>
              )}
              <button onClick={() => navigate(paths.confirmation(whatsappResult.orderId))} className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-terracotta-500 hover:text-terracotta-600">
                View order confirmation <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <>
              {/* Customer details */}
              <section className="card p-6">
                <h2 className="mb-4 font-serif text-xl font-semibold text-indigo-900">Customer & Delivery Details</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className="label" htmlFor="c-name">Full Name *</label>
                    <input id="c-name" value={customer.name} onChange={(e) => setField('name', e.target.value)} className="input" />
                    {errors.name && <p className="mt-1 text-xs text-terracotta-500">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="label" htmlFor="c-email">Email *</label>
                    <input id="c-email" type="email" value={customer.email} onChange={(e) => setField('email', e.target.value)} className="input" />
                    {errors.email && <p className="mt-1 text-xs text-terracotta-500">{errors.email}</p>}
                  </div>
                  <div>
                    <label className="label" htmlFor="c-phone">Phone *</label>
                    <input id="c-phone" value={customer.phone} onChange={(e) => setField('phone', e.target.value)} placeholder="10-digit number" className="input" />
                    {errors.phone && <p className="mt-1 text-xs text-terracotta-500">{errors.phone}</p>}
                  </div>
                  <div className="sm:col-span-2">
                    <label className="label" htmlFor="c-addr">Delivery Address *</label>
                    <textarea id="c-addr" value={customer.address} onChange={(e) => setField('address', e.target.value)} rows={2} className="input" />
                    {errors.address && <p className="mt-1 text-xs text-terracotta-500">{errors.address}</p>}
                  </div>
                  <div>
                    <label className="label" htmlFor="c-city">City *</label>
                    <input id="c-city" value={customer.city} onChange={(e) => setField('city', e.target.value)} className="input" />
                    {errors.city && <p className="mt-1 text-xs text-terracotta-500">{errors.city}</p>}
                  </div>
                  <div>
                    <label className="label" htmlFor="c-state">State *</label>
                    <input id="c-state" value={customer.state} onChange={(e) => setField('state', e.target.value)} className="input" />
                    {errors.state && <p className="mt-1 text-xs text-terracotta-500">{errors.state}</p>}
                  </div>
                  <div>
                    <label className="label" htmlFor="c-pin">Pincode *</label>
                    <input id="c-pin" value={customer.pincode} onChange={(e) => setField('pincode', e.target.value)} maxLength={6} className="input" />
                    {errors.pincode && <p className="mt-1 text-xs text-terracotta-500">{errors.pincode}</p>}
                  </div>
                  <div className="sm:col-span-2">
                    <label className="label" htmlFor="c-note">Order Note (optional)</label>
                    <textarea id="c-note" value={note} onChange={(e) => setNote(e.target.value)} rows={2} placeholder="Any instructions for the artisan" className="input" />
                  </div>
                </div>
              </section>

              {/* Order method */}
              <section className="card p-6">
                <h2 className="mb-4 font-serif text-xl font-semibold text-indigo-900">Choose Order Method</h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  <button
                    onClick={() => setMethod('mock-payment')}
                    className={`rounded-2xl border p-4 text-left transition-colors ${method === 'mock-payment' ? 'border-terracotta-400 bg-terracotta-50' : 'border-cream-200 hover:bg-cream-100'}`}
                  >
                    <CreditCard className="h-6 w-6 text-terracotta-500" />
                    <h3 className="mt-2 font-semibold text-indigo-900">Demo Online Payment</h3>
                    <p className="mt-1 text-xs text-indigo-600">Simulated UPI, card, or COD. No real money moves.</p>
                  </button>
                  <button
                    onClick={() => setMethod('whatsapp')}
                    className={`rounded-2xl border p-4 text-left transition-colors ${method === 'whatsapp' ? 'border-terracotta-400 bg-terracotta-50' : 'border-cream-200 hover:bg-cream-100'}`}
                  >
                    <MessageCircle className="h-6 w-6 text-moss-500" />
                    <h3 className="mt-2 font-semibold text-indigo-900">WhatsApp Order Request</h3>
                    <p className="mt-1 text-xs text-indigo-600">Send a prefilled order summary on WhatsApp.</p>
                  </button>
                </div>

                {method === 'mock-payment' && (
                  <div className="mt-5 animate-fade-in">
                    <h3 className="label">Simulated Payment Method</h3>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { key: 'upi' as const, icon: Smartphone, label: 'UPI' },
                        { key: 'card' as const, icon: CreditCard, label: 'Card' },
                        { key: 'cod' as const, icon: Banknote, label: 'COD' },
                      ].map((opt) => (
                        <button
                          key={opt.key}
                          onClick={() => setPayMethod(opt.key)}
                          className={`flex flex-col items-center gap-1 rounded-xl border p-3 text-sm transition-colors ${payMethod === opt.key ? 'border-terracotta-400 bg-terracotta-50 text-terracotta-600' : 'border-cream-200 text-indigo-700 hover:bg-cream-100'}`}
                        >
                          <opt.icon className="h-5 w-5" />
                          {opt.label}
                        </button>
                      ))}
                    </div>
                    <div className="mt-4 rounded-xl border border-cream-200 bg-cream-100 p-4 text-xs text-indigo-600">
                      <p className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-moss-500" /> This is a clearly labelled simulated payment. We never collect or store real card numbers, CVVs, UPI PINs, or banking credentials. No real money is transferred.</p>
                    </div>

                    {payError && (
                      <div className="mt-4 flex items-start gap-2 rounded-xl border border-terracotta-200 bg-terracotta-50 p-3 text-sm text-terracotta-700 animate-fade-in">
                        <XCircle className="mt-0.5 h-4 w-4 shrink-0" /> {payError}
                      </div>
                    )}

                    <div className="mt-4 flex flex-wrap gap-3">
                      <button onClick={() => handleMockPayment(false)} disabled={paying} className="btn-primary">
                        {paying ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                        {paying ? 'Processing…' : 'Simulate Successful Payment'}
                      </button>
                      <button onClick={() => handleMockPayment(true)} disabled={paying} className="btn-outline">
                        <XCircle className="h-4 w-4" /> Simulate Failed Payment
                      </button>
                    </div>
                  </div>
                )}

                {method === 'whatsapp' && (
                  <div className="mt-5 animate-fade-in">
                    <div className="rounded-xl border border-cream-200 bg-cream-100 p-4 text-xs text-indigo-600">
                      <p className="flex items-start gap-2"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /> A formatted order summary will be generated. If a WhatsApp number is configured, you can open WhatsApp with a prefilled message. Sending the message does not automatically confirm stock or payment — your order stays pending until the artisan confirms it.</p>
                    </div>
                    <button onClick={handleWhatsAppOrder} className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-2.5 text-sm font-semibold text-white hover:brightness-95">
                      <MessageCircle className="h-4 w-4" /> Create Order & Open WhatsApp
                    </button>
                  </div>
                )}
              </section>
            </>
          )}
        </div>

        {/* Summary */}
        <aside className="lg:sticky lg:top-24 h-fit">
          <div className="card p-6">
            <h2 className="mb-4 font-serif text-xl font-semibold text-indigo-900">Order Summary</h2>
            <ul className="mb-4 space-y-3">
              {items.map(({ item, product, artisan }) => (
                <li key={item.productId} className="flex gap-3">
                  <SmartImage src={product.images[0]} alt={product.name} className="h-14 w-14 rounded-lg object-cover" />
                  <div className="flex-1 text-sm">
                    <p className="line-clamp-1 font-medium text-indigo-900">{product.name}</p>
                    <p className="text-xs text-indigo-500">{artisan?.name}</p>
                    <p className="text-xs text-indigo-500">{item.quantity} × {formatINR(product.price)}</p>
                  </div>
                  <span className="text-sm font-semibold text-indigo-900">{formatINR(product.price * item.quantity)}</span>
                </li>
              ))}
            </ul>
            <div className="space-y-1.5 border-t border-cream-200 pt-3 text-sm">
              <div className="flex justify-between"><span className="text-indigo-600">Subtotal</span><span className="font-medium text-indigo-900">{formatINR(cartSubtotal)}</span></div>
              <div className="flex justify-between"><span className="text-indigo-600">Delivery (demo)</span><span className="font-medium text-indigo-900">{delivery === 0 ? 'Free' : formatINR(delivery)}</span></div>
              {cartSubtotal > 0 && cartSubtotal < CONFIG.freeDeliveryThreshold && (
                <p className="text-xs text-moss-600">Add {formatINR(CONFIG.freeDeliveryThreshold - cartSubtotal)} more for free delivery.</p>
              )}
            </div>
            <div className="mt-3 flex justify-between border-t border-cream-200 pt-3">
              <span className="font-serif text-lg font-semibold text-indigo-900">Total</span>
              <span className="font-serif text-2xl font-semibold text-indigo-900">{formatINR(total)}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
