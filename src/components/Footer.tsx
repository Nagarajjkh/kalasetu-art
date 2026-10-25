import { Sparkles, Mail, Phone, MapPin, Facebook, Instagram, Twitter } from 'lucide-react';
import { CONFIG } from '../config';
import { paths, useRouter } from '../lib/router';
import { useStore } from '../store/StoreContext';

const linkGroups = [
  {
    title: 'Shop',
    links: [
      { label: 'Explore Crafts', path: paths.explore },
      { label: 'Our Stories', path: paths.stories },
      { label: 'Cart', path: paths.cart },
      { label: 'My Orders', path: paths.orders },
    ],
  },
  {
    title: 'For Artisans',
    links: [
      { label: 'Become an Artisan', path: paths.register },
      { label: 'Artisan Dashboard', path: paths.dashboard },
      { label: 'Manage Products', path: paths.manageProducts },
      { label: 'Manage Orders', path: paths.manageOrders },
    ],
  },
  {
    title: 'KalaSetu',
    links: [
      { label: 'About Us', path: paths.about },
      { label: 'Contact & Help', path: paths.contact },
    ],
  },
];

export default function Footer() {
  const { navigate } = useRouter();
  const { resetData } = useStore();

  return (
    <footer className="mt-20 border-t border-cream-200 bg-cream-100">
      <div className="container-page py-12">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-terracotta-500 text-cream-50">
                <Sparkles className="h-5 w-5" />
              </span>
              <span className="font-serif text-2xl font-semibold text-indigo-900">{CONFIG.appName}</span>
            </div>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-indigo-600">
              {CONFIG.tagline} A demonstration marketplace built to show how digital access can
              connect traditional Indian artisans directly with buyers.
            </p>
            <div className="mt-4 space-y-1.5 text-sm text-indigo-600">
              <p className="flex items-center gap-2"><Mail className="h-4 w-4 text-terracotta-500" /> hello@kalasetu.demo</p>
              <p className="flex items-center gap-2"><Phone className="h-4 w-4 text-terracotta-500" /> +91 90000 00000 (demo)</p>
              <p className="flex items-center gap-2"><MapPin className="h-4 w-4 text-terracotta-500" /> Karnataka, India</p>
            </div>
            <div className="mt-4 flex gap-2">
              {[Facebook, Instagram, Twitter].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="rounded-full bg-cream-200 p-2.5 text-indigo-700 transition-colors hover:bg-terracotta-100 hover:text-terracotta-600"
                  aria-label="Social link"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {linkGroups.map((group) => (
            <div key={group.title}>
              <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-indigo-900">{group.title}</h4>
              <ul className="space-y-2">
                {group.links.map((l) => (
                  <li key={l.path}>
                    <button
                      onClick={() => navigate(l.path)}
                      className="text-sm text-indigo-600 transition-colors hover:text-terracotta-500"
                    >
                      {l.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 border-t border-cream-200 pt-6">
          <div className="flex flex-col items-start justify-between gap-4 text-xs text-indigo-500 sm:flex-row sm:items-center">
            <p>
              © {new Date().getFullYear()} {CONFIG.appName} — A hackathon demonstration prototype.
              No real payments are processed. All artisan and product data is illustrative demo content.
            </p>
            <button
              onClick={() => {
                if (confirm('Reset all demo data? This restores the seed products and clears your cart, orders, and artisan profile.')) {
                  resetData();
                  navigate(paths.home);
                }
              }}
              className="rounded-full border border-cream-300 px-3 py-1.5 text-xs text-indigo-600 hover:bg-cream-200"
            >
              Reset demo data
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
