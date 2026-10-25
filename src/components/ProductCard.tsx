import { Heart, ShoppingBag, Star, MapPin } from 'lucide-react';
import { useStore } from '../store/StoreContext';
import { paths, useRouter } from '../lib/router';
import { formatINR } from '../lib/utils';
import type { Product } from '../types';
import SmartImage from './SmartImage';
import { StaggerItem } from './Stagger';

interface Props {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: Props) {
  const { getArtisan, isWishlisted, toggleWishlist, addToCart } = useStore();
  const { navigate } = useRouter();
  const artisan = getArtisan(product.artisanId);
  const wished = isWishlisted(product.id);

  const goToProduct = () => navigate(paths.product(product.id));
  const goToArtisan = () => navigate(paths.artisan(product.artisanId));

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product.id, 1);
  };
  const handleWish = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <StaggerItem index={index} className="h-full">
      <article
        onClick={goToProduct}
        className="card group h-full cursor-pointer overflow-hidden hover:-translate-y-1 hover:shadow-lift"
      >
        <div className="relative aspect-[4/3] overflow-hidden">
          <SmartImage
            src={product.images[0]}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
            {product.bestseller && (
              <span className="chip bg-terracotta-500 text-cream-50 shadow">Bestseller</span>
            )}
            {product.trending && (
              <span className="chip bg-indigo-700 text-cream-50 shadow">Trending</span>
            )}
            {!product.available && (
              <span className="chip bg-indigo-900 text-cream-50 shadow">Unavailable</span>
            )}
          </div>
          <button
            onClick={handleWish}
            className={`absolute right-3 top-3 rounded-full p-2 backdrop-blur transition-colors ${
              wished ? 'bg-terracotta-500 text-cream-50' : 'bg-cream-50/80 text-indigo-700 hover:bg-cream-50'
            }`}
            aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
            aria-pressed={wished}
          >
            <Heart className={`h-4 w-4 ${wished ? 'fill-current' : ''}`} />
          </button>
        </div>

        <div className="flex flex-col gap-2 p-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="line-clamp-2 font-serif text-lg leading-snug text-indigo-900 group-hover:text-terracotta-600">
              {product.name}
            </h3>
          </div>
          <button onClick={(e) => { e.stopPropagation(); goToArtisan(); }} className="flex items-center gap-1 text-left text-xs text-indigo-500 hover:text-terracotta-500">
            <MapPin className="h-3 w-3" /> {artisan?.name ?? 'Artisan'} · {product.region}
          </button>

          {product.rating > 0 && (
            <div className="flex items-center gap-1 text-xs text-indigo-500">
              <Star className="h-3.5 w-3.5 fill-gold-400 text-gold-400" />
              <span className="font-medium text-indigo-700">{product.rating.toFixed(1)}</span>
              <span>({product.reviewCount} demo reviews)</span>
            </div>
          )}

          <div className="mt-1 flex items-center justify-between gap-2">
            <span className="font-serif text-xl font-semibold text-indigo-900">{formatINR(product.price)}</span>
            <div className="flex gap-1.5">
              <button
                onClick={handleWish}
                className="rounded-full border border-cream-300 p-2 text-indigo-700 hover:bg-cream-100 sm:hidden"
                aria-label="Toggle wishlist"
              >
                <Heart className={`h-4 w-4 ${wished ? 'fill-terracotta-500 text-terracotta-500' : ''}`} />
              </button>
              <button
                onClick={handleAdd}
                disabled={!product.available || product.quantity <= 0}
                className="btn-primary px-3 py-2 text-xs"
              >
                <ShoppingBag className="h-3.5 w-3.5" /> Add
              </button>
            </div>
          </div>
        </div>
      </article>
    </StaggerItem>
  );
}
