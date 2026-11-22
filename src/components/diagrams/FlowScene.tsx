"use client";
import { useMemo, useRef, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Line, OrbitControls, Sparkles } from "@react-three/drei";
import * as THREE from "three";
import type { DNode, Shape, Tone } from "@/data/diagrams";
import { Ticker } from "./Ticker";
import "./three-console"; // must load before <Canvas> creates its clock

export type Palette = Record<Tone, string> & { line: string; spark: string; dark: boolean };

type Props = {
  nodes: DNode[];
  edges: [string, string][];
  activeId: string | null;
  onSelect: (id: string) => void;
  palette: Palette;
  running: boolean;
  low: boolean;
  touch: boolean;
};

const FOV = 40;
const TAN = Math.tan(THREE.MathUtils.degToRad(FOV / 2));

function Geometry({ shape }: { shape: Shape }) {
  switch (shape) {
    case "box": return <boxGeometry args={[0.85, 0.85, 0.85]} />;
    case "octa": return <octahedronGeometry args={[0.62]} />;
    case "torus": return <torusGeometry args={[0.42, 0.17, 12, 32]} />;
    case "cyl": return <cylinderGeometry args={[0.42, 0.42, 0.8, 20]} />;
    case "ico": return <icosahedronGeometry args={[0.6, 0]} />;
    default: return <sphereGeometry args={[0.52, 24, 16]} />;
  }
}

function Node({ node, active, dimmed, color, onSelect }: { node: DNode; active: boolean; dimmed: boolean; color: string; onSelect: (id: string) => void }) {
  const mesh = useRef<THREE.Mesh>(null);
  const halo = useRef<THREE.Mesh>(null);
  const [hover, setHover] = useState(false);

  useFrame((_, rawDt) => {
    if (!mesh.current) return;
    const dt = Math.min(rawDt, 0.1);
    const target = active ? 1.28 : hover ? 1.14 : 1;
    mesh.current.scale.setScalar(THREE.MathUtils.damp(mesh.current.scale.x, target, 6, dt));
    mesh.current.rotation.y += dt * (active ? 0.9 : 0.25);
    const mat = mesh.current.material as THREE.MeshStandardMaterial;
    mat.emissiveIntensity = THREE.MathUtils.damp(mat.emissiveIntensity, active ? 1.1 : hover ? 0.6 : dimmed ? 0.08 : 0.28, 5, dt);
    mat.opacity = THREE.MathUtils.damp(mat.opacity, dimmed ? 0.45 : 1, 5, dt);
    if (halo.current) {
      halo.current.rotation.z += dt * 0.8;
      halo.current.scale.setScalar(THREE.MathUtils.damp(halo.current.scale.x, active ? 1 : 0.001, 6, dt));
    }
  });

  return (
    <group position={node.pos}>
      <Float speed={1.4} rotationIntensity={0.2} floatIntensity={0.45}>
        <mesh
          ref={mesh}
          onClick={(e) => { e.stopPropagation(); onSelect(node.id); }}
          onPointerOver={(e) => { e.stopPropagation(); setHover(true); document.body.style.cursor = "pointer"; }}
          onPointerOut={() => { setHover(false); document.body.style.cursor = ""; }}
        >
          <Geometry shape={node.shape} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.28} roughness={0.3} metalness={0.15} transparent />
        </mesh>
        <mesh ref={halo} scale={0.001}>
          <torusGeometry args={[0.95, 0.015, 6, 48]} />
          <meshBasicMaterial color={color} transparent opacity={0.8} />
        </mesh>
      </Float>
    </group>
  );
}

function Edge({ a, b, color, hot, pulses }: { a: THREE.Vector3; b: THREE.Vector3; color: string; hot: boolean; pulses: number }) {
  const curve = useMemo(() => {
    const mid = a.clone().lerp(b, 0.5).add(new THREE.Vector3(0, 0.35, 0.6));
    return new THREE.QuadraticBezierCurve3(a, mid, b);
  }, [a, b]);
  const points = useMemo(() => curve.getPoints(24), [curve]);
  const refs = useRef<THREE.Mesh[]>([]);
  const offset = useMemo(() => Math.random(), []);

  useFrame(({ clock }) => {
    const speed = hot ? 0.45 : 0.18;
    refs.current.forEach((m, i) => {
      if (!m) return;
      const t = (clock.elapsedTime * speed + offset + i / pulses) % 1;
      curve.getPoint(t, m.position);
      m.scale.setScalar(0.4 + Math.sin(t * Math.PI) * 0.8);
    });
  });

  return (
    <group>
      <Line points={points} color={color} lineWidth={hot ? 2.2 : 1.2} transparent opacity={hot ? 0.9 : 0.35} />
      {Array.from({ length: pulses }, (_, i) => (
        <mesh key={i} ref={(m) => { if (m) refs.current[i] = m; }}>
          <sphereGeometry args={[0.07, 8, 6]} />
          <meshBasicMaterial color={color} transparent opacity={hot ? 1 : 0.6} />
        </mesh>
      ))}
    </group>
  );
}

/**
 * Labels are plain DOM elements laid over the canvas (not drei <Html>, which
 * spins up a React root per label). Each rendered frame we project the node
 * positions to screen space and move the labels with a transform.
 */
