//Currently only configured for multiCreateListing (config for multiCancel and multiAuctionPayout later)

import { NFT } from "@thirdweb-dev/sdk";
import { useEffect, useRef, useState } from "react";
import { getLocalQue, useClickOutside, useLocalQue } from "../../lib/utils";
import { Web3Button } from "@thirdweb-dev/react";
import { MARKETPLACE_ADDRESS } from "../../const/config";
import { multiCreateListings } from "../../lib/marketplace-v3";

export function MulticallQue({ address }: any) {
  const ref: any = useRef();
  const [enabled, setEnabled] = useState<boolean>(false);
  useClickOutside(ref, enabled, setEnabled);

  const [localQue, setLocalQue] = useLocalQue(address);

  return (
    <div ref={ref}>
      <div className="flex gap-2">
        <button onClick={() => setEnabled(!enabled)}>Que</button>
        <Web3Button
          contractAddress={MARKETPLACE_ADDRESS}
          action={async (contract) =>
            await multiCreateListings(
              contract,
              localQue?.queuedListings,
              localQue?.queuedAuctions
            )
          }
          isDisabled={
            (!localQue?.queuedListings && !localQue?.queuedAuctions) ||
            (localQue?.queuedListings?.length === 0 &&
              localQue?.queuedAuctions?.length === 0)
          }
        >
          Multicall
        </Web3Button>
        <p className="text-[75%] w-1/2">
          {`To list multiple assets at once, click 'add to que' instead of create
          listing. Click the multicall button when your que is ready.`}
        </p>
      </div>
      {enabled && (
        <div className="fixed flex justify-center items-center z-[100] w-[80vw] h-[80vh] backdrop-blur-md bg-[#ffffff1d] rounded-md top-[10%] left-[10%]">
          <h3>Multicall Que</h3>
          <button
            className="absolute top-[5%] right-[5%]"
            onClick={() => setEnabled(false)}
          >
            Close
          </button>
          <div>
            {localQue[0] &&
              localQue.map((nft: NFT) => (
                <div key={nft.metadata.id}>
                  <p>{nft.metadata.name}</p>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
