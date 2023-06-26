import { Web3Button } from "@thirdweb-dev/react";
import { MARKETPLACE_ADDRESS } from "../../const/config";
import { useRouter } from "next/router";

export default function CancelListing({
  listingId,
  type,
}: {
  listingId: string | number;
  type: string;
}) {
  const router = useRouter();
  return (
    <div>
      <Web3Button
      className="connect-button"
        contractAddress={MARKETPLACE_ADDRESS}
        action={(contract: any) =>
          type === "auction"
            ? contract.englishAuctions.cancelAuction(listingId)
            : contract.directListings.cancelListing(listingId)
        }
        onSuccess={() => router.reload()}
      >
        {`Cancel Listing`}
      </Web3Button>
      {type === "auction" && <p>This auction expired with no bids</p>}
    </div>
  );
}
