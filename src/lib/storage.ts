import { CONFIG } from '../config';
import { seedArtisans, seedProducts, seedStories } from '../data/seed';
import type {
  Artisan,
  CartItem,
  CraftStory,
  Order,
  Product,
  WishlistItem,
} from '../types';

// Safe localStorage parsing with fallback handling.
function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw == null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // If we exceed practical localStorage limits, the data will not persist,
    // but the app keeps working in-memory for the current session.
  }
}

export function ensureSeed(force = false): void {
  const seeded = localStorage.getItem(CONFIG.storageKeys.seeded);
  if (seeded && !force) return;
  write(CONFIG.storageKeys.artisans, seedArtisans);
  write(CONFIG.storageKeys.products, seedProducts);
  write(CONFIG.storageKeys.stories, seedStories);
  localStorage.setItem(CONFIG.storageKeys.seeded, '1');
}

export function resetAllData(): void {
  Object.values(CONFIG.storageKeys).forEach((k) => localStorage.removeItem(k as string));
  ensureSeed(true);
}

// --- Artisans ---
export function loadArtisans(): Artisan[] {
  return read<Artisan[]>(CONFIG.storageKeys.artisans, []);
}
export function saveArtisans(list: Artisan[]): void {
  write(CONFIG.storageKeys.artisans, list);
}

// --- Products ---
export function loadProducts(): Product[] {
  return read<Product[]>(CONFIG.storageKeys.products, []);
}
export function saveProducts(list: Product[]): void {
  write(CONFIG.storageKeys.products, list);
}

// --- Stories ---
export function loadStories(): CraftStory[] {
  return read<CraftStory[]>(CONFIG.storageKeys.stories, []);
}
export function saveStories(list: CraftStory[]): void {
  write(CONFIG.storageKeys.stories, list);
}

// --- Cart ---
export function loadCart(): CartItem[] {
  return read<CartItem[]>(CONFIG.storageKeys.cart, []);
}
export function saveCart(cart: CartItem[]): void {
  write(CONFIG.storageKeys.cart, cart);
}

// --- Wishlist ---
export function loadWishlist(): WishlistItem[] {
  return read<WishlistItem[]>(CONFIG.storageKeys.wishlist, []);
}
export function saveWishlist(list: WishlistItem[]): void {
  write(CONFIG.storageKeys.wishlist, list);
}

// --- Orders ---
export function loadOrders(): Order[] {
  return read<Order[]>(CONFIG.storageKeys.orders, []);
}
export function saveOrders(orders: Order[]): void {
  write(CONFIG.storageKeys.orders, orders);
}

// --- Active artisan (the demo-registered one for this browser) ---
export function loadActiveArtisanId(): string | null {
  return read<string | null>(CONFIG.storageKeys.activeArtisan, null);
}
export function saveActiveArtisanId(id: string | null): void {
  write(CONFIG.storageKeys.activeArtisan, id);
}
