import { ArrowLeft, ChevronRight, Quote, Clock, MapPin, ArrowRight } from 'lucide-react';
import { useStore } from '../store/StoreContext';
import { paths, useRouter } from '../lib/router';
import { formatDate } from '../lib/utils';
import SmartImage from '../components/SmartImage';

interface Props { storyId: string }

export default function StoryDetailPage({ storyId }: Props) {
  const { stories, getArtisan, products } = useStore();
  const { navigate } = useRouter();
  const story = stories.find((s) => s.id === storyId);

  if (!story) {
    return (
      <div className="container-page py-20 text-center">
        <h1 className="font-serif text-3xl font-semibold text-indigo-900">Story not found</h1>
        <button onClick={() => navigate(paths.stories)} className="mt-6 btn-primary">Back to Our Stories</button>
      </div>
    );
  }

  const artisan = getArtisan(story.artisanId ?? null);
  const product = products.find((p) => p.id === story.productId);
  const moreStories = stories.filter((s) => s.id !== story.id).slice(0, 2);

  return (
    <div>
      {/* Hero */}
      <div className="relative h-[40vh] min-h-80 overflow-hidden">
        <SmartImage src={story.heroImage} alt={story.title} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/85 via-indigo-900/40 to-transparent" />
        <div className="container-page absolute inset-x-0 bottom-0 pb-8 text-cream-50">
          <nav className="mb-3 text-sm text-cream-200">
            <button onClick={() => navigate(paths.home)} className="hover:text-cream-50">Home</button>
            <ChevronRight className="mx-1 inline h-3 w-3" />
            <button onClick={() => navigate(paths.stories)} className="hover:text-cream-50">Our Stories</button>
          </nav>
          <span className="section-eyebrow text-terracotta-300">{story.category}</span>
          <h1 className="max-w-3xl font-serif text-3xl font-semibold md:text-5xl">{story.title}</h1>
          <p className="mt-2 text-cream-200">{story.subtitle}</p>
          <p className="mt-3 flex items-center gap-3 text-xs text-cream-200">
            <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {story.region}</span>
            <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {formatDate(story.publishedAt)}</span>
          </p>
        </div>
      </div>

      <div className="container-page py-12">
        <button onClick={() => navigate(paths.stories)} className="mb-8 inline-flex items-center gap-1 text-sm text-indigo-600 hover:text-terracotta-500">
          <ArrowLeft className="h-4 w-4" /> All stories
        </button>

        <div className="grid gap-12 lg:grid-cols-[1fr_320px]">
          {/* Body */}
          <article className="prose-craft max-w-none">
            <p className="font-serif text-xl leading-relaxed text-indigo-700">{story.excerpt}</p>
            {story.body.map((para, i) => (
              <p key={i} className="leading-relaxed text-indigo-700">{para}</p>
            ))}

            {/* Process gallery */}
            <h2 className="mt-10 font-serif text-2xl font-semibold text-indigo-900">Process Gallery</h2>
            <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
              {story.gallery.map((src, i) => (
                <SmartImage key={i} src={src} alt={`${story.title} process ${i + 1}`} className="aspect-square w-full rounded-xl object-cover" />
              ))}
            </div>

            {/* Interview */}
            {story.interview.length > 0 && (
              <div className="mt-10">
                <h2 className="font-serif text-2xl font-semibold text-indigo-900">In Conversation</h2>
                <p className="mb-4 text-sm text-indigo-500">Illustrative sample interview.</p>
                <div className="space-y-6">
                  {story.interview.map((q, i) => (
                    <div key={i} className="rounded-2xl border border-cream-200 bg-cream-100 p-5">
                      <p className="flex items-start gap-2 font-medium text-indigo-900"><Quote className="mt-0.5 h-4 w-4 text-terracotta-500" /> {q.question}</p>
                      <p className="mt-3 leading-relaxed text-indigo-700">{q.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </article>

          {/* Sidebar */}
          <aside className="space-y-6">
            {artisan && (
              <div className="card overflow-hidden">
                <SmartImage src={artisan.profileImage} alt={artisan.name} className="aspect-[4/3] w-full object-cover" />
                <div className="p-5">
                  <h3 className="font-serif text-lg font-semibold text-indigo-900">{artisan.name}</h3>
                  <p className="text-xs text-indigo-500">{artisan.businessName}</p>
                  <p className="mt-2 line-clamp-3 text-sm text-indigo-600">{artisan.bio}</p>
                  <button onClick={() => navigate(paths.artisan(artisan.id))} className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-terracotta-500 hover:underline">
                    Meet the artisan <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
            {product && (
              <div className="card p-5">
                <h3 className="mb-3 font-serif text-lg font-semibold text-indigo-900">From This Story</h3>
                <button onClick={() => navigate(paths.product(product.id))} className="flex w-full items-center gap-3 text-left">
                  <SmartImage src={product.images[0]} alt={product.name} className="h-16 w-16 rounded-xl object-cover" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-indigo-900">{product.name}</p>
                    <p className="text-xs text-indigo-500">₹{product.price.toLocaleString('en-IN')}</p>
                  </div>
                </button>
                <button onClick={() => navigate(paths.product(product.id))} className="mt-3 w-full btn-outline text-sm">Discover the Story Behind This Product <ArrowRight className="h-4 w-4" /></button>
              </div>
            )}
          </aside>
        </div>

        {/* More stories */}
        {moreStories.length > 0 && (
          <section className="mt-16">
            <h2 className="mb-6 font-serif text-2xl font-semibold text-indigo-900">More Stories</h2>
            <div className="grid gap-6 md:grid-cols-2">
              {moreStories.map((s) => (
                <button key={s.id} onClick={() => navigate(paths.story(s.id))} className="card group flex gap-4 overflow-hidden text-left hover:-translate-y-0.5 hover:shadow-lift">
                  <SmartImage src={s.heroImage} alt={s.title} className="h-28 w-28 shrink-0 rounded-2xl object-cover" />
                  <div className="flex flex-col justify-center p-3">
                    <p className="text-xs text-indigo-500">{s.region}</p>
                    <h3 className="mt-1 font-serif text-lg font-semibold text-indigo-900 group-hover:text-terracotta-500">{s.title}</h3>
                    <p className="mt-1 line-clamp-2 text-sm text-indigo-600">{s.excerpt}</p>
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
