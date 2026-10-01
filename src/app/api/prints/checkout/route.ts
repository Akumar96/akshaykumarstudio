import { commerceConfig, stripeClient } from "@/lib/print-commerce";
export const runtime = "nodejs";
export async function POST(request: Request) {
  const config = commerceConfig();
  if (!config.ready)
    return Response.json(
      { error: "Online ordering is not open yet." },
      { status: 503 },
    );
  if (request.headers.get("origin") !== new URL(config.origin).origin)
    return Response.json({ error: "Invalid request origin." }, { status: 403 });
  try {
    const form = await request.formData();
    const product = config.products.find((p) => p.id === form.get("product"));
    if (!product || form.get("terms") !== "accepted")
      return Response.json(
        { error: "Choose an available print and accept the order terms." },
        { status: 400 },
      );
    const master = await fetch(product.assetUrl, {
      method: "HEAD",
      signal: AbortSignal.timeout(10000),
      cache: "no-store",
      redirect: "error",
    });
    if (!master.ok)
      return Response.json(
        {
          error:
            "This print is temporarily unavailable. Please contact the studio.",
        },
        { status: 503 },
      );
    const session = await stripeClient().checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      shipping_address_collection: { allowed_countries: ["CA"] },
      line_items: [
        {
          price_data: {
            currency: "cad",
            unit_amount: product.unitAmount,
            product_data: {
              name: product.name,
              description: `${product.size}. ${product.description}`,
            },
          },
          quantity: 1,
        },
      ],
      shipping_options: [
        {
          shipping_rate_data: {
            display_name: "Standard shipping — Canada",
            type: "fixed_amount",
            fixed_amount: { amount: product.shippingAmount, currency: "cad" },
          },
        },
      ],
      automatic_tax: { enabled: true },
      success_url: `${new URL(config.origin).origin}/prints/order`,
      cancel_url: `${new URL(config.origin).origin}/prints#order`,
      metadata: {
        studio_order: "print-v1",
        product: product.id,
        fulfillment: JSON.stringify({
          sku: product.sku,
          assetUrl: product.assetUrl,
          attributes: product.attributes || {},
        }),
      },
    });
    if (!session.url) throw new Error("Missing checkout URL");
    return Response.redirect(session.url, 303);
  } catch {
    return Response.json(
      {
        error:
          "Checkout could not be opened. Please return to Prints and try again, or contact the studio.",
      },
      { status: 502 },
    );
  }
}
