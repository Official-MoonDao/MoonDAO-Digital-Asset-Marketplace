import { MARKETPLACE_ADDRESS } from "../../const/config";
import { Web3Button } from "@thirdweb-dev/react";
import { useRouter } from "next/router";

interface ClaimAuctionPayoutProps {
  claimable: boolean;
  auctionId: number;
}

export default function ClaimAuctionPayout({
  claimable,
  auctionId,
}: ClaimAuctionPayoutProps) {
  const router = useRouter();

  return (
    <Web3Button
      className="web3-button web3-button-primary"
      contractAddress={MARKETPLACE_ADDRESS}
      action={(marketplace) =>
        marketplace
          .call("collectAuctionPayout", [+auctionId])
          .then(() => router.reload())
      }
      isDisabled={!claimable}
    >
      {claimable ? "Claim Payout" : "No Payout"}
    </Web3Button>
  );
}
