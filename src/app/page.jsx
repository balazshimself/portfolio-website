'use client';

import styles from './page.module.scss';
import images from '@/data/images';
import { Billboard, Banner } from '@/components/webgl';
import { Loader } from '@/components/ui/modules';
import { View } from '@/webgl/View';
import { PerspectiveCamera } from '@react-three/drei';
import { useCollageTexture } from '@/hooks';
import { useRef, useEffect, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';

const GAP = 3.2;
const VISIBLE_RANGE = 15; // Distance from camera to render objects

function InfiniteCylinderGroup({ texture, dimensions }) {
    const project_rotation = [-0.15, 0, -0.2]; // Adjust rotation as needed
    const groupRef = useRef();
    const [targetY, setTargetY] = useState(0);
    const [currentY, setCurrentY] = useState(0);
    const [visibleSections, setVisibleSections] = useState(new Set());

    const sectionPool = useRef(new Map());
    const activeSections = useRef(new Map());

    useEffect(() => {
        let ticking = false;

        const handleScroll = (scrollY) => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    const scrollMultiplier = 0.001;
                    setTargetY((prev) => prev + scrollY * scrollMultiplier);
                    ticking = false;
                });
                ticking = true;
            }
        };

        // Prevent default scrolling on the canvas area
        const preventScroll = (e) => {
            handleScroll(e.deltaY);
            e.preventDefault();
        };

        // window.addEventListener('scroll', handleScroll, { passive: true });
        document.addEventListener('wheel', preventScroll, { passive: false });
        document.addEventListener('touchmove', preventScroll, { passive: false });

        return () => {
            // window.removeEventListener('scroll', handleScroll);
            document.removeEventListener('wheel', preventScroll);
            document.removeEventListener('touchmove', preventScroll);
        };
    }, []);

    // Calculate which sections should be visible
    const updateVisibleSections = (cameraY) => {
        const newVisible = new Set();
        const startSection = Math.floor((cameraY - VISIBLE_RANGE) / GAP);
        const endSection = Math.ceil((cameraY + VISIBLE_RANGE) / GAP);

        for (let i = startSection; i <= endSection; i++) {
            newVisible.add(i);
        }

        setVisibleSections(newVisible);
    };

    // Smooth interpolation using useFrame
    useFrame((state, delta) => {
        if (groupRef.current) {
            // Smooth interpolation - adjust the 0.05 value to make it faster (higher) or slower (lower)
            const lerp = (start, end, factor) => start + (end - start) * factor;
            const newY = lerp(currentY, targetY, 0.05);
            setCurrentY(newY);

            // Transform the Y-axis vector [0, 1, 0] by the rotation
            const cosX = Math.cos(project_rotation[0]),
                sinX = Math.sin(project_rotation[0]);
            const cosZ = Math.cos(project_rotation[2]),
                sinZ = Math.sin(project_rotation[2]);

            // Simplified rotation matrix multiplication for Y-axis vector
            const transformedY = [
                -sinZ, // x component
                cosX * cosZ, // y component
                sinX * cosZ, // z component
            ];

            groupRef.current.position.set(
                transformedY[0] * newY,
                transformedY[1] * newY,
                transformedY[2] * newY
            );

            updateVisibleSections(-newY);
        }
    });

    // Generate sections based on visible set
    const renderSections = useMemo(() => {
        const sections = [];

        visibleSections.forEach((sectionIndex) => {
            const yPos = sectionIndex * GAP;

            sections.push(
                <Billboard
                    key={`billboard-${sectionIndex}`}
                    radius={5}
                    rotation={[0, sectionIndex * Math.PI * 0.5, 0]}
                    position={[4.5, yPos, 0]}
                    texture={texture}
                    dimensions={dimensions}
                />,
                <Banner
                    key={`banner-${sectionIndex}`}
                    radius={5.035}
                    rotation={[0, 0, 0.085]}
                    position={[4.5, yPos - GAP * 0.5, 0]}
                />
            );
        });

        return sections;
    }, [visibleSections, texture, dimensions]);

    // return (
    //     <group ref={groupRef} rotation={[-0.15, 0, -0.2]}>
    //         {Array.from({ length: COUNT }).map((_, index) => [
    //             <Billboard
    //                 key={`billboard-${index}`}
    //                 radius={5}
    //                 rotation={[0, index * Math.PI * 0.5, 0]}
    //                 position={[4.5, (index - (Math.ceil(COUNT / 2) - 1)) * GAP, 0]}
    //                 texture={texture}
    //                 dimensions={dimensions}
    //             />,
    //             <Banner
    //                 key={`banner-${index}`}
    //                 radius={5.035}
    //                 rotation={[0, 0, 0.085]}
    //                 position={[4.5, (index - (Math.ceil(COUNT / 2) - 1)) * GAP - GAP * 0.5, 0]}
    //             />,
    //         ])}
    //     </group>
    // );
    return (
        <group ref={groupRef} rotation={project_rotation}>
            {renderSections}
        </group>
    );
}

export default function Home() {
    const { texture, dimensions, isLoading } = useCollageTexture(images);
    const cam = useRef();

    if (isLoading) return <Loader />;

    return (
        <div className={styles.page}>
            <View className={styles.view} orbit={false}>
                <PerspectiveCamera
                    ref={cam}
                    makeDefault
                    fov={7}
                    near={0.01}
                    far={100000}
                    position={[0, 0, 60]}
                />
                <InfiniteCylinderGroup texture={texture} dimensions={dimensions} />
            </View>
        </div>
    );
}
