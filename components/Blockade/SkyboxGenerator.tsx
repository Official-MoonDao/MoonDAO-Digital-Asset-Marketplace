import { useEffect, useState } from "react";
import { createSkybox, useStyles } from "../../lib/blockade-labs";
import Scene from "./Scene";

export function SkyboxGenerator() {
  const [prompt, setPrompt] = useState("");
  const [currStyle, setCurrStyle] = useState(9);
  const styles: any = useStyles();
  const [generations, setGenerations]: any = useState([]);

  // Low security password protection for skybox, will replace w/ nft auth
  const [access, setAccess] = useState(false);
  const [passwordAttempt, setPasswordAttempt] = useState("");

  useEffect(() => {
    if (access) {
      const storedGenerations = localStorage.getItem("generations");
      if (storedGenerations) {
        setGenerations(JSON.parse(storedGenerations));
      }
    }
  }, [access]);
  if (!access) {
    return (
      <div>
        <p>Enter Password to continue</p>
        <input
          onChange={(e) =>
            e.target.value.trim() !== "" && setPasswordAttempt(e.target.value)
          }
        />
        <button
          onClick={() => {
            if (
              passwordAttempt === process.env.NEXT_PUBLIC_GENERATOR_PASSWORD
            ) {
              setAccess(true);
            }
          }}
        >
          Submit
        </button>
      </div>
    );
  }

  // Skybox generator
  return (
    <div className="flex justify-center w-full h-full">
      {generations[0] && <Scene generations={generations} />}
      <div className="flex flex-col gap-4 w-1/2">
        <input
          className="rounded-md p-2"
          type="text"
          placeholder="prompt"
          onChange={(e) =>
            e.target.value.trim() !== "" && setPrompt(e.target.value)
          }
        />
        <select
          className="flex px-4 rounded-md py-2"
          onChange={(e: any) => setCurrStyle(+e.target.value)}
        >
          {styles[0] &&
            styles.map((style: any, i: number) => (
              <option key={`style-${i}`} value={style.id}>
                {style.name}
              </option>
            ))}
        </select>
        <button
          disabled={!prompt}
          onClick={async () => {
            const generation = await createSkybox(prompt, currStyle);
            await setGenerations(() => [...generations, generation]);
            localStorage.setItem(
              "generations",
              JSON.stringify([...generations, generation])
            );
          }}
        >
          Generate
        </button>
      </div>
    </div>
  );
}
