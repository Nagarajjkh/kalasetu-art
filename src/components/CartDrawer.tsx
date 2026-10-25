import { X, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useCartDetail, useStore } from '../store/StoreContext';
import { calcDeliveryCharge } from '../store/StoreContext';
import { CONFIG } from '../config';
import { formatINR } from '../lib/utils';
import { paths, useRouter } from '../lib/router';
import SmartImage from './SmartImage';

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function CartDrawer({ open, onClose }: Props) {
  const { updateCartQty, removeFromCart, cartSubtotal } = useStore();
  const items = useCartDetail();
  const { navigate } = useRouter();

  if (!open) return null;

  const delivery = calcDeliveryCharge(cartSubtotal);
  const goCheckout = () => {
    onClose();
    navigate(paths.checkout);
  };
  const goCart = () => {
    onClose();
    navigate(paths.cart);
  };

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-indigo-900/40 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
        aria-hidden
      />
      <aside
        className="absolute right-0 top-0 h-full w-full max-w-md bg-cream-50 shadow-lift animate-slide-in-right flex flex-col"
        role="dialog"
        aria-label="Shopping cart"
      >
        <div className="flex items-center justify-between border-b border-cream-200 px-5 py-4">
          <h2 className="flex items-center gap-2 font-serif text-xl text-indigo-900">
            <ShoppingBag className="h-5 w-5 text-terracotta-500" />
            Your Cart
          </h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-indigo-700 hover:bg-cream-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-400"
            aria-label="Close cart"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 p-6 text-center">
            <ShoppingBag className="h-12 w-12 text-cream-400" />
            <p className="text-indigo-700">Your cart is empty.</p>
            <button
              onClick={() => { onClose(); navigate(paths.explore); }}
              className="btn-primary"
            >
              Explore Crafts
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-4 py-3">
              <ul className="space-y-3">
                {items.map(({ item, product, artisan }) => (
                  <li
                    key={item.productId}
                    className="flex gap-3 rounded-2xl border border-cream-200 bg-cream-100 p-3"
                  >
                    <button
                      onClick={() => { onClose(); navigate(paths.product(product.id)); }}
                      className="shrink-0"
                    >
                      <SmartImage
                        src={product.images[0]}
                        alt={product.name}
                        className="h-16 w-16 rounded-xl object-cover"
                      />
                    </button>
                    <div className="flex flex-1 flex-col">
                      <p className="line-clamp-1 text-sm font-semibold text-indigo-900">{product.name}</p>
                      <p className="text-xs text-indigo-500">{artisan?.name ?? 'Artisan'}</p>
                      <div className="mt-1 flex items-center justify-between">
                        <div className="flex items-center gap-1.5 rounded-full border border-cream-300 bg-cream-50">
                          <button
                            onClick={() => updateCartQty(item.productId, item.quantity - 1)}
                            className="rounded-full p-1.5 text-indigo-700 hover:bg-cream-200"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="min-w-6 text-center text-sm font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateCartQty(item.productId, Math.min(item.quantity + 1, product.quantity))}
                            className="rounded-full p-1.5 text-indigo-700 hover:bg-cream-200"
                            aria-label="Increase quantity"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <span className="text-sm font-semibold text-indigo-900">
                          {formatINR(product.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.productId)}
                      className="self-start rounded-full p-1.5 text-terracotta-500 hover:bg-terracotta-50"
                      aria-label={`Remove ${product.name}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-cream-200 px-5 py-4">
              <div className="mb-1 flex justify-between text-sm text-indigo-600">
                <span>Subtotal</span>
                <span>{formatINR(cartSubtotal)}</span>
              </div>
              <div className="mb-3 flex justify-between text-sm text-indigo-600">
                <span>Delivery (demo)</span>
                <span>{delivery === 0 ? 'Free' : formatINR(delivery)}</span>
              </div>
              {cartSubtotal < CONFIG.freeDeliveryThreshold && (
                <p className="mb-3 text-xs text-moss-600">
                  Add {formatINR(CONFIG.freeDeliveryThreshold - cartSubtotal)} more for free delivery.
                </p>
              )}
              <div className="flex gap-2">
                <button onClick={goCart} className="btn-outline flex-1">View Cart</button>
                <button onClick={goCheckout} className="btn-primary flex-1">Checkout</button>
              </div>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
