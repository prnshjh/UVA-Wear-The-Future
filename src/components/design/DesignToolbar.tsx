// import { useRef, useState } from "react";
// import { Canvas as FabricCanvas, FabricImage, Textbox, Circle, Rect, util } from "fabric";
// import { supabase } from "@/integrations/supabase/client";
// import { useAuth } from "@/hooks/useAuth";
// import { useToast } from "@/hooks/use-toast";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   Upload,
//   Type,
//   Shapes,
//   Palette,
//   Trash2,
//   Image as ImageIcon,
// } from "lucide-react";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
// import { Separator } from "@/components/ui/separator";

// interface DesignToolbarProps {
//   canvas: FabricCanvas | null;
// }

// const STICKERS = [
//   "⭐",
//   "❤️",
//   "🔥",
//   "💎",
//   "🚀",
//   "✨",
//   "🎨",
//   "👕",
// ];

// const COLORS = [
//   "#000000",
//   "#ffffff",
//   "#ff0000",
//   "#00ff00",
//   "#0000ff",
//   "#ffff00",
//   "#ff00ff",
//   "#00ffff",
// ];

// const DesignToolbar = ({ canvas }: DesignToolbarProps) => {
//   const { user } = useAuth();
//   const { toast } = useToast();
//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const [textInput, setTextInput] = useState("");
//   const [selectedColor, setSelectedColor] = useState("#000000");
//   const [uploading, setUploading] = useState(false);

//   const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (!canvas || !user || !e.target.files?.[0]) return;

//     const file = e.target.files[0];
//     setUploading(true);

//     try {
//       // Upload to Supabase Storage
//       const fileExt = file.name.split(".").pop();
//       const fileName = `${user.id}/${Date.now()}.${fileExt}`;

//       const { error: uploadError } = await supabase.storage
//         .from("design-assets")
//         .upload(fileName, file);

//       if (uploadError) throw uploadError;

//       const { data } = supabase.storage
//         .from("design-assets")
//         .getPublicUrl(fileName);

//       // Add image to canvas with CORS enabled
//       util.loadImage(data.publicUrl, { crossOrigin: 'anonymous' }).then((img) => {
//         const fabricImg = new FabricImage(img, {
//           scaleX: 200 / img.width,
//           scaleY: 200 / img.width,
//           left: 100,
//           top: 100,
//         });
        
//         canvas.add(fabricImg);
//         canvas.setActiveObject(fabricImg);
//         canvas.renderAll();
//       }).catch((err) => {
//         console.error("Error loading image:", err);
//       });

//       toast({
//         title: "Image Uploaded",
//         description: "Image added to canvas",
//       });
//     } catch (error) {
//       console.error("Error uploading image:", error);
//       toast({
//         title: "Error",
//         description: "Failed to upload image",
//         variant: "destructive",
//       });
//     } finally {
//       setUploading(false);
//       if (fileInputRef.current) {
//         fileInputRef.current.value = "";
//       }
//     }
//   };

//   const addText = () => {
//     if (!canvas || !textInput.trim()) return;

//     const text = new Textbox(textInput, {
//       left: 150,
//       top: 150,
//       fontSize: 40,
//       fill: selectedColor,
//       fontFamily: "Arial",
//     });

//     canvas.add(text);
//     canvas.setActiveObject(text);
//     canvas.renderAll();
//     setTextInput("");

//     toast({
//       title: "Text Added",
//       description: "Text added to canvas",
//     });
//   };

//   const addSticker = (emoji: string) => {
//     if (!canvas) return;

//     const text = new Textbox(emoji, {
//       left: 200,
//       top: 200,
//       fontSize: 80,
//       fontFamily: "Arial",
//     });

//     canvas.add(text);
//     canvas.setActiveObject(text);
//     canvas.renderAll();
//   };

//   const addShape = (type: "circle" | "rectangle") => {
//     if (!canvas) return;

