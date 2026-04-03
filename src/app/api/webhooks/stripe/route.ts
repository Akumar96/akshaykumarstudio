import { NextRequest, NextResponse } from "next/server";

// TODO: Add STRIPE_WEBHOOK_SECRET to your Vercel environment variables
// Get this from Stripe Dashboard → Developers → Webhooks → your endpoint
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature || !webhookSecret) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  try {
    // Dynamically import Stripe
    const Stripe = (await import("stripe")).default;
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
      apiVersion: "2026-03-25.dahlia",
    });

    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as any;
      const { printId, size, dimensions } = session.metadata || {};
      const customerEmail = session.customer_details?.email;
      const shipping = session.shipping_details;

      // TODO: Send order to Printful API
      // For now, log the order. In production, you'd:
      // 1. Create an order in Printful via their API
      // 2. Send a confirmation email to the customer
      // 3. Store the order in a database
      console.log("📦 New print order:", {
        printId,
        size,
        dimensions,
        customerEmail,
        shipping,
        orderId: session.id,
      });

      // Example Printful API call (uncomment when ready):
      // await fetch("https://api.printful.com/orders", {
      //   method: "POST",
      //   headers: {
      //     "Authorization": `Bearer ${process.env.PRINTFUL_ACCESS_TOKEN}`,
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({
      //     recipient: {
      //       name: shipping?.name,
      //       address1: shipping?.address?.line1,
      //       city: shipping?.address?.city,
      //       state_code: shipping?.address?.state,
      //       country_code: shipping?.address?.country,
      //       zip: shipping?.address?.postal_code,
      //     },
      //     items: [{
      //       external_id: printId,
      //       variant_id: getPrintfulVariantId(printId, size),
      //       quantity: 1,
      //     }],
      //   }),
      // });
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Webhook error:", err);
    return NextResponse.json({ error: "Webhook failed" }, { status: 400 });
  }
}
