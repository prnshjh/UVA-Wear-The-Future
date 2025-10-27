import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const AnalyticsDashboard = () => {
  const [analytics, setAnalytics] = useState({
    revenueData: [],
    topProducts: [],
    orderStats: {}
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      // Fetch recent orders for revenue data
      const { data: orders } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      // Fetch products for top products
      const { data: products } = await supabase
        .from('products')
        .select('*')
        .order('stock', { ascending: true })
        .limit(10);

      // Calculate basic stats
      const totalRevenue = orders?.reduce((sum, order) => sum + (order.total || 0), 0) || 0;
      const avgOrderValue = orders?.length ? totalRevenue / orders.length : 0;

      setAnalytics({
        revenueData: orders || [],
        topProducts: products || [],
        orderStats: {
          totalRevenue,
          avgOrderValue,
          totalOrders: orders?.length || 0
        }
      });
    } catch (error) {
      toast({
        title: "Error fetching analytics",
        description: String(error),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading analytics...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Revenue</CardTitle>
            <CardDescription>All-time sales</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{analytics.orderStats.totalRevenue?.toLocaleString('en-IN')}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Orders</CardTitle>
            <CardDescription>All orders placed</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.orderStats.totalOrders}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Average Order Value</CardTitle>
            <CardDescription>Per order average</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{Math.round(analytics.orderStats.avgOrderValue)?.toLocaleString('en-IN')}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Low Stock Products</CardTitle>
            <CardDescription>Products needing restock</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.topProducts.slice(0, 5).map((product: any) => (
                <div key={product.id} className="flex justify-between items-center">
                  <span className="text-sm font-medium">{product.name}</span>
                  <span className={`text-sm ${
                    product.stock < 5 ? 'text-red-600 font-bold' : 'text-yellow-600'
                  }`}>
                    {product.stock} in stock
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Revenue</CardTitle>
            <CardDescription>Last 10 orders</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.revenueData.slice(0, 10).map((order: any) => (
                <div key={order.id} className="flex justify-between items-center">
                  <span className="text-sm font-mono">{order.id.slice(0, 8)}...</span>
                  <span className="text-sm font-medium">
                    ₹{order.total?.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(order.created_at).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;