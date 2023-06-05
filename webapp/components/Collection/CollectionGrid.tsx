import CollectionPreview from "./CollectionPreview";
import styles from "../../styles/Buy.module.css";

export default function CollectionGrid({ collections }: any) {
  return (
    <div className={styles.nftGridContainer}>
      {collections &&
        collections[0] &&
        collections.map((c: any, i: number) => (
          <CollectionPreview key={i + c.assetContract} collection={c} />
        ))}
    </div>
  );
}
