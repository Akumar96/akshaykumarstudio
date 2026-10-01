import { test } from "node:test";
import assert from "node:assert/strict";
import { parseProducts, prodigiOrder } from "../src/lib/print-commerce.ts";
const product = {
  id: "coast",
  name: "Coast",
  description: "Test only",
  size: "12 × 18 in",
  unitAmount: 10000,
  shippingAmount: 2000,
  sku: "TEST-SKU",
  assetUrl: "https://example.com/private-master.jpg",
};
test("catalog rejects malformed configuration and client-supplied price shapes", () => {
  assert.equal(parseProducts(JSON.stringify([product])).length, 1);
  for (const change of [
    { unitAmount: -1 },
    { unitAmount: 1.1 },
    { assetUrl: "javascript:alert(1)" },
    { id: "../x" },
    { shippingAmount: -1 },
    { attributes: { x: 4 } },
  ])
    assert.deepEqual(
      parseProducts(JSON.stringify([{ ...product, ...change }])),
      [],
    );
  assert.deepEqual(parseProducts("not json"), []);
  assert.deepEqual(parseProducts(JSON.stringify([product, product])), []);
});
function session() {
  return {
    id: "cs_test_paid",
    mode: "payment",
    payment_status: "paid",
    metadata: {
      studio_order: "print-v1",
      fulfillment: JSON.stringify({
        sku: product.sku,
        assetUrl: product.assetUrl,
      }),
    },
    collected_information: {
      shipping_details: {
        name: "Test Customer",
        address: {
          line1: "Test address",
          city: "Halifax",
          postal_code: "B3H 1A1",
          country: "CA",
        },
      },
    },
    customer_details: { email: "test@example.com" },
  };
}
test("fulfillment uses paid session snapshot and stable idempotency key", () => {
  const order = prodigiOrder(session());
  assert.equal(order.idempotencyKey, "cs_test_paid");
  assert.equal(order.items[0].assets[0].url, product.assetUrl);
  assert.equal(order.items[0].sizing, "fitPrintArea");
  assert.deepEqual(prodigiOrder(session()), order);
});
test("unpaid, unrelated, missing-address and unsupported-country orders cannot print", () => {
  for (const s of [
    { ...session(), payment_status: "unpaid" },
    { ...session(), metadata: {} },
    { ...session(), collected_information: null },
  ])
    assert.throws(() => prodigiOrder(s));
  const s = session();
  s.collected_information.shipping_details.address.country = "US";
  assert.throws(() => prodigiOrder(s));
});
