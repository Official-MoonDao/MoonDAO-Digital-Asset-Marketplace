import { extend } from "@react-three/fiber";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import goodtimes from "../../public/fonts/goodtimes.json";
import { Object3DNode } from "@react-three/fiber";
import * as THREE from "three";

class Text extends TextGeometry {}

extend({ TextGeometry });

declare module "@react-three/fiber" {
  interface ThreeElements {
    textGeometry: Object3DNode<Text, typeof Text>;
  }
}

interface ThreeTextProps {
  position: [number, number, number];
  text: string;
  height?: number;
  size?: number;
  color?: string;
}

export default function ThreeText({
  position,
  text,
  height = 1,
  size = 1,
  color = "#1d1d1d",
}: ThreeTextProps) {
  const font: any = new FontLoader().parse(goodtimes);
  return (
    <mesh position={position}>
      <textGeometry args={[text, { font, size, height }]} />
      <meshPhysicalMaterial
        attach="material"
        clearcoat={1.0}
        clearcoatRoughness={0.1}
        metalness={0.9}
        color={color}
      />
    </mesh>
  );
}
