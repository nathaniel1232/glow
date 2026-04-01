import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getStripe, PLANS } from "@/lib/stripe";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { plan, projectId } = await request.json();

    if (!plan || !["one_time", "subscription"].includes(plan)) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    if (!projectId || typeof projectId !== "string") {
      return NextResponse.json({ error: "Invalid project ID" }, { status: 400 });
    }

    const selectedPlan = PLANS[plan as keyof typeof PLANS];

    const session = await getStripe().checkout.sessions.create({
      mode: selectedPlan.mode,
      payment_method_types: ["card"],
      line_items: [
        {
          price: selectedPlan.priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/brand/${projectId}?paid=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/brand/${projectId}?paid=false`,
      customer_email: user.email,
      metadata: {
        user_id: user.id,
        project_id: projectId,
        plan,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