//     let shape;
//     if (type === "circle") {
//       shape = new Circle({
//         radius: 50,
//         fill: selectedColor,
//         left: 200,
//         top: 200,
//       });
//     } else {
//       shape = new Rect({
//         width: 100,
//         height: 100,
//         fill: selectedColor,
//         left: 200,
//         top: 200,
//       });
//     }

//     canvas.add(shape);
//     canvas.setActiveObject(shape);
//     canvas.renderAll();
//   };

//   const deleteSelected = () => {
//     if (!canvas) return;

//     const activeObjects = canvas.getActiveObjects();
//     if (activeObjects.length) {
//       activeObjects.forEach((obj) => canvas.remove(obj));
//       canvas.discardActiveObject();
//       canvas.renderAll();
      
//       toast({
//         title: "Deleted",
//         description: "Selected items removed",
//       });
//     }
//   };

//   return (
//     <div className="flex flex-wrap items-center gap-2 p-4 bg-muted/50 rounded-lg">
//       {/* Upload Image */}
//       <div>
//         <input
//           ref={fileInputRef}
//           type="file"
//           accept="image/*"
//           onChange={handleImageUpload}
//           className="hidden"
//         />
//         <Button
//           variant="outline"
//           size="sm"
//           onClick={() => fileInputRef.current?.click()}
//           disabled={uploading}
//         >
//           <Upload className="w-4 h-4 mr-2" />
//           {uploading ? "Uploading..." : "Upload Image"}
//         </Button>
//       </div>

//       <Separator orientation="vertical" className="h-8" />

//       {/* Add Text */}
//       <Popover>
//         <PopoverTrigger asChild>
//           <Button variant="outline" size="sm">
//             <Type className="w-4 h-4 mr-2" />
//             Add Text
//           </Button>
//         </PopoverTrigger>
//         <PopoverContent className="w-80">
//           <div className="space-y-3">
//             <Label htmlFor="text-input">Enter Text</Label>
//             <Input
//               id="text-input"
//               value={textInput}
//               onChange={(e) => setTextInput(e.target.value)}
//               placeholder="Type your text..."
//               onKeyDown={(e) => {
//                 if (e.key === "Enter") {
//                   addText();
//                 }
//               }}
//             />
//             <Button onClick={addText} className="w-full" disabled={!textInput.trim()}>
//               Add to Canvas
//             </Button>
//           </div>
//         </PopoverContent>
//       </Popover>

//       {/* Stickers */}
//       <Popover>
//         <PopoverTrigger asChild>
//           <Button variant="outline" size="sm">
//             <ImageIcon className="w-4 h-4 mr-2" />
//             Stickers
//           </Button>
//         </PopoverTrigger>
//         <PopoverContent className="w-64">
//           <div className="grid grid-cols-4 gap-2">
//             {STICKERS.map((emoji, idx) => (
//               <button
//                 key={idx}
//                 onClick={() => addSticker(emoji)}
//                 className="text-3xl p-2 hover:bg-muted rounded transition-colors"
//               >
//                 {emoji}
//               </button>
//             ))}
//           </div>
//         </PopoverContent>
//       </Popover>

//       {/* Shapes */}
//       <Popover>
//         <PopoverTrigger asChild>
//           <Button variant="outline" size="sm">
//             <Shapes className="w-4 h-4 mr-2" />
//             Shapes
//           </Button>
//         </PopoverTrigger>
//         <PopoverContent className="w-48">
//           <div className="space-y-2">
//             <Button
//               variant="outline"
//               className="w-full"
//               onClick={() => addShape("circle")}
//             >
//               Circle
//             </Button>
//             <Button
//               variant="outline"
//               className="w-full"
//               onClick={() => addShape("rectangle")}
//             >
//               Rectangle
//             </Button>
//           </div>
//         </PopoverContent>
//       </Popover>

