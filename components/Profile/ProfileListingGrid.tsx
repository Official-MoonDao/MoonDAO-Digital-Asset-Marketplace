import Link from "next/link";
import styles from "../../styles/Buy.module.css";
import ProfileListing from "./ProfileListing";
export default function ProfileListingGrid({ listings, type = "direct" }: any) {
  return (
    <div className={styles.nftGridContainer}>
      {listings && listings[0] ? (
        listings.map((l: any, i: number) => (
          <ProfileListing listing={l} type={type} key={`listing-${i}`} />
        ))
      ) : (
        <div>{`No valid ${type} listings`}</div>
      )}
    </div>
  );
}
