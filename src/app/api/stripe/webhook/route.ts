import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function POST(request: NextRequest) {
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    return new NextResponse("Stripe webhook is not configured.", { status: 200 });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return new NextResponse("Missing signature.", { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (error) {
    return new NextResponse(error instanceof Error ? error.message : "Invalid webhook signature.", {
      status: 400,
    });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.userId || session.client_reference_id;

    if (userId) {
      await db.subscription.upsert({
        where: { userId },
        update: {
          plan: "PRO",
          status: "ACTIVE",
          stripeCustomerId:
            typeof session.customer === "string" ? session.customer : undefined,
          stripeSubscriptionId:
            typeof session.subscription === "string" ? session.subscription : undefined,
        },
        create: {
          userId,
          plan: "PRO",
          status: "ACTIVE",
          stripeCustomerId:
            typeof session.customer === "string" ? session.customer : undefined,
          stripeSubscriptionId:
            typeof session.subscription === "string" ? session.subscription : undefined,
        },
      });
    }
  }

  if (event.type === "customer.subscription.deleted") {
    const subscription = event.data.object as Stripe.Subscription;
    await db.subscription.updateMany({
      where: {
        stripeSubscriptionId: subscription.id,
      },
      data: {
        plan: "FREE",
        status: "CANCELED",
      },
    });
  }

  return NextResponse.json({ received: true });
}
