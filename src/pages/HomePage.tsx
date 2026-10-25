import { useState } from 'react';
import {
  ArrowRight, ShoppingBag, Store, Search, Truck, ShieldCheck, HandHeart, Sparkles,
  Star, MapPin, Quote,
} from 'lucide-react';
import { useStore } from '../store/StoreContext';
import { paths, useRouter } from '../lib/router';
import SmartImage from '../components/SmartImage';
import ProductCard from '../components/ProductCard';
import { StaggerItem } from '../components/Stagger';
import type { CraftCategory } from '../types';

const categories: { name: CraftCategory; blurb: string; image: string }[] = [
  { name: 'Kasuti Embroidery', blurb: 'Counted-thread silkwork from North Karnataka', image: 'https://images.pexels.com/photos/35251793/pexels-photo-35251793.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
  { name: 'Beedu Craft', blurb: 'Natural lacquerware from the Malnad forests', image: 'https://images.pexels.com/photos/31703678/pexels-photo-31703678.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
  { name: 'Coastal Crafts', blurb: 'Shell and coconut work from the Karavali', image: 'https://images.pexels.com/photos/33186303/pexels-photo-33186303.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
  { name: 'Handwoven Textiles', blurb: 'Pit-loom sarees and stoles from Ilkal', image: 'https://images.pexels.com/photos/24738158/pexels-photo-24738158.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
  { name: 'Home Décor', blurb: 'Wood-fired terracotta for the modern home', image: 'https://images.pexels.com/photos/10066333/pexels-photo-10066333.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
  { name: 'Wooden Crafts', blurb: 'Turned and polished natural-wood pieces', image: 'https://images.pexels.com/photos/2491244/pexels-photo-2491244.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
];

const testimonials = [
  { name: 'Ananya R.', city: 'Bengaluru', text: 'The Kasuti wall hanging is even more beautiful in person. I loved reading the artisan’s story before buying.' },
  { name: 'Daniel P.', city: 'Panaji', text: 'The Beedu spice box has become the centrepiece of my kitchen. Knowing the artisan made it by hand feels special.' },
  { name: 'Meera S.', city: 'Mysuru', text: 'Checkout was simple and the WhatsApp order option made it easy to confirm details with the artisan directly.' },
];

export default function HomePage() {
  const { products, artisans, stories } = useStore();
  const { navigate } = useRouter();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [emailError, setEmailError] = useState('');

  const bestsellers = products.filter((p) => p.bestseller).slice(0, 4);
  const trending = products.filter((p) => p.trending).slice(0, 8);
  const featuredArtisans = artisans.slice(0, 3);

  const subscribe = (e: React.FormEvent) => {
    e.preventDefault();
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!valid) {
      setEmailError('Please enter a valid email address.');
      return;
    }
    setEmailError('');
    setSubscribed(true);
    setEmail('');
  };

  const stats = [
    { label: 'Artisan Partners', value: artisans.length },
    { label: 'Live Listings', value: products.length },
    { label: 'Craft Stories', value: stories.length },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-cream-100 to-cream-50">
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-terracotta-100/60 blur-3xl animate-float" />
        <div className="absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-indigo-100/60 blur-3xl animate-float" style={{ animationDelay: '1.5s' }} />
        <div className="container-page relative py-16 md:py-24">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="animate-fade-up">
              <span className="section-eyebrow">
                <Sparkles className="h-4 w-4" /> A celebration of Indian handicrafts
              </span>
              <h1 className="font-serif text-4xl font-semibold leading-tight text-indigo-900 md:text-6xl">
                Handmade with Heritage.
                <span className="block text-terracotta-500">Shared with the World.</span>
              </h1>
              <p className="mt-6 max-w-md text-lg leading-relaxed text-indigo-600">
                KalaSetu connects traditional Indian artisans directly with buyers.
                Discover Kasuti embroidery, Beedu craft, and coastal handicrafts — and read the
                stories behind every piece.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <button onClick={() => navigate(paths.explore)} className="btn-primary text-base">
                  Explore Crafts <ArrowRight className="h-4 w-4" />
                </button>
                <button onClick={() => navigate(paths.register)} className="btn-outline text-base">
                  Sell Your Craft <Store className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-10 flex gap-8">
                {stats.map((s) => (
                  <div key={s.label}>
                    <div className="font-serif text-3xl font-semibold text-indigo-900">{s.value}</div>
                    <div className="text-xs uppercase tracking-wider text-indigo-500">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative grid grid-cols-2 gap-4">
              <div className="animate-fade-up" style={{ animationDelay: '0.15s' }}>
                <SmartImage
                  src="https://images.pexels.com/photos/35251793/pexels-photo-35251793.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
                  alt="Kasuti embroidery in a hoop"
                  className="aspect-[3/4] w-full rounded-3xl object-cover shadow-lift"
                />
              </div>
              <div className="mt-10 animate-fade-up" style={{ animationDelay: '0.3s' }}>
                <SmartImage
                  src="https://images.pexels.com/photos/14953193/pexels-photo-14953193.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
                  alt="Indian artisan at a handloom"
                  className="aspect-[3/4] w-full rounded-3xl object-cover shadow-lift"
                />
              </div>
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 rounded-2xl border border-cream-200 bg-cream-50 px-5 py-3 text-center shadow-card animate-scale-in" style={{ animationDelay: '0.5s' }}>
                <p className="text-xs text-indigo-500">Every Craft Has a Story</p>
                <p className="font-serif text-lg font-semibold text-indigo-900">Every Artisan Deserves a Market</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container-page py-16">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <span className="section-eyebrow">Browse by craft</span>
            <h2 className="font-serif text-3xl font-semibold text-indigo-900 md:text-4xl">Traditional Craft Categories</h2>
          </div>
          <button onClick={() => navigate(paths.explore)} className="hidden btn-ghost sm:inline-flex">
            View all <ArrowRight className="h-4 w-4" />
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {categories.map((cat, i) => (
            <StaggerItem key={cat.name} index={i}>
              <button
                onClick={() => navigate(`${paths.explore}?cat=${encodeURIComponent(cat.name)}`)}
                className="group relative block w-full overflow-hidden rounded-2xl text-left"
              >
                <SmartImage
                  src={cat.image}
                  alt={cat.name}
                  className="aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/80 via-indigo-900/20 to-transparent" />
                <div className="absolute bottom-0 p-4">
                  <h3 className="font-serif text-xl font-semibold text-cream-50">{cat.name}</h3>
                  <p className="mt-1 text-sm text-cream-100 opacity-90">{cat.blurb}</p>
                </div>
              </button>
            </StaggerItem>
          ))}
        </div>
      </section>

      {/* Bestsellers */}
      <section className="bg-cream-100 py-16">
        <div className="container-page">
          <div className="mb-8">
            <span className="section-eyebrow">Loved by customers</span>
            <h2 className="font-serif text-3xl font-semibold text-indigo-900 md:text-4xl">Bestselling Crafts</h2>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {bestsellers.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured artisans / Meet the Maker */}
      <section className="container-page py-16">
        <div className="mb-8">
          <span className="section-eyebrow">Meet the Maker</span>
          <h2 className="font-serif text-3xl font-semibold text-indigo-900 md:text-4xl">Featured Artisans</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {featuredArtisans.map((a, i) => (
            <StaggerItem key={a.id} index={i}>
              <button
                onClick={() => navigate(paths.artisan(a.id))}
                className="card group w-full overflow-hidden text-left hover:-translate-y-1 hover:shadow-lift"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <SmartImage src={a.profileImage} alt={a.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/70 to-transparent" />
                  <div className="absolute bottom-3 left-4 right-4">
                    <h3 className="font-serif text-xl font-semibold text-cream-50">{a.name}</h3>
                    <p className="flex items-center gap-1 text-sm text-cream-100">
                      <MapPin className="h-3.5 w-3.5" /> {a.village}, {a.state}
                    </p>
                  </div>
                </div>
                <div className="p-4">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-terracotta-500">{a.category}</p>
                  <p className="line-clamp-3 text-sm leading-relaxed text-indigo-600">{a.bio}</p>
                  <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-indigo-700 group-hover:text-terracotta-500">
                    Read story <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </button>
            </StaggerItem>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-indigo-900 py-16 text-cream-50">
        <div className="container-page">
          <div className="mb-10 text-center">
            <span className="section-eyebrow text-terracotta-300">How KalaSetu works</span>
            <h2 className="font-serif text-3xl font-semibold md:text-4xl">A simple path from artisan to you</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { icon: Search, title: 'Discover Crafts', text: 'Browse handcrafted products, search by region or craft, and read the story behind each piece.' },
              { icon: ShoppingBag, title: 'Order Simply', text: 'Add to cart, choose a mock payment or a WhatsApp order request, and check out in minutes.' },
              { icon: Truck, title: 'Direct Delivery', text: 'Your order reaches the artisan, who confirms it and ships it directly to your address.' },
            ].map((step, i) => (
              <StaggerItem key={step.title} index={i}>
                <div className="h-full rounded-2xl border border-indigo-700 bg-indigo-800 p-6">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-terracotta-500 text-cream-50">
                    <step.icon className="h-6 w-6" />
                  </span>
                  <h3 className="mt-4 font-serif text-xl font-semibold">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-indigo-100">{step.text}</p>
                </div>
              </StaggerItem>
            ))}
          </div>
        </div>
      </section>

      {/* Why buy handmade */}
      <section className="container-page py-16">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <span className="section-eyebrow">Why Buy Handmade?</span>
            <h2 className="font-serif text-3xl font-semibold text-indigo-900 md:text-4xl">Every purchase keeps a craft alive</h2>
            <p className="mt-4 leading-relaxed text-indigo-600">
              When you buy from KalaSetu, your money goes directly to the artisan who made the piece —
              not a chain of middlemen. You help preserve a craft tradition that has been passed
              down for generations, and you receive something made with intention, not mass-produced.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                { icon: HandHeart, text: 'Fair, direct income for artisans and their families.' },
                { icon: ShieldCheck, text: 'Natural materials and traditional techniques — no factory shortcuts.' },
                { icon: Sparkles, text: 'One-of-a-kind pieces with a real story behind them.' },
              ].map((item) => (
                <li key={item.text} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-terracotta-100 text-terracotta-600">
                    <item.icon className="h-4 w-4" />
                  </span>
                  <span className="text-indigo-700">{item.text}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <SmartImage src="https://images.pexels.com/photos/36774467/pexels-photo-36774467.jpeg?auto=compress&cs=tinysrgb&h=650&w=940" alt="Artisan shaping clay" className="aspect-[3/4] w-full rounded-3xl object-cover shadow-card" />
            <SmartImage src="https://images.pexels.com/photos/35623922/pexels-photo-35623922.jpeg?auto=compress&cs=tinysrgb&h=650&w=940" alt="Embroidery in a hoop" className="mt-8 aspect-[3/4] w-full rounded-3xl object-cover shadow-card" />
          </div>
        </div>
      </section>

      {/* Trending */}
      <section className="bg-cream-100 py-16">
        <div className="container-page">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <span className="section-eyebrow">Fresh from the loom</span>
              <h2 className="font-serif text-3xl font-semibold text-indigo-900 md:text-4xl">Trending Now</h2>
            </div>
            <button onClick={() => navigate(paths.explore)} className="btn-ghost">View all <ArrowRight className="h-4 w-4" /></button>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {trending.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Regional collection */}
      <section className="container-page py-16">
        <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-800 to-indigo-900 p-8 md:p-12">
          <div className="grid items-center gap-8 lg:grid-cols-2">
            <div className="text-cream-50">
              <span className="section-eyebrow text-terracotta-300">Featured Regional Collection</span>
              <h2 className="font-serif text-3xl font-semibold md:text-4xl">The Karnataka Heritage Edit</h2>
              <p className="mt-4 leading-relaxed text-indigo-100">
                A curated selection of crafts from across Karnataka — from the counted-thread
                Kasuti of Haveri to the wood-fired terracotta of Kundapura. Each piece is made by
                hand by an artisan you can read about.
              </p>
              <button
                onClick={() => navigate(`${paths.stories}`)}
                className="mt-6 btn-primary text-base"
              >
                Explore the Stories <ArrowRight className="h-4 w-4" />
              </button>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {products.slice(0, 6).map((p) => (
                <button key={p.id} onClick={() => navigate(paths.product(p.id))} className="overflow-hidden rounded-xl">
                  <SmartImage src={p.images[0]} alt={p.name} className="aspect-square w-full object-cover transition-transform hover:scale-105" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-cream-100 py-16">
        <div className="container-page">
          <div className="mb-8 text-center">
            <span className="section-eyebrow">Sample demo content</span>
            <h2 className="font-serif text-3xl font-semibold text-indigo-900 md:text-4xl">What Customers Say</h2>
            <p className="mt-2 text-sm text-indigo-500">These testimonials are illustrative demo content.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <StaggerItem key={t.name} index={i}>
                <figure className="card h-full p-6">
                  <Quote className="h-8 w-8 text-terracotta-300" />
                  <blockquote className="mt-3 leading-relaxed text-indigo-700">{t.text}</blockquote>
                  <figcaption className="mt-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-700 font-serif text-cream-50">
                      {t.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-indigo-900">{t.name}</p>
                      <p className="text-xs text-indigo-500">{t.city}</p>
                    </div>
                    <div className="ml-auto flex">
                      {[0, 1, 2, 3, 4].map((s) => (
                        <Star key={s} className="h-4 w-4 fill-gold-400 text-gold-400" />
                      ))}
                    </div>
                  </figcaption>
                </figure>
              </StaggerItem>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="container-page py-16">
        <div className="overflow-hidden rounded-3xl border border-cream-200 bg-cream-100 p-8 text-center md:p-12">
          <div className="mx-auto max-w-xl">
            <span className="section-eyebrow">Stay in the loop</span>
            <h2 className="font-serif text-3xl font-semibold text-indigo-900">Get new craft stories in your inbox</h2>
            <p className="mt-2 text-indigo-600">
              We will send you new artisan stories and product launches. No spam — just crafts.
            </p>
            {subscribed ? (
              <div className="mt-6 rounded-xl bg-moss-100 p-4 text-moss-700 animate-scale-in">
                Thank you for subscribing! (This is a simulated confirmation — no email was sent.)
              </div>
            ) : (
              <form onSubmit={subscribe} className="mt-6 flex flex-col gap-3 sm:flex-row">
                <div className="flex-1 text-left">
                  <label htmlFor="newsletter-email" className="sr-only">Email address</label>
                  <input
                    id="newsletter-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="input"
                    aria-invalid={!!emailError}
                  />
                  {emailError && <p className="mt-1 text-xs text-terracotta-500">{emailError}</p>}
                </div>
                <button type="submit" className="btn-primary">Subscribe</button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
