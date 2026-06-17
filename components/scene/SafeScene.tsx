"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import * as THREE from "three";

import { EffectComposer, Bloom } from "@react-three/postprocessing";

/* =========================
   ORB SYSTEM
========================= */
function World() {
  const group = useRef<THREE.Group>(null);

  const orbs = useMemo(() => {
    return new Array(6).fill(0).map((_, i) => ({
      angle: (i / 6) * Math.PI * 2,
      radius: 3,
      y: (Math.random() - 0.5) * 2,
    }));
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const scroll = window.scrollY;

    if (!group.current) return;

    group.current.rotation.y = t * 0.05;
    group.current.position.y = -scroll * 0.003;
  });

  return (
    <group ref={group}>
      {/* CORE ORB (bright for bloom) */}
      <mesh>
        <sphereGeometry args={[1.6, 32, 32]} />
        <meshStandardMaterial
          color="#3b82f6"
          emissive="#2563eb"
          emissiveIntensity={1}
          roughness={0.25}
          metalness={0.7}
        />
      </mesh>

      {/* SATELLITES */}
      {orbs.map((orb, i) => (
        <mesh
          key={i}
          position={[
            Math.cos(orb.angle) * orb.radius,
            orb.y,
            Math.sin(orb.angle) * orb.radius,
          ]}
        >
          <sphereGeometry args={[0.28, 24, 24]} />
          <meshStandardMaterial
            color={i % 2 === 0 ? "#60a5fa" : "#3b82f6"}
            emissive="#1e40af"
            emissiveIntensity={0.6}
          />
        </mesh>
      ))}
    </group>
  );
}

/* =========================
   CAMERA RIG
========================= */
function CameraRig() {
  const { camera } = useThree();

  useFrame(() => {
    const scroll = window.scrollY;

    camera.position.y = THREE.MathUtils.lerp(
      camera.position.y,
      -scroll * 0.003,
      0.08
    );

    camera.position.z = THREE.MathUtils.lerp(
      camera.position.z,
      5 + Math.sin(scroll * 0.001) * 0.5,
      0.05
    );

    camera.lookAt(0, camera.position.y, 0);
  });

  return null;
}

/* =========================
   SCENE
========================= */
export default function SafeScene() {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas camera={{ position: [0, 0, 5] }} dpr={[1, 1.5]}>
        {/* LIGHTS */}
        <ambientLight intensity={0.6} />
        <directionalLight position={[3, 3, 2]} intensity={1.2} />
        <pointLight position={[-3, -2, -3]} intensity={0.5} color="#60a5fa" />

        {/* WORLD */}
        <CameraRig />
        <World />

        {/* 🌟 BLOOM EFFECT */}
        <EffectComposer>
          <Bloom
            intensity={1.2}
            luminanceThreshold={0.2}
            luminanceSmoothing={0.9}
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
}