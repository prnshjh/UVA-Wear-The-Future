import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";
import DesignCanvas from "@/components/design/DesignCanvas";
import DesignToolbar from "@/components/design/DesignToolbar";
import LayersPanel from "@/components/design/LayersPanel";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, ShoppingCart } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Canvas as FabricCanvas } from "fabric";

interface Product {
  id: string;
  name: string;
  price: number;
  images: string[];
  sizes: string[];
}

const DesignStudio = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [canvas, setCanvas] = useState<FabricCanvas | null>(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [designName, setDesignName] = useState("");
  const [saving, setSaving] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const fetchProduct = async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", productId)
        .single();

      if (error) throw error;
      setProduct(data);
      setSelectedSize(data.sizes[0] || "");
      setDesignName(`Custom ${data.name}`);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load product",
        variant: "destructive",
      });
      navigate("/products");
    }
  };

  const saveDesign = async () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to save designs",
        variant: "destructive",
      });
      return;
    }

    if (!canvas || !product) return;

    setSaving(true);
    try {
      const canvasJSON = canvas.toJSON();
      const previewDataUrl = canvas.toDataURL({ 
        format: "png", 
        quality: 0.8,
        multiplier: 1
      });

      const { error } = await supabase.from("designs").insert({
        user_id: user.id,
        product_id: product.id,
        name: designName,
        size: selectedSize,
        canvas_data: canvasJSON,
        preview_image: previewDataUrl,
        price: product.price,
      });

      if (error) throw error;

      toast({
        title: "Design Saved",
        description: "Your design has been saved successfully",
      });
    } catch (error) {
      console.error("Error saving design:", error);
      toast({
        title: "Error",
        description: "Failed to save design",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const addToCart = async () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to add to cart",
        variant: "destructive",
      });
      return;
    }

    if (!canvas || !product) return;

    setAddingToCart(true);
    try {
      const canvasJSON = canvas.toJSON();
      const previewDataUrl = canvas.toDataURL({ 
        format: "png", 
        quality: 0.8,
        multiplier: 1
      });

      // Save design first
      const { data: designData, error: designError } = await supabase
        .from("designs")
        .insert({
          user_id: user.id,
          product_id: product.id,
          name: designName,
          size: selectedSize,
          canvas_data: canvasJSON,
          preview_image: previewDataUrl,
          price: product.price,
        })
        .select()
        .single();

      if (designError) throw designError;

      toast({
        title: "Added to Cart",
        description: "Your custom design has been added to cart",
      });

      navigate("/cart");
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast({
        title: "Error",
        description: "Failed to add to cart",
        variant: "destructive",
      });
    } finally {
      setAddingToCart(false);
    }
  };

  if (!product) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="pt-20 flex items-center justify-center h-screen">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-20">
        {/* Header */}
        <div className="border-b bg-card">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/products")}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <div>
                  <h1 className="text-xl font-bold">Design Studio</h1>
                  <p className="text-sm text-muted-foreground">
                    Customize your {product.name}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  onClick={saveDesign}
                  disabled={saving}
                >
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? "Saving..." : "Save Design"}
                </Button>
                <Button onClick={addToCart} disabled={addingToCart}>
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  {addingToCart ? "Adding..." : "Add to Cart"}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-12 gap-6">
            {/* Left Panel - Settings */}
            <div className="col-span-12 lg:col-span-3 space-y-4">
              <Card className="p-4">
                <h3 className="font-semibold mb-4">Design Settings</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="design-name">Design Name</Label>
                    <Input
                      id="design-name"
                      value={designName}
                      onChange={(e) => setDesignName(e.target.value)}
                      placeholder="Enter design name"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="size">Size</Label>
                    <Select value={selectedSize} onValueChange={setSelectedSize}>
                      <SelectTrigger id="size" className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {product.sizes.map((size) => (
                          <SelectItem key={size} value={size}>
                            {size}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="pt-2 border-t">
                    <p className="text-sm text-muted-foreground mb-1">
                      Base Price
                    </p>
                    <p className="text-2xl font-bold">
                      ₹{(product.price / 100).toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>
              </Card>

              <LayersPanel canvas={canvas} />
            </div>

            {/* Center - Canvas */}
            <div className="col-span-12 lg:col-span-6">
              <Card className="p-6">
                <DesignToolbar canvas={canvas} />
                <div className="mt-4">
                  <DesignCanvas
                    productImage={product.images[0]}
                    onCanvasReady={setCanvas}
                  />
                </div>
              </Card>
            </div>

            {/* Right Panel - Preview */}
            <div className="col-span-12 lg:col-span-3">
              <Card className="p-4">
                <h3 className="font-semibold mb-4">Product Preview</h3>
                <div className="aspect-[3/4] bg-muted rounded-lg overflow-hidden">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="mt-4 space-y-2">
                  <h4 className="font-semibold">{product.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    Size: {selectedSize}
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignStudio;
