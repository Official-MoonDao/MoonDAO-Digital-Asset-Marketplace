import ProfileDirectListing from "./ProfileDirectListing";
import ProfileAuctionListing from "./ProfileAuctionListing";
import {
  AuctionListing,
  DirectListing,
} from "../../lib/marketplace/marketplace-utils";
import { useAddress } from "@thirdweb-dev/react";
import ProfileWinningBid from "./ProfileWinningBid";

export default function ProfileListingGrid({
  marketplace,
  listings,
  type = "direct",
}: any) {
  const address = useAddress();
  return (
    <div className="flex flex-wrap gap-[1%] w-full">
      {listings && listings[0] ? (
        <>
          {type === "direct" &&
            listings.map((l: DirectListing, i: number) => (
              <ProfileDirectListing
                key={`profile-direct-listing-${i}`}
                listing={l}
                walletAddress={address || ""}
              />
            ))}{" "}
          {type === "auction" &&
            listings.map((a: AuctionListing, i: number) => (
              <ProfileAuctionListing
                key={`profile-auction-listing-${i}`}
                listing={a}
                walletAddress={address || ""}
                marketplace={marketplace}
              />
            ))}
          {type === "winningBids" &&
            listings.map((a: AuctionListing, i: number) => (
              <ProfileWinningBid
                key={`profile-winning-bid-${i}`}
                listing={a}
                walletAddress={address || ""}
                marketplace={marketplace}
              />
            ))}
        </>
      ) : (
        <div>
          {type === "direct" || type === "auction"
            ? `No ${type} listings`
            : `No assets to claim`}
        </div>
      )}
    </div>
  );
}