//       {/* Color Picker */}
//       <Popover>
//         <PopoverTrigger asChild>
//           <Button variant="outline" size="sm">
//             <Palette className="w-4 h-4 mr-2" />
//             <div
//               className="w-4 h-4 rounded border"
//               style={{ backgroundColor: selectedColor }}
//             />
//           </Button>
//         </PopoverTrigger>
//         <PopoverContent className="w-64">
//           <div className="grid grid-cols-4 gap-2">
//             {COLORS.map((color) => (
//               <button
//                 key={color}
//                 onClick={() => setSelectedColor(color)}
//                 className={`w-12 h-12 rounded border-2 transition-all ${
//                   selectedColor === color
//                     ? "border-primary scale-110"
//                     : "border-transparent hover:scale-105"
//                 }`}
//                 style={{ backgroundColor: color }}
//               />
//             ))}
//           </div>
//           <div className="mt-3">
//             <Label>Custom Color</Label>
//             <input
//               type="color"
//               value={selectedColor}
//               onChange={(e) => setSelectedColor(e.target.value)}
//               className="w-full h-10 rounded cursor-pointer"
//             />
//           </div>
//         </PopoverContent>
//       </Popover>

//       <Separator orientation="vertical" className="h-8" />

//       {/* Delete */}
//       <Button variant="destructive" size="sm" onClick={deleteSelected}>
//         <Trash2 className="w-4 h-4 mr-2" />
//         Delete
//       </Button>
//     </div>
//   );
// };

// export default DesignToolbar;
import { useRef, useState } from "react";
import { Canvas as FabricCanvas, FabricImage, Textbox, Circle, Rect, Triangle, util, FabricObject, Line } from "fabric";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Upload,
  Type,
  Shapes,
  Palette,
  Trash2,
  Image as ImageIcon,
  Wand2,
  PenTool,
  Copy,
  Layers,
  Undo,
  Redo,
  Download,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Sparkles,
  AlignCenter,
  AlignLeft,
  AlignRight,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DesignToolbarProps {
  canvas: FabricCanvas | null;
}

const STICKERS = [
  "⭐", "❤️", "🔥", "💎", "🚀", "✨", "🎨", "👕",
  "🌟", "💫", "⚡", "🌈", "🎯", "🏆", "👑", "💪"
];

const COLORS = [
  "#000000", "#ffffff", "#ff0000", "#00ff00", "#0000ff", "#ffff00",
  "#ff00ff", "#00ffff", "#ff6b6b", "#4ecdc4", "#45b7d1", "#f9ca24",
  "#6c5ce7", "#fd79a8", "#a29bfe", "#fab1a0"
];

const FONTS = [
  "Arial",
  "Times New Roman",
  "Courier New",
  "Georgia",
  "Verdana",
  "Impact",
  "Comic Sans MS",
  "Trebuchet MS",
  "Brush Script MT",
  "Pacifico",
];

const TEXT_EFFECTS = [
  { name: "Shadow", value: "shadow" },
  { name: "Outline", value: "outline" },
  { name: "Glow", value: "glow" },
  { name: "3D", value: "3d" },
];

