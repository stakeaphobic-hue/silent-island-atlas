import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useEstateInput } from "@/components/sww/estate-input";

const EYE = 1.7;
const START = new THREE.Vector3(0, EYE, 22);
const COLLIDERS = [
  { min: new THREE.Vector3(-16, 0, -16), max: new THREE.Vector3(16, 12, -4.45) },
  { min: new THREE.Vector3(-5.9, 0, 17.3), max: new THREE.Vector3(-4.5, 5, 18.8) },
  { min: new THREE.Vector3(4.5, 0, 17.3), max: new THREE.Vector3(5.9, 5, 18.8) },
];

const GAME_KEYS = new Set([
  "KeyW",
  "KeyA",
  "KeyS",
  "KeyD",
  "ShiftLeft",
  "ShiftRight",
  "ArrowUp",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "Space",
]);

function blocked(x: number, z: number) {
  for (const c of COLLIDERS) {
    if (x > c.min.x && x < c.max.x && z > c.min.z && z < c.max.z) return true;
  }
  return false;
}

function checkerTexture() {
  const c = document.createElement("canvas");
  c.width = 256;
  c.height = 256;
  const g = c.getContext("2d")!;
  const n = 8;
  const s = 256 / n;
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      g.fillStyle = (x + y) % 2 === 0 ? "#cfc8d4" : "#16151c";
      g.fillRect(x * s, y * s, s, s);
    }
  }
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.anisotropy = 8;
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function Player({ playing }: { playing: boolean }) {
  const { camera, gl } = useThree();
  const yaw = useRef(0);
  const pitch = useRef(0);
  const keys = useRef(new Set<string>());
  const speed = useRef(0);
  const pos = useRef(START.clone());
  const fwd = useRef(new THREE.Vector3());
  const right = useRef(new THREE.Vector3());
  const lookHeld = useRef({ x: 0, y: 0 });

  useEffect(() => {
    camera.position.copy(START);
    camera.rotation.order = "YXZ";
    const down = (e: KeyboardEvent) => {
      keys.current.add(e.code);
      if (GAME_KEYS.has(e.code)) e.preventDefault();
    };
    const up = (e: KeyboardEvent) => keys.current.delete(e.code);
    const clear = () => keys.current.clear();
    const move = (e: MouseEvent) => {
      if (document.pointerLockElement !== gl.domElement) return;
      yaw.current -= e.movementX * 0.0022;
      pitch.current -= e.movementY * 0.0022;
      pitch.current = Math.max(-1.2, Math.min(1.2, pitch.current));
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    window.addEventListener("blur", clear);
    document.addEventListener("visibilitychange", clear);
    document.addEventListener("mousemove", move);
    window.__controlsTest = {
      getYaw: () => yaw.current,
      getSpeed: () => speed.current,
      getX: () => pos.current.x,
      getZ: () => pos.current.z,
      setKeys: (codes) => {
        useEstateInput.getState().setInjected(codes);
      },
    };
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
      window.removeEventListener("blur", clear);
      document.removeEventListener("visibilitychange", clear);
      document.removeEventListener("mousemove", move);
    };
  }, [camera, gl]);

  useEffect(() => {
    if (!playing) {
      document.exitPointerLock();
      return;
    }
    const canvas = gl.domElement;
    const request = () => {
      try {
        if (matchMedia("(pointer: fine)").matches) void canvas.requestPointerLock();
      } catch {
        /* preview iframe may deny lock; WASD + sticks still work */
      }
    };
    canvas.addEventListener("click", request);
    request();
    return () => canvas.removeEventListener("click", request);
  }, [playing, gl]);

  useFrame((_, dtRaw) => {
    const dt = Math.min(dtRaw, 0.1);
    const st = useEstateInput.getState();
    const injected = st.injected;
    const has = (c: string) => (injected ? injected.includes(c) : keys.current.has(c));

    lookHeld.current.x = st.lookX;
    lookHeld.current.y = st.lookY;
    yaw.current -= st.lookX * 1.6 * dt;
    pitch.current -= st.lookY * 1.2 * dt;
    pitch.current = Math.max(-1.2, Math.min(1.2, pitch.current));

    const fy = has("KeyW") || has("ArrowUp") ? 1 : 0;
    const by = has("KeyS") || has("ArrowDown") ? 1 : 0;
    const lx = has("KeyA") || has("ArrowLeft") ? 1 : 0;
    const rx = has("KeyD") || has("ArrowRight") ? 1 : 0;
    let mx = rx - lx + st.moveX;
    let my = fy - by + st.moveY;
    const mag = Math.hypot(mx, my);
    if (mag > 1) {
      mx /= mag;
      my /= mag;
    }

    const sprint = has("ShiftLeft") || has("ShiftRight") || st.sprint;
    const allow = playing || Boolean(injected);
    const vel = (sprint ? 8 : 4.2) * (allow ? 1 : 0);

    fwd.current.set(-Math.sin(yaw.current), 0, -Math.cos(yaw.current));
    right.current.set(Math.cos(yaw.current), 0, -Math.sin(yaw.current));

    const nx = pos.current.x + (fwd.current.x * my + right.current.x * mx) * vel * dt;
    const nz = pos.current.z + (fwd.current.z * my + right.current.z * mx) * vel * dt;
    if (!blocked(nx, pos.current.z)) pos.current.x = nx;
    if (!blocked(pos.current.x, nz)) pos.current.z = nz;
    pos.current.y = EYE;
    pos.current.x = THREE.MathUtils.clamp(pos.current.x, -18, 18);
    pos.current.z = THREE.MathUtils.clamp(pos.current.z, -3.8, 28);

    speed.current = Math.hypot(mx, my) * vel;
    camera.position.copy(pos.current);
    camera.rotation.set(pitch.current, yaw.current, 0, "YXZ");
    if (!window.__controlsTest) {
      window.__controlsTest = {
        getYaw: () => yaw.current,
        getSpeed: () => speed.current,
        getX: () => pos.current.x,
        getZ: () => pos.current.z,
        setKeys: (codes) => useEstateInput.getState().setInjected(codes),
      };
    }
  });

  return null;
}

