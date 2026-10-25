import { useEffect, useState, useCallback } from 'react';

export interface Route {
  path: string; // e.g. '/', '/explore', '/product/prod-001'
  params: Record<string, string>;
}

function parseHash(): Route {
  const hash = window.location.hash.replace(/^#/, '');
  if (!hash || hash === '/') return { path: '/', params: {} };
  const [pathPart, queryPart] = hash.split('?');
  const params: Record<string, string> = {};
  if (queryPart) {
    new URLSearchParams(queryPart).forEach((v, k) => { params[k] = v; });
  }
  return { path: pathPart, params };
}

export function useRouter() {
  const [route, setRoute] = useState<Route>(() => parseHash());

  useEffect(() => {
    const onChange = () => setRoute(parseHash());
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);

  const navigate = useCallback((path: string) => {
    window.location.hash = path;
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  return { route, navigate };
}

// Helper to build paths
export const paths = {
  home: '/',
  explore: '/explore',
  product: (id: string) => `/product/${id}`,
  artisan: (id: string) => `/artisan/${id}`,
  stories: '/stories',
  story: (id: string) => `/stories/${id}`,
  cart: '/cart',
  checkout: '/checkout',
  confirmation: (id: string) => `/order/${id}`,
  orders: '/orders',
  register: '/become-artisan',
  dashboard: '/dashboard',
  manageProducts: '/manage-products',
  manageOrders: '/manage-orders',
  about: '/about',
  contact: '/contact',
};

export function matchRoute(path: string, pattern: string): string | null {
  // returns the dynamic param value or null if no match
  const pParts = pattern.split('/').filter(Boolean);
  const sParts = path.split('/').filter(Boolean);
  if (pParts.length !== sParts.length) return null;
  for (let i = 0; i < pParts.length; i++) {
    if (pParts[i].startsWith(':')) continue;
    if (pParts[i] !== sParts[i]) return null;
  }
  // return the first dynamic segment (single-param patterns only here)
  const dynIndex = pParts.findIndex((p) => p.startsWith(':'));
  return dynIndex >= 0 ? sParts[dynIndex] : '';
}
