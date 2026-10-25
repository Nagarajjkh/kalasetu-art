import { Package, ShoppingBag, Clock, CheckCircle2, TrendingUp, Plus, Store, Settings, AlertCircle } from 'lucide-react';
import { useStore } from '../store/StoreContext';
import { paths, useRouter } from '../lib/router';
import { formatDate, formatINR } from '../lib/utils';
import SmartImage from '../components/SmartImage';
import { StaggerItem } from '../components/Stagger';

export default function DashboardPage() {
  const { activeArtisan, products, orders } = useStore();
  const { navigate } = useRouter();

  if (!activeArtisan) {
    return (
      <div className="container-page py-16">
        <div className="mx-auto max-w-lg rounded-3xl border border-cream-200 bg-cream-100 p-8 text-center">
          <Store className="mx-auto h-12 w-12 text-cream-400" />
          <h1 className="mt-3 font-serif text-2xl font-semibold text-indigo-900">No Artisan Profile Yet</h1>
          <p className="mt-2 text-indigo-600">Register as an artisan to access your dashboard, manage products, and track orders.</p>
          <button onClick={() => navigate(paths.register)} className="mt-5 btn-primary">Become an Artisan</button>
        </div>
      </div>
    );
  }

  const myProducts = products.filter((p) => p.artisanId === activeArtisan.id);
  const myProductIds = new Set(myProducts.map((p) => p.id));
  const myOrders = orders.filter((o) => o.items.some((it) => myProductIds.has(it.productId)));
  const pendingOrders = myOrders.filter((o) => o.fulfillmentStatus === 'pending-confirmation').length;
  const completedOrders = myOrders.filter((o) => o.fulfillmentStatus === 'delivered').length;
  const salesTotal = myOrders
    .filter((o) => o.paymentStatus === 'success')
    .reduce((sum, o) => {
      const mine = o.items.filter((it) => myProductIds.has(it.productId));
      return sum + mine.reduce((s, it) => s + it.price * it.quantity, 0);
    }, 0);

  const stats = [
    { label: 'Total Listings', value: myProducts.length, icon: Package, color: 'bg-indigo-700' },
    { label: 'Total Demo Orders', value: myOrders.length, icon: ShoppingBag, color: 'bg-terracotta-500' },
    { label: 'Pending Requests', value: pendingOrders, icon: Clock, color: 'bg-gold-500' },
    { label: 'Completed Orders', value: completedOrders, icon: CheckCircle2, color: 'bg-moss-500' },
  ];

  const recentProducts = [...myProducts].sort((a, b) => b.createdAt - a.createdAt).slice(0, 4);
  const recentOrders = [...myOrders].sort((a, b) => b.createdAt - a.createdAt).slice(0, 5);

  return (
    <div className="container-page py-10">
      <nav className="mb-6 text-sm text-indigo-500">
        <button onClick={() => navigate(paths.home)} className="hover:text-terracotta-500">Home</button>
        <span className="mx-2">/</span>
        <span className="text-indigo-700">Dashboard</span>
      </nav>

      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <SmartImage src={activeArtisan.profileImage} alt={activeArtisan.name} className="h-16 w-16 rounded-2xl object-cover" />
          <div>
            <h1 className="font-serif text-3xl font-semibold text-indigo-900">Welcome, {activeArtisan.name.split(' ')[0]}</h1>
            <p className="text-sm text-indigo-600">{activeArtisan.businessName} · {activeArtisan.category}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => navigate(paths.manageProducts)} className="btn-primary"><Plus className="h-4 w-4" /> Add Product</button>
          <button onClick={() => navigate(paths.artisan(activeArtisan.id))} className="btn-outline"><Store className="h-4 w-4" /> View Storefront</button>
        </div>
      </div>

      <div className="mb-6 rounded-xl border border-cream-200 bg-cream-100 p-3 text-xs text-indigo-600">
        <p className="flex items-start gap-2"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-terracotta-500" /> Dashboard values are derived from this browser's demo data only. KalaSetu does not provide real payment settlement or verified sales analytics.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s, i) => (
          <StaggerItem key={s.label} index={i}>
            <div className="card p-5">
              <span className={`flex h-10 w-10 items-center justify-center rounded-xl text-cream-50 ${s.color}`}><s.icon className="h-5 w-5" /></span>
              <p className="mt-3 font-serif text-3xl font-semibold text-indigo-900">{s.value}</p>
              <p className="text-sm text-indigo-500">{s.label}</p>
            </div>
          </StaggerItem>
        ))}
      </div>

      {/* Sales total card */}
      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <div className="card p-5 lg:col-span-1">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-moss-100 text-moss-600"><TrendingUp className="h-5 w-5" /></span>
          <p className="mt-3 text-sm text-indigo-500">Demo Sales Total (successful payments only)</p>
          <p className="mt-1 font-serif text-3xl font-semibold text-indigo-900">{formatINR(salesTotal)}</p>
          <p className="mt-1 text-xs text-indigo-400">Illustrative — not a real settlement figure.</p>
        </div>

        <div className="card p-5 lg:col-span-2">
          <h3 className="mb-3 font-serif text-lg font-semibold text-indigo-900">Quick Actions</h3>
          <div className="grid gap-2 sm:grid-cols-2">
            <button onClick={() => navigate(paths.manageProducts)} className="flex items-center gap-2 rounded-xl border border-cream-200 p-3 text-left text-sm text-indigo-700 hover:bg-cream-100">
              <Package className="h-5 w-5 text-terracotta-500" /> Manage Products
            </button>
            <button onClick={() => navigate(paths.manageOrders)} className="flex items-center gap-2 rounded-xl border border-cream-200 p-3 text-left text-sm text-indigo-700 hover:bg-cream-100">
              <ShoppingBag className="h-5 w-5 text-terracotta-500" /> Manage Orders
            </button>
            <button onClick={() => navigate(paths.artisan(activeArtisan.id))} className="flex items-center gap-2 rounded-xl border border-cream-200 p-3 text-left text-sm text-indigo-700 hover:bg-cream-100">
              <Store className="h-5 w-5 text-terracotta-500" /> Public Storefront
            </button>
            <button onClick={() => navigate(paths.register)} className="flex items-center gap-2 rounded-xl border border-cream-200 p-3 text-left text-sm text-indigo-700 hover:bg-cream-100">
              <Settings className="h-5 w-5 text-terracotta-500" /> Registration Details
            </button>
          </div>
        </div>
      </div>

      {/* Recent products */}
      <section className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-serif text-xl font-semibold text-indigo-900">Recent Products</h2>
          <button onClick={() => navigate(paths.manageProducts)} className="text-sm font-medium text-terracotta-500 hover:underline">Manage all</button>
        </div>
        {recentProducts.length === 0 ? (
          <div className="card p-8 text-center text-indigo-600">
            <p>You have not added any products yet.</p>
            <button onClick={() => navigate(paths.manageProducts)} className="mt-4 btn-primary">Add your first product</button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {recentProducts.map((p) => (
              <button key={p.id} onClick={() => navigate(paths.product(p.id))} className="card overflow-hidden text-left hover:shadow-lift">
                <SmartImage src={p.images[0]} alt={p.name} className="aspect-square w-full object-cover" />
                <div className="p-3">
                  <p className="line-clamp-1 text-sm font-semibold text-indigo-900">{p.name}</p>
                  <p className="text-xs text-indigo-500">{formatINR(p.price)} · {p.quantity} in stock</p>
                  <span className={`mt-1 inline-block chip ${p.available ? 'bg-moss-100 text-moss-700' : 'bg-cream-200 text-indigo-500'}`}>{p.available ? 'Available' : 'Unavailable'}</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </section>

      {/* Recent orders */}
      <section className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-serif text-xl font-semibold text-indigo-900">Recent Order Activity</h2>
          <button onClick={() => navigate(paths.manageOrders)} className="text-sm font-medium text-terracotta-500 hover:underline">Manage all</button>
        </div>
        {recentOrders.length === 0 ? (
          <div className="card p-8 text-center text-indigo-600">
            <p>No orders yet. When customers buy your products, their orders appear here.</p>
          </div>
        ) : (
          <ul className="space-y-2">
            {recentOrders.map((o) => (
              <li key={o.id} className="card flex flex-wrap items-center justify-between gap-3 p-4">
                <div>
                  <p className="font-mono text-sm font-semibold text-indigo-900">{o.id}</p>
                  <p className="text-xs text-indigo-500">{o.customer.name} · {formatDate(o.createdAt)}</p>
                </div>
                <span className="text-sm text-indigo-600">{o.items.length} item(s)</span>
                <span className="font-semibold text-indigo-900">{formatINR(o.total)}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
