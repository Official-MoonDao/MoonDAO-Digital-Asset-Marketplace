import { useContract, useMetadata, useNFT } from "@thirdweb-dev/react";
import {
  DirectSubmission,
  AuctionSubmission,
} from "../../lib/marketplace/marketplace-utils";
import Skeleton from "../Layout/Skeleton";

export default function QueThumbnail({
  que,
}: {
  que: DirectSubmission | AuctionSubmission;
}) {
  const { contract } = useContract(que?.assetContract);
  const { data: contractMetadata } = useMetadata(contract);
  const { data: nft }: any = useNFT(contract, que?.tokenId);

  return (
    <article className="flex items-center lg:hover:bg-gradient-to-br lg:hover:ring-2 ring-white from-main-background via-indigo-900 to-main-background transition-all duration-150 lg:rounded-xl lg:px-3 lg:py-2 xl:py-3 xl:px-4">
      <div className="flex items-center gap-2 md:gap-3 lg:gap-6">
        <p className="font-bold text-lg">{que.tokenId}</p>
        {nft ? (
          <img
            src={nft?.metadata.image}
            alt={`${nft?.metadata?.name} collection image`}
            className="w-20 h-20 rounded-full object-cover"
          />
        ) : (
          <Skeleton width="20px" height="20px" borderRadius="100%" />
        )}
      </div>
      {contractMetadata && (
        <div className="ml-2 md:ml-4 flex flex-col">
          <h6 className="font-bold lg:text-lg">{contractMetadata?.name}</h6>
        </div>
      )}
    </article>
  );
}
