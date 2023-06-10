import styles from "../../styles/Buy.module.css";
import ProfileDirectListing from "./ProfileDirectListing";
import ProfileAuctionListing from "./ProfileAuctionListing";
import { AuctionListing, DirectListing } from "../../lib/utils";

export default function ProfileListingGrid({ listings, type = "direct" }: any) {
  return (
    <div className={styles.nftGridContainer}>
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
