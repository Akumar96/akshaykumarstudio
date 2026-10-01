import {
  commerceConfig,
  prodigiOrder,
  stripeClient,
} from "@/lib/print-commerce";
import type Stripe from "stripe";
export const runtime = "nodejs";
export async function POST(request: Request) {
  if (
    !process.env.STRIPE_WEBHOOK_SECRET ||
    !process.env.STRIPE_SECRET_KEY ||
    !process.env.PRODIGI_API_KEY
  )
    return new Response("Not configured", { status: 503 });
  const stripe = stripeClient();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      await request.text(),
      request.headers.get("stripe-signature") || "",
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch {
    return new Response("Invalid signature", { status: 400 });
  }
  if (
    ![
      "checkout.session.completed",
      "checkout.session.async_payment_succeeded",
    ].includes(event.type)
  )
    return new Response("Ignored");
  const incoming = event.data.object as Stripe.Checkout.Session;
  if (incoming.metadata?.studio_order !== "print-v1")
    return new Response("Ignored");
  const { live } = commerceConfig();
  if (event.livemode !== live)
    return new Response("Mode mismatch", { status: 400 });
  try {
    // Retrieve current payment state; never fulfill from a browser redirect.
    const session = await stripe.checkout.sessions.retrieve(incoming.id);
    if (session.payment_status !== "paid")
      return new Response("Awaiting payment");
    if (session.metadata?.prodigi_order_id)
      return new Response("Already submitted");
    const order = prodigiOrder(session);
    const host = live
      ? "https://api.prodigi.com"
      : "https://api.sandbox.prodigi.com";
    const response = await fetch(`${host}/v4.0/Orders`, {
      method: "POST",
      headers: {
        "X-API-Key": process.env.PRODIGI_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(order),
      signal: AbortSignal.timeout(20000),
    });
    if (!response.ok) throw new Error("Lab submission failed");
    const result = await response.json();
    if (!result.order?.id) throw new Error("Lab order ID missing");
    // Prodigi retains idempotency keys indefinitely: concurrent/retried events cannot print twice.
    await stripe.checkout.sessions.update(session.id, {
      metadata: {
        prodigi_order_id: result.order.id,
        fulfillment_status: result.outcome || "submitted",
      },
    });
    if (String(result.outcome).toLowerCase() === "createdwithissues")
      console.error("Lab order needs review; Stripe event:", event.id);
    return new Response("Submitted");
  } catch {
    // A non-2xx result makes Stripe retry. No customer address or asset URL is logged.
    console.error("Print fulfillment needs retry; Stripe event:", event.id);
    return new Response("Fulfillment pending retry", { status: 500 });
  }
}
