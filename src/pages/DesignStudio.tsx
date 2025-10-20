// import { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { supabase } from "@/integrations/supabase/client";
// import { useAuth } from "@/hooks/useAuth";
// import { useToast } from "@/hooks/use-toast";
// import Navigation from "@/components/Navigation";
// import DesignCanvas from "@/components/design/DesignCanvas";
// import DesignToolbar from "@/components/design/DesignToolbar";
// import LayersPanel from "@/components/design/LayersPanel";
// import { Button } from "@/components/ui/button";
// import { ArrowLeft, Save, ShoppingCart } from "lucide-react";
// import { Card } from "@/components/ui/card";
// import { Label } from "@/components/ui/label";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Input } from "@/components/ui/input";
// import { Canvas as FabricCanvas } from "fabric";

// interface Product {
//   id: string;
//   name: string;
//   price: number;
//   images: string[];
//   sizes: string[];
// }

// const DesignStudio = () => {
//   const { productId } = useParams();
//   const navigate = useNavigate();
//   const { user } = useAuth();
//   const { toast } = useToast();
  
//   const [product, setProduct] = useState<Product | null>(null);
//   const [canvas, setCanvas] = useState<FabricCanvas | null>(null);
//   const [selectedSize, setSelectedSize] = useState("");
//   const [designName, setDesignName] = useState("");
//   const [saving, setSaving] = useState(false);
//   const [addingToCart, setAddingToCart] = useState(false);

//   useEffect(() => {
//     if (productId) {
//       fetchProduct();
//     }
//   }, [productId]);

//   const fetchProduct = async () => {
//     try {
//       const { data, error } = await supabase
//         .from("products")
//         .select("*")
//         .eq("id", productId)
//         .single();

//       if (error) throw error;
//       setProduct(data);
//       setSelectedSize(data.sizes[0] || "");
//       setDesignName(`Custom ${data.name}`);
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to load product",
//         variant: "destructive",
//       });
//       navigate("/products");
//     }
//   };

//   const saveDesign = async () => {
//     if (!user) {
//       toast({
//         title: "Login Required",
//         description: "Please login to save designs",
//         variant: "destructive",
//       });
//       return;
//     }

//     if (!canvas || !product) return;

//     setSaving(true);
//     try {
//       const canvasJSON = canvas.toJSON();
//       const previewDataUrl = canvas.toDataURL({ 
//         format: "png", 
//         quality: 0.8,
//         multiplier: 1
//       });

//       const { error } = await supabase.from("designs").insert({
//         user_id: user.id,
//         product_id: product.id,
//         name: designName,
//         size: selectedSize,
//         canvas_data: canvasJSON,
//         preview_image: previewDataUrl,
//         price: product.price,
//       });

//       if (error) throw error;

//       toast({
//         title: "Design Saved",
//         description: "Your design has been saved successfully",
//       });
//     } catch (error) {
//       console.error("Error saving design:", error);
//       toast({
//         title: "Error",
//         description: "Failed to save design",
//         variant: "destructive",
//       });
//     } finally {
//       setSaving(false);
//     }
//   };

//   const addToCart = async () => {
//     if (!user) {
//       toast({
//         title: "Login Required",
//         description: "Please login to add to cart",
//         variant: "destructive",
//       });
//       return;
//     }

//     if (!canvas || !product) return;

//     setAddingToCart(true);
//     try {
//       const canvasJSON = canvas.toJSON();
//       const previewDataUrl = canvas.toDataURL({ 
//         format: "png", 
//         quality: 0.8,
//         multiplier: 1
//       });

//       // Save design first
//       const { data: designData, error: designError } = await supabase
//         .from("designs")
//         .insert({
//           user_id: user.id,
//           product_id: product.id,
//           name: designName,
//           size: selectedSize,
//           canvas_data: canvasJSON,
//           preview_image: previewDataUrl,
//           price: product.price,
//         })
//         .select()
//         .single();

//       if (designError) throw designError;

//       toast({
//         title: "Added to Cart",
//         description: "Your custom design has been added to cart",
//       });

//       navigate("/cart");
//     } catch (error) {
//       console.error("Error adding to cart:", error);
//       toast({
//         title: "Error",
//         description: "Failed to add to cart",
//         variant: "destructive",
//       });
//     } finally {
//       setAddingToCart(false);
//     }
//   };

