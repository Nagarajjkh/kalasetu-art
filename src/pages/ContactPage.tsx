import { useState } from 'react';
import { Mail, Phone, MapPin, MessageCircle, Send, CheckCircle2, HelpCircle, Clock } from 'lucide-react';
import { paths, useRouter } from '../lib/router';

const faqs = [
  { q: 'Is KalaSetu a real store?', a: 'No. KalaSetu is a hackathon demonstration prototype. All products, artisans, orders, and payments are illustrative demo content. No real money is processed.' },
  { q: 'How do payments work?', a: 'Payments are clearly labelled as simulated. You can run a mock successful or failed payment to see how the flow works. No real card, UPI, or banking details are ever collected.' },
  { q: 'Can I really order on WhatsApp?', a: 'You can generate a prefilled WhatsApp order summary. If a number is configured it opens WhatsApp; otherwise you can copy the summary. Sending the message does not confirm stock or payment.' },
  { q: 'How do I become an artisan?', a: 'Visit the Become an Artisan page, fill in your details, and a demo artisan profile is created in this browser. You can then add products and manage demo orders.' },
  { q: 'Will my data survive a refresh?', a: 'Yes — products, cart, orders, and your artisan profile are saved in this browser\'s localStorage. Clearing your browser data or using a different device will reset them.' },
];

export default function ContactPage() {
  const { navigate } = useRouter();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);

  const setField = (k: string, v: string) => {
    setForm((f) => ({ ...f, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: '' }));
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const err: Record<string, string> = {};
    if (!form.name.trim()) err.name = 'Name is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) err.email = 'Valid email is required';
    if (!form.message.trim()) err.message = 'Message is required';
    setErrors(err);
    if (Object.keys(err).length) return;
    setSent(true);
    setForm({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="container-page py-10">
      <nav className="mb-6 text-sm text-indigo-500">
        <button onClick={() => navigate(paths.home)} className="hover:text-terracotta-500">Home</button>
        <span className="mx-2">/</span>
        <span className="text-indigo-700">Contact & Help</span>
      </nav>

      <div className="max-w-2xl">
        <span className="section-eyebrow"><MessageCircle className="h-4 w-4" /> We are here to help</span>
        <h1 className="font-serif text-4xl font-semibold text-indigo-900">Contact & Help</h1>
        <p className="mt-2 text-indigo-600">Questions about KalaSetu, an order, or becoming an artisan? Reach out — we usually reply within a day.</p>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_360px]">
        {/* Form */}
        <div className="card p-6">
          {sent ? (
            <div className="flex flex-col items-center gap-3 py-10 text-center animate-scale-in">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-moss-100 text-moss-600"><CheckCircle2 className="h-7 w-7" /></span>
              <h2 className="font-serif text-2xl font-semibold text-indigo-900">Message Sent!</h2>
              <p className="max-w-sm text-indigo-600">Thank you for reaching out. This is a simulated confirmation — no message was actually sent. Your demo data is unchanged.</p>
              <button onClick={() => setSent(false)} className="btn-outline">Send another message</button>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="label" htmlFor="ct-name">Name *</label>
                  <input id="ct-name" value={form.name} onChange={(e) => setField('name', e.target.value)} className="input" />
                  {errors.name && <p className="mt-1 text-xs text-terracotta-500">{errors.name}</p>}
                </div>
                <div>
                  <label className="label" htmlFor="ct-email">Email *</label>
                  <input id="ct-email" type="email" value={form.email} onChange={(e) => setField('email', e.target.value)} className="input" />
                  {errors.email && <p className="mt-1 text-xs text-terracotta-500">{errors.email}</p>}
                </div>
              </div>
              <div>
                <label className="label" htmlFor="ct-subject">Subject</label>
                <input id="ct-subject" value={form.subject} onChange={(e) => setField('subject', e.target.value)} className="input" />
              </div>
              <div>
                <label className="label" htmlFor="ct-msg">Message *</label>
                <textarea id="ct-msg" rows={5} value={form.message} onChange={(e) => setField('message', e.target.value)} className="input" />
                {errors.message && <p className="mt-1 text-xs text-terracotta-500">{errors.message}</p>}
              </div>
              <button type="submit" className="btn-primary"><Send className="h-4 w-4" /> Send Message</button>
            </form>
          )}
        </div>

        {/* Contact info */}
        <aside className="space-y-6">
          <div className="card p-5">
            <h3 className="font-serif text-lg font-semibold text-indigo-900">Reach Us</h3>
            <ul className="mt-3 space-y-3 text-sm text-indigo-600">
              <li className="flex items-start gap-2"><Mail className="mt-0.5 h-4 w-4 text-terracotta-500" /> hello@kalasetu.demo</li>
              <li className="flex items-start gap-2"><Phone className="mt-0.5 h-4 w-4 text-terracotta-500" /> +91 90000 00000 (demo)</li>
              <li className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 text-terracotta-500" /> Karnataka, India</li>
              <li className="flex items-start gap-2"><Clock className="mt-0.5 h-4 w-4 text-terracotta-500" /> Demo support hours: Mon–Sat</li>
            </ul>
          </div>
          <div className="card p-5">
            <h3 className="font-serif text-lg font-semibold text-indigo-900">Quick Links</h3>
            <div className="mt-3 flex flex-col gap-2 text-sm">
              <button onClick={() => navigate(paths.explore)} className="text-left text-indigo-600 hover:text-terracotta-500">→ Explore the marketplace</button>
              <button onClick={() => navigate(paths.register)} className="text-left text-indigo-600 hover:text-terracotta-500">→ Become an artisan</button>
              <button onClick={() => navigate(paths.orders)} className="text-left text-indigo-600 hover:text-terracotta-500">→ View my orders</button>
              <button onClick={() => navigate(paths.stories)} className="text-left text-indigo-600 hover:text-terracotta-500">→ Read craft stories</button>
            </div>
          </div>
        </aside>
      </div>

      {/* FAQ */}
      <section className="mt-12">
        <h2 className="mb-6 flex items-center gap-2 font-serif text-2xl font-semibold text-indigo-900"><HelpCircle className="h-5 w-5 text-terracotta-500" /> Frequently Asked Questions</h2>
        <div className="space-y-3">
          {faqs.map((f) => (
            <details key={f.q} className="card group p-5">
              <summary className="cursor-pointer list-none font-medium text-indigo-900 marker:hidden">{f.q}</summary>
              <p className="mt-3 leading-relaxed text-indigo-600">{f.a}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
