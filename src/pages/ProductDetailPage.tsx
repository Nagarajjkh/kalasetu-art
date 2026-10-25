import { useState } from 'react';
import {
  Heart, ShoppingBag, Minus, Plus, Star, MapPin, Truck, Clock, Check, ArrowLeft,
  ScrollText, Recycle, Sparkles, ChevronRight,
} from 'lucide-react';
import { useStore } from '../store/StoreContext';
import { paths, useRouter } from '../lib/router';
import { formatINR } from '../lib/utils';
import SmartImage from '../components/SmartImage';
import ProductCard from '../components/ProductCard';

interface Props { productId: string }

export default function ProductDetailPage({ productId }: Props) {
  const { products, getArtisan, addToCart, toggleWishlist, isWishlisted } = useStore();
  const { navigate } = useRouter();
  const product = products.find((p) => p.id === productId);
  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  if (!product) {
    return (
      <div className="container-page py-20 text-center">
        <h1 className="font-serif text-3xl text-indigo-900">Product not found</h1>
        <p className="mt-2 text-indigo-600">This listing may have been removed.</p>
        <button onClick={() => navigate(paths.explore)} className="mt-6 btn-primary">Browse the marketplace</button>
      </div>
    );
  }

  const artisan = getArtisan(product.artisanId);
  const wished = isWishlisted(product.id);
  const related = products.filter((p) => p.id !== product.id && p.category === product.category).slice(0, 4);

  const handleAdd = () => {
    addToCart(product.id, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const maxQty = Math.max(1, product.quantity);

  return (
    <div className="container-page py-8">
      <nav className="mb-6 flex items-center gap-2 text-sm text-indigo-500">
        <button onClick={() => navigate(paths.home)} className="hover:text-terracotta-500">Home</button>
        <ChevronRight className="h-3 w-3" />
        <button onClick={() => navigate(paths.explore)} className="hover:text-terracotta-500">Explore</button>
        <ChevronRight className="h-3 w-3" />
        <span className="line-clamp-1 text-indigo-700">{product.name}</span>
      </nav>

      <button onClick={() => navigate(paths.explore)} className="mb-4 inline-flex items-center gap-1 text-sm text-indigo-600 hover:text-terracotta-500">
        <ArrowLeft className="h-4 w-4" /> Back to marketplace
      </button>

      <div className="grid gap-10 lg:grid-cols-2">
        {/* Gallery */}
        <div>
          <div className="overflow-hidden rounded-3xl shadow-card animate-fade-in">
            <SmartImage
              key={activeImg}
              src={product.images[activeImg]}
              alt={product.name}
              className="aspect-square w-full object-cover animate-fade-in"
            />
          </div>
          <div className="mt-4 grid grid-cols-4 gap-3">
            {product.images.map((src, i) => (
              <button
                key={i}
                onClick={() => setActiveImg(i)}
                className={`overflow-hidden rounded-xl border-2 transition-colors ${
                  i === activeImg ? 'border-terracotta-500' : 'border-transparent hover:border-cream-300'
                }`}
                aria-label={`View image ${i + 1}`}
              >
                <SmartImage src={src} alt={`${product.name} view ${i + 1}`} className="aspect-square w-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="animate-fade-up">
          <div className="flex flex-wrap gap-2">
            <span className="chip bg-cream-200 text-indigo-700">{product.category}</span>
            {product.bestseller && <span className="chip bg-terracotta-500 text-cream-50">Bestseller</span>}
            {product.trending && <span className="chip bg-indigo-700 text-cream-50">Trending</span>}
          </div>
          <h1 className="mt-3 font-serif text-3xl font-semibold leading-tight text-indigo-900 md:text-4xl">{product.name}</h1>

          <button
            onClick={() => artisan && navigate(paths.artisan(artisan.id))}
            className="mt-3 inline-flex items-center gap-1.5 text-sm text-indigo-600 hover:text-terracotta-500"
          >
            <MapPin className="h-4 w-4 text-terracotta-500" />
            By {artisan?.name ?? 'Artisan'} · {product.region}
          </button>

          {product.rating > 0 && (
            <div className="mt-2 flex items-center gap-1 text-sm">
              <div className="flex">
                {[0, 1, 2, 3, 4].map((s) => (
                  <Star key={s} className={`h-4 w-4 ${s < Math.round(product.rating) ? 'fill-gold-400 text-gold-400' : 'text-cream-300'}`} />
                ))}
              </div>
              <span className="font-medium text-indigo-700">{product.rating.toFixed(1)}</span>
              <span className="text-indigo-400">({product.reviewCount} demo reviews)</span>
            </div>
          )}

          <p className="mt-4 font-serif text-4xl font-semibold text-indigo-900">{formatINR(product.price)}</p>

          <p className="mt-4 leading-relaxed text-indigo-600">{product.description}</p>

          {/* Quick facts */}
          <ul className="mt-5 grid grid-cols-2 gap-3 text-sm">
            <li className="flex items-center gap-2 text-indigo-700"><Clock className="h-4 w-4 text-terracotta-500" /> Production: {product.productionTime}</li>
            <li className="flex items-center gap-2 text-indigo-700"><Truck className="h-4 w-4 text-terracotta-500" /> Dispatch: {product.dispatchTime}</li>
            <li className="flex items-center gap-2 text-indigo-700">
              <Check className="h-4 w-4 text-moss-500" /> {product.quantity > 0 ? `${product.quantity} in stock` : 'Out of stock'}
            </li>
            <li className="flex items-center gap-2 text-indigo-700"><Sparkles className="h-4 w-4 text-terracotta-500" /> Handmade</li>
          </ul>

          <div className="mt-4 text-sm text-indigo-700">
            <span className="font-medium">Materials:</span> {product.materials.join(', ')}
          </div>

          {/* Quantity + actions */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 rounded-full border border-cream-300 bg-cream-50 p-1">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="rounded-full p-2 text-indigo-700 hover:bg-cream-200" aria-label="Decrease quantity">
                <Minus className="h-4 w-4" />
              </button>
              <span className="min-w-8 text-center font-medium">{qty}</span>
              <button onClick={() => setQty((q) => Math.min(maxQty, q + 1))} className="rounded-full p-2 text-indigo-700 hover:bg-cream-200" aria-label="Increase quantity" disabled={qty >= maxQty}>
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <span className="text-xs text-indigo-500">Max {product.quantity} available</span>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              onClick={handleAdd}
              disabled={product.quantity <= 0}
              className="btn-primary text-base"
            >
              <ShoppingBag className="h-4 w-4" />
              {added ? 'Added to cart!' : 'Add to Cart'}
            </button>
            <button
              onClick={() => toggleWishlist(product.id)}
              className={`btn-outline text-base ${wished ? 'border-terracotta-300 text-terracotta-600' : ''}`}
            >
              <Heart className={`h-4 w-4 ${wished ? 'fill-terracotta-500 text-terracotta-500' : ''}`} />
              {wished ? 'Saved' : 'Save'}
            </button>
            <button onClick={() => navigate(paths.cart)} className="btn-ghost text-base">View Cart</button>
          </div>

          {/* Provenance teaser */}
          <div className="mt-8 rounded-2xl border border-cream-200 bg-cream-100 p-5">
            <h3 className="flex items-center gap-2 font-serif text-lg font-semibold text-indigo-900">
              <ScrollText className="h-5 w-5 text-terracotta-500" /> The Story Behind This Piece
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-indigo-600">
              <span className="font-medium">Craft:</span> {product.provenance.craftName} · <span className="font-medium">Region:</span> {product.provenance.regionalOrigin}
            </p>
            <p className="mt-1 text-sm leading-relaxed text-indigo-600">{product.provenance.culturalSignificance}</p>
            <button
              onClick={() => artisan && navigate(paths.artisan(artisan.id))}
              className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-terracotta-500 hover:text-terracotta-600"
            >
              Discover the full story <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Full provenance */}
      <section className="mt-16">
        <h2 className="mb-6 font-serif text-3xl font-semibold text-indigo-900">Provenance & Craft</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="card p-6">
            <h3 className="font-serif text-lg font-semibold text-indigo-900">Materials & Techniques</h3>
            <p className="mt-2 text-sm text-indigo-600"><span className="font-medium text-indigo-700">Materials:</span> {product.provenance.materials.join(', ')}</p>
            {product.provenance.techniques.length > 0 && (
              <p className="mt-1 text-sm text-indigo-600"><span className="font-medium text-indigo-700">Techniques:</span> {product.provenance.techniques.join(', ')}</p>
            )}
            <p className="mt-1 text-sm text-indigo-600"><span className="font-medium text-indigo-700">Creation time:</span> {product.provenance.creationTime}</p>
          </div>
          <div className="card p-6">
            <h3 className="flex items-center gap-2 font-serif text-lg font-semibold text-indigo-900">
              <Recycle className="h-5 w-5 text-moss-500" /> Sustainability
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-indigo-600">{product.provenance.sustainability}</p>
          </div>
        </div>

        <div className="mt-6 card p-6">
          <h3 className="font-serif text-lg font-semibold text-indigo-900">Cultural Significance</h3>
          <p className="mt-2 leading-relaxed text-indigo-600">{product.provenance.culturalSignificance}</p>
          {product.provenance.inspiration && (
            <p className="mt-3 leading-relaxed text-indigo-600">
              <span className="font-medium text-indigo-700">Inspiration:</span> {product.provenance.inspiration}
            </p>
          )}
        </div>

        {product.provenance.process.length > 0 && (
          <div className="mt-6 card p-6">
            <h3 className="font-serif text-lg font-semibold text-indigo-900">The Making Process</h3>
            <ol className="mt-4 space-y-3">
              {product.provenance.process.map((step, i) => (
                <li key={i} className="flex gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-terracotta-100 text-sm font-semibold text-terracotta-600">{i + 1}</span>
                  <span className="pt-0.5 text-indigo-700">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        )}

        {product.provenance.artisanNotes && (
          <div className="mt-6 card p-6">
            <h3 className="font-serif text-lg font-semibold text-indigo-900">From the Artisan</h3>
            <blockquote className="mt-3 border-l-4 border-terracotta-300 pl-4 italic leading-relaxed text-indigo-700">
              “{product.provenance.artisanNotes}”
            </blockquote>
          </div>
        )}
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-6 font-serif text-3xl font-semibold text-indigo-900">You May Also Like</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {related.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        </section>
      )}
    </div>
  );
}
