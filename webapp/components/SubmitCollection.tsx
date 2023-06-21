import { useRef, useState } from "react";
import { useClickOutside } from "../lib/utils";

export default function SubmitCollection() {
  const submitRef: any = useRef();
  const [enabled, setEnabled] = useState<boolean>(false);

  useClickOutside(submitRef, enabled, setEnabled);

  return (
    <div
      className={`w-full flex justify-center ${
        enabled ? "md:h-[500px]" : "h-[200px]"
      } ease-in-ease-out duration-500`}
      ref={submitRef}
    >
      {!enabled ? (
        <div className="w-full flex flex-col gap-2 justify-center items-center">
          <p className="text-[75%] opacity-60 w-full text-center">
            {
              "Don't see your assets? Apply to have your collection added to the marketplace \n (you must be the owner of the collection)"
            }
          </p>
          <button
            className="connect-button w-3/4"
            onClick={() => setEnabled(true)}
          >
            Submit a Collection
          </button>
        </div>
      ) : (
        <div className="animate-fade-in w-3/4 flex flex-col justify-center items-center rounded-lg light">
          <iframe
            className="rounded-lg"
            allowTransparency={true}
            width={"100%"}
            height={"550px"}
            src={
              "https://circles-v1-production.vercel.app/r/ad645285-65ef-4aec-b314-d8d0659cccd8/embed?mode=dark"
            }
          />
        </div>
      )}
    </div>
  );
}