function Fountain({
  position,
  radius = 2.2,
  height = 1.6,
}: {
  position: [number, number, number];
  radius?: number;
  height?: number;
}) {
  const night = useEstateInput((s) => s.night);
  const water = night ? "#8b0014" : "#6a7a88";
  return (
    <group position={position}>
      <mesh position={[0, 0.12, 0]}>
        <cylinderGeometry args={[radius, radius * 1.05, 0.28, 24]} />
        <meshStandardMaterial color="#5c5a66" roughness={0.85} />
      </mesh>
      <mesh position={[0, 0.28, 0]}>
        <cylinderGeometry args={[radius * 0.86, radius * 0.86, 0.08, 24]} />
        <meshStandardMaterial
          color={water}
          emissive={water}
          emissiveIntensity={night ? 0.55 : 0.12}
          roughness={0.18}
          metalness={0.2}
        />
      </mesh>
      <mesh position={[0, height / 2, 0]}>
        <cylinderGeometry args={[0.16, 0.2, height, 12]} />
        <meshStandardMaterial color="#5c5a66" roughness={0.85} />
      </mesh>
      <mesh position={[0, height, 0]}>
        <cylinderGeometry args={[radius * 0.32, radius * 0.38, 0.14, 16]} />
        <meshStandardMaterial color="#5c5a66" roughness={0.85} />
      </mesh>
    </group>
  );
}

function House() {
  const night = useEstateInput((s) => s.night);
  const win = night ? "#ff4d6d" : "#ffcc55";
  return (
    <group>
      <mesh position={[0, 4.5, -10]}>
        <boxGeometry args={[22, 9, 10]} />
        <meshStandardMaterial color="#5c5a66" roughness={0.86} />
      </mesh>
      <mesh position={[-12, 3, -8]}>
        <boxGeometry args={[8, 6, 8]} />
        <meshStandardMaterial color="#55545f" roughness={0.86} />
      </mesh>
      <mesh position={[12, 3, -8]}>
        <boxGeometry args={[8, 6, 8]} />
        <meshStandardMaterial color="#55545f" roughness={0.86} />
      </mesh>
      <mesh position={[0, 8, -7]}>
        <boxGeometry args={[6, 14, 5]} />
        <meshStandardMaterial color="#4e4c56" roughness={0.8} />
      </mesh>
      <mesh position={[0, 7.2, -4.46]}>
        <planeGeometry args={[3.6, 8.5]} />
        <meshStandardMaterial color={win} emissive={win} emissiveIntensity={1.35} />
      </mesh>
      <mesh position={[0, 6.4, -4.4]}>
        <planeGeometry args={[1.05, 2.35]} />
        <meshBasicMaterial color="#2a2418" transparent opacity={0.55} />
      </mesh>
      <mesh position={[0, 1.7, -4.62]}>
        <boxGeometry args={[2.2, 3.2, 0.18]} />
        <meshStandardMaterial color="#6a5a2a" metalness={0.55} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.5, -3.2]}>
        <boxGeometry args={[6, 1.2, 5]} />
        <meshStandardMaterial color="#5c5a66" roughness={0.86} />
      </mesh>
      <pointLight position={[0, 7, -3]} color={win} intensity={18} distance={28} />
    </group>
  );
}

