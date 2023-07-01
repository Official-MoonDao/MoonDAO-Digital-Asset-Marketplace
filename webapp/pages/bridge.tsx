import Link from "next/link";
import PolygonBridge from "../components/Home/PolygonBridge";
import Metadata from "../components/Layout/Metadata";
import { NETWORK } from "../const/config";

export default function BridgePage() {
  return (
    <main className="flex flex-col items-center px-6 md:px-10">
      <Metadata title="Bridge" />
      <div className="flex gap-4 justify-center items-center flex-col h-full mt-12">
        <h1 className="my-2 text-2xl text-[#6433b9]">{`Bridge to ${NETWORK.name}`}</h1>

        <div className="flex flex-col gap-4 p-2 w-1/2">
          <p className="text-2xl">Steps:</p>
          <p className="text-moon-gold">{`1. Connect your wallet and select the Proof of Stake Bridge`}</p>
          <p className="text-moon-gold">
            {`
            2. Change the input token to MOONEY (if you can't find it in the
            list click "Manage token list" and enable all of the lists)`}
          </p>
          <p className="text-moon-gold">
            {`
            3. Enter the amount of MOONEY you want to bridge and click "Transfer"`}
          </p>
        </div>
        <div className="w-1/2">
          <PolygonBridge />
        </div>
        <Link href={"/"} className="mt-8 web3-button">
          ← Back
        </Link>
      </div>
    </main>
  );
}
