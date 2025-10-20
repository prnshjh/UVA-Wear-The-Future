// import { useEffect, useRef } from "react";
// import { Canvas as FabricCanvas, FabricImage, util } from "fabric";

// interface DesignCanvasProps {
//   productImage: string;
//   onCanvasReady: (canvas: FabricCanvas) => void;
// }

// const DesignCanvas = ({ productImage, onCanvasReady }: DesignCanvasProps) => {
//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const fabricCanvasRef = useRef<FabricCanvas | null>(null);

//   useEffect(() => {
//     if (!canvasRef.current) return;

//     const canvas = new FabricCanvas(canvasRef.current, {
//       width: 600,
//       height: 700,
//       backgroundColor: "#f5f5f5",
//     });

//     fabricCanvasRef.current = canvas;
//     onCanvasReady(canvas);

//     // Load product image as background with CORS enabled
//     util.loadImage(productImage, { crossOrigin: 'anonymous' }).then((img) => {
//       const fabricImg = new FabricImage(img, {
//         scaleX: 600 / img.width,
//         scaleY: 700 / img.height,
//         selectable: false,
//         evented: false,
//       });
      
//       canvas.backgroundImage = fabricImg;
//       canvas.renderAll();
//     }).catch((err) => {
//       console.error("Error loading image:", err);
//     });

//     return () => {
//       canvas.dispose();
//     };
//   }, [productImage]);

//   return (
//     <div className="flex justify-center bg-muted/30 p-4 rounded-lg">
//       <canvas ref={canvasRef} className="border border-border rounded shadow-lg" />
//     </div>
//   );
// };

// export default DesignCanvas;
import { useEffect, useRef } from "react";
import { Canvas as FabricCanvas, FabricImage, util } from "fabric";

interface DesignCanvasProps {
  productImage: string;
  onCanvasReady: (canvas: FabricCanvas) => void;
}

const DesignCanvas = ({ productImage, onCanvasReady }: DesignCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<FabricCanvas | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    // Get container dimensions
    const container = containerRef.current;
    const width = Math.min(container.clientWidth, 600);
    const height = Math.min(container.clientHeight, 700);

    // Initialize Fabric canvas
    const canvas = new FabricCanvas(canvasRef.current, {
      width: width,
      height: height,
      backgroundColor: "transparent",
    });

    fabricCanvasRef.current = canvas;
    onCanvasReady(canvas);

    // Load product image as background (non-selectable)
    util.loadImage(productImage, { crossOrigin: 'anonymous' })
      .then((img) => {
        // Calculate scale to fit canvas
        const scale = Math.min(
          width / img.width,
          height / img.height
        );

        const fabricImg = new FabricImage(img, {
          scaleX: scale,
          scaleY: scale,
          left: (width - img.width * scale) / 2,
          top: (height - img.height * scale) / 2,
          selectable: false,
          evented: false,
          hasControls: false,
          hasBorders: false,
          lockMovementX: true,
          lockMovementY: true,
          hoverCursor: 'default',
        });
        
        // Add as background
        canvas.backgroundImage = fabricImg;
        canvas.renderAll();
      })
      .catch((err) => {
        console.error("Error loading product image:", err);
      });

    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current) return;
      
      const newWidth = Math.min(containerRef.current.clientWidth, 600);
      const newHeight = Math.min(containerRef.current.clientHeight, 700);
      
      canvas.setDimensions({ width: newWidth, height: newHeight });
      canvas.renderAll();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.dispose();
    };
  }, [productImage]);

  return (
    <div 
      ref={containerRef}
      className="flex justify-center items-center bg-muted/30 p-4 rounded-lg"
      style={{ minHeight: '700px' }}
    >
      <div className="relative">
        <canvas ref={canvasRef} className="border border-border rounded shadow-lg" />
        <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
          Design Area
        </div>
      </div>
    </div>
  );
};

export default DesignCanvas;