import ProfileDirectListing from "./ProfileDirectListing";
import ProfileAuctionListing from "./ProfileAuctionListing";
import {
  AuctionListing,
  DirectListing,
} from "../../lib/marketplace/marketplace-utils";

export default function ProfileListingGrid({ listings, type = "direct" }: any) {
  return (
    <div className="flex flex-wrap gap-[1%] w-full">
      {listings && listings[0] ? (
        <>
          {type === "direct"
            ? listings.map((l: DirectListing, i: number) => (
                <ProfileDirectListing listing={l} key={`listing-${i}`} />
              ))
            : listings.map((a: AuctionListing, i: number) => (
                <ProfileAuctionListing listing={a} key={`listing-${i}`} />
              ))}
        </>
      ) : (
        <div>{`No valid ${type} listings`}</div>
      )}
    </div>
  );
}
