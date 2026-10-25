import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { CONFIG } from '../config';
import {
  ensureSeed,
  loadActiveArtisanId,
  loadArtisans,
  loadCart,
  loadOrders,
  loadProducts,
  loadStories,
  loadWishlist,
  saveActiveArtisanId,
  saveArtisans,
  saveCart,
  saveOrders,
  saveProducts,
  saveStories,
  saveWishlist,
} from '../lib/storage';
import type {
  Artisan,
  CartItem,
  CraftStory,
  CustomerInfo,
  Order,
  Product,
  WishlistItem,
} from '../types';

export function uid(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

interface StoreContextValue {
  artisans: Artisan[];
  products: Product[];
  stories: CraftStory[];
  cart: CartItem[];
  wishlist: WishlistItem[];
  orders: Order[];
  activeArtisanId: string | null;
  activeArtisan: Artisan | null;
  cartCount: number;
  cartSubtotal: number;
  wishlistCount: number;
  // cart
  addToCart: (productId: string, quantity?: number) => void;
  updateCartQty: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  // wishlist
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
  // artisans/products
  addArtisan: (a: Omit<Artisan, 'id' | 'createdAt' | 'isDemo'>) => Artisan;
  getArtisan: (id: string | null) => Artisan | undefined;
  addProduct: (p: Omit<Product, 'id' | 'createdAt' | 'rating' | 'reviewCount' | 'trending' | 'bestseller' | 'provenance'> & Partial<Pick<Product, 'provenance'>>) => Product;
  updateProduct: (id: string, patch: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  // orders
  createOrder: (order: Omit<Order, 'id' | 'createdAt'>) => Order;
  updateOrder: (id: string, patch: Partial<Order>) => void;
  getOrder: (id: string) => Order | undefined;
  setActiveArtisanId: (id: string | null) => void;
  resetData: () => void;
}

const StoreContext = createContext<StoreContextValue | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [artisans, setArtisans] = useState<Artisan[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [stories, setStories] = useState<CraftStory[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeArtisanId, setActiveArtisanIdState] = useState<string | null>(null);

  useEffect(() => {
    ensureSeed();
    setArtisans(loadArtisans());
    setProducts(loadProducts());
    setStories(loadStories());
    setCart(loadCart());
    setWishlist(loadWishlist());
    setOrders(loadOrders());
    setActiveArtisanIdState(loadActiveArtisanId());
  }, []);

  // persist on change
  useEffect(() => { saveArtisans(artisans); }, [artisans]);
  useEffect(() => { saveProducts(products); }, [products]);
  useEffect(() => { saveStories(stories); }, [stories]);
  useEffect(() => { saveCart(cart); }, [cart]);
  useEffect(() => { saveWishlist(wishlist); }, [wishlist]);
  useEffect(() => { saveOrders(orders); }, [orders]);
  useEffect(() => { saveActiveArtisanId(activeArtisanId); }, [activeArtisanId]);

  const addToCart = useCallback((productId: string, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.productId === productId);
      if (existing) {
        return prev.map((c) =>
          c.productId === productId ? { ...c, quantity: c.quantity + quantity } : c
        );
      }
      return [...prev, { productId, quantity, addedAt: Date.now() }];
    });
  }, []);

  const updateCartQty = useCallback((productId: string, quantity: number) => {
    setCart((prev) =>
      quantity <= 0
        ? prev.filter((c) => c.productId !== productId)
        : prev.map((c) => (c.productId === productId ? { ...c, quantity } : c))
    );
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCart((prev) => prev.filter((c) => c.productId !== productId));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const toggleWishlist = useCallback((productId: string) => {
    setWishlist((prev) => {
      if (prev.some((w) => w.productId === productId)) {
        return prev.filter((w) => w.productId !== productId);
      }
      return [...prev, { productId, addedAt: Date.now() }];
    });
  }, []);

  const isWishlisted = useCallback(
    (productId: string) => wishlist.some((w) => w.productId === productId),
    [wishlist]
  );

  const addArtisan = useCallback(
    (a: Omit<Artisan, 'id' | 'createdAt' | 'isDemo'>): Artisan => {
      const artisan: Artisan = {
        ...a,
        id: uid('art'),
        createdAt: Date.now(),
        isDemo: false,
      };
      setArtisans((prev) => [...prev, artisan]);
      setActiveArtisanIdState(artisan.id);
      return artisan;
    },
    []
  );

  const getArtisan = useCallback(
    (id: string | null) => artisans.find((a) => a.id === id),
    [artisans]
  );

  const addProduct = useCallback<StoreContextValue['addProduct']>((p) => {
    const product: Product = {
      id: uid('prod'),
      createdAt: Date.now(),
      rating: 0,
      reviewCount: 0,
      trending: false,
      bestseller: false,
      provenance: p.provenance ?? {
        craftName: p.category,
        regionalOrigin: `${p.region}`,
        materials: p.materials,
        techniques: [],
        creationTime: p.productionTime,
        culturalSignificance: 'Demo listing — provenance details can be added by the artisan.',
        inspiration: '',
        process: [],
        sustainability: 'Illustrative — not certified.',
        artisanNotes: '',
      },
      ...p,
    } as Product;
    setProducts((prev) => [product, ...prev]);
    return product;
  }, []);

  const updateProduct = useCallback((id: string, patch: Partial<Product>) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  }, []);

  const deleteProduct = useCallback((id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const createOrder = useCallback((order: Omit<Order, 'id' | 'createdAt'>): Order => {
    const full: Order = {
      ...order,
      id: `KS${Date.now().toString(36).toUpperCase().slice(-6)}`,
      createdAt: Date.now(),
    };
    setOrders((prev) => [full, ...prev]);
    return full;
  }, []);

  const updateOrder = useCallback((id: string, patch: Partial<Order>) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, ...patch } : o)));
  }, []);

  const getOrder = useCallback((id: string) => orders.find((o) => o.id === id), [orders]);

  const setActiveArtisanId = useCallback((id: string | null) => {
    setActiveArtisanIdState(id);
  }, []);

  const resetData = useCallback(() => {
    ensureSeed(true);
    setArtisans(loadArtisans());
    setProducts(loadProducts());
    setStories(loadStories());
    setCart([]);
    setWishlist([]);
    setOrders([]);
    setActiveArtisanIdState(null);
  }, []);

  const cartCount = useMemo(
    () => cart.reduce((sum, c) => sum + c.quantity, 0),
    [cart]
  );

  const cartSubtotal = useMemo(
    () =>
      cart.reduce((sum, c) => {
        const product = products.find((p) => p.id === c.productId);
        return sum + (product ? product.price * c.quantity : 0);
      }, 0),
    [cart, products]
  );

  const wishlistCount = wishlist.length;
  const activeArtisan = artisans.find((a) => a.id === activeArtisanId) ?? null;

  const value: StoreContextValue = {
    artisans,
    products,
    stories,
    cart,
    wishlist,
    orders,
    activeArtisanId,
    activeArtisan,
    cartCount,
    cartSubtotal,
    wishlistCount,
    addToCart,
    updateCartQty,
    removeFromCart,
    clearCart,
    toggleWishlist,
    isWishlisted,
    addArtisan,
    getArtisan,
    addProduct,
    updateProduct,
    deleteProduct,
    createOrder,
    updateOrder,
    getOrder,
    setActiveArtisanId,
    resetData,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreContextValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}

export function useCartDetail() {
  const { cart, products, getArtisan } = useStore();
  return useMemo(
    () =>
      cart
        .map((item) => {
          const product = products.find((p) => p.id === item.productId);
          if (!product) return null;
          const artisan = getArtisan(product.artisanId);
          return { item, product, artisan };
        })
        .filter((x): x is NonNullable<typeof x> => x !== null),
    [cart, products, getArtisan]
  );
}

export function calcDeliveryCharge(subtotal: number): number {
  if (subtotal === 0) return 0;
  return subtotal >= CONFIG.freeDeliveryThreshold ? 0 : CONFIG.deliveryCharge;
}

export type { CustomerInfo };
