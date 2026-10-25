import { CONFIG } from '../config';
import type { Order } from '../types';

export function formatINR(amount: number): string {
  return '₹' + amount.toLocaleString('en-IN');
}

export function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function formatDateTime(ts: number): string {
  return new Date(ts).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// Build the WhatsApp order message and wa.me URL.
// Returns null for the URL if no number is configured.
export function buildWhatsApp(order: Order): { message: string; url: string | null } {
  const lines: string[] = [];
  lines.push('Namaste from KalaSetu! I would like to place an order:');
  lines.push('');
  lines.push(`Order Reference: ${order.id}`);
  lines.push('');
  order.items.forEach((it, idx) => {
    lines.push(`${idx + 1}. ${it.productName}`);
    lines.push(`   Artisan: ${it.artisanName}`);
    lines.push(`   Qty: ${it.quantity} x ${formatINR(it.price)} = ${formatINR(it.quantity * it.price)}`);
  });
  lines.push('');
  lines.push(`Subtotal: ${formatINR(order.subtotal)}`);
  lines.push(`Delivery: ${formatINR(order.deliveryCharge)}`);
  lines.push(`Total: ${formatINR(order.total)}`);
  lines.push('');
  lines.push('Customer details:');
  lines.push(`Name: ${order.customer.name}`);
  lines.push(`Phone: ${order.customer.phone}`);
  lines.push(`Email: ${order.customer.email}`);
  lines.push(`Address: ${order.customer.address}, ${order.customer.city}, ${order.customer.state} - ${order.customer.pincode}`);
  if (order.note) lines.push(`Note: ${order.note}`);
  lines.push('');
  lines.push('This order request was created on the KalaSetu demo marketplace. Sending this message does not automatically confirm stock or payment.');

  const message = lines.join('\n');

  if (!CONFIG.whatsappNumber) {
    return { message, url: null };
  }
  const url = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
  return { message, url };
}

export function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Could not read file'));
    reader.readAsDataURL(file);
  });
}

export function isValidImageFile(file: File): boolean {
  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  return allowed.includes(file.type) && file.size <= 3 * 1024 * 1024; // 3MB cap for localStorage
}

export const fulfillmentLabels: Record<string, string> = {
  'pending-confirmation': 'Pending Confirmation',
  confirmed: 'Confirmed',
  processing: 'Processing',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

export const paymentLabels: Record<string, string> = {
  pending: 'Pending',
  success: 'Mock Payment Successful',
  failed: 'Mock Payment Failed',
  'not-applicable': 'Not Applicable',
};

export const fulfillmentFlows: string[] = [
  'pending-confirmation',
  'confirmed',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
];

// Simulated payment outcomes for the mock payment screen.
// Deterministic by default (success), with an explicit "fail" trigger.
export function simulatePayment(shouldFail: boolean): Promise<{ ok: boolean; reason?: string }> {
  return new Promise((resolve) => {
    const delay = 900 + Math.random() * 700;
    setTimeout(() => {
      if (shouldFail) {
        resolve({ ok: false, reason: 'Simulated payment declined. No real money was moved.' });
      } else {
        resolve({ ok: true });
      }
    }, delay);
  });
}
