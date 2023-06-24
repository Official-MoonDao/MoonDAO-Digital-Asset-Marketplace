import { BlockadeLabsSdk } from "@blockadelabs/sdk";
import { useEffect, useState } from "react";

const sdk = new BlockadeLabsSdk({
  api_key: process.env.NEXT_PUBLIC_BLOCKADE_LABS_KEY || "",
});

// Create a new skybox
export async function createSkybox(prompt: string, style: any = 9) {
  const generation = await sdk.generateSkybox({
    prompt,
    skybox_style_id: +style,
  });
  return generation;
}

//Get a skybox by id
export async function getSkyboxById(generationId: any) {
  const skybox = await sdk.getImagineById({ id: generationId });
  return skybox;
}

/////HOOKS/////////////

//All skybox styles
export function useStyles() {
  const [styles, setStyles]: any = useState([]);
  useEffect(() => {
    (async () => {
      const currStyles = await sdk.getSkyboxStyles();
      await setStyles([...currStyles]);
    })();
  }, []);
  return styles;
}

//Wait for generation to complete and load
export function useGeneration(generationId: any) {
  const [progress, setProgress] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const interval = setInterval(async () => {
      const generation = await getSkyboxById(generationId);
      setProgress(generation);
      console.log(progress);
      if (generation.status === "complete") {
        clearInterval(interval);
        setIsLoading(false);
      }
    }, 2000);
    return () => {
      clearInterval(interval);
      setIsLoading(false);
    };
  }, [generationId]);
  return { data: progress, isLoading };
}
