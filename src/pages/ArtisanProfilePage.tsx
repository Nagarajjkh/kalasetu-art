import { ArrowLeft, MapPin, Mail, Phone, Clock, Store, ChevronRight, Sparkles } from 'lucide-react';
import { useStore } from '../store/StoreContext';
import { paths, useRouter } from '../lib/router';
import { formatINR } from '../lib/utils';
import SmartImage from '../components/SmartImage';
import ProductCard from '../components/ProductCard';

interface Props { artisanId: string }

export default function ArtisanProfilePage({ artisanId }: Props) {
  const { artisans, products, stories } = useStore();
  const { navigate } = useRouter();
  const artisan = artisans.find((a) => a.id === artisanId);

  if (!artisan) {
    return (
      <div className="container-page py-20 text-center">
        <h1 className="font-serif text-3xl font-semibold text-indigo-900">Artisan not found</h1>
        <button onClick={() => navigate(paths.explore)} className="mt-6 btn-primary">Browse the marketplace</button>
      </div>
    );
  }

  const myProducts = products.filter((p) => p.artisanId === artisanId);
  const myStories = stories.filter((s) => s.artisanId === artisanId);

  return (
    <div>
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-800 to-indigo-900 text-cream-50">
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-terracotta-500/20 blur-3xl" />
        <div className="container-page relative py-12">
          <button onClick={() => navigate(paths.explore)} className="mb-6 inline-flex items-center gap-1 text-sm text-cream-200 hover:text-cream-50">
            <ArrowLeft className="h-4 w-4" /> Back to marketplace
          </button>
          <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
            <SmartImage src={artisan.profileImage} alt={artisan.name} className="h-32 w-32 rounded-3xl object-cover shadow-lift ring-4 ring-cream-50/20" />
            <div>
              <span className="section-eyebrow text-terracotta-300"><Store className="h-4 w-4" /> Artisan Storefront</span>
              <h1 className="font-serif text-3xl font-semibold md:text-4xl">{artisan.name}</h1>
              <p className="mt-1 text-cream-200">{artisan.businessName}</p>
              <div className="mt-3 flex flex-wrap gap-4 text-sm text-cream-200">
                <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4 text-terracotta-300" /> {artisan.village}, {artisan.state}</span>
                <span className="flex items-center gap-1.5"><Clock className="h-4 w-4 text-terracotta-300" /> {artisan.yearsExperience} years of craft</span>
                <span className="flex items-center gap-1.5"><Sparkles className="h-4 w-4 text-terracotta-300" /> {artisan.category}</span>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {artisan.specialties.map((s) => (
                  <span key={s} className="chip bg-indigo-700 text-cream-100">{s}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-page py-12">
        <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
          {/* Bio / story */}
          <div>
            <h2 className="font-serif text-2xl font-semibold text-indigo-900">Craft Story</h2>
            <p className="mt-3 leading-relaxed text-indigo-700">{artisan.story}</p>

            {artisan.bio && artisan.bio !== artisan.story && (
              <p className="mt-3 leading-relaxed text-indigo-700">{artisan.bio}</p>
            )}

            {/* Products */}
            <h2 className="mt-10 font-serif text-2xl font-semibold text-indigo-900">Products by {artisan.name.split(' ')[0]}</h2>
            {myProducts.length === 0 ? (
              <p className="mt-4 text-indigo-600">This artisan has not listed any products yet.</p>
            ) : (
              <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3">
                {myProducts.map((p, i) => (
                  <ProductCard key={p.id} product={p} index={i} />
                ))}
              </div>
            )}

            {/* Stories */}
            {myStories.length > 0 && (
              <div className="mt-10">
                <h2 className="font-serif text-2xl font-semibold text-indigo-900">Craft Stories</h2>
                <div className="mt-4 space-y-4">
                  {myStories.map((s) => (
                    <button key={s.id} onClick={() => navigate(paths.story(s.id))} className="card group flex w-full gap-4 p-3 text-left hover:-translate-y-0.5 hover:shadow-lift">
                      <SmartImage src={s.heroImage} alt={s.title} className="h-24 w-24 shrink-0 rounded-xl object-cover" />
                      <div className="flex flex-col justify-center">
                        <h3 className="font-serif text-lg font-semibold text-indigo-900 group-hover:text-terracotta-500">{s.title}</h3>
                        <p className="mt-1 line-clamp-2 text-sm text-indigo-600">{s.excerpt}</p>
                        <span className="mt-1 inline-flex items-center gap-1 text-sm font-medium text-terracotta-500">Read story <ChevronRight className="h-4 w-4" /></span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <div className="card p-5">
              <h3 className="font-serif text-lg font-semibold text-indigo-900">Contact</h3>
              <ul className="mt-3 space-y-2 text-sm text-indigo-600">
                <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-terracotta-500" /> {artisan.phone}</li>
                <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-terracotta-500" /> {artisan.email}</li>
                <li className="flex items-center gap-2"><MapPin className="h-4 w-4 text-terracotta-500" /> {artisan.village}, {artisan.town}, {artisan.district}, {artisan.state}</li>
              </ul>
              {artisan.isDemo && (
                <p className="mt-4 rounded-lg bg-cream-100 p-2 text-xs text-indigo-500">This is a demo artisan profile from the seed data.</p>
              )}
            </div>
            {myProducts.length > 0 && (
              <div className="card p-5">
                <h3 className="font-serif text-lg font-semibold text-indigo-900">Quick Stats</h3>
                <div className="mt-3 space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-indigo-600">Products</span><span className="font-medium text-indigo-900">{myProducts.length}</span></div>
                  <div className="flex justify-between"><span className="text-indigo-600">Price range</span><span className="font-medium text-indigo-900">{formatINR(Math.min(...myProducts.map((p) => p.price)))}–{formatINR(Math.max(...myProducts.map((p) => p.price)))}</span></div>
                  <div className="flex justify-between"><span className="text-indigo-600">Total stock</span><span className="font-medium text-indigo-900">{myProducts.reduce((s, p) => s + p.quantity, 0)}</span></div>
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
