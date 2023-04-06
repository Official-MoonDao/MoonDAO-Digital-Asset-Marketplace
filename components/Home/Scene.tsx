import { useTexture } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import Skybox from "./Skybox";
import { OrbitControls } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import { RoundedBox } from "@react-three/drei";
import ZoomControls from "./CustomOrbitControls";
import CustomOrbitControls from "./CustomOrbitControls";

const textures = [
  "/skybox/skybox1.jpg",
  "/skybox/skybox2.jpg",
  "/skybox/skybox3.jpg",
];

export default function Scene() {
  const [currTexture, setCurrTexture] = useState<number>(0);
  const [distance, setDistance] = useState<number>(0);
  const [enablePagination, setEnablePagination] = useState<boolean>(false);
  useEffect(() => {
    distance > 8 ? setEnablePagination(true) : setEnablePagination(false);
  }, [distance]);
  return (
    <>
      <Canvas>
        <ambientLight intensity={0.5} />
        <CustomOrbitControls
          distance={distance}
          setDistance={(d: number) => setDistance(d)}
        />
        <Skybox texturePath={textures[currTexture]} />
      </Canvas>
      {enablePagination && (
        <div className="absolute bottom-16 left-0 right-0 flex items-center justify-center w-full gap-[25%]">
          <button
            className={`bg-gray-200 rounded-full p-2 w-1/4`}
            onClick={() => currTexture > 0 && setCurrTexture(currTexture - 1)}
          >
            {"<"}
          </button>
          <button
            className={`bg-gray-200 rounded-full p-2 w-1/4`}
            onClick={() =>
              currTexture < textures.length - 1 &&
              setCurrTexture(currTexture + 1)
            }
          >
            {">"}
          </button>
        </div>
      )}
    </>
  );
}
