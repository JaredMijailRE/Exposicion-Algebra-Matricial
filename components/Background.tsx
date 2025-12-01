'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial, Line } from '@react-three/drei';
import * as THREE from 'three';

function ScatterPlot() {
    const pointsRef = useRef<THREE.Points>(null);
    const lineRef = useRef<any>(null);

    // Generate random points for linear regression simulation
    const { positions, linePoints } = useMemo(() => {
        const count = 100;
        const pos = new Float32Array(count * 3);
        const line = [];

        // Simple linear regression: y = 0.5x + noise
        for (let i = 0; i < count; i++) {
            const x = (Math.random() - 0.5) * 10;
            const z = (Math.random() - 0.5) * 10;
            const y = 0.5 * x + (Math.random() - 0.5) * 2;

            pos[i * 3] = x;
            pos[i * 3 + 1] = y;
            pos[i * 3 + 2] = z;
        }

        // Regression line points (start and end)
        line.push(new THREE.Vector3(-5, -2.5, 0));
        line.push(new THREE.Vector3(5, 2.5, 0));

        return { positions: pos, linePoints: line };
    }, []);

    useFrame((state, delta) => {
        if (pointsRef.current) {
            pointsRef.current.rotation.y += delta * 0.1;
        }
        if (lineRef.current) {
            lineRef.current.rotation.y += delta * 0.1;
        }
    });

    return (
        <group>
            <Points ref={pointsRef} positions={positions} stride={3} frustumCulled={false}>
                <PointMaterial
                    transparent
                    color="#00ff88"
                    size={0.15}
                    sizeAttenuation={true}
                    depthWrite={false}
                />
            </Points>
            <group ref={lineRef}>
                <Line
                    points={linePoints}
                    color="#ff0088"
                    lineWidth={2}
                />
            </group>
        </group>
    );
}

export default function Background() {
    return (
        <div className="fixed inset-0 -z-10 bg-black">
            <Canvas camera={{ position: [0, 0, 10], fov: 60 }}>
                <fog attach="fog" args={['black', 5, 20]} />
                <ScatterPlot />
            </Canvas>
        </div>
    );
}
