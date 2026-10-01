import Stripe from "stripe";

export type PrintProduct = {
  id: string;
  name: string;
  description: string;
  size: string;
  unitAmount: number;
  shippingAmount: number;
  sku: string;
  assetUrl: string;
  attributes?: Record<string, string>;
};
const httpsUrl = (value: unknown) => {
  if (typeof value !== "string") return false;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && !url.username && !url.password;
  } catch {
    return false;
  }
};
export function parseProducts(raw: string | undefined): PrintProduct[] {
  if (!raw) return [];
  try {
    const items: PrintProduct[] = JSON.parse(raw);
    if (!Array.isArray(items) || items.length > 30) return [];
    const ids = new Set<string>();
    for (const p of items) {
      if (
        !p ||
        typeof p.id !== "string" ||
        !/^[a-z0-9-]{1,64}$/.test(p.id) ||
        ids.has(p.id) ||
        ![p.name, p.description, p.size, p.sku].every(
          (v) => typeof v === "string" && v.length > 0 && v.length <= 200,
        ) ||
        !Number.isSafeInteger(p.unitAmount) ||
        p.unitAmount < 100 ||
        p.unitAmount > 1000000 ||
        !Number.isSafeInteger(p.shippingAmount) ||
        p.shippingAmount < 0 ||
        p.shippingAmount > 100000 ||
        !httpsUrl(p.assetUrl) ||
        (p.attributes &&
          (typeof p.attributes !== "object" ||
            Array.isArray(p.attributes) ||
            !Object.values(p.attributes).every((v) => typeof v === "string")))
      )
        return [];
      // Stripe metadata values have a 500-character limit. This snapshot survives catalog changes.
      if (
        JSON.stringify({
          sku: p.sku,
          assetUrl: p.assetUrl,
          attributes: p.attributes || {},
        }).length > 500
      )
        return [];
      ids.add(p.id);
    }
    return items;
  } catch {
    return [];
  }
}
export function commerceConfig() {
  const products = parseProducts(process.env.PRINT_PRODUCTS_JSON);
  const live = process.env.PRINT_MODE === "live";
  const stripeKey = process.env.STRIPE_SECRET_KEY || "";
  const modeMatches = stripeKey.startsWith(live ? "sk_live_" : "sk_test_");
  const origin = process.env.SITE_URL;
  const ready =
    products.length > 0 &&
    modeMatches &&
    !!process.env.STRIPE_WEBHOOK_SECRET &&
    !!process.env.PRODIGI_API_KEY &&
    httpsUrl(origin) &&
    httpsUrl(process.env.PRINT_TERMS_URL) &&
    process.env.PRINT_CHECKOUT_ENABLED === "true";
  return {
    products,
    ready,
    live,
    origin: origin || "",
    terms: process.env.PRINT_TERMS_URL || "",
  };
}
export function stripeClient() {
  return new Stripe(process.env.STRIPE_SECRET_KEY || "unconfigured", {
    maxNetworkRetries: 2,
  });
}
export function prodigiOrder(session: Stripe.Checkout.Session) {
  if (
    session.payment_status !== "paid" ||
    session.mode !== "payment" ||
    session.metadata?.studio_order !== "print-v1"
  )
    throw new Error("Not a paid studio print order");
  const shipping = session.collected_information?.shipping_details;
  const address = shipping?.address;
  if (
    !shipping?.name ||
    !address?.line1 ||
    !address.city ||
    !address.postal_code ||
    address.country !== "CA"
  )
    throw new Error("Shipping details missing or unsupported");
  const asset = JSON.parse(session.metadata.fulfillment || "null");
  if (!asset?.sku || !httpsUrl(asset.assetUrl))
    throw new Error("Missing fulfillment snapshot");
  return {
    merchantReference: session.id,
    idempotencyKey: session.id,
    shippingMethod: "Standard",
    recipient: {
      name: shipping.name,
      email: session.customer_details?.email || undefined,
      address: {
        line1: address.line1,
        line2: address.line2 || undefined,
        postalOrZipCode: address.postal_code,
        countryCode: address.country,
        townOrCity: address.city,
        stateOrCounty: address.state || undefined,
      },
    },
    items: [
      {
        sku: asset.sku,
        copies: 1,
        sizing: "fitPrintArea",
        attributes: asset.attributes || {},
        assets: [{ printArea: "default", url: asset.assetUrl }],
      },
    ],
  };
}
