import { NETWORK } from "../../const/config";

export default function PolygonBridge() {
  return (
    <div>
      <button
        onClick={() =>
          window.open(
            "https://wallet.polygon.technology/polygon/bridge/deposit"
          )
        }
        className="bridge-button"
      >
        {`${NETWORK.name} Bridge`}
      </button>
      <h1 className="text-center md:text-left text-[80%] opacity-70 leading-6 pr-2 pt-3">
        {`The marketplace uses L2 MOONEY, use the bridge to transfer L1
        MOONEY (${NETWORK.name === "Mumbai" ? "Goerli" : "Mainnet"}) to L2 (${
          NETWORK.name
        })`}
      </h1>
    </div>
  );
}
