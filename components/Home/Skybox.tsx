import * as THREE from "three";
import { useTexture } from "@react-three/drei";
export default function Skybox({ texturePath }: any) {
  const texture = useTexture(texturePath);
  return (
    <mesh>
      <pointLight intensity={1} />
      <sphereBufferGeometry args={[5, 64, 64]} />
      <meshBasicMaterial map={texture} side={THREE.BackSide} />
    </mesh>
  );
}
