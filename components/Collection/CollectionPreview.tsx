import {
  MediaRenderer,
  ThirdwebNftMedia,
  useContract,
  useMetadata,
} from "@thirdweb-dev/react";
import Image from "next/image";
import Link from "next/link";
import buyStyles from "../../styles/Buy.module.css";
import styles from "../NFT/NFT.module.css";
import Skeleton from "../Skeleton/Skeleton";
export default function CollectionPreview({ collection }: any) {
  const { contract } = useContract(collection.address);
  const { data: metadata, isLoading } = useMetadata(contract);

  return (
    <div className={buyStyles.nftContainer}>
      {isLoading ? (
        <Skeleton width={"100%"} height="200px" />
      ) : (
        <Link href={`/token/${collection.address}`}>
          <Image
            src={metadata?.image}
            width={200}
            height={200}
            alt=""
            style={{ width: "100%", borderRadius: "30px" }}
          />
        </Link>
      )}
      <h4>{metadata?.name}</h4>
    </div>
  );
}
