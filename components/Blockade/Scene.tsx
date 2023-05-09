import { Canvas } from "@react-three/fiber";
import Skybox from "./Skybox";
import { useEffect, useState } from "react";
import CustomOrbitControls from "./CustomOrbitControls";

export default function Scene({ generations }: any) {
  const [currGeneration, setcurrGeneration] = useState<number>(0);
  const [distance, setDistance] = useState<number>(0);
  const [enablePagination, setEnablePagination] = useState<boolean>(false);
  useEffect(() => {
    distance > 3 ? setEnablePagination(true) : setEnablePagination(false);
  }, [distance]);
  return (
    <>
      <Canvas>
        <ambientLight intensity={0.5} />
        <CustomOrbitControls
          distance={distance}
          setDistance={(d: number) => setDistance(d)}
        />
        <Skybox generation={generations[currGeneration]} />
      </Canvas>
      {enablePagination && generations.length > 1 && (
        <div className="absolute bottom-16 left-[10%] right-0 flex items-center justify-center w-1/2 gap-[25%]">
          <button
            className={`bg-gray-200 rounded-full p-2 w-1/4`}
            onClick={() =>
              currGeneration > 0 && setcurrGeneration(currGeneration - 1)
            }
          >
            {"<"}
          </button>
          <button
            className={`bg-gray-200 rounded-full p-2 w-1/4`}
            onClick={() => {
              console.log(currGeneration, generations);
              currGeneration < generations.length - 1 &&
                setcurrGeneration(currGeneration + 1);
            }}
          >
            {">"}
          </button>
        </div>
      )}
    </>
  );
}
