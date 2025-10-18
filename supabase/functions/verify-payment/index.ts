import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { createHmac } from 'https://deno.land/std@0.177.0/node/crypto.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );

    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) {
      throw new Error('Unauthorized');
    }

    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      items,
      total,
      shipping_address,
      wallet_used = 0
    } = await req.json();
    const razorpayKeySecret = Deno.env.get('RAZORPAY_KEY_SECRET');
    if (!razorpayKeySecret) {
      throw new Error('Razorpay secret not configured');
    }

    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = createHmac('sha256', razorpayKeySecret)
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      console.error('Payment signature verification failed');
      throw new Error('Invalid payment signature');
    }

    console.log('Payment verified successfully');

    // Create order
    const { data: order, error: orderError } = await supabaseClient
      .from('orders')
      .insert({
        user_id: user.id,
        items,
        total,
        payment_status: 'completed',
        razorpay_order_id,
        razorpay_payment_id,
        shipping_address,
      })
      .select()
      .single();

    if (orderError) {
      console.error('Order creation error:', orderError);
      throw new Error('Failed to create order');
    }

    // Get user's wallet
    const { data: wallet, error: walletFetchError } = await supabaseClient
      .from('wallets')
      .select('id, balance')
      .eq('user_id', user.id)
      .single();

    if (walletFetchError || !wallet) {
      console.error('Wallet fetch error:', walletFetchError);
      throw new Error('Failed to fetch wallet');
    }

    // Calculate new balance: deduct wallet_used, add coins for amount paid
    const newBalance = wallet.balance - wallet_used + total;
    
    // Update wallet balance
    const { error: walletUpdateError } = await supabaseClient
      .from('wallets')
      .update({ balance: newBalance })
      .eq('user_id', user.id);

    if (walletUpdateError) {
      console.error('Wallet update error:', walletUpdateError);
      throw new Error('Failed to update wallet');
    }

    // Log transactions
    const transactions = [];

    // If wallet was used, log debit transaction
    if (wallet_used > 0) {
      transactions.push({
        wallet_id: wallet.id,
        amount: wallet_used,
        type: 'debit',
        description: `Order #${order.id.slice(0, 8)} - Wallet redemption`,
        order_id: order.id,
      });
    }

    // Log credit transaction for coins earned
    transactions.push({
      wallet_id: wallet.id,
      amount: total,
      type: 'credit',
      description: `Order #${order.id.slice(0, 8)} - Coins earned`,
      order_id: order.id,
    });

    const { error: txError } = await supabaseClient
      .from('wallet_transactions')
      .insert(transactions);

    if (txError) {
      console.error('Transaction log error:', txError);
      // Don't throw - wallet was updated successfully
    }

    // Clear cart
    await supabaseClient
      .from('cart_items')
      .delete()
      .eq('user_id', user.id);

    console.log('Order completed, wallet updated, cart cleared');

    return new Response(
      JSON.stringify({ success: true, orderId: order.id }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error:', error);
    const message = error instanceof Error ? error.message : 'An error occurred';
    return new Response(
      JSON.stringify({ error: message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