function Gates() {
  const night = useEstateInput((s) => s.night);
  const iron = "#1c1b22";
  const stone = "#5c5a66";
  return (
    <group>
      {([-5.2, 5.2] as const).map((x) => (
        <group key={x} position={[x, 0, 18]}>
          <mesh position={[0, 2.1, 0]}>
            <boxGeometry args={[1.2, 4.2, 1.2]} />
            <meshStandardMaterial color={stone} roughness={0.88} />
          </mesh>
          <mesh position={[0, 4.45, 0]}>
            <sphereGeometry args={[0.38, 12, 12]} />
            <meshStandardMaterial color={stone} roughness={0.7} />
          </mesh>
        </group>
      ))}
      {([-1, 1] as const).map((sign) => (
        <group key={sign} position={[sign * 2.6, 1.8, 18]} rotation={[0, sign * 0.55, 0]}>
          <mesh>
            <boxGeometry args={[0.12, 3.4, 2.6]} />
            <meshStandardMaterial color={iron} metalness={0.7} roughness={0.45} />
          </mesh>
          {[-0.7, 0, 0.7].map((z) => (
            <mesh key={z} position={[0, 0, z]}>
              <boxGeometry args={[0.06, 3.2, 0.06]} />
              <meshStandardMaterial color={iron} metalness={0.7} roughness={0.45} />
            </mesh>
          ))}
        </group>
      ))}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 1.05, 17.28]} visible={night}>
        <circleGeometry args={[0.85, 24]} />
        <meshStandardMaterial color="#c4d84a" emissive="#6a7a10" emissiveIntensity={0.35} />
      </mesh>
    </group>
  );
}

function Ground() {
  const tex = useMemo(() => {
    const t = checkerTexture();
    t.repeat.set(8, 8);
    return t;
  }, []);
  const path = useMemo(() => {
    const t = checkerTexture();
    t.repeat.set(2, 6);
    return t;
  }, []);
  useEffect(() => () => {
    tex.dispose();
    path.dispose();
  }, [tex, path]);
  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[16, 16]} />
        <meshStandardMaterial map={tex} roughness={0.42} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 12]} receiveShadow>
        <planeGeometry args={[4, 10]} />
        <meshStandardMaterial map={path} roughness={0.42} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.04, 4]}>
        <planeGeometry args={[80, 80]} />
        <meshStandardMaterial color="#121018" />
      </mesh>
    </>
  );
}

function Atmosphere() {
  const night = useEstateInput((s) => s.night);
  const { scene } = useThree();
  useEffect(() => {
    scene.background = new THREE.Color(night ? "#090614" : "#1a1524");
    scene.fog = new THREE.FogExp2(night ? "#1a1028" : "#2a2433", night ? 0.022 : 0.028);
  }, [night, scene]);
  return (
    <>
      <ambientLight intensity={night ? 0.28 : 0.45} color="#4a3a66" />
      <directionalLight position={[-12, 20, 8]} intensity={night ? 0.35 : 0.55} color="#c8c0ff" />
      <mesh position={[-18, 22, -30]}>
        <sphereGeometry args={[3.2, 16, 16]} />
        <meshBasicMaterial color="#e8e4ff" />
      </mesh>
    </>
  );
}

export function GateWorld({
  playing,
  night,
}: {
  playing: boolean;
  night: boolean;
}) {
  useEffect(() => {
    useEstateInput.getState().setPlaying(playing);
  }, [playing]);
  useEffect(() => {
    useEstateInput.getState().setNight(night);
  }, [night]);

  return (
    <Canvas
      className="h-full w-full touch-none"
      camera={{ position: [0, EYE, 22], fov: 65, near: 0.1, far: 180 }}
      dpr={[1, 2]}
      gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
    >
      <Atmosphere />
      <Ground />
      <House />
      <Gates />
      <Fountain position={[0, 0, 0]} />
      <Fountain position={[-5.5, 0, -2]} radius={0.7} height={0.9} />
      <Fountain position={[5.5, 0, -2]} radius={0.7} height={0.9} />
      <Player playing={playing} />
    </Canvas>
  );
}
