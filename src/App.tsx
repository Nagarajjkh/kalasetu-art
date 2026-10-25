import { useEffect, useState } from 'react';
import { StoreProvider, useStore } from './store/StoreContext';
import { matchRoute, paths, useRouter } from './lib/router';
import Header from './components/Header';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import { PageTransition } from './components/Stagger';

import HomePage from './pages/HomePage';
import ExplorePage from './pages/ExplorePage';
import ProductDetailPage from './pages/ProductDetailPage';
import ArtisanProfilePage from './pages/ArtisanProfilePage';
import StoriesPage from './pages/StoriesPage';
import StoryDetailPage from './pages/StoryDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import OrdersPage from './pages/OrdersPage';
import ArtisanRegisterPage from './pages/ArtisanRegisterPage';
import DashboardPage from './pages/DashboardPage';
import ManageProductsPage from './pages/ManageProductsPage';
import ManageOrdersPage from './pages/ManageOrdersPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import NotFoundPage from './pages/NotFoundPage';

function AppShell() {
  const { route } = useRouter();
  const { cartCount } = useStore();
  const [cartOpen, setCartOpen] = useState(false);

  // Close the cart drawer whenever the route changes
  useEffect(() => { setCartOpen(false); }, [route.path]);

  const renderPage = () => {
    const { path } = route;
    if (path === paths.home) return <HomePage />;
    if (path === paths.explore) return <ExplorePage />;
    if (path === paths.stories) return <StoriesPage />;
    if (path === paths.cart) return <CartPage />;
    if (path === paths.checkout) return <CheckoutPage />;
    if (path === paths.orders) return <OrdersPage />;
    if (path === paths.register) return <ArtisanRegisterPage />;
    if (path === paths.dashboard) return <DashboardPage />;
    if (path === paths.manageProducts) return <ManageProductsPage />;
    if (path === paths.manageOrders) return <ManageOrdersPage />;
    if (path === paths.about) return <AboutPage />;
    if (path === paths.contact) return <ContactPage />;

    // dynamic routes
    let id = matchRoute(path, '/product/:id');
    if (id !== null) return <ProductDetailPage productId={id} />;
    id = matchRoute(path, '/artisan/:id');
    if (id !== null) return <ArtisanProfilePage artisanId={id} />;
    id = matchRoute(path, '/stories/:id');
    if (id !== null) return <StoryDetailPage storyId={id} />;
    id = matchRoute(path, '/order/:id');
    if (id !== null) return <OrderConfirmationPage orderId={id} />;

    return <NotFoundPage />;
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header onOpenCart={() => setCartOpen(true)} />
      <main className="flex-1">
        <PageTransition key={route.path + (route.params.q ?? '') + (route.params.cat ?? '')}>
          {renderPage()}
        </PageTransition>
      </main>
      <Footer />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      {/* Floating cart button on mobile when items exist */}
      {cartCount > 0 && !cartOpen && (
        <button
          onClick={() => setCartOpen(true)}
          className="fixed bottom-6 right-6 z-30 flex items-center gap-2 rounded-full bg-terracotta-500 px-5 py-3 text-sm font-semibold text-cream-50 shadow-lift transition-transform hover:scale-105 active:scale-95 lg:hidden"
          aria-label={`Open cart with ${cartCount} items`}
        >
          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-cream-50 px-1.5 text-xs font-bold text-terracotta-600">{cartCount}</span>
          View Cart
        </button>
      )}
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <AppShell />
    </StoreProvider>
  );
}
