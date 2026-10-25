import { useEffect, useState } from 'react';
import { Menu, X, ShoppingBag, Heart, Search, Store, LayoutDashboard, Sparkles } from 'lucide-react';
import { useStore } from '../store/StoreContext';
import { paths, useRouter } from '../lib/router';
import { CONFIG } from '../config';

const navItems = [
  { label: 'Home', path: paths.home },
  { label: 'Explore Crafts', path: paths.explore },
  { label: 'Our Stories', path: paths.stories },
  { label: 'Become an Artisan', path: paths.register },
  { label: 'About', path: paths.about },
  { label: 'Contact', path: paths.contact },
];

export default function Header({ onOpenCart }: { onOpenCart: () => void }) {
  const { route, navigate } = useRouter();
  const { cartCount, wishlistCount, activeArtisan } = useStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [route]);

  const go = (path: string) => { navigate(path); };
  const isActive = (path: string) => {
    if (path === '/') return route.path === '/';
    return route.path === path || route.path.startsWith(path + '/');
  };

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`${paths.explore}?q=${encodeURIComponent(query.trim())}`);
    setSearchOpen(false);
    setQuery('');
  };

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled ? 'bg-cream-50/95 shadow-soft backdrop-blur' : 'bg-cream-50'
      }`}
    >
      <div className="container-page">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <button onClick={() => go(paths.home)} className="flex items-center gap-2 focus:outline-none">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-terracotta-500 text-cream-50">
              <Sparkles className="h-5 w-5" />
            </span>
            <span className="flex flex-col leading-none">
              <span className="font-serif text-xl font-semibold text-indigo-900">{CONFIG.appName}</span>
              <span className="hidden text-[10px] uppercase tracking-wider text-terracotta-500 sm:block">
                Connecting Artisans to the World
              </span>
            </span>
          </button>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 lg:flex">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => go(item.path)}
                className={`rounded-full px-3.5 py-2 text-sm font-medium transition-colors ${
                  isActive(item.path)
                    ? 'bg-indigo-700 text-cream-50'
                    : 'text-indigo-700 hover:bg-cream-200'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setSearchOpen((s) => !s)}
              className="rounded-full p-2.5 text-indigo-700 hover:bg-cream-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-400"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>

            {activeArtisan && (
              <button
                onClick={() => go(paths.dashboard)}
                className="hidden items-center gap-1.5 rounded-full bg-moss-100 px-3 py-2 text-sm font-medium text-moss-700 hover:bg-moss-200 sm:flex"
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </button>
            )}

            <button
              onClick={() => go(paths.register)}
              className="hidden rounded-full p-2.5 text-indigo-700 hover:bg-cream-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-400 sm:block"
              aria-label="Become an artisan"
              title="Sell your craft"
            >
              <Store className="h-5 w-5" />
            </button>

            <button
              onClick={() => go(paths.explore)}
              className="relative rounded-full p-2.5 text-indigo-700 hover:bg-cream-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-400"
              aria-label="Wishlist"
            >
              <Heart className="h-5 w-5" />
              {wishlistCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-terracotta-500 px-1 text-[10px] font-bold text-cream-50 animate-scale-in">
                  {wishlistCount}
                </span>
              )}
            </button>

            <button
              onClick={onOpenCart}
              className="relative rounded-full p-2.5 text-indigo-700 hover:bg-cream-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-400"
              aria-label="Open cart"
            >
              <ShoppingBag className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-terracotta-500 px-1 text-[10px] font-bold text-cream-50 animate-scale-in">
                  {cartCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setMobileOpen((s) => !s)}
              className="rounded-full p-2.5 text-indigo-700 hover:bg-cream-200 lg:hidden"
              aria-label="Menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Search bar */}
        {searchOpen && (
          <div className="pb-3 animate-fade-down">
            <form onSubmit={submitSearch} className="flex gap-2">
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for crafts, artisans, regions…"
                className="input"
              />
              <button type="submit" className="btn-primary">Search</button>
            </form>
          </div>
        )}
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden">
          <div className="absolute inset-0 top-16 z-30 bg-indigo-900/30 backdrop-blur-sm animate-fade-in" onClick={() => setMobileOpen(false)} />
          <nav className="absolute left-0 right-0 top-16 z-40 border-b border-cream-200 bg-cream-50 px-4 py-3 shadow-card animate-fade-down">
            <ul className="space-y-1">
              {navItems.map((item) => (
                <li key={item.path}>
                  <button
                    onClick={() => go(item.path)}
                    className={`w-full rounded-xl px-4 py-3 text-left text-sm font-medium ${
                      isActive(item.path)
                        ? 'bg-indigo-700 text-cream-50'
                        : 'text-indigo-700 hover:bg-cream-200'
                    }`}
                  >
                    {item.label}
                  </button>
                </li>
              ))}
              {activeArtisan && (
                <li>
                  <button
                    onClick={() => go(paths.dashboard)}
                    className="w-full rounded-xl bg-moss-100 px-4 py-3 text-left text-sm font-medium text-moss-700"
                  >
                    Artisan Dashboard
                  </button>
                </li>
              )}
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
}
