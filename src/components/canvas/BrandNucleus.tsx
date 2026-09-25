import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export interface NucleusProps {
  stage?: string;
  activeNodeId?: string;
  onNodeClick?: (nodeId: string) => void;
  accentColor?: string;
  shape?: 'icosahedron' | 'torus' | 'octahedron' | 'knot';
  materialStyle?: 'glass' | 'wireframe' | 'specular' | 'mineral';
  speedMultiplier?: number;
  interactive?: boolean;
  className?: string;
  showLabels?: boolean;
  morphTrigger?: number;
  highlightCategory?: string;
}

interface NodeData {
  id: string;
  label: string;
  angle: number;
  distance: number;
  elevation: number;
  color: string;
}

const STRATEGIC_NODES: NodeData[] = [
  { id: 'problem', label: 'Problem', angle: 0, distance: 3.2, elevation: 0.4, color: '#f59e0b' },
  { id: 'audience', label: 'Audience', angle: (Math.PI * 2) / 7, distance: 3.4, elevation: -0.6, color: '#e0a96d' },
  { id: 'position', label: 'Positioning', angle: ((Math.PI * 2) / 7) * 2, distance: 3.1, elevation: 0.7, color: '#d97706' },
  { id: 'personality', label: 'Personality', angle: ((Math.PI * 2) / 7) * 3, distance: 3.3, elevation: -0.3, color: '#ec4899' },
  { id: 'voice', label: 'Voice', angle: ((Math.PI * 2) / 7) * 4, distance: 3.0, elevation: 0.5, color: '#8b5cf6' },
  { id: 'visual', label: 'Visual', angle: ((Math.PI * 2) / 7) * 5, distance: 3.5, elevation: -0.5, color: '#10b981' },
  { id: 'launch', label: 'Launch', angle: ((Math.PI * 2) / 7) * 6, distance: 3.2, elevation: 0.2, color: '#38bdf8' },
];

