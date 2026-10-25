/**
 * Stripe PaymentIntent server for idunrx checkout.
 * Run: npm run start:server
 * Set STRIPE_SECRET_KEY in server/.env (that file is not committed).
 */
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const Stripe = require("stripe");

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || "";
if (!STRIPE_SECRET_KEY) {
  console.error("Set STRIPE_SECRET_KEY before starting the Stripe server.");
  process.exit(1);
}

const app = express();
const PORT = 4242;

app.use(cors());
app.use(express.json());

const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: "2025-02-24.acacia",
});

const {
  meta,
  buildPaymentIntentMetadata,
  buildShipping,
} = require("./stripePaymentIntentHelpers");

app.post("/api/create-payment-intent", async (req, res) => {
  try {
    const body = req.body;
    const {
      email,
      productName,
      sku,
      amount,
      currency = "usd",
      productId,
    } = body;

    if (!email || amount === undefined || amount === null) {
      return res.status(400).json({
        error: "Missing required fields: email and amount are required",
      });
    }

    const amountInCents = Math.max(50, Math.floor(Number(amount)));

    if (amountInCents < 50 || amountInCents > 10000000) {
      return res.status(400).json({
        error: `Invalid amount: ${amountInCents} cents`,
      });
    }

    const customerName = [meta(body.firstName), meta(body.lastName)]
      .filter(Boolean)
      .join(" ");

    let customer;
    const existing = await stripe.customers.list({ email, limit: 1 });
    const customerPayload = {
      email,
      name: customerName || undefined,
      phone: meta(body.phone) || undefined,
    };
    if (existing.data.length > 0) {
      customer = await stripe.customers.update(existing.data[0].id, customerPayload);
    } else {
      customer = await stripe.customers.create(customerPayload);
    }

    const metadata = buildPaymentIntentMetadata(body);
    const shipping = buildShipping(body);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: String(currency).toLowerCase(),
      customer: customer.id,
      // Dynamic payment methods — Stripe shows eligible methods from Dashboard
      // (Klarna, Link, Amazon Pay, etc.) based on amount, currency, and address.
      automatic_payment_methods: { enabled: true },
      metadata,
      receipt_email: email,
      ...(shipping ? { shipping } : {}),
      description: productName
        ? `${productName}${sku ? ` (${sku})` : ""}`
        : undefined,
    });

    console.log("[stripe] PaymentIntent created:", {
      id: paymentIntent.id,
      amount: paymentIntent.amount,
      email,
      ...metadata,
    });

    return res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error("[stripe] create-payment-intent error:", err);
    return res.status(500).json({
      error: err.message || "Failed to create payment intent",
    });
  }
});

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`idunrx Stripe server listening on http://localhost:${PORT}`);
});
