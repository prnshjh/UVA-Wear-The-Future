import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState<any>({
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
    pin: "",
  });
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchProfile();
    fetchOrders();
  }, []);

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
      if (data) setProfile(data);
    } catch (err) {
      toast({
        title: "Error loading profile",
        description: String(err),
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
      setOrders(data || []);
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
      if (imageFile) imageUrl = await uploadProfileImage(imageFile, user.user.id);

      const { error } = await supabase.from("user_profiles").upsert({
        user_id: user.user.id,
        name: profile.name,
        phone: profile.phone,
        account_number: profile.account_number,
        bank_name: profile.bank_name,
        ifsc: profile.ifsc,
        address_line1: profile.address_line1,
        address_line2: profile.address_line2,
        city: profile.city,
        state: profile.state,
        pin: profile.pin,
        profile_image_url: imageUrl,
        updated_at: new Date(),
      });

      if (error) throw error;
      toast({ title: "Profile updated", description: "Saved successfully" });
      fetchProfile();
      setEditing(false);
    } catch (err) {
      toast({
        title: "Error saving profile",
        description: String(err),
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
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
        {/* --- Left: Profile Section --- */}
        <div className="bg-card rounded-2xl shadow p-6 border border-border space-y-6">
          <div className="flex items-center justify-between">
          
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
              ["PIN Code", "pin"],
            ].map(([label, key]) => (
              <div key={key}>
                <Label>{label}</Label>
                {editing ? (
                  <Input
                    value={profile[key]}
                    onChange={(e) =>
                      setProfile({ ...profile, [key]: e.target.value })
                    }
                  />
                ) : (
                  <p className="text-muted-foreground mt-1">
                    {profile[key] || "—"}
                  </p>
                )}
              </div>
            ))}
          </div>

          {editing && (
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setEditing(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          )}
        </div>

    {/* Orders Section */}
<div className="md:w-2/3 bg-card rounded-2xl shadow-sm p-6 border border-border">
  <h2 className="text-2xl font-bold mb-6">My Orders</h2>

  {orders.length === 0 ? (
    <p className="text-muted-foreground text-sm">
      You haven’t placed any orders yet.
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
              {Array.isArray(order.items) &&
                order.items.slice(0, 3).map((item: any, idx: number) => (
                  <img
                    key={idx}
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    className="w-14 h-14 rounded-lg object-cover border"
                  />
                ))}
              {Array.isArray(order.items) && order.items.length > 3 && (
                <div className="w-14 h-14 flex items-center justify-center bg-muted rounded-lg text-sm text-muted-foreground">
                  +{order.items.length - 3}
                </div>
              )}
            </div>

            {/* Order Info */}
            <div className="flex-1">
              <div className="flex justify-between items-center">
                <p className="font-semibold text-lg">
                  ₹{order.total.toLocaleString("en-IN")}
                </p>
                <span
                  className={`px-3 py-1 text-xs rounded-full ${
                    order.payment_status === "paid"
                      ? "bg-green-100 text-green-700"
                      : order.payment_status === "pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {order.payment_status.toUpperCase()}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {new Date(order.created_at).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t px-4 py-2 flex justify-between text-sm text-muted-foreground">
            <p>
              {order.items.length}{" "}
              {order.items.length === 1 ? "item" : "items"}
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

      {/* --- Order Details Modal --- */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
  <DialogContent className="max-w-2xl rounded-2xl">
    <DialogHeader>
      <DialogTitle className="text-xl font-semibold">Order Details</DialogTitle>
    </DialogHeader>

    {selectedOrder && (
      <div className="space-y-6">
        {/* Order Meta */}
        <div className="grid md:grid-cols-2 gap-3 border-b pb-3">
          <div>
            <p className="text-sm text-muted-foreground">Order ID</p>
            <p className="font-medium">{selectedOrder.id}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Date</p>
            <p>{new Date(selectedOrder.created_at).toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Payment Status</p>
            <p
              className={
                selectedOrder.payment_status === "paid"
                  ? "text-green-600 font-medium"
                  : "text-yellow-600 font-medium"
              }
            >
              {selectedOrder.payment_status.toUpperCase()}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Amount</p>
            <p className="font-semibold text-lg">₹{selectedOrder.total}</p>
          </div>
        </div>

        {/* Shipping Address */}
        <div>
          <h4 className="font-semibold mb-2 text-lg">Shipping Address</h4>
          <div className="bg-muted p-4 rounded-lg text-sm">
            <p>{selectedOrder.shipping_address?.line1}</p>
            {selectedOrder.shipping_address?.line2 && (
              <p>{selectedOrder.shipping_address.line2}</p>
            )}
            <p>
              {selectedOrder.shipping_address?.city},{" "}
              {selectedOrder.shipping_address?.state}{" "}
              {selectedOrder.shipping_address?.pin}
            </p>
          </div>
        </div>

        {/* Ordered Items */}
        <div>
          <h4 className="font-semibold mb-2 text-lg">Items</h4>
          <div className="space-y-3">
            {Array.isArray(selectedOrder.items) ? (
              selectedOrder.items.map((item: any, idx: number) => (
                <div
                  key={idx}
                  className="flex justify-between items-center border p-3 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="w-14 h-14 rounded object-cover border"
                    />
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Qty: {item.quantity || 1}
                      </p>
                    </div>
                  </div>
                  <p className="font-medium">₹{item.price}</p>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-sm">
                No items data found.
              </p>
            )}
          </div>
        </div>

        {/* Payment Info */}
        <div className="border-t pt-3 text-sm text-muted-foreground">
          <p>
            <strong>Payment ID:</strong>{" "}
            {selectedOrder.razorpay_payment_id || "—"}
          </p>
          <p>
            <strong>Razorpay Order ID:</strong>{" "}
            {selectedOrder.razorpay_order_id || "—"}
          </p>
        </div>
      </div>
    )}
  </DialogContent>
</Dialog>

    </div>
  );
};

export default Profile;
