import CollectionPreview from "./CollectionPreview";
import styles from "../../styles/Buy.module.css";
import { useEffect } from "react";
export default function CollectionGrid({ collections }: any) {
  return (
    <div className={styles.nftGridContainer}>
      {collections &&
        collections[0] &&
        collections.map((c: any) => (
          <CollectionPreview key={c.address} collection={c} />
        ))}
    </div>
  );
}
