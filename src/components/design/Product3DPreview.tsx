import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RotateCcw, Move, ZoomIn, ZoomOut, Maximize2, Play, Pause } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

interface Product3DPreviewProps {
  productType: string; // "T-Shirts", "Hoodies", "Jeans", etc.
  designTexture: string; // Data URL of the canvas design
  productColor?: string;
}

const Product3DPreview = ({ 
  productType, 
  designTexture,
  productColor = "#ffffff" 
}: Product3DPreviewProps) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const meshRef = useRef<THREE.Mesh | null>(null);
  const textureRef = useRef<THREE.Texture | null>(null);
  const animationFrameRef = useRef<number>();
  
  const [autoRotate, setAutoRotate] = useState(true);
  const [zoom, setZoom] = useState(5);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf5f5f5);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      45,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = zoom;
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 7.5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0xffffff, 0.5);
    pointLight.position.set(-5, 5, 5);
    scene.add(pointLight);

    // Create 3D model based on product type
    createProductModel(scene, productType, productColor);

    // Animation loop
    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);

      if (meshRef.current) {
        if (autoRotate) {
          meshRef.current.rotation.y += 0.005;
        } else {
          meshRef.current.rotation.x = rotation.x;
          meshRef.current.rotation.y = rotation.y;
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    // Handle window resize
    const handleResize = () => {
      if (!mountRef.current || !camera || !renderer) return;
      
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Update zoom
  useEffect(() => {
    if (cameraRef.current) {
      cameraRef.current.position.z = zoom;
    }
  }, [zoom]);

  // Update texture when design changes
  useEffect(() => {
    if (!sceneRef.current || !designTexture) return;

    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(designTexture, (texture) => {
      texture.needsUpdate = true;
      textureRef.current = texture;

      // Apply texture to the mesh
      if (meshRef.current) {
        const material = meshRef.current.material as THREE.MeshStandardMaterial;
        material.map = texture;
        material.needsUpdate = true;
      }
    });
  }, [designTexture]);

  const createProductModel = (scene: THREE.Scene, type: string, color: string) => {
    let geometry: THREE.BufferGeometry;
    
    // Create different geometries based on product type
    switch (type) {
      case "T-Shirts":
        // T-Shirt shape (simplified box with neck cutout)
        geometry = createTShirtGeometry();
        break;
      case "Hoodies":
        geometry = createHoodieGeometry();
        break;
      case "Jeans":
        geometry = createJeansGeometry();
        break;
      case "Jackets":
        geometry = createJacketGeometry();
        break;
      default:
        geometry = new THREE.BoxGeometry(2, 3, 0.3);
    }

    const material = new THREE.MeshStandardMaterial({
      color: color,
      roughness: 0.7,
      metalness: 0.1,
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    scene.add(mesh);
    meshRef.current = mesh;

    // Add a ground plane for shadow
    const groundGeometry = new THREE.PlaneGeometry(10, 10);
    const groundMaterial = new THREE.ShadowMaterial({ opacity: 0.2 });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -2;
    ground.receiveShadow = true;
    scene.add(ground);
  };

  const createTShirtGeometry = () => {
    // Create a simplified T-shirt shape
    const shape = new THREE.Shape();
    
    // Body
    shape.moveTo(-1, -1.5);
    shape.lineTo(-1, 0.8);
    shape.lineTo(-1.3, 1);
    shape.lineTo(-1.3, 1.2);
    shape.lineTo(-0.5, 1.2);
    shape.lineTo(-0.3, 1.5);
    shape.lineTo(0.3, 1.5);
    shape.lineTo(0.5, 1.2);
    shape.lineTo(1.3, 1.2);
    shape.lineTo(1.3, 1);
    shape.lineTo(1, 0.8);
    shape.lineTo(1, -1.5);
    shape.lineTo(-1, -1.5);

    const extrudeSettings = {
      depth: 0.3,
      bevelEnabled: true,
      bevelThickness: 0.05,
      bevelSize: 0.05,
      bevelSegments: 3
    };

    return new THREE.ExtrudeGeometry(shape, extrudeSettings);
  };

  const createHoodieGeometry = () => {
    // Similar to T-shirt but with hood
    const shape = new THREE.Shape();
    
    shape.moveTo(-1.1, -1.5);
    shape.lineTo(-1.1, 0.8);
    shape.lineTo(-1.4, 1);
    shape.lineTo(-1.4, 1.3);
    shape.lineTo(-0.5, 1.3);
    shape.lineTo(-0.3, 1.7);
    shape.lineTo(0.3, 1.7);
    shape.lineTo(0.5, 1.3);
    shape.lineTo(1.4, 1.3);
    shape.lineTo(1.4, 1);
    shape.lineTo(1.1, 0.8);
    shape.lineTo(1.1, -1.5);
    shape.lineTo(-1.1, -1.5);

    const extrudeSettings = {
      depth: 0.4,
      bevelEnabled: true,
      bevelThickness: 0.08,
      bevelSize: 0.08,
      bevelSegments: 3
    };

    return new THREE.ExtrudeGeometry(shape, extrudeSettings);
  };

  const createJeansGeometry = () => {
    // Jeans/pants shape
    const shape = new THREE.Shape();
    
    shape.moveTo(-0.9, 1.5);
    shape.lineTo(-0.9, 0);
    shape.lineTo(-0.5, -1.5);
    shape.lineTo(-0.2, -1.5);
    shape.lineTo(0.2, -1.5);
    shape.lineTo(0.5, -1.5);
    shape.lineTo(0.9, 0);
    shape.lineTo(0.9, 1.5);
    shape.lineTo(-0.9, 1.5);

    const extrudeSettings = {
      depth: 0.4,
      bevelEnabled: true,
      bevelThickness: 0.05,
      bevelSize: 0.05,
      bevelSegments: 2
    };

    return new THREE.ExtrudeGeometry(shape, extrudeSettings);
  };

  const createJacketGeometry = () => {
    // Jacket shape - similar to hoodie but more structured
    const shape = new THREE.Shape();
    
    shape.moveTo(-1.2, -1.5);
    shape.lineTo(-1.2, 0.9);
    shape.lineTo(-1.5, 1.1);
    shape.lineTo(-1.5, 1.4);
    shape.lineTo(-0.4, 1.4);
    shape.lineTo(-0.2, 1.6);
    shape.lineTo(0.2, 1.6);
    shape.lineTo(0.4, 1.4);
    shape.lineTo(1.5, 1.4);
    shape.lineTo(1.5, 1.1);
    shape.lineTo(1.2, 0.9);
    shape.lineTo(1.2, -1.5);
    shape.lineTo(-1.2, -1.5);

    const extrudeSettings = {
      depth: 0.5,
      bevelEnabled: true,
      bevelThickness: 0.1,
      bevelSize: 0.1,
      bevelSegments: 3
    };

    return new THREE.ExtrudeGeometry(shape, extrudeSettings);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setAutoRotate(false);
    setLastMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;

    const deltaX = e.clientX - lastMousePos.x;
    const deltaY = e.clientY - lastMousePos.y;

    setRotation(prev => ({
      x: prev.x + deltaY * 0.01,
      y: prev.y + deltaX * 0.01
    }));

    setLastMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const resetView = () => {
    setRotation({ x: 0, y: 0 });
    setZoom(5);
    setAutoRotate(true);
  };

  return (
    <Card className="overflow-hidden">
      <div className="p-4 bg-gradient-to-r from-primary/5 to-accent/5 border-b">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="font-semibold">
              3D Preview
            </Badge>
            <Badge variant="secondary" className="text-xs">
              Interactive
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setAutoRotate(!autoRotate)}
          >
            {autoRotate ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Drag to rotate • Scroll to zoom • See your design in 3D
        </p>
      </div>

      <div
        ref={mountRef}
        className="w-full h-[500px] cursor-grab active:cursor-grabbing relative bg-gradient-to-b from-muted/20 to-muted/50"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />

      <div className="p-4 space-y-4 bg-card border-t">
        {/* Zoom Control */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm flex items-center gap-2">
              <Move className="w-4 h-4" />
              Zoom Level
            </Label>
            <span className="text-xs text-muted-foreground">{zoom.toFixed(1)}x</span>
          </div>
          <div className="flex items-center gap-2">
            <ZoomOut className="w-4 h-4 text-muted-foreground" />
            <Slider
              value={[zoom]}
              onValueChange={(v) => setZoom(v[0])}
              min={3}
              max={10}
              step={0.1}
              className="flex-1"
            />
            <ZoomIn className="w-4 h-4 text-muted-foreground" />
          </div>
        </div>

        {/* Controls */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={resetView}
            className="flex-1"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset View
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAutoRotate(!autoRotate)}
            className="flex-1"
          >
            {autoRotate ? (
              <>
                <Pause className="w-4 h-4 mr-2" />
                Pause
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Auto Rotate
              </>
            )}
          </Button>
        </div>

        {/* Tips */}
        <div className="text-xs text-muted-foreground space-y-1 pt-2 border-t">
          <p className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary"></span>
            <strong>Pro Tip:</strong> Click and drag to rotate the model
          </p>
          <p className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent"></span>
            <strong>Export:</strong> This preview updates in real-time with your design
          </p>
        </div>
      </div>
    </Card>
  );
};

export default Product3DPreview;