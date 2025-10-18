import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/contexts/CartContext';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

declare global {
  interface Window {
    Razorpay: any;
  }
}

const addressSchema = z.object({
  phone: z.string().min(10, 'Phone must be at least 10 digits'),
  address_line1: z.string().min(5, 'Address is required'),
  address_line2: z.string().optional(),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  pincode: z.string().min(6, 'Valid pincode required'),
});

type AddressForm = z.infer<typeof addressSchema>;

const Checkout = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cartItems, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0);
  const [useWallet, setUseWallet] = useState(false);
  const [isMonthEndSale, setIsMonthEndSale] = useState(false);

  const form = useForm<AddressForm>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      phone: '',
      address_line1: '',
      address_line2: '',
      city: '',
      state: '',
      pincode: '',
    },
  });

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => setScriptLoaded(true);
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    // Load user profile address and wallet balance
    const loadProfile = async () => {
      if (!user) return;

      const { data } = await supabase
        .from('profiles')
        .select('phone, address_line1, address_line2, city, state, pincode')
        .eq('id', user.id)
        .single();

      if (data) {
        form.reset({
          phone: data.phone || '',
          address_line1: data.address_line1 || '',
          address_line2: data.address_line2 || '',
          city: data.city || '',
          state: data.state || '',
          pincode: data.pincode || '',
        });
      }

      // Load wallet balance
      const { data: walletData } = await supabase
        .from('wallets')
        .select('balance')
        .eq('user_id', user.id)
        .single();

      if (walletData) {
        setWalletBalance(walletData.balance);
      }

      // Check if it's month-end sale (last 5 days of month)
      const today = new Date();
      const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
      const daysRemaining = lastDay - today.getDate();
      setIsMonthEndSale(daysRemaining <= 5);
    };

    loadProfile();
  }, [user]);

  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/cart');
    }
  }, [cartItems, navigate]);

  const subtotal = cartItems.reduce((sum, item) => {
    return sum + (item.product?.price || 0) * item.quantity;
  }, 0);

  const walletDiscount = useWallet && isMonthEndSale ? Math.min(walletBalance, subtotal) : 0;
  const total = subtotal - walletDiscount;

  const onSubmit = async (values: AddressForm) => {
    if (!user || !scriptLoaded) {
      toast({
        title: 'Error',
        description: 'Please wait for payment system to load',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      // Save address to profile
      await supabase
        .from('profiles')
        .update(values)
        .eq('id', user.id);

      // Create Razorpay order
      const { data: orderData, error: orderError } = await supabase.functions.invoke(
        'create-razorpay-order',
        {
          body: { amount: total, currency: 'INR' },
        }
      );

      if (orderError) throw orderError;

      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'UVA',
        description: 'Order Payment',
        order_id: orderData.orderId,
        handler: async (response: any) => {
          try {
            // Verify payment
            const items = cartItems.map(item => ({
              product_id: item.product_id,
              quantity: item.quantity,
              size: item.size,
              price: item.product?.price || 0,
              name: item.product?.name || '',
            }));

            const { data: verifyData, error: verifyError } = await supabase.functions.invoke(
              'verify-payment',
              {
                body: {
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  items,
                  total,
                  shipping_address: values,
                  wallet_used: walletDiscount,
                },
              }
            );

            if (verifyError) throw verifyError;

            const coinsEarned = total; // Earn coins on amount paid after discount
            toast({
              title: 'Payment Successful',
              description: `Order placed! You earned ${coinsEarned} coins.`,
            });

            navigate('/');
          } catch (error) {
            console.error('Payment verification error:', error);
            toast({
              title: 'Payment Error',
              description: 'Payment verification failed',
              variant: 'destructive',
            });
          }
        },
        prefill: {
          email: user.email,
          contact: values.phone,
        },
        theme: {
          color: '#000000',
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', () => {
        toast({
          title: 'Payment Failed',
          description: 'Please try again',
          variant: 'destructive',
        });
      });
      rzp.open();
    } catch (error) {
      console.error('Checkout error:', error);
      toast({
        title: 'Error',
        description: 'Failed to process checkout',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navigation />
      <div className="min-h-screen pt-20 px-4">
        <div className="max-w-4xl mx-auto py-12">
          <h1 className="text-3xl font-bold mb-8">Checkout</h1>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Shipping Address Form */}
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-6">Shipping Address</h2>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="1234567890" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="address_line1"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address Line 1</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Street address" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="address_line2"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address Line 2 (Optional)</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Apartment, suite, etc." />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>State</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="pincode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pincode</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="123456" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    disabled={loading || !scriptLoaded}
                  >
                    {loading ? 'Processing...' : 'Proceed to Payment'}
                  </Button>
                </form>
              </Form>
            </Card>

            {/* Order Summary */}
            <div>
              <Card className="p-6">
                <h2 className="text-xl font-bold mb-6">Order Summary</h2>
                
                <div className="space-y-4 mb-6">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <div>
                        <p className="font-medium">{item.product?.name}</p>
                        <p className="text-muted-foreground">
                          Size: {item.size} × {item.quantity}
                        </p>
                      </div>
                      <span>₹{((item.product?.price || 0) * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>₹{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>Free</span>
                  </div>
                  
                  {/* Wallet Redemption Option */}
                  {isMonthEndSale && walletBalance > 0 && (
                    <>
                      <div className="pt-3 border-t">
                        <div className="flex items-center space-x-2 mb-2">
                          <Checkbox 
                            id="use-wallet" 
                            checked={useWallet}
                            onCheckedChange={(checked) => setUseWallet(checked as boolean)}
                          />
                          <Label htmlFor="use-wallet" className="text-sm font-medium cursor-pointer">
                            Use Wallet Balance ({walletBalance} coins available)
                          </Label>
                        </div>
                        <p className="text-xs text-muted-foreground ml-6">
                          🎉 Month-end sale active! Redeem your coins now
                        </p>
                      </div>
                      {useWallet && walletDiscount > 0 && (
                        <div className="flex justify-between text-sm text-green-600">
                          <span>Wallet Discount</span>
                          <span>-₹{walletDiscount.toLocaleString()}</span>
                        </div>
                      )}
                    </>
                  )}
                  
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Coins to earn</span>
                    <span>{total} coins</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>₹{total.toLocaleString()}</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Checkout;