function LabelProjector({ nodes, labels }: { nodes: DNode[]; labels: React.RefObject<(HTMLDivElement | null)[]> }) {
  const v = useMemo(() => new THREE.Vector3(), []);
  useFrame(({ camera, size }) => {
    nodes.forEach((n, i) => {
      const el = labels.current?.[i];
      if (!el) return;
      v.set(n.pos[0], n.pos[1] - 0.95, n.pos[2]).project(camera);
      const x = (v.x * 0.5 + 0.5) * size.width;
      const y = (-v.y * 0.5 + 0.5) * size.height;
      el.style.transform = `translate(-50%, 0) translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
    });
  });
  return null;
}

/** Places the camera so the whole diagram (plus labels) fits any canvas shape. */
function FitCamera({ nodes, onScale }: { nodes: DNode[]; onScale: (s: number) => void }) {
  const { camera, size, invalidate } = useThree();
  useEffect(() => {
    const halfW = Math.max(...nodes.map((n) => Math.abs(n.pos[0]))) + 1.5;
    const halfH = Math.max(...nodes.map((n) => Math.abs(n.pos[1]))) + 1.4;
    const aspect = size.width / size.height;
    const z = Math.max(halfH / TAN, halfW / (TAN * aspect)) + 0.8;
    camera.position.set(0, 0.6, z);
    camera.lookAt(0, 0, 0);
    // Labels are DOM text, so shrink them a little on narrow canvases.
    onScale(THREE.MathUtils.clamp(size.width / 620, 0.66, 1));
    invalidate();
  }, [camera, size, nodes, onScale, invalidate]);
  return null;
}

export default function FlowScene({ nodes: rawNodes, edges, activeId, onSelect, palette, running, low, touch }: Props) {
  // Responsive layout: on tall, narrow canvases (phones) the diagram is turned
  // so it flows top-to-bottom instead of left-to-right.
  const wrap = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState({ w: 600, h: 400 });
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setBox({ w: e.contentRect.width, h: e.contentRect.height }));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const portrait = box.w / Math.max(box.h, 1) < 0.95;
  const compact = box.w < 420;
  const nodes = useMemo<DNode[]>(
    () => (portrait ? rawNodes.map((n) => ({ ...n, pos: [n.pos[1] * 1.15, -n.pos[0] * 0.78, n.pos[2]] as [number, number, number] })) : rawNodes),
    [rawNodes, portrait],
  );
  const [interacted, setInteracted] = useState(false);
  const [labelScale, setLabelScale] = useState(1);
  const labels = useRef<(HTMLDivElement | null)[]>([]);
  const vec = useMemo(() => Object.fromEntries(nodes.map((n) => [n.id, new THREE.Vector3(...n.pos)])), [nodes]);
  const connected = useMemo(() => {
    if (!activeId) return new Set<string>();
    const s = new Set<string>([activeId]);
    edges.forEach(([f, t]) => { if (f === activeId) s.add(t); if (t === activeId) s.add(f); });
    return s;
  }, [activeId, edges]);

  return (
    <div ref={wrap} className="relative h-full w-full">
    <Canvas
      frameloop="demand"
      dpr={low ? 1 : [1, 1.5]}
      camera={{ position: [0, 0.6, 12], fov: FOV }}
      gl={{ antialias: !low, alpha: true, powerPreference: low ? "low-power" : "default" }}
      onPointerDown={() => setInteracted(true)}
    >
      <Ticker fps={low ? 24 : 30} running={running} />
      <FitCamera nodes={nodes} onScale={setLabelScale} />
      <LabelProjector nodes={nodes} labels={labels} />
      <ambientLight intensity={palette.dark ? 0.6 : 0.95} />
      <pointLight position={[4, 5, 6]} intensity={60} color={palette.a} />
      <pointLight position={[-5, -3, 4]} intensity={35} color={palette.b} />
      {edges.map(([f, t]) => (
        <Edge key={f + t} a={vec[f]} b={vec[t]} color={palette.line} pulses={low ? 1 : 2} hot={!!activeId && (f === activeId || t === activeId)} />
      ))}
      {nodes.map((n) => (
        <Node key={n.id} node={n} color={palette[n.tone ?? "a"]} active={n.id === activeId} dimmed={!!activeId && !connected.has(n.id)} onSelect={onSelect} />
      ))}
      {!low && <Sparkles count={24} scale={[13, 7, 6]} size={2.2} speed={0.3} opacity={0.7} color={palette.spark} />}
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        enableRotate={!touch}
        enableDamping={false}
        autoRotate={!interacted && running}
        autoRotateSpeed={0.45}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={Math.PI / 1.6}
        minAzimuthAngle={-Math.PI / 3.5}
        maxAzimuthAngle={Math.PI / 3.5}
      />
    </Canvas>
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        {nodes.map((n, i) => {
          const dimmed = !!activeId && !connected.has(n.id);
          return (
            <div
              key={n.id}
              ref={(el) => { labels.current[i] = el; }}
              className="diagram-label absolute left-0 top-0 will-change-transform"
              style={{ opacity: dimmed ? 0.45 : 1, fontSize: 15 * labelScale }}
            >
              <div style={{ fontWeight: 500 }}>{n.label}</div>
              {n.sub && !compact && <div style={{ fontSize: "0.8em", color: "var(--muted)" }}>{n.sub}</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
