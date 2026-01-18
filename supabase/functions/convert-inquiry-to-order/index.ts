import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ConvertRequest {
  inquiry_id: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ success: false, error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Initialize Supabase clients
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    // User client for auth verification
    const userClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    // Service client for atomic operations
    const serviceClient = createClient(supabaseUrl, supabaseServiceKey);

    // Verify user is authenticated
    const { data: { user }, error: authError } = await userClient.auth.getUser();
    if (authError || !user) {
      console.error('Auth error:', authError);
      return new Response(
        JSON.stringify({ success: false, error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const actorId = user.id;
    console.log(`User ${actorId} requesting inquiry conversion`);

    // Parse request body
    const body: ConvertRequest = await req.json();
    const { inquiry_id } = body;

    if (!inquiry_id) {
      return new Response(
        JSON.stringify({ success: false, error: 'Missing inquiry_id' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 1. Fetch and verify inquiry exists
    const { data: inquiry, error: inquiryError } = await serviceClient
      .from('inquiries')
      .select('*')
      .eq('id', inquiry_id)
      .single();

    if (inquiryError || !inquiry) {
      console.error('Inquiry fetch error:', inquiryError);
      return new Response(
        JSON.stringify({ success: false, error: 'Inquiry not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 2. Verify inquiry belongs to this user (requester_email matches user email)
    const userEmail = user.email?.toLowerCase();
    const inquiryEmail = inquiry.requester_email?.toLowerCase();
    
    // Check if user is admin (admins can convert any inquiry)
    const { data: isAdmin } = await serviceClient
      .rpc('has_role', { _user_id: actorId, _role: 'admin' });

    if (!isAdmin && userEmail !== inquiryEmail) {
      console.error(`Email mismatch: user=${userEmail}, inquiry=${inquiryEmail}`);
      return new Response(
        JSON.stringify({ success: false, error: 'You can only convert your own inquiries' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 3. Check inquiry not already converted
    if (inquiry.conversion_status === 'converted') {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Inquiry already converted',
          order_id: inquiry.order_id 
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 4. Verify factory exists
    if (!inquiry.factory_id) {
      return new Response(
        JSON.stringify({ success: false, error: 'Inquiry has no associated factory' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { data: factory, error: factoryError } = await serviceClient
      .from('factories')
      .select('id, name')
      .eq('id', inquiry.factory_id)
      .single();

    if (factoryError || !factory) {
      console.error('Factory fetch error:', factoryError);
      return new Response(
        JSON.stringify({ success: false, error: 'Factory not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Converting inquiry ${inquiry_id} to order for factory ${factory.name}`);

    // 5. Create draft order (using service client for atomicity)
    const specifications = {
      target_price: inquiry.target_price || null,
      product_description: inquiry.product_description || inquiry.message || null,
      original_message: inquiry.message,
      deadline: inquiry.deadline || null,
      source: 'inquiry_conversion',
      source_inquiry_id: inquiry.id,
      requester_name: inquiry.requester_name,
      requester_email: inquiry.requester_email,
    };

    const { data: order, error: orderError } = await serviceClient
      .from('orders')
      .insert({
        factory_id: inquiry.factory_id,
        buyer_id: actorId,
        quantity: inquiry.quantity || 100, // Default quantity, buyer can edit
        unit_price: 0, // Buyer fills in
        status: 'draft',
        specifications,
        currency: 'USD',
      })
      .select()
      .single();

    if (orderError || !order) {
      console.error('Order creation error:', orderError);
      return new Response(
        JSON.stringify({ success: false, error: 'Failed to create order', details: orderError?.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Created draft order ${order.id} (${order.order_number})`);

    // 6. Create default milestones (30/70 split)
    // Note: total_amount is 0 since unit_price is 0, buyer will update later
    const { error: milestonesError } = await serviceClient
      .from('order_milestones')
      .insert([
        {
          order_id: order.id,
          label: 'Deposit',
          percentage: 30,
          amount: 0, // Calculated when buyer sets total
          sequence_order: 1,
          release_condition: 'PO accepted by factory',
          status: 'pending',
        },
        {
          order_id: order.id,
          label: 'Final Payment',
          percentage: 70,
          amount: 0,
          sequence_order: 2,
          release_condition: 'QC passed',
          status: 'pending',
        },
      ]);

    if (milestonesError) {
      console.error('Milestone creation error:', milestonesError);
      // Rollback: delete the created order
      await serviceClient.from('orders').delete().eq('id', order.id);
      return new Response(
        JSON.stringify({ success: false, error: 'Failed to create milestones', details: milestonesError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Created default milestones for order ${order.id}`);

    // 7. Update inquiry with conversion status
    const { error: updateError } = await serviceClient
      .from('inquiries')
      .update({
        order_id: order.id,
        conversion_status: 'converted',
        converted_at: new Date().toISOString(),
      })
      .eq('id', inquiry_id);

    if (updateError) {
      console.error('Inquiry update error:', updateError);
      // Note: We don't rollback here since the order is created successfully
      // The inquiry can be manually updated later
    }

    console.log(`Inquiry ${inquiry_id} marked as converted`);

    // 8. Return success with order details
    return new Response(
      JSON.stringify({
        success: true,
        order_id: order.id,
        order_number: order.order_number,
        message: 'Inquiry converted to draft order. Edit order details and issue PO when ready.',
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Unexpected error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ success: false, error: 'Internal server error', details: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
