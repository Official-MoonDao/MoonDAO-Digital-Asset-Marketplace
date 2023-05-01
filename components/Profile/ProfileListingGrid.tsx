import Link from "next/link";
import styles from "../../styles/Buy.module.css";
import ProfileListing from "./ProfileListing";
export default function ProfileListingGrid({ listings, type }: any) {
  return (
    <div className={styles.nftGridContainer}>
      {listings.map((l: any, i: number) => (
        <ProfileListing listing={l} type={type} key={`listing-${i}`} />
      ))}
    </div>
  );
}
