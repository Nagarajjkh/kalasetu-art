import { useMemo, useState, useEffect } from 'react';
import { Search, SlidersHorizontal, Grid, List, X, SearchX } from 'lucide-react';
import { useStore } from '../store/StoreContext';
import { useRouter, paths } from '../lib/router';
import { formatINR } from '../lib/utils';
import type { CraftCategory } from '../types';
import ProductCard from '../components/ProductCard';
import SmartImage from '../components/SmartImage';
import { StaggerItem } from '../components/Stagger';

const allCategories: CraftCategory[] = [
  'Kasuti Embroidery',
  'Beedu Craft',
  'Coastal Crafts',
  'Handwoven Textiles',
  'Traditional Accessories',
  'Home Décor',
  'Wooden Crafts',
  'Natural Material Crafts',
];

type SortKey = 'newest' | 'price-asc' | 'price-desc' | 'popular';

export default function ExplorePage() {
  const { products, getArtisan, addToCart } = useStore();
  const { route, navigate } = useRouter();

  const [query, setQuery] = useState(route.params.q ?? '');
  const [cats, setCats] = useState<CraftCategory[]>(
    route.params.cat ? [route.params.cat as CraftCategory] : []
  );
  const [maxPrice, setMaxPrice] = useState<number>(8000);
  const [sort, setSort] = useState<SortKey>('newest');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [visible, setVisible] = useState(8);

  // sync query param changes when user uses header search again
  useEffect(() => {
    if (route.params.q !== undefined) setQuery(route.params.q);
    if (route.params.cat !== undefined) setCats([route.params.cat as CraftCategory]);
  }, [route.params.q, route.params.cat]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = products.filter((p) => {
      if (cats.length && !cats.includes(p.category)) return false;
      if (p.price > maxPrice) return false;
      if (!q) return true;
      const artisan = getArtisan(p.artisanId);
      const haystack = [
        p.name,
        p.category,
        p.region,
        p.shortDescription,
        p.materials.join(' '),
        artisan?.name ?? '',
        artisan?.town ?? '',
        artisan?.state ?? '',
      ].join(' ').toLowerCase();
      return haystack.includes(q);
    });

    list = [...list].sort((a, b) => {
      switch (sort) {
        case 'price-asc': return a.price - b.price;
        case 'price-desc': return b.price - a.price;
        case 'popular': return (b.rating * b.reviewCount) - (a.rating * a.reviewCount);
        default: return b.createdAt - a.createdAt;
      }
    });
    return list;
  }, [products, query, cats, maxPrice, sort, getArtisan]);

  const toggleCat = (c: CraftCategory) =>
    setCats((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]));

  const reset = () => {
    setQuery('');
    setCats([]);
    setMaxPrice(8000);
    setSort('newest');
    navigate(paths.explore);
  };

  const shown = filtered.slice(0, visible);

  return (
    <div className="container-page py-10">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-indigo-500">
        <button onClick={() => navigate(paths.home)} className="hover:text-terracotta-500">Home</button>
        <span className="mx-2">/</span>
        <span className="text-indigo-700">Explore Crafts</span>
      </nav>

      <div className="mb-8">
        <h1 className="font-serif text-4xl font-semibold text-indigo-900">Explore Crafts</h1>
        <p className="mt-2 text-indigo-600">Search and filter products from artisans across Karnataka.</p>
      </div>

      {/* Search + sort row */}
      <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-indigo-400" />
          <input
            value={query}
            onChange={(e) => { setQuery(e.target.value); setVisible(8); }}
            placeholder="Search products, artisans, regions…"
            className="input pl-11"
          />
          {query && (
            <button onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-indigo-400 hover:bg-cream-200" aria-label="Clear search">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <div className="flex gap-2">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="input w-auto"
            aria-label="Sort by"
          >
            <option value="newest">Newest</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="popular">Popularity</option>
          </select>
          <button
            onClick={() => setShowFilters((s) => !s)}
            className="btn-outline lg:hidden"
            aria-label="Toggle filters"
          >
            <SlidersHorizontal className="h-4 w-4" /> Filters
          </button>
          <div className="hidden rounded-full border border-cream-300 bg-cream-50 p-1 lg:flex">
            <button onClick={() => setView('grid')} className={`rounded-full p-2 ${view === 'grid' ? 'bg-indigo-700 text-cream-50' : 'text-indigo-700'}`} aria-label="Grid view"><Grid className="h-4 w-4" /></button>
            <button onClick={() => setView('list')} className={`rounded-full p-2 ${view === 'list' ? 'bg-indigo-700 text-cream-50' : 'text-indigo-700'}`} aria-label="List view"><List className="h-4 w-4" /></button>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
        {/* Filters */}
        <aside className={`${showFilters ? 'block' : 'hidden'} lg:block`}>
          <div className="card sticky top-24 p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-serif text-lg font-semibold text-indigo-900">Filters</h2>
              <button onClick={reset} className="text-xs text-terracotta-500 hover:underline">Reset all</button>
            </div>

            <fieldset className="mb-5">
              <legend className="label">Craft Category</legend>
              <div className="space-y-2">
                {allCategories.map((c) => (
                  <label key={c} className="flex cursor-pointer items-center gap-2 text-sm text-indigo-700">
                    <input
                      type="checkbox"
                      checked={cats.includes(c)}
                      onChange={() => toggleCat(c)}
                      className="h-4 w-4 rounded border-cream-400 text-terracotta-500 focus:ring-terracotta-400"
                    />
                    {c}
                  </label>
                ))}
              </div>
            </fieldset>

            <fieldset>
              <legend className="label">Max Price: {formatINR(maxPrice)}</legend>
              <input
                type="range"
                min={500}
                max={8000}
                step={100}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-terracotta-500"
              />
              <div className="flex justify-between text-xs text-indigo-400">
                <span>₹500</span>
                <span>₹8,000</span>
              </div>
            </fieldset>
          </div>
        </aside>

        {/* Results */}
        <div>
          <div className="mb-4 flex items-center justify-between text-sm text-indigo-500">
            <span>{filtered.length} {filtered.length === 1 ? 'product' : 'products'} found</span>
          </div>

          {filtered.length === 0 ? (
            <div className="card flex flex-col items-center justify-center gap-4 p-12 text-center">
              <SearchX className="h-12 w-12 text-cream-400" />
              <h3 className="font-serif text-xl text-indigo-900">No products match your filters</h3>
              <p className="text-indigo-600">Try adjusting your search or filters and try again.</p>
              <button onClick={reset} className="btn-primary">Clear all filters</button>
            </div>
          ) : view === 'grid' ? (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {shown.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          ) : (
            <ul className="space-y-4">
              {shown.map((p, i) => {
                const artisan = getArtisan(p.artisanId);
                return (
                  <StaggerItem key={p.id} index={i}>
                    <li
                      onClick={() => navigate(paths.product(p.id))}
                      className="card flex cursor-pointer gap-4 p-3 hover:-translate-y-0.5 hover:shadow-lift"
                    >
                      <SmartImage src={p.images[0]} alt={p.name} className="h-32 w-32 shrink-0 rounded-xl object-cover" />
                      <div className="flex flex-1 flex-col">
                        <h3 className="font-serif text-lg font-semibold text-indigo-900">{p.name}</h3>
                        <p className="text-xs text-indigo-500">{artisan?.name} · {p.region}</p>
                        <p className="mt-1 line-clamp-2 text-sm text-indigo-600">{p.shortDescription}</p>
                        <div className="mt-auto flex items-center justify-between">
                          <span className="font-serif text-xl font-semibold text-indigo-900">{formatINR(p.price)}</span>
                          <button
                            onClick={(e) => { e.stopPropagation(); addToCart(p.id); }}
                            className="btn-primary text-xs"
                          >
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    </li>
                  </StaggerItem>
                );
              })}
            </ul>
          )}

          {visible < filtered.length && (
            <div className="mt-8 text-center">
              <button onClick={() => setVisible((v) => v + 8)} className="btn-outline">
                Load more ({filtered.length - visible} left)
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
