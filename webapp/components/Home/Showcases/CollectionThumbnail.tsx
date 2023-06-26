import {
  ThirdwebNftMedia,
  useContract,
  useMetadata,
} from "@thirdweb-dev/react";
import LogoSmall from "../../../assets/LogoSmall";
import { useCollectionStats } from "../../../lib/marketplace/hooks";
import Skeleton from "../../Layout/Skeleton";
import Link from "next/link";
import Image from "next/image";

export default function CollectionThumbnail({
  collection,
  validListings,
  validAuctions,
}: any) {
  const { contract: collectionContract } = useContract(
    collection.assetContract
  );
  const { data: metadata }: any = useMetadata(collectionContract);

  const { floorPrice } = useCollectionStats(
    validListings,
    validAuctions,
    collectionContract
  );

  if (!metadata) return <Skeleton width="335px" height="262px" />;
  return (
    <Link href={`/collection/${collection.assetContract}`}>
      <article className="flex items-center min-w-[300px] max-w-[345px] lg:w-full lg:max-w-none hover:lg:bg-gradient-to-br lg:hover:ring-2 ring-moon-white from-moon-gold via-moon-secondary to-moon-gold transition-all duration-150 lg:rounded-xl lg:pl-1 lg:pr-4 lg:py-2 xl:py-3">
        <div className="flex items-center gap-2 md:gap-3 lg:gap-6">
          <p className="font-bold text-lg">{metadata.id}</p>
          <ThirdwebNftMedia
            metadata={metadata}
            className="rounded-full object-cover"
            width="80px"
            height="80px"
          />
        </div>
        <div className="ml-4 md:ml-5 flex flex-col">
          <h6 className="font-bold lg:text-lg break-words">{metadata.name}</h6>
          <p className="mt-2 text-sm flex items-center">
            Floor{" "}
            <span className="ml-2 flex items-center gap-1">
              <LogoSmall size={{ width: 10.54, height: 11.07 }} />
              {floorPrice}
            </span>
          </p>
        </div>
      </article>
    </Link>
  );
}
