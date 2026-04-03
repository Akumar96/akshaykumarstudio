import { NextRequest, NextResponse } from "next/server";

// TODO: Add STRIPE_SECRET_KEY to your Vercel environment variables
// Get this from https://dashboard.stripe.com/apikeys
const stripeSecretKey = process.env.STRIPE_SECRET_KEY || "";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { printId, priceId, size, dimensions, price } = body;

    if (!stripeSecretKey) {
      return NextResponse.json(
        { error: "Stripe not configured" },
        { status: 500 }
      );
    }

    // Dynamically import Stripe (keeps it out of client bundle)
    const Stripe = (await import("stripe")).default;
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2026-03-25.dahlia",
    });

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      // TODO: Add your production URL
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/shop?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/shop?canceled=true`,
      metadata: {
        printId,
        size,
        dimensions,
        price: String(price),
      },
      shipping_address_collection: {
        allowed_countries: [
          "US",
          "CA",
          "GB",
          "AU",
          "DE",
          "FR",
          "JP",
          "NZ",
          "IE",
          "NL",
          "BE",
          "SE",
          "NO",
          "DK",
          "IT",
          "ES",
          "CH",
          "AT",
        ],
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
