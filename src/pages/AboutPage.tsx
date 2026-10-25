import { Sparkles, HandHeart, ShieldCheck, Globe, Users, Recycle, ArrowRight, Heart } from 'lucide-react';
import { useStore } from '../store/StoreContext';
import { paths, useRouter } from '../lib/router';
import SmartImage from '../components/SmartImage';
import { StaggerItem } from '../components/Stagger';

export default function AboutPage() {
  const { artisans, products, stories } = useStore();
  const { navigate } = useRouter();

  const values = [
    { icon: HandHeart, title: 'Artisans First', text: 'Every purchase goes directly to the maker. No middlemen, no factory shortcuts.' },
    { icon: ShieldCheck, title: 'Honest Craft', text: 'Natural materials, traditional techniques, and clear provenance on every piece.' },
    { icon: Globe, title: 'Direct Access', text: 'Digital storefronts connect village artisans to buyers across the country.' },
    { icon: Recycle, title: 'Sustainable Traditions', text: 'We celebrate crafts built on local materials, low waste, and long-lasting design.' },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-cream-100 to-cream-50 py-16 md:py-24">
        <div className="container-page">
          <div className="max-w-3xl animate-fade-up">
            <span className="section-eyebrow"><Sparkles className="h-4 w-4" /> About KalaSetu</span>
            <h1 className="font-serif text-4xl font-semibold leading-tight text-indigo-900 md:text-6xl">
              Connecting Artisans to the World
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-indigo-600">
              KalaSetu — from “kala” (art) and “setu” (bridge) — is a demonstration platform built to
              give traditional Indian artisans a simple digital storefront, direct buyer access,
              and a way to share the stories behind their craft.
            </p>
            <div className="mt-8 flex gap-3">
              <button onClick={() => navigate(paths.explore)} className="btn-primary">Explore Crafts <ArrowRight className="h-4 w-4" /></button>
              <button onClick={() => navigate(paths.register)} className="btn-outline">Sell Your Craft</button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="container-page -mt-8 mb-8">
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Artisan Partners', value: artisans.length, icon: Users },
            { label: 'Live Listings', value: products.length, icon: Sparkles },
            { label: 'Craft Stories', value: stories.length, icon: Heart },
          ].map((s) => (
            <div key={s.label} className="card p-6 text-center">
              <s.icon className="mx-auto h-7 w-7 text-terracotta-500" />
              <p className="mt-2 font-serif text-3xl font-semibold text-indigo-900">{s.value}</p>
              <p className="text-sm text-indigo-500">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Mission */}
      <section className="container-page py-12">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <span className="section-eyebrow">Our Mission</span>
            <h2 className="font-serif text-3xl font-semibold text-indigo-900 md:text-4xl">Every Craft Has a Story</h2>
            <p className="mt-4 leading-relaxed text-indigo-600">
              Across India, traditional crafts are disappearing — not because they are no longer
              valued, but because artisans cannot reach buyers. Kasuti embroidery, Beedu lacquerware,
              coastal shell craft: each is a living tradition carried by a handful of practitioners
              in a few villages.
            </p>
            <p className="mt-3 leading-relaxed text-indigo-600">
              KalaSetu is a hackathon demonstration showing how a simple, accessible digital
              marketplace can change that. Artisans register, list their work, share their stories,
              and receive orders directly — no advanced technical knowledge needed.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <SmartImage src="https://images.pexels.com/photos/14953193/pexels-photo-14953193.jpeg?auto=compress&cs=tinysrgb&h=650&w=940" alt="Artisan at a handloom" className="aspect-[3/4] rounded-2xl object-cover shadow-card" />
            <SmartImage src="https://images.pexels.com/photos/3145866/pexels-photo-3145866.jpeg?auto=compress&cs=tinysrgb&h=650&w=940" alt="Potter shaping clay" className="mt-8 aspect-[3/4] rounded-2xl object-cover shadow-card" />
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-cream-100 py-12">
        <div className="container-page">
          <h2 className="mb-8 text-center font-serif text-3xl font-semibold text-indigo-900">What We Stand For</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {values.map((v, i) => (
              <StaggerItem key={v.title} index={i}>
                <div className="card h-full p-6">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-terracotta-500 text-cream-50"><v.icon className="h-5 w-5" /></span>
                  <h3 className="mt-4 font-serif text-lg font-semibold text-indigo-900">{v.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-indigo-600">{v.text}</p>
                </div>
              </StaggerItem>
            ))}
          </div>
        </div>
      </section>

      {/* Demo notice */}
      <section className="container-page py-12">
        <div className="rounded-3xl border border-cream-200 bg-cream-100 p-8">
          <h2 className="font-serif text-2xl font-semibold text-indigo-900">A Note on the Demo</h2>
          <p className="mt-3 leading-relaxed text-indigo-600">
            KalaSetu is a hackathon prototype. All artisan profiles, products, stories, orders, and
            reviews shown here are illustrative demo content stored locally in your browser. No
            real payments are processed, no real orders are shipped, and no personal data is
            verified. A production version would require authentication, a backend database, secure
            image storage, a real payment gateway, and appropriate access controls.
          </p>
        </div>
      </section>
    </div>
  );
}
