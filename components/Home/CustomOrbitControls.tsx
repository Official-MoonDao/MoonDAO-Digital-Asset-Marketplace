import { OrbitControls } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useState, useRef } from "react";

interface Props {
  distance: number;
  setDistance: Function;
}

export default function CustomOrbitControls({ distance, setDistance }: Props) {
  const controlRef = useRef<any>();
  useEffect(() => {
    if (controlRef.current) console.log(controlRef);
  }, []);
  useFrame(() => {
    if (controlRef.current) {
      const newDistance: number = controlRef.current.getDistance().toFixed(5);
      if (newDistance !== distance) setDistance(newDistance);
    }
  });
  return (
    <OrbitControls
      enablePan={false}
      dampingFactor={0.01}
      ref={controlRef}
      maxDistance={10}
    />
  );
}
