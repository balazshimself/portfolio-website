"use client";

import * as THREE from "three";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";

import "@/webgl/components/MeshImageMaterial";
import "@/webgl/components/MeshBannerMaterial";

function setupCylinderTextureMapping(texture, dimensions, radius, height) {
  const cylinderCircumference = 2 * Math.PI * radius;
  const cylinderHeight = height;
  const cylinderAspectRatio = cylinderCircumference / cylinderHeight;

  if (dimensions.aspectRatio > cylinderAspectRatio) {
    // Canvas is wider than cylinder proportionally
    texture.repeat.x = cylinderAspectRatio / dimensions.aspectRatio;
    texture.repeat.y = 1;
    texture.offset.x = (1 - texture.repeat.x) / 2;
  } else {
    // Canvas is taller than cylinder proportionally
    texture.repeat.x = 1;
    texture.repeat.y = dimensions.aspectRatio / cylinderAspectRatio;
  }

  // Center the texture
  texture.offset.y = (1 - texture.repeat.y) / 2;
}

export function Billboard({ texture, dimensions, radius = 5, ...props }) {
  const ref = useRef(null);

  setupCylinderTextureMapping(texture, dimensions, radius, 2);

  useFrame((state, delta) => {
    if (texture) texture.offset.x += delta * 0.001;
  });

  return (
    <mesh ref={ref} {...props}>
      <cylinderGeometry args={[radius, radius, 2, 100, 1, true]} />
      <meshImageMaterial
        map={texture}
        side={THREE.DoubleSide}
        toneMapped={false}
      />
    </mesh>
  );
}

export function Banner({ radius = 1.6, ...props }) {
  const ref = useRef(null);

  const texture = useTexture("/banner.jpg");
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

  useFrame((state, delta) => {
    if (!ref.current) return;
    const material = ref.current.material;
    if (material.map) material.map.offset.x += delta / 30;
  });

  return (
    <mesh ref={ref} {...props}>
      <cylinderGeometry
        args={[radius, radius, radius * 0.07, radius * 80, radius * 10, true]}
      />
      <meshBannerMaterial
        map={texture}
        map-anisotropy={16}
        map-repeat={[15, 1]}
        side={THREE.DoubleSide}
        toneMapped={false}
        backfaceRepeatX={0.2}
      />
    </mesh>
  );
}
