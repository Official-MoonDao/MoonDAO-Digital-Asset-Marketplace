import { useContract, useMetadata } from "@thirdweb-dev/react";
import LogoSmall from "../assets/LogoSmall";
import { useCollectionStats } from "../lib/marketplace-v3";
import Skeleton from "./Skeleton/Skeleton";

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
    collection.assetContract
  );

  if (!metadata) return <Skeleton width="335px" height="162px" />;
  return (
    <a href={`/collection/${collection.assetContract}`}>
      {/*Collection link goes on top*/}
      <article className="flex items-center lg:hover:bg-gradient-to-br hover:ring-2 ring-white from-main-background via-indigo-900 to-main-background transition-all duration-150 lg:rounded-xl lg:px-3 lg:py-2 xl:py-3 xl:px-4">
        <div className="flex items-center gap-2 md:gap-3 lg:gap-6">
          <p className="font-bold text-lg">{metadata.id}</p>
          <img
            src={metadata.image}
            alt={`${metadata.name} collection image`}
            className="w-20 h-20 rounded-full object-cover"
          />
        </div>
        <div className="ml-2 md:ml-4 flex flex-col">
          <h6 className="font-bold lg:text-lg">{metadata.name}</h6>
          <p className="mt-2 text-sm flex items-center">
            Floor{" "}
            <span className="ml-2 flex items-center gap-1">
              <LogoSmall size={{ width: 10.54, height: 11.07 }} />
              {floorPrice}
            </span>
          </p>
        </div>
        {/* <div className="ml-3 md:ml-7 lg:ml-14 flex flex-col items-end">
          <p className={`${change < 0 ? "text-amber-600" : "text-emerald-500"} text-lg font-bold blur-[0.6px]`}>
            {change < 0 ? "" : "+"}
            {change}%
          </p>
          <p className="mt-2 text-sm flex items-center gap-1">
            <LogoSmall size={{ width: 10.54, height: 11.07 }} /> {volume}k
          </p>
        </div> */}
      </article>
    </a>
  );
}
