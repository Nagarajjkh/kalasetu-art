import { ArrowRight, BookOpen, ChevronRight } from 'lucide-react';
import { useStore } from '../store/StoreContext';
import { paths, useRouter } from '../lib/router';
import { formatDate } from '../lib/utils';
import SmartImage from '../components/SmartImage';
import { StaggerItem } from '../components/Stagger';

export default function StoriesPage() {
  const { stories, products } = useStore();
  const { navigate } = useRouter();

  const regionalCollections = stories.reduce<Record<string, typeof stories>>((acc, s) => {
    (acc[s.region] ??= []).push(s);
    return acc;
  }, {});

  return (
    <div className="container-page py-10">
      <nav className="mb-6 text-sm text-indigo-500">
        <button onClick={() => navigate(paths.home)} className="hover:text-terracotta-500">Home</button>
        <span className="mx-2">/</span>
        <span className="text-indigo-700">Our Stories</span>
      </nav>

      <div className="mb-10 max-w-2xl">
        <span className="section-eyebrow"><BookOpen className="h-4 w-4" /> Craft Storytelling & Provenance</span>
        <h1 className="font-serif text-4xl font-semibold text-indigo-900 md:text-5xl">Our Stories</h1>
        <p className="mt-3 text-lg leading-relaxed text-indigo-600">
          Every craft on KalaSetu carries a story — of a region, a tradition, and a pair of hands.
          Read editorial features on the crafts of Karnataka, the artisans who keep them alive,
          and the process behind every piece. All content is illustrative demo material.
        </p>
      </div>

      {/* Featured story */}
      {stories[0] && (
        <button
          onClick={() => navigate(paths.story(stories[0].id))}
          className="group mb-12 block w-full overflow-hidden rounded-3xl text-left shadow-card"
        >
          <div className="relative grid items-end gap-0 md:grid-cols-2">
            <SmartImage src={stories[0].heroImage} alt={stories[0].title} className="aspect-[16/10] w-full object-cover md:aspect-square" />
            <div className="bg-indigo-900 p-8 text-cream-50 md:p-10">
              <span className="section-eyebrow text-terracotta-300">Featured Story</span>
              <h2 className="font-serif text-3xl font-semibold md:text-4xl">{stories[0].title}</h2>
              <p className="mt-2 text-cream-200">{stories[0].subtitle}</p>
              <p className="mt-4 leading-relaxed text-indigo-100">{stories[0].excerpt}</p>
              <p className="mt-4 text-xs text-indigo-300">Published {formatDate(stories[0].publishedAt)} · {stories[0].region}</p>
              <span className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-terracotta-300 group-hover:text-terracotta-200">
                Read the full story <ArrowRight className="h-4 w-4" />
              </span>
            </div>
          </div>
        </button>
      )}

      {/* All stories */}
      <section className="mb-12">
        <h2 className="mb-6 font-serif text-2xl font-semibold text-indigo-900">All Craft Stories</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {stories.map((s, i) => (
            <StaggerItem key={s.id} index={i}>
              <button
                onClick={() => navigate(paths.story(s.id))}
                className="card group h-full overflow-hidden text-left hover:-translate-y-1 hover:shadow-lift"
              >
                <SmartImage src={s.heroImage} alt={s.title} className="aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="p-5">
                  <span className="chip bg-terracotta-100 text-terracotta-600">{s.category}</span>
                  <h3 className="mt-2 font-serif text-xl font-semibold text-indigo-900 group-hover:text-terracotta-600">{s.title}</h3>
                  <p className="mt-1 text-xs text-indigo-500">{s.region} · {formatDate(s.publishedAt)}</p>
                  <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-indigo-600">{s.excerpt}</p>
                  <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-terracotta-500">
                    Read story <ChevronRight className="h-4 w-4" />
                  </span>
                </div>
              </button>
            </StaggerItem>
          ))}
        </div>
      </section>

      {/* Regional craft collections */}
      <section>
        <h2 className="mb-6 font-serif text-2xl font-semibold text-indigo-900">Regional Craft Collections</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {Object.entries(regionalCollections).map(([region, regionStories]) => {
            const first = regionStories[0];
            const relatedProducts = products.filter((p) => p.provenance.regionalOrigin.includes(region) || p.region.includes(region.split(',')[0])).slice(0, 3);
            return (
              <div key={region} className="card overflow-hidden">
                <SmartImage src={first.heroImage} alt={region} className="aspect-[16/10] w-full object-cover" />
                <div className="p-5">
                  <h3 className="font-serif text-lg font-semibold text-indigo-900">{region}</h3>
                  <p className="mt-1 text-sm text-indigo-600">{regionStories.length} {regionStories.length === 1 ? 'story' : 'stories'} from this region</p>
                  {relatedProducts.length > 0 && (
                    <div className="mt-3 flex gap-2">
                      {relatedProducts.map((p) => (
                        <button key={p.id} onClick={() => navigate(paths.product(p.id))} className="overflow-hidden rounded-lg">
                          <SmartImage src={p.images[0]} alt={p.name} className="h-14 w-14 object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                  <button onClick={() => navigate(paths.story(first.id))} className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-terracotta-500 hover:underline">
                    Explore collection <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Craft origin teaser */}
      <section className="mt-12 rounded-3xl bg-cream-100 p-8 md:p-10">
        <h2 className="font-serif text-2xl font-semibold text-indigo-900">Craft Origin Map</h2>
        <p className="mt-2 max-w-2xl text-indigo-600">
          Our crafts span the state of Karnataka — from the counted-thread embroidery of Haveri in
          the north to the wood-fired pottery of Kundapura on the coast. Every product page on
          KalaSetu includes a provenance section explaining who made it, where, and how.
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {stories.map((s) => (
            <div key={s.id} className="flex items-center gap-3 rounded-xl bg-cream-50 p-3">
              <SmartImage src={s.heroImage} alt={s.title} className="h-12 w-12 rounded-lg object-cover" />
              <div>
                <p className="text-sm font-medium text-indigo-900">{s.category}</p>
                <p className="text-xs text-indigo-500">{s.region}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
