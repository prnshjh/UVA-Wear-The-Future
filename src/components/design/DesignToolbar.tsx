import { useRef, useState } from "react";
import { Canvas as FabricCanvas, FabricImage, Textbox, Circle, Rect, util } from "fabric";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Upload,
  Type,
  Shapes,
  Palette,
  Trash2,
  Image as ImageIcon,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";

interface DesignToolbarProps {
  canvas: FabricCanvas | null;
}

const STICKERS = [
  "⭐",
  "❤️",
  "🔥",
  "💎",
  "🚀",
  "✨",
  "🎨",
  "👕",
];

const COLORS = [
  "#000000",
  "#ffffff",
  "#ff0000",
  "#00ff00",
  "#0000ff",
  "#ffff00",
  "#ff00ff",
  "#00ffff",
];

const DesignToolbar = ({ canvas }: DesignToolbarProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [textInput, setTextInput] = useState("");
  const [selectedColor, setSelectedColor] = useState("#000000");
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!canvas || !user || !e.target.files?.[0]) return;

    const file = e.target.files[0];
    setUploading(true);

    try {
      // Upload to Supabase Storage
      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("design-assets")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from("design-assets")
        .getPublicUrl(fileName);

      // Add image to canvas with CORS enabled
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
      }).catch((err) => {
        console.error("Error loading image:", err);
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
      fontSize: 40,
      fill: selectedColor,
      fontFamily: "Arial",
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

  const addShape = (type: "circle" | "rectangle") => {
    if (!canvas) return;

    let shape;
    if (type === "circle") {
      shape = new Circle({
        radius: 50,
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

  return (
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
          {uploading ? "Uploading..." : "Upload Image"}
        </Button>
      </div>

      <Separator orientation="vertical" className="h-8" />

      {/* Add Text */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm">
            <Type className="w-4 h-4 mr-2" />
            Add Text
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="space-y-3">
            <Label htmlFor="text-input">Enter Text</Label>
            <Input
              id="text-input"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Type your text..."
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  addText();
                }
              }}
            />
            <Button onClick={addText} className="w-full" disabled={!textInput.trim()}>
              Add to Canvas
            </Button>
          </div>
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
          </div>
        </PopoverContent>
      </Popover>

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
          <div className="mt-3">
            <Label>Custom Color</Label>
            <input
              type="color"
              value={selectedColor}
              onChange={(e) => setSelectedColor(e.target.value)}
              className="w-full h-10 rounded cursor-pointer"
            />
          </div>
        </PopoverContent>
      </Popover>

      <Separator orientation="vertical" className="h-8" />

      {/* Delete */}
      <Button variant="destructive" size="sm" onClick={deleteSelected}>
        <Trash2 className="w-4 h-4 mr-2" />
        Delete
      </Button>
    </div>
  );
};

export default DesignToolbar;