export const BrandNucleus: React.FC<NucleusProps> = ({
  stage = 'landing',
  activeNodeId,
  onNodeClick,
  accentColor = '#f59e0b',
  shape = 'icosahedron',
  materialStyle = 'glass',
  speedMultiplier = 1,
  interactive = true,
  className = 'w-full h-full min-h-[400px]',
  showLabels = true,
  morphTrigger = 0,
  highlightCategory,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let animationFrameId: number;
    const width = container.clientWidth || 600;
    const height = container.clientHeight || 500;

    // SCENE & CAMERA
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 8.5);

    // RENDERER
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.appendChild(renderer.domElement);

    // LIGHTING
    const ambientLight = new THREE.AmbientLight(0xfff6ec, 0.9);
    scene.add(ambientLight);

    const warmLight = new THREE.PointLight(new THREE.Color(accentColor), 2.8, 20);
    warmLight.position.set(4, 3, 5);
    scene.add(warmLight);

    const rimLight = new THREE.DirectionalLight(0x7dd3fc, 1.2);
    rimLight.position.set(-5, -4, -3);
    scene.add(rimLight);

    // CENTRAL ABSTRACT NUCLEUS GROUP
    const nucleusGroup = new THREE.Group();
    scene.add(nucleusGroup);

    // GEOMETRY BUILDER
    const buildCoreGeometry = (type: string) => {
      switch (type) {
        case 'torus':
          return new THREE.TorusGeometry(1.2, 0.45, 24, 64);
        case 'octahedron':
          return new THREE.OctahedronGeometry(1.5, 2);
        case 'knot':
          return new THREE.TorusKnotGeometry(0.9, 0.32, 80, 16);
        case 'icosahedron':
        default:
          return new THREE.IcosahedronGeometry(1.4, 2);
      }
    };

    const coreGeo = buildCoreGeometry(shape);

    // CORE MATERIAL
    let coreMat: THREE.Material;
    if (materialStyle === 'wireframe') {
      coreMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(accentColor),
        wireframe: true,
        emissive: new THREE.Color(accentColor),
        emissiveIntensity: 0.3,
        roughness: 0.2,
      });
    } else if (materialStyle === 'mineral') {
      coreMat = new THREE.MeshStandardMaterial({
        color: 0x221f1d,
        roughness: 0.4,
        metalness: 0.8,
        flatShading: true,
      });
    } else if (materialStyle === 'specular') {
      coreMat = new THREE.MeshPhysicalMaterial({
        color: 0x141312,
        metalness: 0.95,
        roughness: 0.15,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
      });
    } else {
      // Glass
      coreMat = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(accentColor),
        transmission: 0.7,
        opacity: 0.85,
        transparent: true,
        roughness: 0.25,
        ior: 1.5,
        thickness: 1.2,
      });
    }

    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    nucleusGroup.add(coreMesh);

    // SECONDARY OUTER LATTICE CAGE
    const cageGeo = new THREE.IcosahedronGeometry(1.8, 1);
    const cageMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true,
      transparent: true,
      opacity: 0.12,
    });
    const cageMesh = new THREE.Mesh(cageGeo, cageMat);
    nucleusGroup.add(cageMesh);

    // PARTICLES (Cosmic strategic dust)
    const particleCount = 140;
    const particleGeo = new THREE.BufferGeometry();
    const posArray = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      const radius = 2.4 + Math.random() * 2.8;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      posArray[i] = radius * Math.sin(phi) * Math.cos(theta);
      posArray[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
      posArray[i + 2] = radius * Math.cos(phi);
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particleMat = new THREE.PointsMaterial({
      size: 0.045,
      color: 0xfde68a,
      transparent: true,
      opacity: 0.45,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    nucleusGroup.add(particles);

    // ORBITING STRATEGIC NODES
    const nodeMeshes: { mesh: THREE.Mesh; data: NodeData; initialPos: THREE.Vector3 }[] = [];
    const nodeGeo = new THREE.SphereGeometry(0.12, 16, 16);

    STRATEGIC_NODES.forEach((node) => {
      const nodeColor = new THREE.Color(node.color);
      const nodeMat = new THREE.MeshStandardMaterial({
        color: nodeColor,
        emissive: nodeColor,
        emissiveIntensity: 0.6,
        roughness: 0.3,
      });

      const mesh = new THREE.Mesh(nodeGeo, nodeMat);
      const x = Math.cos(node.angle) * node.distance;
      const z = Math.sin(node.angle) * node.distance;
      const y = node.elevation;
      mesh.position.set(x, y, z);
      mesh.userData = { id: node.id, label: node.label };

      // Outer aura ring
      const ringGeo = new THREE.RingGeometry(0.16, 0.22, 24);
      const ringMat = new THREE.MeshBasicMaterial({
        color: nodeColor,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.25,
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.lookAt(camera.position);
      mesh.add(ringMesh);

      nucleusGroup.add(mesh);
      nodeMeshes.push({ mesh, data: node, initialPos: new THREE.Vector3(x, y, z) });
    });

    // CONNECTING TETHER LINES
    const lineMat = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.08,
    });

    const linesGroup = new THREE.Group();
    nucleusGroup.add(linesGroup);

    nodeMeshes.forEach((item) => {
      const lineGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        item.mesh.position,
      ]);
      const line = new THREE.Line(lineGeo, lineMat);
      linesGroup.add(line);
    });

    // POINTER PARALLAX
    let targetRotX = 0;
    let targetRotY = 0;
    let pointerX = 0;
    let pointerY = 0;

    const handlePointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      pointerX = x;
      pointerY = y;
      targetRotY = x * 0.8;
      targetRotX = y * 0.6;
    };

    if (interactive) {
      window.addEventListener('mousemove', handlePointerMove);
    }

    // RESIZE LISTENER
    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth || 600;
      const newH = container.clientHeight || 500;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    window.addEventListener('resize', handleResize);

    // ANIMATION LOOP
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime() * speedMultiplier;

      // Base idle rotation
      nucleusGroup.rotation.y += 0.003 * speedMultiplier;
      nucleusGroup.rotation.x = THREE.MathUtils.lerp(nucleusGroup.rotation.x, targetRotX, 0.05);
      nucleusGroup.rotation.z = THREE.MathUtils.lerp(nucleusGroup.rotation.z, -targetRotY * 0.5, 0.05);

      // Core breathing & morph pulse
      const breathe = Math.sin(elapsedTime * 1.5) * 0.04;
      coreMesh.scale.set(1 + breathe, 1 + breathe, 1 + breathe);
      cageMesh.rotation.y -= 0.002 * speedMultiplier;
      cageMesh.rotation.z += 0.001 * speedMultiplier;

      // Dynamic Node Orbiting
      nodeMeshes.forEach((item, index) => {
        const angle = item.data.angle + elapsedTime * 0.15;
        const x = Math.cos(angle) * item.data.distance;
        const z = Math.sin(angle) * item.data.distance;
        const y = item.data.elevation + Math.sin(elapsedTime * 1.2 + index) * 0.15;
        item.mesh.position.set(x, y, z);

        // Highlight active or matching node
        const isTarget = item.data.id === activeNodeId || item.data.id === hoveredNode;
        const scaleVal = isTarget ? 1.6 : 1.0;
        item.mesh.scale.lerp(new THREE.Vector3(scaleVal, scaleVal, scaleVal), 0.1);
      });

      // Update lines
      linesGroup.children.forEach((lineObj, idx) => {
        const line = lineObj as THREE.Line;
        const node = nodeMeshes[idx];
        if (node) {
          const positions = line.geometry.attributes.position as THREE.BufferAttribute;
          positions.setXYZ(1, node.mesh.position.x, node.mesh.position.y, node.mesh.position.z);
          positions.needsUpdate = true;
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    // CLEANUP
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('resize', handleResize);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      coreGeo.dispose();
      cageGeo.dispose();
      particleGeo.dispose();
      nodeGeo.dispose();
    };
  }, [accentColor, shape, materialStyle, speedMultiplier, interactive, activeNodeId, hoveredNode, morphTrigger]);

  return (
    <div className={`relative ${className} select-none overflow-hidden flex items-center justify-center`}>
      {/* 3D Canvas Mount Point */}
      <div ref={containerRef} className="absolute inset-0 w-full h-full pointer-events-auto" />

      {/* Atmospheric Radial Backdrop Warm Glow */}
      <div 
        className="absolute inset-0 pointer-events-none -z-10 transition-opacity duration-1000"
        style={{
          background: `radial-gradient(circle at 50% 50%, rgba(217, 163, 102, 0.08) 0%, rgba(12, 11, 10, 0) 70%)`
        }}
      />

      {/* Spatial Overlay Node Pills (Desktop/Interactive) */}
      {showLabels && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div className="relative w-full max-w-lg h-72">
            {STRATEGIC_NODES.map((node, i) => {
              const rad = (i / STRATEGIC_NODES.length) * Math.PI * 2;
              const xPos = 50 + Math.cos(rad) * 40;
              const yPos = 50 + Math.sin(rad) * 36;
              const isActive = activeNodeId === node.id;

              return (
                <button
                  key={node.id}
                  onClick={() => onNodeClick && onNodeClick(node.id)}
                  onMouseEnter={() => setHoveredNode(node.id)}
                  onMouseLeave={() => setHoveredNode(null)}
                  style={{
                    left: `${xPos}%`,
                    top: `${yPos}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                  className={`pointer-events-auto absolute transition-all duration-300 text-[11px] font-mono tracking-wider px-2.5 py-1 rounded-full border backdrop-blur-md cursor-pointer ${
                    isActive
                      ? 'bg-white/10 text-white border-amber-400 shadow-sm scale-110'
                      : 'bg-[#181615]/70 text-[#c8c0b5] border-white/[0.08] hover:border-white/20 hover:text-white'
                  }`}
                >
                  <span className="inline-block w-1.5 h-1.5 rounded-full mr-1.5" style={{ backgroundColor: node.color }} />
                  {node.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
