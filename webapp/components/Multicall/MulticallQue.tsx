//Currently only configured for multiCreateListing (config for multiCancel and multiAuctionPayout later)

import { NFT } from "@thirdweb-dev/sdk";
import { useRef, useState } from "react";
import { useLocalQue } from "../../lib/marketplace/hooks";
import { useClickOutside } from "../../lib/utils/hooks";
import { Web3Button, useSigner } from "@thirdweb-dev/react";
import {
  MARKETPLACE_ADDRESS,
  MOONEY_ADDRESS,
  MOONEY_DECIMALS,
} from "../../const/config";
import { multiCreateListings } from "../../lib/marketplace/marketplace-multicall";
import { Contract } from "ethers";
import MARKETPLACE_ABI from "../../const/abis/MarketplaceV3.json";

export function MulticallQue({ address }: any) {
  const signer = useSigner();
  const ref: any = useRef();
  const [enabled, setEnabled] = useState<boolean>(false);
  useClickOutside(ref, enabled, setEnabled);

  const [localQue, setLocalQue]: any = useLocalQue(address);

  const dummyQueuedListings = [
    {
      assetContract: "0xdbb3aaA438e49a93c3E3E213AEbF2F5370993D2d",
      tokenId: "2",
      currency: MOONEY_ADDRESS,
      quantity: "1",
      pricePerToken: String(5 * MOONEY_DECIMALS),
      startTimestamp: Math.round(new Date(Date.now()).valueOf() / 1000),
      endTimestamp: Math.round(
        new Date(Date.now() + 10000000).valueOf() / 1000
      ),
      reserved: false,
    },
  ];

  return (
    <div ref={ref}>
      <div className="flex gap-2">
        <button onClick={() => setEnabled(!enabled)}>Que</button>
        <Web3Button
          contractAddress={MARKETPLACE_ADDRESS}
          action={async () => {
            const marketplace = new Contract(
              MARKETPLACE_ADDRESS,
              MARKETPLACE_ABI,
              signer
            );

            return await multiCreateListings(
              marketplace,
              dummyQueuedListings,
              []
            );
          }}
          isDisabled={!signer}
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
                <div key={`queThumbnail-${nft.metadata.id}`}>
                  <p>{nft.metadata.name}</p>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
