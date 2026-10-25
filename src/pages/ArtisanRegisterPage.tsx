import { useState } from 'react';
import { Store, Upload, CheckCircle2, AlertCircle, ArrowRight, User, MapPin } from 'lucide-react';
import { useStore } from '../store/StoreContext';
import { paths, useRouter } from '../lib/router';
import { isValidImageFile, readFileAsDataURL } from '../lib/utils';
import type { CraftCategory } from '../types';
import SmartImage from '../components/SmartImage';

const categories: CraftCategory[] = [
  'Kasuti Embroidery', 'Beedu Craft', 'Coastal Crafts', 'Handwoven Textiles',
  'Traditional Accessories', 'Home Décor', 'Wooden Crafts', 'Natural Material Crafts',
];

const initialState = {
  name: '', businessName: '', phone: '', email: '',
  village: '', town: '', district: '', state: '', category: 'Kasuti Embroidery' as CraftCategory,
  bio: '', yearsExperience: '', profileImage: '',
};

export default function ArtisanRegisterPage() {
  const { addArtisan, activeArtisan } = useStore();
  const { navigate } = useRouter();
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [consent, setConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  if (activeArtisan) {
    return (
      <div className="container-page py-16">
        <div className="mx-auto max-w-lg rounded-3xl border border-moss-200 bg-moss-50 p-8 text-center animate-scale-in">
          <CheckCircle2 className="mx-auto h-14 w-14 text-moss-500" />
          <h1 className="mt-4 font-serif text-2xl font-semibold text-indigo-900">You are already registered</h1>
          <p className="mt-2 text-indigo-600">Welcome back, {activeArtisan.name}. Visit your dashboard to manage products and orders.</p>
          <div className="mt-6 flex justify-center gap-3">
            <button onClick={() => navigate(paths.dashboard)} className="btn-primary">Go to Dashboard <ArrowRight className="h-4 w-4" /></button>
            <button onClick={() => navigate(paths.artisan(activeArtisan.id))} className="btn-outline">View Storefront</button>
          </div>
        </div>
      </div>
    );
  }

  const setField = (k: string, v: string) => {
    setForm((f) => ({ ...f, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: '' }));
  };

  const handleImage = async (file: File) => {
    if (!isValidImageFile(file)) {
      setErrors((e) => ({ ...e, profileImage: 'Please upload a JPG, PNG, or WebP image under 3MB.' }));
      return;
    }
    try {
      const dataUrl = await readFileAsDataURL(file);
      setForm((f) => ({ ...f, profileImage: dataUrl }));
      setErrors((e) => ({ ...e, profileImage: '' }));
    } catch {
      setErrors((e) => ({ ...e, profileImage: 'Could not read that image. Please try another.' }));
    }
  };

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Your name is required';
    if (!form.businessName.trim()) e.businessName = 'Business or craft name is required';
    if (!/^[0-9]{10}$/.test(form.phone.replace(/\D/g, '').slice(-10))) e.phone = 'Enter a valid 10-digit phone';
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.village.trim()) e.village = 'Village is required';
    if (!form.town.trim()) e.town = 'Town is required';
    if (!form.district.trim()) e.district = 'District is required';
    if (!form.state.trim()) e.state = 'State is required';
    if (!form.bio.trim()) e.bio = 'Please write a short bio';
    const years = Number(form.yearsExperience);
    if (!form.yearsExperience || isNaN(years) || years < 0) e.yearsExperience = 'Enter years of experience';
    if (!consent) e.consent = 'Please agree to the demo submission terms';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setTimeout(() => {
      addArtisan({
        name: form.name.trim(),
        businessName: form.businessName.trim(),
        phone: form.phone.trim(),
        email: form.email.trim() || `${form.name.toLowerCase().replace(/\s/g, '')}@kalasetu.demo`,
        village: form.village.trim(),
        town: form.town.trim(),
        district: form.district.trim(),
        state: form.state.trim(),
        category: form.category,
        bio: form.bio.trim(),
        yearsExperience: Number(form.yearsExperience),
        profileImage: form.profileImage || 'https://images.pexels.com/photos/5747522/pexels-photo-5747522.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
        specialties: [form.category],
        story: form.bio.trim(),
      });
      setSubmitting(false);
      setSuccess(true);
    }, 600);
  };

  if (success) {
    return (
      <div className="container-page py-16">
        <div className="mx-auto max-w-lg rounded-3xl border border-moss-200 bg-moss-50 p-8 text-center animate-scale-in">
          <CheckCircle2 className="mx-auto h-14 w-14 text-moss-500" />
          <h1 className="mt-4 font-serif text-2xl font-semibold text-indigo-900">Registration Successful!</h1>
          <p className="mt-2 text-indigo-600">Your demo artisan profile has been created. You can now add products and manage orders from your dashboard.</p>
          <div className="mt-6 flex justify-center gap-3">
            <button onClick={() => navigate(paths.dashboard)} className="btn-primary">Go to Dashboard <ArrowRight className="h-4 w-4" /></button>
            <button onClick={() => navigate(paths.manageProducts)} className="btn-outline">Add Your First Product</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-page py-10">
      <nav className="mb-6 text-sm text-indigo-500">
        <button onClick={() => navigate(paths.home)} className="hover:text-terracotta-500">Home</button>
        <span className="mx-2">/</span>
        <span className="text-indigo-700">Become an Artisan</span>
      </nav>

      <div className="mx-auto max-w-3xl">
        <div className="mb-8 text-center">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-terracotta-500 text-cream-50"><Store className="h-6 w-6" /></span>
          <h1 className="mt-3 font-serif text-4xl font-semibold text-indigo-900">Become an Artisan</h1>
          <p className="mt-2 text-indigo-600">Set up your demo storefront. It takes a few minutes — no technical knowledge needed.</p>
        </div>

        <form onSubmit={submit} className="card space-y-6 p-6 md:p-8">
          <section>
            <h2 className="mb-4 flex items-center gap-2 font-serif text-lg font-semibold text-indigo-900"><User className="h-5 w-5 text-terracotta-500" /> About You</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label" htmlFor="a-name">Your Name *</label>
                <input id="a-name" value={form.name} onChange={(e) => setField('name', e.target.value)} className="input" />
                {errors.name && <p className="mt-1 text-xs text-terracotta-500">{errors.name}</p>}
              </div>
              <div>
                <label className="label" htmlFor="a-biz">Business / Craft Name *</label>
                <input id="a-biz" value={form.businessName} onChange={(e) => setField('businessName', e.target.value)} className="input" />
                {errors.businessName && <p className="mt-1 text-xs text-terracotta-500">{errors.businessName}</p>}
              </div>
              <div>
                <label className="label" htmlFor="a-phone">Contact Number *</label>
                <input id="a-phone" value={form.phone} onChange={(e) => setField('phone', e.target.value)} placeholder="10-digit mobile" className="input" />
                {errors.phone && <p className="mt-1 text-xs text-terracotta-500">{errors.phone}</p>}
              </div>
              <div>
                <label className="label" htmlFor="a-email">Email (optional)</label>
                <input id="a-email" type="email" value={form.email} onChange={(e) => setField('email', e.target.value)} className="input" />
                {errors.email && <p className="mt-1 text-xs text-terracotta-500">{errors.email}</p>}
              </div>
            </div>
          </section>

          <section>
            <h2 className="mb-4 flex items-center gap-2 font-serif text-lg font-semibold text-indigo-900"><MapPin className="h-5 w-5 text-terracotta-500" /> Where You Are</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <label className="label" htmlFor="a-vil">Village *</label>
                <input id="a-vil" value={form.village} onChange={(e) => setField('village', e.target.value)} className="input" />
                {errors.village && <p className="mt-1 text-xs text-terracotta-500">{errors.village}</p>}
              </div>
              <div>
                <label className="label" htmlFor="a-town">Town *</label>
                <input id="a-town" value={form.town} onChange={(e) => setField('town', e.target.value)} className="input" />
                {errors.town && <p className="mt-1 text-xs text-terracotta-500">{errors.town}</p>}
              </div>
              <div>
                <label className="label" htmlFor="a-dist">District *</label>
                <input id="a-dist" value={form.district} onChange={(e) => setField('district', e.target.value)} className="input" />
                {errors.district && <p className="mt-1 text-xs text-terracotta-500">{errors.district}</p>}
              </div>
              <div>
                <label className="label" htmlFor="a-state">State *</label>
                <input id="a-state" value={form.state} onChange={(e) => setField('state', e.target.value)} className="input" />
                {errors.state && <p className="mt-1 text-xs text-terracotta-500">{errors.state}</p>}
              </div>
            </div>
          </section>

          <section>
            <h2 className="mb-4 font-serif text-lg font-semibold text-indigo-900">Your Craft</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label" htmlFor="a-cat">Craft Category *</label>
                <select id="a-cat" value={form.category} onChange={(e) => setField('category', e.target.value)} className="input">
                  {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="label" htmlFor="a-years">Years of Experience *</label>
                <input id="a-years" type="number" min={0} value={form.yearsExperience} onChange={(e) => setField('yearsExperience', e.target.value)} className="input" />
                {errors.yearsExperience && <p className="mt-1 text-xs text-terracotta-500">{errors.yearsExperience}</p>}
              </div>
            </div>
            <div className="mt-4">
              <label className="label" htmlFor="a-bio">Short Bio / Craft Story *</label>
              <textarea id="a-bio" rows={4} value={form.bio} onChange={(e) => setField('bio', e.target.value)} placeholder="Tell buyers about your craft, your tradition, and what makes your work special." className="input" />
              {errors.bio && <p className="mt-1 text-xs text-terracotta-500">{errors.bio}</p>}
            </div>
          </section>

          <section>
            <h2 className="mb-2 font-serif text-lg font-semibold text-indigo-900">Profile Image</h2>
            <p className="mb-3 text-sm text-indigo-600">Upload a photo of yourself or your craft (optional). JPG, PNG, or WebP under 3MB.</p>
            <div className="flex flex-wrap items-center gap-4">
              <SmartImage src={form.profileImage || undefined} alt="Profile preview" className="h-24 w-24 rounded-2xl object-cover" />
              <label htmlFor="a-img" className="btn-outline cursor-pointer">
                <Upload className="h-4 w-4" /> Choose Image
                <input id="a-img" type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={(e) => e.target.files?.[0] && handleImage(e.target.files[0])} />
              </label>
            </div>
            {errors.profileImage && <p className="mt-2 text-xs text-terracotta-500">{errors.profileImage}</p>}
          </section>

          <section className="rounded-xl border border-cream-200 bg-cream-100 p-4">
            <label className="flex cursor-pointer items-start gap-3 text-sm text-indigo-700">
              <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-0.5 h-4 w-4 rounded border-cream-400 text-terracotta-500 focus:ring-terracotta-400" />
              <span>I understand this is a demonstration registration. My details will be stored locally in this browser only and are not part of a real marketplace. No payment or personal information is verified.</span>
            </label>
            {errors.consent && <p className="mt-1 text-xs text-terracotta-500">{errors.consent}</p>}
          </section>

          {Object.values(errors).some(Boolean) && (
            <div className="flex items-start gap-2 rounded-xl border border-terracotta-200 bg-terracotta-50 p-3 text-sm text-terracotta-700">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /> Please fix the highlighted fields and try again.
            </div>
          )}

          <div className="flex justify-end">
            <button type="submit" disabled={submitting} className="btn-primary text-base">
              {submitting ? 'Creating profile…' : 'Create Demo Artisan Profile'} <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
