import { useState } from 'react';
import { Plus, Edit2, Trash2, X, Upload, AlertCircle, Package, Eye } from 'lucide-react';
import { useStore } from '../store/StoreContext';
import { paths, useRouter } from '../lib/router';
import { formatINR, isValidImageFile, readFileAsDataURL } from '../lib/utils';
import SmartImage from '../components/SmartImage';
import type { CraftCategory, Product } from '../types';

const categories: CraftCategory[] = [
  'Kasuti Embroidery', 'Beedu Craft', 'Coastal Crafts', 'Handwoven Textiles',
  'Traditional Accessories', 'Home Décor', 'Wooden Crafts', 'Natural Material Crafts',
];

interface FormState {
  name: string; price: string; category: CraftCategory; quantity: string;
  materials: string; shortDescription: string; description: string; productionTime: string;
  dispatchTime: string; region: string; available: boolean; images: string[];
}

const empty: FormState = {
  name: '', price: '', category: 'Kasuti Embroidery', quantity: '1',
  materials: '', shortDescription: '', description: '', productionTime: '',
  dispatchTime: '', region: '', available: true, images: [],
};

export default function ManageProductsPage() {
  const { activeArtisan, products, addProduct, updateProduct, deleteProduct } = useStore();
  const { navigate } = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState<FormState>(empty);
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!activeArtisan) {
    return (
      <div className="container-page py-16 text-center">
        <h1 className="font-serif text-2xl font-semibold text-indigo-900">No Artisan Profile</h1>
        <p className="mt-2 text-indigo-600">Register as an artisan first.</p>
        <button onClick={() => navigate(paths.register)} className="mt-5 btn-primary">Become an Artisan</button>
      </div>
    );
  }

  const myProducts = products.filter((p) => p.artisanId === activeArtisan.id);

  const openAdd = () => { setEditing(null); setForm({ ...empty, region: `${activeArtisan.town}, ${activeArtisan.state}` }); setErrors({}); setModalOpen(true); };
  const openEdit = (p: Product) => {
    setEditing(p);
    setForm({
      name: p.name, price: String(p.price), category: p.category, quantity: String(p.quantity),
      materials: p.materials.join(', '), shortDescription: p.shortDescription, description: p.description,
      productionTime: p.productionTime, dispatchTime: p.dispatchTime, region: p.region, available: p.available, images: p.images,
    });
    setErrors({});
    setModalOpen(true);
  };

  const setField = (k: keyof FormState, v: string | boolean) => {
    setForm((f) => ({ ...f, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: '' }));
  };

  const handleImage = async (file: File) => {
    if (!isValidImageFile(file)) { setErrors((e) => ({ ...e, images: 'JPG/PNG/WebP under 3MB only.' })); return; }
    try {
      const url = await readFileAsDataURL(file);
      setForm((f) => ({ ...f, images: [...f.images, url].slice(0, 5) }));
      setErrors((e) => ({ ...e, images: '' }));
    } catch {
      setErrors((e) => ({ ...e, images: 'Could not read that image.' }));
    }
  };

  const removeImage = (idx: number) => setForm((f) => ({ ...f, images: f.images.filter((_, i) => i !== idx) }));

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Product name is required';
    const price = Number(form.price);
    if (!form.price || isNaN(price) || price <= 0) e.price = 'Enter a valid price';
    const qty = Number(form.quantity);
    if (!form.quantity || isNaN(qty) || qty < 0) e.quantity = 'Enter a valid quantity';
    if (!form.shortDescription.trim()) e.shortDescription = 'Short description is required';
    if (!form.region.trim()) e.region = 'Region is required';
    if (form.images.length === 0) e.images = 'Add at least one image';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const save = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    const payload = {
      artisanId: activeArtisan.id,
      name: form.name.trim(),
      images: form.images,
      price: Number(form.price),
      category: form.category,
      shortDescription: form.shortDescription.trim(),
      description: form.description.trim() || form.shortDescription.trim(),
      quantity: Number(form.quantity),
      materials: form.materials.split(',').map((m) => m.trim()).filter(Boolean),
      productionTime: form.productionTime.trim() || 'A few days',
      dispatchTime: form.dispatchTime.trim() || '2–3 days',
      region: form.region.trim(),
      available: form.available,
    };
    if (editing) {
      updateProduct(editing.id, payload);
    } else {
      addProduct(payload);
    }
    setModalOpen(false);
    setForm(empty);
    setEditing(null);
  };

  const confirmDelete = (p: Product) => {
    if (confirm(`Delete "${p.name}"? This removes your demo listing.`)) deleteProduct(p.id);
  };

  return (
    <div className="container-page py-10">
      <nav className="mb-6 text-sm text-indigo-500">
        <button onClick={() => navigate(paths.home)} className="hover:text-terracotta-500">Home</button>
        <span className="mx-2">/</span>
        <button onClick={() => navigate(paths.dashboard)} className="hover:text-terracotta-500">Dashboard</button>
        <span className="mx-2">/</span>
        <span className="text-indigo-700">Manage Products</span>
      </nav>

      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-4xl font-semibold text-indigo-900">Manage Products</h1>
          <p className="mt-1 text-indigo-600">Add, edit, or remove your demo listings.</p>
        </div>
        <button onClick={openAdd} className="btn-primary"><Plus className="h-4 w-4" /> Add Product</button>
      </div>

      {myProducts.length === 0 ? (
        <div className="card flex flex-col items-center justify-center gap-4 p-12 text-center">
          <Package className="h-12 w-12 text-cream-400" />
          <h3 className="font-serif text-xl text-indigo-900">No products yet</h3>
          <p className="text-indigo-600">Add your first product to start selling.</p>
          <button onClick={openAdd} className="btn-primary"><Plus className="h-4 w-4" /> Add Product</button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {myProducts.map((p) => (
            <div key={p.id} className="card overflow-hidden">
              <SmartImage src={p.images[0]} alt={p.name} className="aspect-[4/3] w-full object-cover" />
              <div className="p-4">
                <h3 className="line-clamp-1 font-serif text-lg font-semibold text-indigo-900">{p.name}</h3>
                <p className="text-sm text-indigo-500">{formatINR(p.price)} · {p.quantity} in stock</p>
                <span className={`mt-2 inline-block chip ${p.available ? 'bg-moss-100 text-moss-700' : 'bg-cream-200 text-indigo-500'}`}>
                  {p.available ? 'Available' : 'Unavailable'}
                </span>
                <div className="mt-4 flex gap-2">
                  <button onClick={() => navigate(paths.product(p.id))} className="btn-ghost flex-1 text-xs"><Eye className="h-3.5 w-3.5" /> View</button>
                  <button onClick={() => openEdit(p)} className="btn-outline flex-1 text-xs"><Edit2 className="h-3.5 w-3.5" /> Edit</button>
                  <button onClick={() => confirmDelete(p)} className="rounded-full p-2.5 text-terracotta-500 hover:bg-terracotta-50" aria-label={`Delete ${p.name}`}><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-indigo-900/40 p-4 backdrop-blur-sm animate-fade-in" onClick={() => setModalOpen(false)}>
          <div className="my-8 w-full max-w-2xl rounded-3xl bg-cream-50 shadow-lift animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 flex items-center justify-between rounded-t-3xl border-b border-cream-200 bg-cream-50 px-6 py-4">
              <h2 className="font-serif text-xl font-semibold text-indigo-900">{editing ? 'Edit Product' : 'Add New Product'}</h2>
              <button onClick={() => setModalOpen(false)} className="rounded-full p-2 text-indigo-700 hover:bg-cream-200" aria-label="Close"><X className="h-5 w-5" /></button>
            </div>
            <form onSubmit={save} className="space-y-5 p-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="label" htmlFor="p-name">Product Name *</label>
                  <input id="p-name" value={form.name} onChange={(e) => setField('name', e.target.value)} className="input" />
                  {errors.name && <p className="mt-1 text-xs text-terracotta-500">{errors.name}</p>}
                </div>
                <div>
                  <label className="label" htmlFor="p-price">Price (₹) *</label>
                  <input id="p-price" type="number" min={1} value={form.price} onChange={(e) => setField('price', e.target.value)} className="input" />
                  {errors.price && <p className="mt-1 text-xs text-terracotta-500">{errors.price}</p>}
                </div>
                <div>
                  <label className="label" htmlFor="p-qty">Available Quantity *</label>
                  <input id="p-qty" type="number" min={0} value={form.quantity} onChange={(e) => setField('quantity', e.target.value)} className="input" />
                  {errors.quantity && <p className="mt-1 text-xs text-terracotta-500">{errors.quantity}</p>}
                </div>
                <div>
                  <label className="label" htmlFor="p-cat">Category *</label>
                  <select id="p-cat" value={form.category} onChange={(e) => setField('category', e.target.value)} className="input">
                    {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label" htmlFor="p-region">Region *</label>
                  <input id="p-region" value={form.region} onChange={(e) => setField('region', e.target.value)} className="input" />
                  {errors.region && <p className="mt-1 text-xs text-terracotta-500">{errors.region}</p>}
                </div>
                <div className="sm:col-span-2">
                  <label className="label" htmlFor="p-materials">Materials (comma separated)</label>
                  <input id="p-materials" value={form.materials} onChange={(e) => setField('materials', e.target.value)} placeholder="Cotton, silk, natural dyes" className="input" />
                </div>
                <div>
                  <label className="label" htmlFor="p-prodtime">Production Time</label>
                  <input id="p-prodtime" value={form.productionTime} onChange={(e) => setField('productionTime', e.target.value)} placeholder="e.g. 5 days" className="input" />
                </div>
                <div>
                  <label className="label" htmlFor="p-disptime">Dispatch Time</label>
                  <input id="p-disptime" value={form.dispatchTime} onChange={(e) => setField('dispatchTime', e.target.value)} placeholder="e.g. 2–3 days" className="input" />
                </div>
                <div className="sm:col-span-2">
                  <label className="label" htmlFor="p-short">Short Description *</label>
                  <input id="p-short" value={form.shortDescription} onChange={(e) => setField('shortDescription', e.target.value)} className="input" />
                  {errors.shortDescription && <p className="mt-1 text-xs text-terracotta-500">{errors.shortDescription}</p>}
                </div>
                <div className="sm:col-span-2">
                  <label className="label" htmlFor="p-desc">Full Description</label>
                  <textarea id="p-desc" rows={3} value={form.description} onChange={(e) => setField('description', e.target.value)} className="input" />
                </div>
              </div>

              {/* Images */}
              <div>
                <label className="label">Product Images * (up to 5)</label>
                <div className="flex flex-wrap gap-3">
                  {form.images.map((src, i) => (
                    <div key={i} className="relative">
                      <SmartImage src={src} alt={`Preview ${i + 1}`} className="h-20 w-20 rounded-xl object-cover" />
                      <button type="button" onClick={() => removeImage(i)} className="absolute -right-2 -top-2 rounded-full bg-terracotta-500 p-1 text-cream-50 shadow" aria-label="Remove image"><X className="h-3 w-3" /></button>
                    </div>
                  ))}
                  {form.images.length < 5 && (
                    <label htmlFor="p-img" className="flex h-20 w-20 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-cream-300 text-indigo-400 hover:border-terracotta-400 hover:text-terracotta-500">
                      <Upload className="h-5 w-5" />
                      <span className="text-[10px]">Add</span>
                      <input id="p-img" type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={(e) => e.target.files?.[0] && handleImage(e.target.files[0])} />
                    </label>
                  )}
                </div>
                {errors.images && <p className="mt-1 text-xs text-terracotta-500">{errors.images}</p>}
                {form.images.length > 0 && <p className="mt-1 text-xs text-indigo-400">Images are stored as data URLs in this browser. For large catalogues, consider external image links in a real deployment.</p>}
              </div>

              {/* Available toggle */}
              <label className="flex cursor-pointer items-center gap-3 text-sm text-indigo-700">
                <input type="checkbox" checked={form.available} onChange={(e) => setField('available', e.target.checked)} className="h-4 w-4 rounded border-cream-400 text-terracotta-500 focus:ring-terracotta-400" />
                Mark this product as available for sale
              </label>

              {Object.values(errors).some(Boolean) && (
                <div className="flex items-start gap-2 rounded-xl border border-terracotta-200 bg-terracotta-50 p-3 text-sm text-terracotta-700">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /> Please fix the highlighted fields.
                </div>
              )}

              <div className="flex justify-end gap-3 border-t border-cream-200 pt-4">
                <button type="button" onClick={() => setModalOpen(false)} className="btn-ghost">Cancel</button>
                <button type="submit" className="btn-primary">{editing ? 'Save Changes' : 'Add Product'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
