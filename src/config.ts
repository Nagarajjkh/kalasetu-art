// Central app configuration. No secrets, no API keys.
export const CONFIG = {
  appName: 'KalaSetu',
  tagline: 'Every Craft Has a Story. Every Artisan Deserves a Market.',
  // Configurable marketplace WhatsApp number for order requests.
  // Leave as empty string to demonstrate the "unconfigured" setup state,
  // which shows a copy-the-summary fallback instead of opening an invalid wa.me link.
  whatsappNumber: '', // e.g. '919000000000' (country code + number, no + or spaces)

  // Demo delivery charge shown in cart and checkout. Clearly labelled as demo.
  deliveryCharge: 60,
  freeDeliveryThreshold: 1500,

  // localStorage keys
  storageKeys: {
    artisans: 'kalasetu:artisans',
    products: 'kalasetu:products',
    stories: 'kalasetu:stories',
    cart: 'kalasetu:cart',
    wishlist: 'kalasetu:wishlist',
    orders: 'kalasetu:orders',
    customer: 'kalasetu:customer',
    seeded: 'kalasetu:seeded:v1',
    activeArtisan: 'kalasetu:active-artisan',
  },
};

export const WHATSAPP_UNCONFIGURED_MESSAGE =
  'No verified WhatsApp number has been configured for this demo marketplace. ' +
  'You can still copy the order summary below and send it to your artisan manually.';
