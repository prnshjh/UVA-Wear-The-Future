import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Package, Truck, CheckCircle, Clock, XCircle, AlertCircle } from "lucide-react";

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "",
    phone: "",
    account_number: "",
    bank_name: "",
    ifsc: "",
    profile_image_url: "",
    address_line1: "",
    address_line2: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [profileId, setProfileId] = useState<string | null>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [cancellingOrder, setCancellingOrder] = useState(false);
  const [returningOrder, setReturningOrder] = useState(false);
  const { toast } = useToast();
  
  const [userName, setUserName] = useState("");
  const [orderItemsWithProducts, setOrderItemsWithProducts] = useState<any[]>([]);

  useEffect(() => {
    fetchProfile();
    fetchOrders();
  }, []);

  // Fetch user name when order is selected
  useEffect(() => {
    if (selectedOrder?.user_id) {
      fetchUserName(selectedOrder.user_id);
    }
  }, [selectedOrder]);

  // Fetch product data when order is selected
  useEffect(() => {
    if (selectedOrder?.items) {
      fetchOrderProducts(selectedOrder.items);
    }
  }, [selectedOrder]);

  const fetchUserName = async (userId: string) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("name")
      .eq("id", userId)
      .single();
    if (!error && data) setUserName(data.name);
  };

  const fetchOrderProducts = async (items: any[]) => {
    if (!items?.length) {
      setOrderItemsWithProducts([]);
      return;
    }

    try {
      // Get all product IDs from order items
      const productIds = items.map((item) => item.product_id).filter(Boolean);

      if (productIds.length === 0) {
        setOrderItemsWithProducts(items);
        return;
      }

      // Fetch product data including images
      const { data: products, error } = await supabase
        .from("products")
        .select("id, name, images")
        .in("id", productIds);

      if (error) {
        console.error("Error fetching products:", error);
        setOrderItemsWithProducts(items);
        return;
      }

      // Merge product data with order items
      const mergedItems = items.map((item) => {
        const product = products?.find((p) => p.id === item.product_id);
        return {
          ...item,
          product: product || null,
          image: product?.images?.[0] || "/placeholder.svg" // Use first image or placeholder
        };
      });

      setOrderItemsWithProducts(mergedItems);
    } catch (err) {
      console.error("Error in fetchOrderProducts:", err);
      setOrderItemsWithProducts(items);
    }
  };

  // Function to get image URLs for order preview thumbnails
  const getOrderPreviewImages = async (items: any[]) => {
    if (!items?.length) return [];

    const productIds = items.map((item) => item.product_id).filter(Boolean);
    if (productIds.length === 0) return [];

    try {
      const { data: products, error } = await supabase
        .from("products")
        .select("id, images")
        .in("id", productIds);

      if (error || !products) return [];

      return items.map(item => {
        const product = products.find(p => p.id === item.product_id);
        return product?.images?.[0] || "/placeholder.svg";
      });
    } catch (err) {
      console.error("Error fetching preview images:", err);
      return [];
    }
  };

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const { data: user } = await supabase.auth.getUser();
      if (!user?.user) return;

      const { data, error } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("user_id", user.user.id)
        .single();

      if (error && error.code !== "PGRST116") throw error;
      
      if (data) {
        // Store the profile ID and set profile data
        setProfileId(data.id);
        setProfile({
          name: data.name || "",
          phone: data.phone || "",
          account_number: data.account_number || "",
          bank_name: data.bank_name || "",
          ifsc: data.ifsc || "",
          profile_image_url: data.profile_image_url || "",
          address_line1: data.address_line1 || "",
          address_line2: data.address_line2 || "",
          city: data.city || "",
          state: data.state || "",
          pincode: data.pincode || "",
        });
      } else {
        // No profile exists yet, reset profileId
        setProfileId(null);
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
      toast({
        title: "Error loading profile",
        description: "Failed to load profile data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user?.user) return;

      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", user.user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      // Enhance orders with product images for preview
      const ordersWithImages = await Promise.all(
        (data || []).map(async (order) => {
          if (order.items?.length) {
            const previewImages = await getOrderPreviewImages(order.items);
            return {
              ...order,
              previewImages
            };
          }
          return order;
        })
      );
      
      setOrders(ordersWithImages);
    } catch (err) {
      toast({
        title: "Error fetching orders",
        description: String(err),
        variant: "destructive",
      });
    }
  };

  const uploadProfileImage = async (file: File, userId: string) => {
    const fileExt = file.name.split(".").pop();
    const filePath = `profiles/${userId}.${fileExt}`;
    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, file, { upsert: true });
    if (uploadError) throw uploadError;

    const { data: publicURL } = supabase.storage
      .from("avatars")
      .getPublicUrl(filePath);
    return publicURL.publicUrl;
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const { data: user } = await supabase.auth.getUser();
      if (!user?.user) {
        toast({
          title: "Authentication Required",
          description: "Please log in to save your profile",
          variant: "destructive",
        });
        return;
      }

      let imageUrl = profile.profile_image_url;
      if (imageFile) {
        imageUrl = await uploadProfileImage(imageFile, user.user.id);
      }

      // Prepare data with proper field names matching the schema
      const profileData = {
        user_id: user.user.id,
        name: profile.name || null,
        phone: profile.phone || null,
        account_number: profile.account_number || null,
        bank_name: profile.bank_name || null,
        ifsc: profile.ifsc || null,
        address_line1: profile.address_line1 || null,
        address_line2: profile.address_line2 || null,
        city: profile.city || null,
        state: profile.state || null,
        pincode: profile.pincode || null,
        profile_image_url: imageUrl || null,
        updated_at: new Date().toISOString(),
      };

      console.log("Saving profile data:", profileData);
      console.log("Profile ID:", profileId);

      let error;

      if (profileId) {
        // Update existing profile
        const { error: updateError } = await supabase
          .from("user_profiles")
          .update(profileData)
          .eq("id", profileId);

        error = updateError;
      } else {
        // Create new profile
        const { error: insertError } = await supabase
          .from("user_profiles")
          .insert([profileData]);

        error = insertError;
      }

      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }

      toast({ 
        title: "Profile updated", 
        description: "Your profile has been saved successfully" 
      });
      
      fetchProfile();
      setEditing(false);
      setImageFile(null);
    } catch (err: any) {
      console.error("Save error:", err);
      toast({
        title: "Error saving profile",
        description: err.message || "Please check your data and try again",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    if (!confirm("Are you sure you want to cancel this order?")) return;
    
    try {
      setCancellingOrder(true);
      const { error } = await supabase
        .from("orders")
        .update({ status: "cancelled" })
        .eq("id", orderId);

      if (error) throw error;
      
      toast({
        title: "Order Cancelled",
        description: "Your order has been cancelled successfully",
      });
      
      fetchOrders();
      if (selectedOrder?.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: "cancelled" });
      }
    } catch (err) {
      toast({
        title: "Error cancelling order",
        description: String(err),
        variant: "destructive",
      });
    } finally {
      setCancellingOrder(false);
    }
  };

  const handleReturnOrder = async (orderId: string) => {
    if (!confirm("Are you sure you want to return this order?")) return;
    
    try {
      setReturningOrder(true);
      const { error } = await supabase
        .from("orders")
        .update({ status: "returned" })
        .eq("id", orderId);

      if (error) throw error;
      
      toast({
        title: "Return Initiated",
        description: "Your return request has been submitted",
      });
      
      fetchOrders();
      if (selectedOrder?.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: "returned" });
      }
    } catch (err) {
      toast({
        title: "Error processing return",
        description: String(err),
        variant: "destructive",
      });
    } finally {
      setReturningOrder(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case "packed":
        return <Package className="w-5 h-5 text-blue-500" />;
      case "shipped":
        return <Truck className="w-5 h-5 text-purple-500" />;
      case "delivered":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "cancelled":
        return <XCircle className="w-5 h-5 text-red-500" />;
      case "returned":
        return <AlertCircle className="w-5 h-5 text-orange-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "packed":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "shipped":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "delivered":
        return "bg-green-100 text-green-700 border-green-200";
      case "cancelled":
        return "bg-red-100 text-red-700 border-red-200";
      case "returned":
        return "bg-orange-100 text-orange-700 border-orange-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const canCancelOrder = (order: any) => {
    return order.status !== "delivered" && order.status !== "cancelled" && order.status !== "returned";
  };

  const canReturnOrder = (order: any) => {
    if (order.status !== "delivered" || !order.delivered_at) return false;
    const deliveryDate = new Date(order.delivered_at);
    const currentDate = new Date();
    const diffTime = Math.abs(currentDate.getTime() - deliveryDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 5;
  };

  const getExpectedDeliveryDate = (order: any) => {
    if (order.delivered_at) return new Date(order.delivered_at);
    const orderDate = new Date(order.created_at);
    orderDate.setDate(orderDate.getDate() + 7);
    return orderDate;
  };

  const handleInputChange = (field: string, value: string) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (loading)
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p className="text-muted-foreground">Loading profile...</p>
      </div>
    );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      <main className="flex-1 pt-24 pb-20 container mx-auto px-4 grid md:grid-cols-2 gap-8">
        {/* Left: Profile Section */}
        <div className="bg-card rounded-2xl shadow p-6 border border-border space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Profile Information</h2>
            {!editing && (
              <Button variant="outline" onClick={() => setEditing(true)}>
                Edit Profile
              </Button>
            )}
          </div>

          <div className="flex flex-col items-center">
            <img
              src={profile.profile_image_url || "/placeholder.svg"}
              className="w-32 h-32 rounded-full border border-border object-cover"
              alt="Profile"
            />
            {editing && (
              <Input
                type="file"
                accept="image/*"
                className="mt-3"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              />
            )}
          </div>

          <div className="space-y-4">
            {[
              ["Full Name", "name"],
              ["Phone Number", "phone"],
              ["Bank Name", "bank_name"],
              ["Account Number", "account_number"],
              ["IFSC Code", "ifsc"],
              ["Address Line 1", "address_line1"],
              ["Address Line 2", "address_line2"],
              ["City", "city"],
              ["State", "state"],
              ["PIN Code", "pincode"],
            ].map(([label, key]) => (
              <div key={key}>
                <Label htmlFor={key}>{label}</Label>
                {editing ? (
                  <Input
                    id={key}
                    value={profile[key]}
                    onChange={(e) => handleInputChange(key, e.target.value)}
                    placeholder={`Enter your ${label.toLowerCase()}`}
                  />
                ) : (
                  <p className="text-muted-foreground mt-1 px-3 py-2 border border-transparent">
                    {profile[key] || "Not provided"}
                  </p>
                )}
              </div>
            ))}
          </div>

          {editing && (
            <div className="flex justify-end gap-3 pt-4">
              <Button 
                variant="outline" 
                onClick={() => {
                  setEditing(false);
                  fetchProfile(); // Reset to original data
                  setImageFile(null);
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          )}
        </div>

        {/* Right: Orders Section */}
        <div className="bg-card rounded-2xl shadow p-6 border border-border">
          <h2 className="text-2xl font-bold mb-6">Orders History</h2>

          {orders.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              You haven't placed any orders yet.
            </p>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="border rounded-xl hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden"
                  onClick={() => setSelectedOrder(order)}
                >
                  <div className="flex items-center gap-4 p-4">
                    {/* Thumbnail Preview */}
                    <div className="flex -space-x-2">
                      {order.previewImages?.slice(0, 3).map((image: string, idx: number) => (
                        <img
                          key={idx}
                          src={image || "/placeholder.svg"}
                          alt="Product"
                          className="w-14 h-14 rounded-lg object-cover border-2 border-background"
                        />
                      ))}
                      {order.items?.length > 3 && (
                        <div className="w-14 h-14 flex items-center justify-center bg-muted rounded-lg text-sm text-muted-foreground border-2 border-background">
                          +{order.items.length - 3}
                        </div>
                      )}
                    </div>

                    {/* Order Info */}
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <p className="font-semibold text-lg">
                          ₹{order.total.toLocaleString("en-IN")}
                        </p>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(order.status)}
                          <span className={`px-3 py-1 text-xs rounded-full border ${getStatusColor(order.status)}`}>
                            {order.status.toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {new Date(order.created_at).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                      {order.tracking_id && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Tracking: {order.tracking_id}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="border-t px-4 py-2 flex justify-between text-sm text-muted-foreground">
                    <p>
                      {order.items?.length || 0}{" "}
                      {(order.items?.length || 0) === 1 ? "item" : "items"}
                    </p>
                    <p className="text-blue-600 font-medium">View Details →</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />

      {/* Order Details Modal */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold">Order Details</DialogTitle>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-6">
              {/* Order Status Timeline */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(selectedOrder.status)}
                    <div>
                      <p className="font-semibold text-lg">
                        Order {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {selectedOrder.status === "delivered" ? "Delivered on" : "Expected delivery"}:{" "}
                        {getExpectedDeliveryDate(selectedOrder).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                  {selectedOrder.tracking_id && (
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Tracking ID</p>
                      <p className="font-mono text-sm font-medium">{selectedOrder.tracking_id}</p>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  {canCancelOrder(selectedOrder) && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleCancelOrder(selectedOrder.id)}
                      disabled={cancellingOrder}
                    >
                      {cancellingOrder ? "Cancelling..." : "Cancel Order"}
                    </Button>
                  )}
                  {canReturnOrder(selectedOrder) && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleReturnOrder(selectedOrder.id)}
                      disabled={returningOrder}
                    >
                      {returningOrder ? "Processing..." : "Return Order"}
                    </Button>
                  )}
                  {selectedOrder.status === "delivered" && !canReturnOrder(selectedOrder) && (
                    <p className="text-xs text-muted-foreground self-center">
                      Return period expired (5 days limit)
                    </p>
                  )}
                </div>
              </div>

              {/* Order Meta */}
              <div className="grid md:grid-cols-2 gap-4 border rounded-lg p-4">
                <div>
                  <p className="text-sm text-muted-foreground">Order ID</p>
                  <p className="font-mono text-sm font-medium">{selectedOrder.id.slice(0, 8)}...</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Order Date</p>
                  <p className="font-medium">
                    {new Date(selectedOrder.created_at).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Payment Status</p>
                  <p className={`font-medium ${
                    selectedOrder.payment_status === "paid"
                      ? "text-green-600"
                      : selectedOrder.payment_status === "pending"
                      ? "text-yellow-600"
                      : "text-red-600"
                  }`}>
                    {selectedOrder.payment_status.toUpperCase()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Amount</p>
                  <p className="font-bold text-xl">₹{selectedOrder.total.toLocaleString("en-IN")}</p>
                </div>
              </div>

              {/* Ordered Items */}
              <div>
                <h4 className="font-semibold mb-3 text-lg flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Items Ordered
                </h4>
                <div className="space-y-3">
                  {orderItemsWithProducts.length > 0 ? (
                    orderItemsWithProducts.map((item: any, idx: number) => (
                      <div
                        key={idx}
                        className="flex justify-between items-center border rounded-lg p-4 hover:bg-muted/50 transition"
                      >
                        <div className="flex items-center gap-4">
                          <img
                            src={item.image || "/placeholder.svg"}
                            alt={item.product?.name || "Product"}
                            className="w-16 h-16 rounded-lg object-cover border"
                          />
                          <div>
                            <p className="font-semibold">{item.product?.name || item.name || "Product"}</p>
                            <div className="flex gap-4 mt-1">
                              <p className="text-sm text-muted-foreground">
                                Qty: {item.quantity || 1}
                              </p>
                              {item.size && (
                                <p className="text-sm text-muted-foreground">
                                  Size: {item.size}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                        <p className="font-semibold text-lg">₹{(item.price || 0).toLocaleString("en-IN")}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground text-sm">No items data found.</p>
                  )}
                </div>
              </div>

              {/* Shipping Address */}
              <div>
                <h4 className="font-semibold mb-3 text-lg flex items-center gap-2">
                  <Truck className="w-5 h-5" />
                  Shipping Address
                </h4>
                <div className="bg-muted/50 p-4 rounded-lg border">
                  <p className="font-medium">{userName}</p>

                  <p className="mt-1">{selectedOrder.shipping_address?.address_line1}</p>
                  {selectedOrder.shipping_address?.address_line2 && (
                    <p>{selectedOrder.shipping_address.address_line2}</p>
                  )}
                  <p>
                    {selectedOrder.shipping_address?.city}, {selectedOrder.shipping_address?.state}{" "}
                    {selectedOrder.shipping_address?.pincode}
                  </p>
                  {selectedOrder.shipping_address?.phone && (
                    <p className="mt-2 text-sm text-muted-foreground">
                      Phone: {selectedOrder.shipping_address.phone}
                    </p>
                  )}
                </div>
              </div>

              {/* Payment Info */}
              <div className="border-t pt-4">
                <h4 className="font-semibold mb-3 text-sm text-muted-foreground">Payment Information</h4>
                <div className="grid md:grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-muted-foreground">Payment ID</p>
                    <p className="font-mono">{selectedOrder.razorpay_payment_id || "—"}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Razorpay Order ID</p>
                    <p className="font-mono">{selectedOrder.razorpay_order_id || "—"}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Profile;