const DesignToolbar = ({ canvas }: DesignToolbarProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [textInput, setTextInput] = useState("");
  const [selectedColor, setSelectedColor] = useState("#000000");
  const [uploading, setUploading] = useState(false);
  const [fontSize, setFontSize] = useState(40);
  const [fontFamily, setFontFamily] = useState("Arial");
  const [opacity, setOpacity] = useState(100);
  const [brushWidth, setBrushWidth] = useState(5);
  const [isDrawing, setIsDrawing] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!canvas || !user || !e.target.files?.[0]) return;

    const file = e.target.files[0];
    setUploading(true);

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("design-assets")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from("design-assets")
        .getPublicUrl(fileName);

      util.loadImage(data.publicUrl, { crossOrigin: 'anonymous' }).then((img) => {
        const fabricImg = new FabricImage(img, {
          scaleX: 200 / img.width,
          scaleY: 200 / img.width,
          left: 100,
          top: 100,
        });
        
        canvas.add(fabricImg);
        canvas.setActiveObject(fabricImg);
        canvas.renderAll();
      });

      toast({
        title: "Image Uploaded",
        description: "Image added to canvas",
      });
    } catch (error) {
      console.error("Error uploading image:", error);
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const addText = () => {
    if (!canvas || !textInput.trim()) return;

    const text = new Textbox(textInput, {
      left: 150,
      top: 150,
      fontSize: fontSize,
      fill: selectedColor,
      fontFamily: fontFamily,
    });

    canvas.add(text);
    canvas.setActiveObject(text);
    canvas.renderAll();
    setTextInput("");

    toast({
      title: "Text Added",
      description: "Text added to canvas",
    });
  };

  const addSticker = (emoji: string) => {
    if (!canvas) return;

    const text = new Textbox(emoji, {
      left: 200,
      top: 200,
      fontSize: 80,
      fontFamily: "Arial",
    });

    canvas.add(text);
    canvas.setActiveObject(text);
    canvas.renderAll();
  };

  const addShape = (type: "circle" | "rectangle" | "triangle") => {
    if (!canvas) return;

    let shape: FabricObject;
    if (type === "circle") {
      shape = new Circle({
        radius: 50,
        fill: selectedColor,
        left: 200,
        top: 200,
      });
    } else if (type === "triangle") {
      shape = new Triangle({
        width: 100,
        height: 100,
        fill: selectedColor,
        left: 200,
        top: 200,
      });
    } else {
      shape = new Rect({
        width: 100,
        height: 100,
        fill: selectedColor,
        left: 200,
        top: 200,
      });
    }

    canvas.add(shape);
    canvas.setActiveObject(shape);
    canvas.renderAll();
  };

  const deleteSelected = () => {
    if (!canvas) return;

    const activeObjects = canvas.getActiveObjects();
    if (activeObjects.length) {
      activeObjects.forEach((obj) => canvas.remove(obj));
      canvas.discardActiveObject();
      canvas.renderAll();
      
      toast({
        title: "Deleted",
        description: "Selected items removed",
      });
    }
  };

   const duplicateSelected = () => {
    if (!canvas) return;

    const activeObject = canvas.getActiveObject();
    if (activeObject) {
      // Cast to any to call clone with a callback (avoids mismatch with current fabric typings)
      (activeObject as any).clone((cloned: FabricObject) => {
        cloned.set({
          left: (cloned.left || 0) + 20,
          top: (cloned.top || 0) + 20,
        });
        canvas.add(cloned);
        canvas.setActiveObject(cloned);
        canvas.renderAll();
      });
    }
  };

  const toggleLock = () => {
    if (!canvas) return;

    const activeObject = canvas.getActiveObject();
    if (activeObject) {
      const isLocked = activeObject.lockMovementX;
      activeObject.set({
        lockMovementX: !isLocked,
        lockMovementY: !isLocked,
        lockRotation: !isLocked,
        lockScalingX: !isLocked,
        lockScalingY: !isLocked,
        selectable: isLocked,
      });
      canvas.renderAll();
      
      toast({
        title: isLocked ? "Unlocked" : "Locked",
        description: `Object is now ${isLocked ? "unlocked" : "locked"}`,
      });
    }
  };

  const toggleVisibility = () => {
    if (!canvas) return;

    const activeObject = canvas.getActiveObject();
    if (activeObject) {
      activeObject.visible = !activeObject.visible;
      canvas.renderAll();
    }
  };

  const changeOpacity = (value: number[]) => {
    if (!canvas) return;
    
    const activeObject = canvas.getActiveObject();
    if (activeObject) {
      activeObject.set({ opacity: value[0] / 100 });
      canvas.renderAll();
    }
    setOpacity(value[0]);
  };

  const rotateObject = () => {
    if (!canvas) return;

    const activeObject = canvas.getActiveObject();
    if (activeObject) {
      activeObject.rotate((activeObject.angle || 0) + 90);
      canvas.renderAll();
    }
  };

  const alignObject = (alignment: "left" | "center" | "right") => {
    if (!canvas) return;

    const activeObject = canvas.getActiveObject();
    if (activeObject) {
      const canvasWidth = canvas.width || 600;
      const objWidth = activeObject.getScaledWidth();

      switch (alignment) {
        case "left":
          activeObject.set({ left: 0 });
          break;
        case "center":
          activeObject.set({ left: (canvasWidth - objWidth) / 2 });
          break;
        case "right":
          activeObject.set({ left: canvasWidth - objWidth });
          break;
      }
      canvas.renderAll();
    }
  };

  const applyTextEffect = (effect: string) => {
    if (!canvas) return;

    const activeObject = canvas.getActiveObject();
    if (activeObject && activeObject.type === 'textbox') {
      switch (effect) {
        case 'shadow':
          activeObject.set({
            shadow: {
              color: 'rgba(0,0,0,0.3)',
              blur: 10,
              offsetX: 5,
              offsetY: 5,
            }
          });
          break;
        case 'outline':
          activeObject.set({
            stroke: '#000000',
            strokeWidth: 2,
          });
          break;
        case 'glow':
          activeObject.set({
            shadow: {
              color: selectedColor,
              blur: 20,
              offsetX: 0,
              offsetY: 0,
            }
          });
          break;
        case '3d':
          activeObject.set({
            shadow: {
              color: 'rgba(0,0,0,0.5)',
              blur: 5,
              offsetX: 3,
              offsetY: 3,
            },
            stroke: '#000000',
            strokeWidth: 1,
          });
          break;
      }
      canvas.renderAll();
    }
  };

  const enableDrawing = () => {
    if (!canvas) return;

    setIsDrawing(!isDrawing);
    canvas.isDrawingMode = !canvas.isDrawingMode;

    if (canvas.isDrawingMode && (canvas as any).freeDrawingBrush) {
      (canvas as any).freeDrawingBrush.color = selectedColor;
      (canvas as any).freeDrawingBrush.width = brushWidth;
    }
  };

  return (
    <div className="space-y-4">
      {/* Main Toolbar */}
      <div className="flex flex-wrap items-center gap-2 p-4 bg-muted/50 rounded-lg">
        {/* Upload Image */}
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            <Upload className="w-4 h-4 mr-2" />
            {uploading ? "Uploading..." : "Upload"}
          </Button>
        </div>

        <Separator orientation="vertical" className="h-8" />

        {/* Add Text */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm">
              <Type className="w-4 h-4 mr-2" />
              Text
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <Tabs defaultValue="basic">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="basic">Basic</TabsTrigger>
                <TabsTrigger value="advanced">Advanced</TabsTrigger>
              </TabsList>
              
              <TabsContent value="basic" className="space-y-3">
                <div>
                  <Label htmlFor="text-input">Enter Text</Label>
                  <Input
                    id="text-input"
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    placeholder="Type your text..."
                    onKeyDown={(e) => e.key === "Enter" && addText()}
                  />
                </div>
                
                <div>
                  <Label>Font Size: {fontSize}px</Label>
                  <Slider
                    value={[fontSize]}
                    onValueChange={(v) => setFontSize(v[0])}
                    min={12}
                    max={200}
                    step={1}
                  />
                </div>

                <div>
                  <Label>Font Family</Label>
                  <Select value={fontFamily} onValueChange={setFontFamily}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {FONTS.map((font) => (
                        <SelectItem key={font} value={font}>
                          <span style={{ fontFamily: font }}>{font}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button onClick={addText} className="w-full" disabled={!textInput.trim()}>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Add Text
                </Button>
              </TabsContent>

              <TabsContent value="advanced" className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  {TEXT_EFFECTS.map((effect) => (
                    <Button
                      key={effect.value}
                      variant="outline"
                      size="sm"
                      onClick={() => applyTextEffect(effect.value)}
                    >
                      <Wand2 className="w-4 h-4 mr-1" />
                      {effect.name}
                    </Button>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </PopoverContent>
        </Popover>

        {/* Stickers */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm">
              <ImageIcon className="w-4 h-4 mr-2" />
              Stickers
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64">
            <div className="grid grid-cols-4 gap-2">
              {STICKERS.map((emoji, idx) => (
                <button
                  key={idx}
                  onClick={() => addSticker(emoji)}
                  className="text-3xl p-2 hover:bg-muted rounded transition-colors"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        {/* Shapes */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm">
              <Shapes className="w-4 h-4 mr-2" />
              Shapes
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-48">
            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => addShape("circle")}
              >
                Circle
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => addShape("rectangle")}
              >
                Rectangle
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => addShape("triangle")}
              >
                Triangle
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        {/* Drawing Tool */}
        <Button
          variant={isDrawing ? "default" : "outline"}
          size="sm"
          onClick={enableDrawing}
        >
          <PenTool className="w-4 h-4 mr-2" />
          Draw
        </Button>

        {isDrawing && (
          <>
            <div className="flex items-center gap-2">
              <Label className="text-xs">Width:</Label>
              <Slider
                value={[brushWidth]}
                onValueChange={(v) => {
                  setBrushWidth(v[0]);
                  if (canvas && (canvas as any).freeDrawingBrush) {
                    (canvas as any).freeDrawingBrush.width = v[0];
                  }
                }}
                min={1}
                max={50}
                step={1}
                className="w-24"
              />
            </div>
          </>
        )}

        {/* Color Picker */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm">
              <Palette className="w-4 h-4 mr-2" />
              <div
                className="w-4 h-4 rounded border"
                style={{ backgroundColor: selectedColor }}
              />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64">
            <div className="space-y-3">
              <div className="grid grid-cols-4 gap-2">
                {COLORS.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`w-12 h-12 rounded border-2 transition-all ${
                      selectedColor === color
                        ? "border-primary scale-110"
                        : "border-transparent hover:scale-105"
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <div>
                <Label>Custom Color</Label>
                <input
                  type="color"
                  value={selectedColor}
                  onChange={(e) => setSelectedColor(e.target.value)}
                  className="w-full h-10 rounded cursor-pointer"
                />
              </div>
            </div>
          </PopoverContent>
        </Popover>

        <Separator orientation="vertical" className="h-8" />

        {/* Object Controls */}
        <Button variant="outline" size="sm" onClick={duplicateSelected}>
          <Copy className="w-4 h-4" />
        </Button>

        <Button variant="outline" size="sm" onClick={rotateObject}>
          <RotateCw className="w-4 h-4" />
        </Button>

        <Button variant="outline" size="sm" onClick={toggleLock}>
          <Lock className="w-4 h-4" />
        </Button>

        <Button variant="outline" size="sm" onClick={toggleVisibility}>
          <Eye className="w-4 h-4" />
        </Button>

        {/* Alignment */}
        <div className="flex gap-1">
          <Button variant="outline" size="sm" onClick={() => alignObject("left")}>
            <AlignLeft className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => alignObject("center")}>
            <AlignCenter className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => alignObject("right")}>
            <AlignRight className="w-4 h-4" />
          </Button>
        </div>

        <Separator orientation="vertical" className="h-8" />

        {/* Delete */}
        <Button variant="destructive" size="sm" onClick={deleteSelected}>
          <Trash2 className="w-4 h-4 mr-2" />
          Delete
        </Button>
      </div>

      {/* Opacity Control */}
      <div className="p-4 bg-muted/50 rounded-lg">
        <div className="flex items-center gap-4">
          <Label className="min-w-20">Opacity: {opacity}%</Label>
          <Slider
            value={[opacity]}
            onValueChange={changeOpacity}
            min={0}
            max={100}
            step={1}
            className="flex-1"
          />
        </div>
      </div>
    </div>
  );
};

export default DesignToolbar;