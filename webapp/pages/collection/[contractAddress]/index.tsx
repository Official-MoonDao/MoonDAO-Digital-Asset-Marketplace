import { MARKETPLACE_ADDRESS } from "../../../const/config";
import Image from "next/image";
import LogoSmall from "../../../assets/LogoSmall";

import {
  getAllValidAuctions,
  getAllValidListings,
  useAllAssets,
  useCollectionStats,
} from "../../../lib/marketplace-v3";
import AssetPreview from "../../../components/Collection/AssetPreview";
import { AuctionListing, DirectListing } from "../../../lib/utils";
import { useEffect, useState } from "react";
import { useContract, useMetadata } from "@thirdweb-dev/react";
import Skeleton from "../../../components/Skeleton/Skeleton";
import { getAllDetectedFeatureNames } from "@thirdweb-dev/sdk";
import Metadata from "../../../components/Metadata";

interface CollectionPageProps {
  contractAddress: string;
}

export default function CollectionPage({
  contractAddress,
}: CollectionPageProps) {
  //Marketplace data
  const { contract: marketplace } = useContract(MARKETPLACE_ADDRESS);
  const [validListings, setValidListings] = useState<DirectListing[]>([]);
  const [validAuctions, setValidAuctions] = useState<AuctionListing[]>([]);

  const assets = useAllAssets(validListings, validAuctions, contractAddress);

  //NFT Collection Data
  const [collectionType, setCollectionType] = useState<string>("");
  const { contract: collectionContract }: any = useContract(contractAddress);
  const { data: metadata } = useMetadata(collectionContract);

  const { floorPrice, listed, supply } = useCollectionStats(
    validListings,
    validAuctions,
    collectionContract
  );

  useEffect(() => {
    if (marketplace && collectionContract) {
      getAllValidListings(marketplace).then((listings: DirectListing[]) => {
        setValidListings(listings);
      });
      getAllValidAuctions(marketplace).then((auctions: AuctionListing[]) => {
        setValidAuctions(auctions);
      });

      //set collection type
      const extensions = getAllDetectedFeatureNames(collectionContract.abi);
      setCollectionType(extensions[0]);
    }
  }, [marketplace, collectionContract]);

  return (
    <main className="px-6 pt-10 md:pt-12 lg:pt-16 flex flex-col items-center w-full">
      <Metadata title={metadata?.name} description={metadata?.description} />
      {/*Collection title and data*/}
      <div className="flex flex-col items-center md:flex-row md:items-start md:gap-12 lg:gap-16 xl:gap-20">
        <div>
          {metadata ? (
            <Image
              width={285}
              height={285}
              className="border-4 p-2 rounded-full object-cover xl:w-[320px] xl:h-[320px]"
              src={metadata.image}
              alt="Collection thumbnail"
            />
          ) : (
            <Skeleton borderRadius="100%" width="285px" height="285px" />
          )}
        </div>
        <div className="mt-4 md:mt-0 xl:-mt-4">
          {/*Title */}
          <div className="mt-8 w-[320px] md:w-[420px] xl:w-[520px] ">
            {metadata ? (
              <h2 className="mt-8 font-GoodTimes text-2xl md:text-3xl xl:text-4xl  bg-clip-text text-transparent bg-gradient-to-b from-indigo-100 via-moon-orange to-moon-secondary">
                {metadata.name}
              </h2>
            ) : (
              <Skeleton />
            )}
          </div>

          {/*Data div */}
          <div className="mt-7 xl:mt-9 grid grid-cols-2 gap-3 text-sm xl:text-base w-[320px] xl:w-[400px]">
            <p className="w-[149px] xl:w-[189px] rounded-[3px] bg-[#301B3D] py-[6px] xl:py-2 px-[10px] xl:px-3 flex items-center justify-between">
              Floor{" "}
              <span className="flex items-center gap-[6px] max-w-[60px] xl:max-w-[90px] truncate">
                <LogoSmall size={{ width: 10.54, height: 11.07 }} />
                {/*Floor*/}
                {floorPrice}
              </span>
            </p>
            {/*Listings*/}
            <p className="w-[149px] xl:w-[189px] rounded-[3px] bg-[#301B3D] py-[6px] xl:py-2 px-[10px] xl:px-3 flex items-center justify-between">
              Listed{" "}
              <span className="max-w-[60px] truncate xl:max-w-[90px]">
                {listed}
              </span>
            </p>
            {/*Supply*/}
            {collectionType !== "ERC1155" && (
              <p className="w-[149px] xl:w-[189px] rounded-[3px] bg-[#301B3D] py-[6px] xl:py-2 px-[10px] xl:px-3 flex items-center justify-between">
                Supply{" "}
                <span className="max-w-[60px] truncate xl:max-w-[90px]">
                  {supply}
                </span>
              </p>
            )}
          </div>
          <div className="mt-8 xl:mt-9 max-w-[320px] xl:max-w-[420px]">
            {metadata ? (
              <p className=" xl:text-base xl:leading-loose text-sm font-light leading-relaxed">
                {metadata?.description}
              </p>
            ) : (
              <Skeleton width="320px" height="50px" />
            )}
          </div>
        </div>
      </div>
      {/*Grid with the collection's assets */}
      <div className="mt-20 md:mt-24 flex flex-col gap-10 md:grid md:grid-cols-2 md:grid-flow-row md:gap-12 xl:grid-cols-3 xl:gap-14">
        {assets[0] &&
          assets.map((a: DirectListing | AuctionListing, i: number) => (
            <div className="" key={`asset-${i}`}>
              <AssetPreview
                contractAddress={contractAddress}
                tokenId={a.tokenId}
                validListings={validListings}
                validAuctions={validAuctions}
              />
            </div>
          ))}
      </div>
    </main>
  );
}

export async function getServerSideProps({ params }: any) {
  const contractAddress = params?.contractAddress;
  if (!contractAddress) {
    return {
      notFound: true,
    };
  }
  return {
    props: { contractAddress },
  };
}
