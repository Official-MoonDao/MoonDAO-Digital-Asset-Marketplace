import ProfileDirectListing from "./ProfileDirectListing";
import ProfileAuctionListing from "./ProfileAuctionListing";
import {
  AuctionListing,
  DirectListing,
} from "../../lib/marketplace/marketplace-utils";
import { useAddress } from "@thirdweb-dev/react";

export default function ProfileListingGrid({ listings, type = "direct" }: any) {
  const address = useAddress();
  return (
    <div className="flex flex-wrap gap-[1%] w-full">
      {listings && listings[0] ? (
        <>
          {type === "direct"
            ? listings.map((l: DirectListing, i: number) => (
                <ProfileDirectListing
                  key={`profile-direct-listing-${i}`}
                  listing={l}
                  walletAddress={address || ""}
                />
              ))
            : listings.map((a: AuctionListing, i: number) => (
                <ProfileAuctionListing
                  key={`profile-auction-listing-${i}`}
                  listing={a}
                  walletAddress={address || ""}
                />
              ))}
        </>
      ) : (
        <div>{`No valid ${type} listings`}</div>
      )}
    </div>
  );
}
