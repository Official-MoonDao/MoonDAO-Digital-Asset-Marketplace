import { MARKETPLACE_ADDRESS } from "../../../const/config";
import Image from "next/image";
import LogoSmall from "../../../assets/LogoSmall";

import {
  getAllValidAuctions,
  getAllValidListings,
  useAllAssets,
} from "../../../lib/marketplace-v3";
import { initSDK } from "../../../lib/thirdweb";
import AssetPreview from "../../../components/Collection/AssetPreview";
import { AuctionListing, DirectListing } from "../../../lib/utils";
import { useEffect, useState } from "react";
import { useContract } from "@thirdweb-dev/react";

export default function Collection({ contractAddress }: any) {
  const { contract: marketplace } = useContract(MARKETPLACE_ADDRESS);

  const [validListings, setValidListings] = useState<DirectListing[]>([]);
  const [validAuctions, setValidAuctions] = useState<AuctionListing[]>([]);

  const assets = useAllAssets(validListings, validAuctions, contractAddress);

  useEffect(() => {
    if (marketplace) {
      getAllValidListings(marketplace).then((listings: DirectListing[]) => {
        setValidListings(listings);
      });
      getAllValidAuctions(marketplace).then((auctions: AuctionListing[]) => {
        setValidAuctions(auctions);
      });
    }
  }, [marketplace]);

  return (
    <main className="px-6 pt-10 md:pt-12 lg:pt-16 flex flex-col items-center w-full">
      {/*Collection title and data*/}
      <div className="flex flex-col items-center md:flex-row md:items-start md:gap-12 lg:gap-16 xl:gap-20">
        <div>
          <Image
            width={285}
            height={285}
            className="border p-2 rounded-full object-cover xl:w-[320px] xl:h-[320px]"
            src="/solanamonkey.png"
            alt="Collection thumbnail"
          />
        </div>
        <div className="mt-4 md:mt-0 xl:-mt-4">
          {/*Title */}
          <h2 className="mt-8 font-GoodTimes text-2xl w-[320px] md:text-3xl xl:text-4xl md:w-[420px] xl:w-[520px] bg-clip-text text-transparent bg-gradient-to-b from-indigo-100 via-moon-orange to-moon-secondary">
            Solana Monkeys
          </h2>

          {/*Data div */}
          <div className="mt-7 xl:mt-9 grid grid-cols-2 gap-3 text-sm xl:text-base w-[320px] xl:w-[400px]">
            <p className="w-[149px] xl:w-[189px] rounded-[3px] bg-[#301B3D] py-[6px] xl:py-2 px-[10px] xl:px-3 flex items-center justify-between">
              Floor{" "}
              <span className="flex items-center gap-[6px] max-w-[60px] xl:max-w-[90px] truncate">
                <LogoSmall size={{ width: 10.54, height: 11.07 }} />
                {/*Floor*/}
                10000
              </span>
            </p>
            <p className="w-[149px] xl:w-[189px] rounded-[3px] bg-[#301B3D] py-[6px] xl:py-2 px-[10px] xl:px-3 flex items-center justify-between">
              {/* Volume % change
            Will add conditional logic for styling in case of positive and negative values, fix possible truncation of %*/}
              Change{" "}
              <span className="text-green-600 max-w-[60px] truncate xl:max-w-[90px]">
                +230%
              </span>
            </p>
            {/*Listings*/}
            <p className="w-[149px] xl:w-[189px] rounded-[3px] bg-[#301B3D] py-[6px] xl:py-2 px-[10px] xl:px-3 flex items-center justify-between">
              Listed{" "}
              <span className="max-w-[60px] truncate xl:max-w-[90px]">274</span>
            </p>
            {/*Supply*/}
            <p className="w-[149px] xl:w-[189px] rounded-[3px] bg-[#301B3D] py-[6px] xl:py-2 px-[10px] xl:px-3 flex items-center justify-between">
              Supply{" "}
              <span className="max-w-[60px] truncate xl:max-w-[90px]">30k</span>
            </p>
          </div>

          <p className="mt-8 xl:mt-9 max-w-[320px] xl:max-w-[420px] xl:text-base xl:leading-loose text-sm font-light leading-relaxed">
            SMB is a collection of 5000 unique randomly generated SolanaMonkeys
            stored on the blockchain. With their accessibility-oriented design,
            the monkeys goal is to invade the Solana blockchain with as many
            individuals as possible, building a large community around them,
            supported by owner-exclusive advantages, a community wallet and a
            future voting system. Reject humanity, return to monke.
          </p>
          <div className="mt-7 flex items-center gap-4">
            <button className="rounded w-[141px] bg-moon-secondary py-[14px] font-bold hover:ring-1 ring-orange-400 transition-all duration-150">
              Buy
            </button>
            <button className="rounded w-[141px] bg-slate-900 py-[14px] border-[0.6px] border-gray-700 hover:ring-1 ring-indigo-800 transition-all duration-150">
              Sell
            </button>
          </div>
        </div>
      </div>
      {/*Grid with the collection's assets */}
      <div className="mt-20 md:mt-24 flex flex-col gap-10 md:grid md:grid-cols-2 md:grid-flow-row md:gap-12 xl:grid-cols-3 xl:gap-14">
        {assets[0] &&
          Array(6)
            .fill(assets[0])
            .map((a: DirectListing | AuctionListing, i: number) => (
              <div className="" key={`asset-${i}`}>
                <AssetPreview
                  contractAddress={contractAddress}
                  tokenId={a.tokenId}
                />
              </div>
            ))}
      </div>
    </main>
  );
}

export async function getServerSideProps({ params }: any) {
  const contractAddress = params?.contractAddress;
  return {
    props: { contractAddress },
  };
}
