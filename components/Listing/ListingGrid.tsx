import Link from "next/link";
import styles from "../../styles/Buy.module.css";
export default function ListingGrid({ listings }: any) {
  return (
    <div className={styles.nftGridContainer}>
      <Link
        href={`/collection/${contractAddress}/${nft.metadata.id}`}
        key={nft.metadata.id}
        className={styles.nftContainer}
      >
        <NFT nft={nft} />
      </Link>
    </div>
  );
}
