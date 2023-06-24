import { useContract, useNFT } from "@thirdweb-dev/react";
import LogoSmall from "../../assets/LogoSmall";
import { useRouter } from "next/router";
import { useAssetStats } from "../../lib/marketplace-v3";
import Skeleton from "../Skeleton/Skeleton";
import Image from "next/image";
export default function AssetPreview({ contractAddress, tokenId, validListings, validAuctions }: any) {
  const { contract } = useContract(contractAddress);
  const { data: nft, isLoading, error } = useNFT(contract, tokenId);
  const router = useRouter();
  const { floorPrice, listed, supply } = useAssetStats(
    validListings,
    validAuctions,
    contractAddress,
    tokenId
  );

  if (isLoading) return <Skeleton width="335px" height="282px" />;
  if (error || !nft) return <div>NFT not found!</div>;

  return (
    <article className="relative group overflow-hidden">
      {/*Stamps to cut corners*/}
      <div className="bg-main-background h-[40px] w-[100px] z-50 rotate-[-32.17deg] absolute -left-8 -top-3"></div>
      <div className="bg-main-background h-[40px] w-[100px] z-50 rotate-[-32.17deg] absolute -right-8 -bottom-3"></div>
      {/*Image container to create zoom effect*/}
      <div className="w-[335px] h-[275px] overflow-hidden">
        <button onClick={() => router.push(`/collection/${contractAddress}/${tokenId}`)}>
          <Image
            className="object-cover w-[335px] h-[275px] object-center group-hover:scale-110 transition-all duration-200"
            src={`${nft.metadata.image}`}
            alt={`${nft.metadata.name} image.`}
            width={335}
            height={275}
          />
        </button>
      </div>
      {/*Card with Asset data*/}
      <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 relative z-10 bg-opacity-10 w-[335px] h-[162px] flex justify-between">
        <div className="pl-6 mt-5 flex flex-col items-start">
          <h6 className="text-lg font-bold">{nft.metadata.name}</h6>
          {/*Price*/}
          <p className="mt-11 text-xl flex items-center gap-3 truncate">
            <LogoSmall size={{ width: 24.54, height: 24.07 }} />
            {floorPrice && floorPrice.toString().length < 9
              ? floorPrice
              : floorPrice?.toString().slice(0, 7) + "..."}
          </p>
        </div>
        <div className="mt-5 pr-9 flex flex-col items-end">
          <p className="font-bold text-xl">#{nft.metadata.id}</p>
          <button
            onClick={() => router.push(`/collection/${contractAddress}/${tokenId}`)}
            className="mt-10 border-[0.5px] hover:scale-105 px-[10px] py-[6px] rounded transition-all duration-150 bg-slate-900 hover:bg-indigo-700"
          >
            <a>Buy now</a>
          </button>
        </div>
      </div>
    </article>
  );
}
