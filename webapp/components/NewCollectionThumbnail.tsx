import { useContract, useMetadata } from "@thirdweb-dev/react";
import LogoSmall from "../assets/LogoSmall";
import { useCollectionStats } from "../lib/marketplace-v3";
import Skeleton from "./Skeleton/Skeleton";

export default function NewCollectionThumbnail({
  collection,
  validListings,
  validAuctions,
}: any) {
  const { contract: collectionContract } = useContract(
    collection?.assetContract
  );
  const { data: metadata } = useMetadata(collectionContract);

  const { floorPrice } = useCollectionStats(
    validListings,
    validAuctions,
    collection?.assetContract
  );

  if (!metadata) return <Skeleton width="335px" height="162px" />;
  return (
    <article className="relative flex flex-col group items-center hover:scale-[1.035] group transition-all duration-150">
      {/*Here goes the collection link*/}
      <a href="">
        <img
          className="z-10 w-[300px] h-[235px] object-cover rounded-t-[6px] rounded-b-[15px] group-hover:ring ring-indigo-200"
          src={metadata.image}
          alt={`${metadata.name} collection thumbnail`}
        />
        <div className="-mt-3 border border-stone-900 group-hover:border-stone-600 w-[300px] h-[100px] flex flex-col items-center text-center rounded-md">
          <h6 className="mt-7 tracking-widest group-hover:text-indigo-400">
            {metadata.name}
          </h6>

          <p className="mt-[7px] text-sm flex items-center">
            <span className="opacity-60">Floor</span>
            <span className="ml-[14px] flex items-center gap-[6px]">
              <LogoSmall size={{ height: 11.07, width: 10.54 }} />
              {floorPrice}
            </span>
          </p>
        </div>
      </a>
    </article>
  );
}
