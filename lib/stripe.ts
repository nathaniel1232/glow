import Stripe from "stripe";

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      typescript: true,
    });
  }
  return _stripe;
}

export const PLANS = {
  one_time: {
    name: "One-time Export",
    price: 1900,
    priceId: process.env.STRIPE_ONE_TIME_PRICE_ID!,
    mode: "payment" as const,
    description: "Download your complete brand kit",
  },
  subscription: {
    name: "Pro Monthly",
    price: 1200,
    priceId: process.env.STRIPE_SUBSCRIPTION_PRICE_ID!,
    mode: "subscription" as const,
    description: "Unlimited brand generations per month",
  },
};
