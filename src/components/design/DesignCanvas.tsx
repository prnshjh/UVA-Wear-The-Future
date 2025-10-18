import { useEffect, useRef } from "react";
import { Canvas as FabricCanvas, FabricImage, util } from "fabric";

interface DesignCanvasProps {
  productImage: string;
  onCanvasReady: (canvas: FabricCanvas) => void;
}

const DesignCanvas = ({ productImage, onCanvasReady }: DesignCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<FabricCanvas | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new FabricCanvas(canvasRef.current, {
      width: 600,
      height: 700,
      backgroundColor: "#f5f5f5",
    });

    fabricCanvasRef.current = canvas;
    onCanvasReady(canvas);

    // Load product image as background with CORS enabled
    util.loadImage(productImage, { crossOrigin: 'anonymous' }).then((img) => {
      const fabricImg = new FabricImage(img, {
        scaleX: 600 / img.width,
        scaleY: 700 / img.height,
        selectable: false,
        evented: false,
      });
      
      canvas.backgroundImage = fabricImg;
      canvas.renderAll();
    }).catch((err) => {
      console.error("Error loading image:", err);
    });

    return () => {
      canvas.dispose();
    };
  }, [productImage]);

  return (
    <div className="flex justify-center bg-muted/30 p-4 rounded-lg">
      <canvas ref={canvasRef} className="border border-border rounded shadow-lg" />
    </div>
  );
};

export default DesignCanvas;
