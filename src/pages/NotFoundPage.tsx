import { Home, Compass } from 'lucide-react';
import { paths, useRouter } from '../lib/router';

export default function NotFoundPage() {
  const { navigate } = useRouter();
  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <p className="font-serif text-8xl font-semibold text-terracotta-200">404</p>
      <h1 className="mt-4 font-serif text-3xl font-semibold text-indigo-900">Page Not Found</h1>
      <p className="mt-2 max-w-md text-indigo-600">
        The page you are looking for may have been moved, or it never existed in this demo marketplace.
      </p>
      <div className="mt-6 flex gap-3">
        <button onClick={() => navigate(paths.home)} className="btn-primary"><Home className="h-4 w-4" /> Back Home</button>
        <button onClick={() => navigate(paths.explore)} className="btn-outline"><Compass className="h-4 w-4" /> Explore Crafts</button>
      </div>
    </div>
  );
}
