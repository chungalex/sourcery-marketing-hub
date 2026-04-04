import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Stripe from "https://esm.sh/stripe@14";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing authorization" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");

    if (!stripeSecretKey) {
      return new Response(JSON.stringify({ error: "Stripe not configured. Set STRIPE_SECRET_KEY in Supabase secrets." }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: authError } = await userClient.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { milestone_id, order_id } = await req.json();

    if (!milestone_id || !order_id) {
      return new Response(JSON.stringify({ error: "Missing milestone_id or order_id" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fetch milestone and verify it belongs to the user's order
    const { data: milestone, error: milestoneError } = await userClient
      .from("order_milestones")
      .select("id, label, amount, status, order_id")
      .eq("id", milestone_id)
      .eq("order_id", order_id)
      .single();

    if (milestoneError || !milestone) {
      return new Response(JSON.stringify({ error: "Milestone not found" }), {
        status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (milestone.status !== "pending" && milestone.status !== "eligible") {
      return new Response(JSON.stringify({ error: `Milestone is ${milestone.status} — cannot pay now.` }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!milestone.amount || milestone.amount <= 0) {
      return new Response(JSON.stringify({ error: "Milestone amount must be greater than 0. Set unit price on the order first." }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fetch order for context
    const { data: order } = await userClient
      .from("orders")
      .select("order_number, currency, factories(name)")
      .eq("id", order_id)
      .single();

    const stripe = new Stripe(stripeSecretKey, { apiVersion: "2024-06-20" });

    const appUrl = Deno.env.get("APP_URL") || "https://sourcery.lovable.app";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: (order?.currency || "usd").toLowerCase(),
            product_data: {
              name: `${milestone.label} — Order ${order?.order_number || order_id.slice(0, 8)}`,
              description: (order?.factories as any)?.name
                ? `Payment to ${(order.factories as any).name}`
                : "Sourcery platform payment",
            },
            unit_amount: Math.round(milestone.amount * 100), // Stripe uses cents
          },
          quantity: 1,
        },
      ],
      metadata: {
        milestone_id,
        order_id,
        user_id: user.id,
      },
      success_url: `${appUrl}/orders/${order_id}?payment=success&milestone=${milestone_id}`,
      cancel_url: `${appUrl}/orders/${order_id}?payment=cancelled`,
    });

    return new Response(JSON.stringify({ url: session.url, session_id: session.id }), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("[stripe-checkout] Error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: "Internal server error", details: message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
