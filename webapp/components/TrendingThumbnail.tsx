import { useContract, useNFT } from "@thirdweb-dev/react";
import LogoSmall from "../assets/LogoSmall";
import Skeleton from "./Skeleton/Skeleton";
import { useAssetStats } from "../lib/marketplace-v3";
import { NFT } from "@thirdweb-dev/sdk";
import Link from "next/link";
export default function TrendingThumbnail({
  asset,
  validListings,
  validAuctions,
}: any) {
  const { contract } = useContract(asset.assetContract);
  const { data: nft }: any = useNFT(contract, asset.tokenId);

  const { floorPrice, owners } = useAssetStats(
    validListings,
    validAuctions,
    asset?.assetContract,
    asset?.tokenId
  );

  if (!nft) return <Skeleton width="335px" height="162px" />;

  return (
    <article className="relative group overflow-hidden">
      {/*Stamps to cut corners*/}
      <div className="bg-[#251d2e] h-[40px] w-[100px] z-50 rotate-[-32.17deg] absolute -left-8 -top-3"></div>
      <div className="bg-[#251d2e] h-[40px] w-[100px] z-50 rotate-[-32.17deg] absolute -right-8 -bottom-3"></div>
      {/*Image container to create zoom effect*/}
      <div className="w-[335px] h-[275px] overflow-hidden">
        <img
          className="object-cover object-center group-hover:scale-110 transition-all duration-200"
          src={nft.metadata.image}
          alt={`${nft.metadata.name} image.`}
        />
      </div>
      {/*Card with Asset data*/}
      <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 relative z-10 bg-opacity-10 w-[335px] h-[162px] flex justify-between">
        <div className="pl-6 mt-5 flex flex-col items-start">
          <h6 className="text-lg font-bold">{nft.metadata.name}</h6>
          <p className="mt-1 text-sm opacity-60 blend">{owners} owners</p>
          <p className="text-sm mt-5 opacity-70">Floor Price</p>
          <span className="flex items-center gap-2">
            <LogoSmall size={{ width: 10.54, height: 11.07 }} />
            {floorPrice}
          </span>
        </div>
        <div className="mt-5  pr-6 flex flex-col items-end">
          <p className="font-bold text-lg">#{nft.metadata.id}</p>
          <button className="mt-[50px] text-xs border-[0.5px] px-[10px] py-[6px] rounded-xl hover:bg-slate-900">
            <Link href={`/collection/${asset.assetContract}/${asset.tokenId}`}>
              Details
            </Link>
          </button>
        </div>
      </div>
    </article>
  );
}
