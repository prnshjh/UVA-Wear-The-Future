import { useState, useEffect } from "react";
import { Canvas as FabricCanvas, FabricObject } from "fabric";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Trash2, MoveUp, MoveDown } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface LayersPanelProps {
  canvas: FabricCanvas | null;
}

interface Layer {
  id: string;
  object: FabricObject;
  name: string;
  visible: boolean;
}

const LayersPanel = ({ canvas }: LayersPanelProps) => {
  const [layers, setLayers] = useState<Layer[]>([]);
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null);

  useEffect(() => {
    if (!canvas) return;

    const updateLayers = () => {
      const objects = canvas.getObjects();
      const newLayers: Layer[] = objects
        .filter((obj) => obj !== canvas.backgroundImage)
        .map((obj, index) => ({
          id: `layer-${index}`,
          object: obj,
          name: getObjectName(obj),
          visible: obj.visible !== false,
        }));
      setLayers(newLayers);
    };

    updateLayers();

    canvas.on("object:added", updateLayers);
    canvas.on("object:removed", updateLayers);
    canvas.on("object:modified", updateLayers);
    canvas.on("selection:created", (e) => {
      if (e.selected?.[0]) {
        const index = canvas.getObjects().indexOf(e.selected[0]);
        setSelectedLayerId(`layer-${index}`);
      }
    });
    canvas.on("selection:cleared", () => setSelectedLayerId(null));

    return () => {
      canvas.off("object:added", updateLayers);
      canvas.off("object:removed", updateLayers);
      canvas.off("object:modified", updateLayers);
    };
  }, [canvas]);

  const getObjectName = (obj: FabricObject): string => {
    if (obj.type === "textbox") {
      const text = (obj as any).text || "";
      return `Text: ${text.substring(0, 15)}${text.length > 15 ? "..." : ""}`;
    }
    if (obj.type === "image") return "Image";
    if (obj.type === "circle") return "Circle";
    if (obj.type === "rect") return "Rectangle";
    return obj.type || "Object";
  };

  const toggleVisibility = (layer: Layer) => {
    if (!canvas) return;
    layer.object.visible = !layer.object.visible;
    canvas.renderAll();
    setLayers([...layers]);
  };

  const deleteLayer = (layer: Layer) => {
    if (!canvas) return;
    canvas.remove(layer.object);
    canvas.renderAll();
  };

  const moveLayer = (layer: Layer, direction: "up" | "down") => {
    if (!canvas) return;
    const objects = canvas.getObjects();
    const currentIndex = objects.indexOf(layer.object);

    if (direction === "up" && currentIndex < objects.length - 1) {
      canvas.bringObjectForward(layer.object);
    } else if (direction === "down" && currentIndex > 0) {
      canvas.sendObjectBackwards(layer.object);
    }

    canvas.renderAll();
  };

  const selectLayer = (layer: Layer) => {
    if (!canvas) return;
    canvas.setActiveObject(layer.object);
    canvas.renderAll();
    setSelectedLayerId(layer.id);
  };

  if (!canvas) return null;

  return (
    <Card className="p-4">
      <h3 className="font-semibold mb-3">Layers</h3>
      <ScrollArea className="h-[300px]">
        {layers.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            No layers yet. Add elements to get started.
          </p>
        ) : (
          <div className="space-y-2">
            {[...layers].reverse().map((layer) => (
              <div
                key={layer.id}
                className={`p-2 rounded border transition-colors cursor-pointer ${
                  selectedLayerId === layer.id
                    ? "border-primary bg-primary/5"
                    : "border-border hover:bg-muted/50"
                }`}
                onClick={() => selectLayer(layer)}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium truncate flex-1">
                    {layer.name}
                  </span>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={(e) => {
                        e.stopPropagation();
                        moveLayer(layer, "up");
                      }}
                    >
                      <MoveUp className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={(e) => {
                        e.stopPropagation();
                        moveLayer(layer, "down");
                      }}
                    >
                      <MoveDown className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleVisibility(layer);
                      }}
                    >
                      {layer.visible ? (
                        <Eye className="h-3 w-3" />
                      ) : (
                        <EyeOff className="h-3 w-3" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-destructive hover:text-destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteLayer(layer);
                      }}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </Card>
  );
};

export default LayersPanel;
