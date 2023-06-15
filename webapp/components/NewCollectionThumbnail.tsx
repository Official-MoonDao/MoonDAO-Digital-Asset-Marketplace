import { useContract, useMetadata } from "@thirdweb-dev/react";
import LogoSmall from "../assets/LogoSmall";
import { useCollectionStats } from "../lib/marketplace-v3";
import randomColor from "../util/randomColor";
import Skeleton from "./Skeleton/Skeleton";
import Link from "next/link";
import Image from "next/image";

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
    collectionContract
  );
  if (!metadata) return <Skeleton width="335px" height="262px" />;
  return (
    <article className="relative flex flex-col group items-center hover:scale-[1.035] group transition-all duration-150">
      <Link
        className="flex flex-col group items-center"
        href={`/collection/${collection.assetContract}`}
      >
        {metadata?.image ? (
          <Image
            className="z-10 w-[300px] h-[235px] object-cover rounded-t-[6px] rounded-b-[15px] group-hover:ring ring-indigo-200"
            src={metadata.image}
            width={300}
            height={235}
            alt={`${metadata.name} collection thumbnail`}
          />
        ) : (
          <div
            className="z-10 w-[300px] h-[235px] object-cover rounded-t-[6px] rounded-b-[15px] group-hover:ring ring-indigo-200"
            style={{
              backgroundImage: `linear-gradient(90deg, ${randomColor()}, ${randomColor()})`,
            }}
          />
        )}

        <div className="-mt-3 border bg-gradient-to-br from-black via-slate-900 to-black border-yellow-200 group-hover:border-moon-gold shadow shadow-moon-white w-[300px] lg:w-[350px] h-[100px] flex flex-col items-center text-center rounded-md">
          <h6 className="mt-7 tracking-widest text-indigo-100 group-hover:text-white max-w-[250px] lg:max-w-[320px] text-center truncate">
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
      </Link>
    </article>
  );
}
