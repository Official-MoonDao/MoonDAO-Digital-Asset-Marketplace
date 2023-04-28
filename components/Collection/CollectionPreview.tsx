import {
  MediaRenderer,
  ThirdwebNftMedia,
  useContract,
  useMetadata,
} from "@thirdweb-dev/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getCollection } from "../../lib/opensea";
import buyStyles from "../../styles/Buy.module.css";
import randomColor from "../../util/randomColor";
import styles from "../NFT/NFT.module.css";
import Skeleton from "../Skeleton/Skeleton";
export default function CollectionPreview({ collection }: any) {
  const [collectionDetails, setCollectionDetails] = useState<any>({
    name: "",
    symbol: "",
  });

  const { contract: collectionContract } = useContract(collection[2]);

  useEffect(() => {
    if (collectionContract)
      (async () => {
        const name = await collectionContract?.call("name");
        const symbol = await collectionContract?.call("symbol");
        console.log(name);
        setCollectionDetails({ name, symbol });
      })();
  }, [collection, collectionContract]);
  return (
    <div className={buyStyles.nftContainer}>
      <Link href={`/collection/${collection[2]}`}>
        <div
          style={{
            backgroundImage: `linear-gradient(90deg, ${randomColor()}, ${randomColor()})`,
            height: "20vw",
            width: "20vw",
          }}
        />
      </Link>
      <h4>{collectionDetails.name}</h4>
    </div>
  );
}
