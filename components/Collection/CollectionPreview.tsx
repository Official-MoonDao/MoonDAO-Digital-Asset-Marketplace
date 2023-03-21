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
  const [cData, setCData] = useState<any>({}); //collection data comes from opensea
  useEffect(() => {
    (async () => {
      setCData(await getCollection(collection.address));
    })();
  }, [collection]);
  return (
    <div className={buyStyles.nftContainer}>
      <Link href={`/collection/${cData.address}`}>
        {cData.image_url ? (
          <Image
            className="w-full h-full rounded-md mb-4"
            src={cData.image_url}
            width={400}
            height={400}
            alt=""
          />
        ) : (
          <div
            style={{
              background: `linear-gradient(90deg, ${randomColor()}, ${randomColor()})`,
              height: "30vw",
            }}
          />
        )}
      </Link>
      <h4>{cData.name}</h4>
    </div>
  );
}
