import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Heart } from 'lucide-react';
import { useCartDetail, useStore, calcDeliveryCharge } from '../store/StoreContext';
import { CONFIG } from '../config';
import { formatINR } from '../lib/utils';
import { paths, useRouter } from '../lib/router';
import SmartImage from '../components/SmartImage';

export default function CartPage() {
  const { updateCartQty, removeFromCart, cartSubtotal, toggleWishlist } = useStore();
  const items = useCartDetail();
  const { navigate } = useRouter();
  const delivery = calcDeliveryCharge(cartSubtotal);
  const total = cartSubtotal + delivery;

  if (items.length === 0) {
    return (
      <div className="container-page py-20 text-center">
        <div className="mx-auto max-w-md">
          <ShoppingBag className="mx-auto h-16 w-16 text-cream-400" />
          <h1 className="mt-4 font-serif text-3xl font-semibold text-indigo-900">Your cart is empty</h1>
          <p className="mt-2 text-indigo-600">Discover beautiful handmade crafts from artisans across Karnataka.</p>
          <button onClick={() => navigate(paths.explore)} className="mt-6 btn-primary">
            Explore Crafts <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container-page py-10">
      <nav className="mb-6 text-sm text-indigo-500">
        <button onClick={() => navigate(paths.home)} className="hover:text-terracotta-500">Home</button>
        <span className="mx-2">/</span>
        <span className="text-indigo-700">Cart</span>
      </nav>

      <h1 className="mb-8 font-serif text-4xl font-semibold text-indigo-900">Shopping Cart</h1>

      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <div>
          <ul className="space-y-4">
            {items.map(({ item, product, artisan }) => (
              <li key={item.productId} className="card flex gap-4 p-4">
                <button onClick={() => navigate(paths.product(product.id))} className="shrink-0">
                  <SmartImage src={product.images[0]} alt={product.name} className="h-24 w-24 rounded-xl object-cover" />
                </button>
                <div className="flex flex-1 flex-col">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-serif text-lg font-semibold text-indigo-900">{product.name}</h3>
                      <p className="text-sm text-indigo-500">{artisan?.name} · {product.region}</p>
                    </div>
                    <span className="font-serif text-lg font-semibold text-indigo-900">{formatINR(product.price * item.quantity)}</span>
                  </div>
                  <div className="mt-auto flex items-center justify-between pt-2">
                    <div className="flex items-center gap-2 rounded-full border border-cream-300 bg-cream-50 p-1">
                      <button onClick={() => updateCartQty(item.productId, item.quantity - 1)} className="rounded-full p-1.5 text-indigo-700 hover:bg-cream-200" aria-label="Decrease quantity"><Minus className="h-3.5 w-3.5" /></button>
                      <span className="min-w-8 text-center text-sm font-medium">{item.quantity}</span>
                      <button onClick={() => updateCartQty(item.productId, Math.min(item.quantity + 1, product.quantity))} className="rounded-full p-1.5 text-indigo-700 hover:bg-cream-200" aria-label="Increase quantity" disabled={item.quantity >= product.quantity}><Plus className="h-3.5 w-3.5" /></button>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => toggleWishlist(product.id)} className="rounded-full p-2 text-indigo-600 hover:bg-cream-200" aria-label="Save to wishlist"><Heart className="h-4 w-4" /></button>
                      <button onClick={() => removeFromCart(item.productId)} className="rounded-full p-2 text-terracotta-500 hover:bg-terracotta-50" aria-label={`Remove ${product.name}`}><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <button onClick={() => navigate(paths.explore)} className="mt-4 inline-flex items-center gap-1 text-sm text-indigo-600 hover:text-terracotta-500">
            ← Continue shopping
          </button>
        </div>

        {/* Summary */}
        <aside className="lg:sticky lg:top-24 h-fit">
          <div className="card p-6">
            <h2 className="mb-4 font-serif text-xl font-semibold text-indigo-900">Order Summary</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-indigo-600">Subtotal</span><span className="font-medium text-indigo-900">{formatINR(cartSubtotal)}</span></div>
              <div className="flex justify-between"><span className="text-indigo-600">Delivery (demo)</span><span className="font-medium text-indigo-900">{delivery === 0 ? 'Free' : formatINR(delivery)}</span></div>
              {cartSubtotal < CONFIG.freeDeliveryThreshold && (
                <p className="pt-1 text-xs text-moss-600">Add {formatINR(CONFIG.freeDeliveryThreshold - cartSubtotal)} more for free delivery.</p>
              )}
            </div>
            <div className="mt-4 border-t border-cream-200 pt-4 flex justify-between">
              <span className="font-serif text-lg font-semibold text-indigo-900">Total</span>
              <span className="font-serif text-2xl font-semibold text-indigo-900">{formatINR(total)}</span>
            </div>
            <button onClick={() => navigate(paths.checkout)} className="mt-5 w-full btn-primary text-base">
              Proceed to Checkout <ArrowRight className="h-4 w-4" />
            </button>
            <p className="mt-3 text-center text-xs text-indigo-400">Demo checkout — no real payments processed.</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
