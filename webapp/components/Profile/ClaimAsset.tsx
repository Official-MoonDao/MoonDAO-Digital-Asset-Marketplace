import { Web3Button } from "@thirdweb-dev/react";
import { MARKETPLACE_ADDRESS } from "../../const/config";
import { useRouter } from "next/router";
import { toast } from "react-hot-toast";

type ClaimAssetProps = {
  walletAddress: string;
  auctionId: string | number;
};

export default function ClaimAsset({
  walletAddress,
  auctionId,
}: ClaimAssetProps) {
  const router = useRouter();
  return (
    <Web3Button
      className="web3-button web3-button-primary"
      contractAddress={MARKETPLACE_ADDRESS}
      action={(marketplace) =>
        marketplace.englishAuctions.closeAuctionForBidder(
          auctionId,
          walletAddress
        )
      }
      onSuccess={() => {
        router.reload();
        setTimeout(() => {
          toast.success("Asset claimed!");
        }, 1000);
      }}
    >
      {"Claim Asset"}
    </Web3Button>
  );
}
