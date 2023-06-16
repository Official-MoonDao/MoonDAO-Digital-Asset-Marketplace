import * as THREE from "three";
import { useTexture } from "@react-three/drei";
import { useGeneration } from "../../../lib/blockade-labs";
import { useEffect, useRef, useState } from "react";
import ThreeText from "../ThreeText";
import { useFrame } from "@react-three/fiber";
export default function GeneratedSkybox({ generation }: any) {
  const [currGeneration, setCurrGeneration] = useState<any>({});

  const { data: generationData, isLoading: loadingGeneration }: any =
    useGeneration(currGeneration.id);
  const texture: any = useTexture(
    generationData?.file_url || "/skybox/blank.png"
  );
  useEffect(() => {
    setCurrGeneration(generation);
  }, [generation]);

  const loadingMeshRef = useRef<any>();

  useFrame(() => {
    if (loadingGeneration) {
      loadingMeshRef.current.rotation.y += 0.01;
    }
  });
  if (loadingGeneration || !generationData?.file_url) {
    return (
      <mesh ref={loadingMeshRef}>
        <pointLight intensity={1} />
        <sphereGeometry args={[10, 64, 64]} />
        <ThreeText position={[-5, 0, 0]} text="Loading..." />
      </mesh>
    );
  }
  return (
    <mesh>
      <pointLight intensity={1} />
      <sphereGeometry args={[5, 64, 64]} />
      <meshBasicMaterial map={texture} side={THREE.BackSide} opacity={0.2} />
    </mesh>
  );
}
