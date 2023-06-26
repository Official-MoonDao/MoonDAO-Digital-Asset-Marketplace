import { useAddress, useContract } from "@thirdweb-dev/react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Skeleton from "../../components/Layout/Skeleton";
import { MARKETPLACE_ADDRESS } from "../../const/config";
import { GetServerSideProps } from "next";
import { useListingsByWallet } from "../../lib/marketplace/hooks";
import {
  getAllAuctions,
  getAllValidListings,
} from "../../lib/marketplace/marketplace-listings";
import ProfileListingGrid from "../../components/Profile/ProfileListingGrid";
import {
  AuctionListing,
  DirectListing,
} from "../../lib/marketplace/marketplace-utils";
import { Canvas } from "@react-three/fiber";
import ThreeText from "../../components/r3f/ThreeText";
import BannerScene from "../../components/r3f/Profile/BannerScene";

type ProfilePageProps = {
  walletAddress: string;
};

export default function ProfilePage({ walletAddress }: ProfilePageProps) {
  const router = useRouter();
  const address = useAddress();

  const { contract: marketplace } = useContract(
    MARKETPLACE_ADDRESS,
    "marketplace-v3"
  );
  const [loadingListings, setLoadingListings] = useState<boolean>(true);
  const [validListings, setValidListings] = useState<DirectListing[]>([]);
  const [validAuctions, setValidAuctions] = useState<AuctionListing[]>([]);

  const { listings, auctions } = useListingsByWallet(
    validListings,
    validAuctions,
    walletAddress
  );
  const [tab, setTab] = useState<"listings" | "auctions">("listings");

  useEffect(() => {
    if (marketplace) {
      getAllValidListings(marketplace).then((listings: DirectListing[]) => {
        setValidListings(listings);
        setLoadingListings(false);
      });
      getAllAuctions(marketplace).then((auctions: AuctionListing[]) => {
        setValidAuctions(auctions);
        setLoadingListings(false);
      });
    }
  }, [marketplace]);
  return (
    <main className="w-full ml-auto mr-auto px-4 mt-24 max-w-[1200px]">
      <div>
        <div className="flex justify-center items-center w-full bg-[#272a2d] h-[300px] rounded-tl-[30px] rounded-br-[30px] bg-gradient-to-br from-moon-secondary via-indigo-900 to-moon-secondary">
          <Canvas flat className="w-full">
            <BannerScene walletAddress={walletAddress} />
          </Canvas>
        </div>
      </div>

      <div className="w-full flex justify-start border-b-[1px] border-white border-opacity-60 my-4">
        <h3
          className={`p-4 text-base font-semibold cursor-pointer transition-all duration-100 ease-in-out hover:text-[#e9e9f9]
        ${
          tab === "listings"
            ? "text-moon-gold border-b-moon-gold border-b-2"
            : "text-white text-opacity-60"
        }`}
          onClick={() => setTab("listings")}
        >
          Listings
        </h3>
        <h3
          className={` p-4 text-base font-semibold cursor-pointer transition-all duration-100 ease-in-out hover:text-[#e9e9f9]
        ${
          tab === "auctions"
            ? "text-moon-gold border-b-moon-gold border-b-2"
            : "text-white text-opacity-60"
        }`}
          onClick={() => setTab("auctions")}
        >
          Auctions
        </h3>
      </div>

      <div
        className={`${
          tab === "listings"
            ? "flex opacity-100"
            : "hidden h-0 opacity-0 transition-all duration-100"
        }`}
      >
        {marketplace && !loadingListings ? (
          <ProfileListingGrid listings={listings} />
        ) : (
          <Skeleton />
        )}
      </div>

      <div
        className={`${
          tab === "auctions"
            ? "flex opacity-100"
            : "hidden h-0 opacity-0 transition-all duration-100"
        }`}
      >
        {marketplace && !loadingListings ? (
          <ProfileListingGrid listings={auctions} type="auction" />
        ) : (
          <Skeleton />
        )}
      </div>
    </main>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const walletAddress = params?.address;
  return {
    props: {
      walletAddress,
    },
  };
};
