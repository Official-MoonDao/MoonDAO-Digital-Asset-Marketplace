import { extend } from "@react-three/fiber";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import goodtimes from "../../public/fonts/goodtimes.json";

extend({ TextGeometry });

export default function ThreeText({ position, text }: any) {
  const font = new FontLoader().parse(goodtimes);

  return (
    <mesh position={position}>
      <textGeometry args={[text, { font, size: 1, height: 1 }]} />\
      <meshPhysicalMaterial attach="material" color={"black"} />
    </mesh>
  );
}