//   if (!product) {
//     return (
//       <div className="min-h-screen">
//         <Navigation />
//         <div className="pt-20 flex items-center justify-center h-screen">
//           <p className="text-muted-foreground">Loading...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-background">
//       <Navigation />
//       <div className="pt-20">
//         {/* Header */}
//         <div className="border-b bg-card">
//           <div className="container mx-auto px-4 py-4">
//             <div className="flex items-center justify-between">
//               <div className="flex items-center gap-4">
//                 <Button
//                   variant="ghost"
//                   size="sm"
//                   onClick={() => navigate("/products")}
//                 >
//                   <ArrowLeft className="w-4 h-4 mr-2" />
//                   Back
//                 </Button>
//                 <div>
//                   <h1 className="text-xl font-bold">Design Studio</h1>
//                   <p className="text-sm text-muted-foreground">
//                     Customize your {product.name}
//                   </p>
//                 </div>
//               </div>
//               <div className="flex items-center gap-3">
//                 <Button
//                   variant="outline"
//                   onClick={saveDesign}
//                   disabled={saving}
//                 >
//                   <Save className="w-4 h-4 mr-2" />
//                   {saving ? "Saving..." : "Save Design"}
//                 </Button>
//                 <Button onClick={addToCart} disabled={addingToCart}>
//                   <ShoppingCart className="w-4 h-4 mr-2" />
//                   {addingToCart ? "Adding..." : "Add to Cart"}
//                 </Button>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Main Content */}
//         <div className="container mx-auto px-4 py-6">
//           <div className="grid grid-cols-12 gap-6">
//             {/* Left Panel - Settings */}
//             <div className="col-span-12 lg:col-span-3 space-y-4">
//               <Card className="p-4">
//                 <h3 className="font-semibold mb-4">Design Settings</h3>
//                 <div className="space-y-4">
//                   <div>
//                     <Label htmlFor="design-name">Design Name</Label>
//                     <Input
//                       id="design-name"
//                       value={designName}
//                       onChange={(e) => setDesignName(e.target.value)}
//                       placeholder="Enter design name"
//                       className="mt-1"
//                     />
//                   </div>
//                   <div>
//                     <Label htmlFor="size">Size</Label>
//                     <Select value={selectedSize} onValueChange={setSelectedSize}>
//                       <SelectTrigger id="size" className="mt-1">
//                         <SelectValue />
//                       </SelectTrigger>
//                       <SelectContent>
//                         {product.sizes.map((size) => (
//                           <SelectItem key={size} value={size}>
//                             {size}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                   </div>
//                   <div className="pt-2 border-t">
//                     <p className="text-sm text-muted-foreground mb-1">
//                       Base Price
//                     </p>
//                     <p className="text-2xl font-bold">
//                       ₹{(product.price / 100).toLocaleString("en-IN")}
//                     </p>
//                   </div>
//                 </div>
//               </Card>

//               <LayersPanel canvas={canvas} />
//             </div>

//             {/* Center - Canvas */}
//             <div className="col-span-12 lg:col-span-6">
//               <Card className="p-6">
//                 <DesignToolbar canvas={canvas} />
//                 <div className="mt-4">
//                   <DesignCanvas
//                     productImage={product.images[0]}
//                     onCanvasReady={setCanvas}
//                   />
//                 </div>
//               </Card>
//             </div>

//             {/* Right Panel - Preview */}
//             <div className="col-span-12 lg:col-span-3">
//               <Card className="p-4">
//                 <h3 className="font-semibold mb-4">Product Preview</h3>
//                 <div className="aspect-[3/4] bg-muted rounded-lg overflow-hidden">
//                   <img
//                     src={product.images[0]}
//                     alt={product.name}
//                     className="w-full h-full object-cover"
//                   />
//                 </div>
//                 <div className="mt-4 space-y-2">
//                   <h4 className="font-semibold">{product.name}</h4>
//                   <p className="text-sm text-muted-foreground">
//                     Size: {selectedSize}
//                   </p>
//                 </div>
//               </Card>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DesignStudio;
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
import { ArrowLeft, Save, ShoppingCart, Download, Undo, Redo, Sparkles, Zap } from "lucide-react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Product3DPreview from "@/components/design/Product3DPreview";

interface Product {
  id: string;
  name: string;
  price: number;
  images: string[];
  sizes: string[];
  category: string;
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
  const [history, setHistory] = useState<string[]>([]);
  const [historyStep, setHistoryStep] = useState(-1);
  const [previewTexture, setPreviewTexture] = useState<string>("");

