import { extend } from "@react-three/fiber";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import goodtimes from "../../public/fonts/goodtimes.json";
import { Object3DNode } from "@react-three/fiber";

class Text extends TextGeometry {}

extend({ TextGeometry });

declare module "@react-three/fiber" {
  interface ThreeElements {
    textGeometry: Object3DNode<Text, typeof Text>;
  }
}

export default function ThreeText({ position, text }: any) {
  const font: any = new FontLoader().parse(goodtimes);
  return (
    <mesh position={position}>
      <textGeometry args={[text, { font, size: 1, height: 1 }]} />
      <meshPhysicalMaterial attach="material" color={"black"} />
    </mesh>
  );
}
