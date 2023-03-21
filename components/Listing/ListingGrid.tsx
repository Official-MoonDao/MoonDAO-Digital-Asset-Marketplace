import Link from "next/link";
import styles from "../../styles/Buy.module.css";
import Listing from "./Listing";
export default function ListingGrid({ listings, type }: any) {
  return (
    <div className={styles.nftGridContainer}>
      {listings.map((l: any, i: number) => (
        <Listing listing={l} type={type} key={`listing-${i}`} />
      ))}
    </div>
  );
}