  useEffect(() => {
    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  useEffect(() => {
    if (canvas) {
      // Save state to history on object modifications
      const handleModified = () => {
        saveState();
        updatePreviewTexture();
      };
      
      canvas.on('object:modified', handleModified);
      canvas.on('object:added', handleModified);
      canvas.on('object:removed', handleModified);
      
      // Save initial state
      saveState();
      updatePreviewTexture();
      
      return () => {
        canvas.off('object:modified', handleModified);
        canvas.off('object:added', handleModified);
        canvas.off('object:removed', handleModified);
      };
    }
  }, [canvas]);

  const saveState = () => {
    if (!canvas) return;
    
    const json = JSON.stringify(canvas.toJSON());
    const newHistory = history.slice(0, historyStep + 1);
    newHistory.push(json);
    setHistory(newHistory);
    setHistoryStep(newHistory.length - 1);
  };

  const updatePreviewTexture = () => {
    if (!canvas) return;
    
    try {
      // Get texture without triggering another render
      const dataUrl = canvas.toDataURL({
        format: 'png',
        quality: 0.6,
        multiplier: 0.5
      });
      setPreviewTexture(dataUrl);
    } catch (error) {
      console.error('Error updating preview:', error);
    }
  };

  const undo = () => {
    if (!canvas || historyStep <= 0) return;
    
    setHistoryStep(historyStep - 1);
    canvas.loadFromJSON(JSON.parse(history[historyStep - 1]), () => {
      canvas.renderAll();
    });
  };

  const redo = () => {
    if (!canvas || historyStep >= history.length - 1) return;
    
    setHistoryStep(historyStep + 1);
    canvas.loadFromJSON(JSON.parse(history[historyStep + 1]), () => {
      canvas.renderAll();
    });
  };

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
        title: "Design Saved! 🎨",
        description: "Your masterpiece has been saved successfully",
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

  const downloadDesign = () => {
    if (!canvas) return;

    const dataUrl = canvas.toDataURL({
      format: 'png',
      quality: 1,
      multiplier: 2
    });

    const link = document.createElement('a');
    link.download = `${designName.replace(/\s+/g, '_')}_design.png`;
    link.href = dataUrl;
    link.click();

    toast({
      title: "Downloaded! 📥",
      description: "Your design has been downloaded",
    });
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
        title: "Added to Cart! 🛒",
        description: "Your custom design is ready for checkout",
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
          <div className="text-center">
            <Sparkles className="w-12 h-12 mx-auto mb-4 animate-pulse text-accent" />
            <p className="text-muted-foreground">Loading Design Studio...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <Navigation />
      <div className="pt-20">
        {/* Header */}
        <div className="border-b bg-card shadow-sm sticky top-16 z-40">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between flex-wrap gap-4">
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
                  <div className="flex items-center gap-2">
                    <h1 className="text-xl font-bold">Design Studio</h1>
                    <Badge variant="outline" className="hidden sm:inline-flex">
                      <Sparkles className="w-3 h-3 mr-1" />
                      Pro
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Customize your {product.name}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={undo}
                  disabled={historyStep <= 0}
                  title="Undo"
                >
                  <Undo className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={redo}
                  disabled={historyStep >= history.length - 1}
                  title="Redo"
                >
                  <Redo className="w-4 h-4" />
                </Button>
                <Separator orientation="vertical" className="h-6 hidden sm:block" />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={downloadDesign}
                >
                  <Download className="w-4 h-4 sm:mr-2" />
                  <span className="hidden sm:inline">Export</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={saveDesign}
                  disabled={saving}
                >
                  <Save className="w-4 h-4 sm:mr-2" />
                  <span className="hidden sm:inline">{saving ? "Saving..." : "Save"}</span>
                </Button>
                <Button size="sm" onClick={addToCart} disabled={addingToCart}>
                  <ShoppingCart className="w-4 h-4 sm:mr-2" />
                  <span className="hidden sm:inline">{addingToCart ? "Adding..." : "Add to Cart"}</span>
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
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-accent" />
                  Design Settings
                </h3>
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
              <Tabs defaultValue="2d" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="2d">2D View</TabsTrigger>
                  <TabsTrigger value="3d">
                    <Sparkles className="w-4 h-4 mr-1" />
                    3D View
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="2d" className="mt-4">
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
                      <Badge variant="outline">{product.category}</Badge>
                    </div>
                  </Card>
                </TabsContent>

                <TabsContent value="3d" className="mt-4">
                  <Product3DPreview
                    productType={product.category}
                    designTexture={previewTexture || product.images[0]}
                    productColor="#ffffff"
                  />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignStudio;