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
    collection?.assetContractAddress
  );
  const { data: metadata }: any = useMetadata(collectionContract);

  const { floorPrice } = useCollectionStats(
    validListings,
    validAuctions,
    collectionContract
  );

  return (
    <Link href={`/collection/${collection?.assetContractAddress}`}>
      {!metadata ? (
        <Skeleton width="335px" height="100px" />
      ) : (
        <article className="flex items-center w-[345px] lg:max-w-none hover:lg:bg-gradient-to-br lg:hover:ring-1 ring-moon-white from-moon-gold via-moon-secondary to-moon-gold transition-all duration-150 lg:rounded-xl lg:pl-2 lg:pr-4 lg:py-2 xl:py-3">
          <div className="">
            {/*<p className="font-bold text-lg">{metadata.id}</p>*/}
            <ThirdwebNftMedia
              metadata={metadata}
              className="rounded-full object-cover"
              width="80px"
              height="80px"
            />
          </div>
          <div className="ml-4 md:ml-5 flex flex-col">
            <h6 className="font-bold lg:text-lg break-words">
              {metadata.name}
            </h6>
            <p className="mt-2 text-sm flex items-center">
              Floor{" "}
              <span className="ml-2 flex items-center gap-1">
                <LogoSmall size={{ width: 10.54, height: 11.07 }} />
                {floorPrice}
              </span>
            </p>
          </div>
        </article>
      )}
    </Link>
  );
}
