"use client";

// This component now hosts the persistent WebGL scene AND still exposes the r3f.Out portal
// so existing <View> usage in page.jsx keeps working. Homepage 3D logic (camera + cylinder
// of Billboards/Banners) is duplicated here to allow persistence across route transitions.
// Once you remove the logic from page.jsx you will avoid the duplicate rendering.

import { useRef, useEffect, useState, useMemo, useCallback } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Preload, PerspectiveCamera } from "@react-three/drei";
import { useRouter } from "next/navigation";
import { r3f } from "@/webgl/helpers/global";
import { View } from "./View";
import styles from "./page.module.scss";

import images from "@/data/images";
import { useCollageTexture } from "@/hooks";
import { Billboard, Banner } from "@/components/webgl";
import { Loader } from "@/components/ui/modules";

// ===== External control API ==================================================
let startTransitionRef = null; // set after mount
let ready = false;
const readyCallbacks = [];

function markReady() {
  if (!ready) {
    ready = true;
    readyCallbacks.splice(0).forEach((cb) => cb());
  }
}

// Public API: import { sceneAPI, onSceneReady } from '@/webgl/Scene'
export const sceneAPI = {
  startProjectTransition: (slug) => {
    if (startTransitionRef) {
      startTransitionRef(slug);
    } else {
      console.warn("Scene not mounted yet; transition ignored");
    }
  },
  isReady: () => ready,
};

export function onSceneReady(cb) {
  if (ready) cb();
  else readyCallbacks.push(cb);
}

// ===== Constants & Helpers ===================================================
const GAP = 3.2;
const VISIBLE_RANGE = 6; // Distance from camera to render objects
const PROJECT_SLUGS = ["alpha", "beta", "gamma"];

// ===== Infinite Cylinder Group (persistent) ==================================
function InfiniteCylinderGroup({ texture, dimensions, onRequestNavigate }) {
  const router = useRouter();
  const project_rotation = [-0.15, 0, -0.2];
  const containerRef = useRef(); // unrotated parent for global X shifts
  const groupRef = useRef(); // rotated group (cylinder)
  const [targetY, setTargetY] = useState(0);
  const [currentY, setCurrentY] = useState(0);
  const [visibleSections, setVisibleSections] = useState(new Set());
  const [shiftX, setShiftX] = useState(0);
  const [targetShiftX, setTargetShiftX] = useState(0);

  // Expose transition starter (slide + navigation) to external API
  const startTransition = useCallback(
    (slug) => {
      // animate slide out
      setTargetShiftX(-20);
      // Navigate at midpoint (~250ms currently); tune as needed
      setTimeout(() => {
        if (onRequestNavigate) onRequestNavigate(slug);
        else router.push(`/projects/${slug}`);
      }, 250);
    },
    [router, onRequestNavigate]
  );

  useEffect(() => {
    startTransitionRef = startTransition; // register for external calls
    markReady();
    return () => {
      if (startTransitionRef === startTransition) startTransitionRef = null;
    };
  }, [startTransition]);

  useEffect(() => {
    let ticking = false;
    const handleScroll = (scrollY) => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollMultiplier = 0.0025;
          // Smoothly add scroll delta to target
          setTargetY((prev) => prev + scrollY * scrollMultiplier);
          ticking = false;
        });
        ticking = true;
      }
    };
    const preventScroll = (e) => {
      handleScroll(e.deltaY);
      e.preventDefault();
    };
    document.addEventListener("wheel", preventScroll, { passive: false });
    document.addEventListener("touchmove", preventScroll, { passive: false });
    return () => {
      document.removeEventListener("wheel", preventScroll);
      document.removeEventListener("touchmove", preventScroll);
    };
  }, []);

  const updateVisibleSections = (cameraY) => {
    const newVisible = new Set();
    const startSection = Math.floor((cameraY - VISIBLE_RANGE) / GAP);
    const endSection = Math.ceil((cameraY + VISIBLE_RANGE) / GAP);
    for (let i = startSection; i <= endSection; i++) newVisible.add(i);
    setVisibleSections(newVisible);
  };

  useFrame(() => {
    // Lateral shift
    if (containerRef.current) {
      const lerp = (a, b, f) => a + (b - a) * f;
      const newShiftX = lerp(shiftX, targetShiftX, 0.05);
      if (Math.abs(newShiftX - shiftX) > 0.0001) setShiftX(newShiftX);
      containerRef.current.position.x = newShiftX;
    }
    if (groupRef.current) {
      const lerp = (a, b, f) => a + (b - a) * f;
      const newY = lerp(currentY, targetY, 0.05);
      if (Math.abs(newY - currentY) > 0.0001) setCurrentY(newY);
      const cosX = Math.cos(project_rotation[0]),
        sinX = Math.sin(project_rotation[0]);
      const cosZ = Math.cos(project_rotation[2]),
        sinZ = Math.sin(project_rotation[2]);
      const transformedY = [-sinZ, cosX * cosZ, sinX * cosZ];
      groupRef.current.position.set(
        transformedY[0] * newY,
        transformedY[1] * newY,
        transformedY[2] * newY
      );
      updateVisibleSections(-newY);
    }
  });

  const renderSections = useMemo(() => {
    const sections = [];
    visibleSections.forEach((sectionIndex) => {
      const yPos = sectionIndex * GAP;
      const baseX = 6;
      const handleClick = () => {
        const projectIndex =
          ((sectionIndex % PROJECT_SLUGS.length) + PROJECT_SLUGS.length) %
          PROJECT_SLUGS.length;
        startTransition(PROJECT_SLUGS[projectIndex]);
      };
      const pointerOver = () => (document.body.style.cursor = "pointer");
      const pointerOut = () => (document.body.style.cursor = "auto");
      sections.push(
        <Billboard
          key={`billboard-${sectionIndex}`}
          radius={5}
          rotation={[0, sectionIndex * Math.PI * 0.5, 0]}
          position={[baseX, yPos, 0]}
          texture={texture}
          dimensions={dimensions}
          onClick={handleClick}
          onPointerOver={pointerOver}
          onPointerOut={pointerOut}
        />,
        <Banner
          key={`banner-${sectionIndex}`}
          radius={5.035}
          rotation={[0, 0, 0.085]}
          position={[baseX, yPos - GAP * 0.5, 0]}
        />
      );
    });
    return sections;
  }, [visibleSections, texture, dimensions, startTransition]);

  return (
    <group ref={containerRef}>
      <group ref={groupRef} rotation={[-0.15, 0, -0.2]}>
        {renderSections}
      </group>
    </group>
  );
}

// ===== Scene Root ============================================================
export default function Scene(props) {
  const { texture, dimensions, isLoading } = useCollageTexture(images);

  return (
    <div className={styles.page}>
      {/* <View className={styles.view} orbit={false}> */}
      <Canvas {...props}>
        {/* Persistent camera for the hoisted scene */}
        {!isLoading && (
          <PerspectiveCamera
            makeDefault
            fov={7}
            near={0.01}
            far={100000}
            position={[0, 0, 60]}
          />
        )}
        {/* Hoisted home 3D (duplicate with page.jsx until that file is cleaned) */}
        {!isLoading && texture && (
          <InfiniteCylinderGroup texture={texture} dimensions={dimensions} />
        )}
        {/* Existing portal for legacy <View> usage */}
        <r3f.Out />
        <Preload all />
        {isLoading && <Loader />}
      </Canvas>
      {/* </View> */}
    </div>
  );
}
