import { useAddress, useContract } from "@thirdweb-dev/react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Container from "../../components/Container/Container";
import Skeleton from "../../components/Skeleton/Skeleton";
import { MARKETPLACE_ADDRESS } from "../../const/config";
import styles from "../../styles/Profile.module.css";
import { GetServerSideProps } from "next";
import {
  getAllAuctions,
  getAllValidListings,
  useListingsAndAuctionsForWallet,
} from "../../lib/marketplace-v3";
import ProfileListingGrid from "../../components/Profile/ProfileListingGrid";
import { AuctionListing, DirectListing } from "../../lib/utils";

export default function ProfilePage({ walletAddress }: any) {
  const router = useRouter();
  const address = useAddress();
  const [userIsOwner, setUserIsOwner] = useState<boolean>(true);

  const { contract: marketplace } = useContract(
    MARKETPLACE_ADDRESS,
    "marketplace-v3"
  );
  const [loadingListings, setLoadingListings] = useState<boolean>(true);
  const [validListings, setValidListings] = useState<DirectListing[]>([]);
  const [validAuctions, setValidAuctions] = useState<AuctionListing[]>([]);

  const { listings, auctions } = useListingsAndAuctionsForWallet(
    validListings,
    validAuctions,
    walletAddress
  );
  const [tab, setTab] = useState<"listings" | "auctions">("listings");

  useEffect(() => {
    if (address) {
      if (router.query && router.query.address?.toString() === address)
        setUserIsOwner(true);
    }
  }, [address, router]);

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
    <Container maxWidth="lg" className="">
      <div className={styles.profileHeader}>
        <div
          className={styles.coverImage}
          style={{
            background: `linear-gradient(-45deg, #${walletAddress?.slice(
              -12,
              -6
            )}, #${walletAddress?.slice(6, 12)})`,
          }}
        />
        <div
          className={styles.profilePicture}
          style={{
            background: `linear-gradient(180deg, #${walletAddress?.slice(
              6,
              12
            )}, #${walletAddress?.slice(-6)})`,
          }}
        />
        <h1 className={styles.profileName}>
          {router.query.address ? (
            router.query.address.toString().substring(0, 4) +
            "..." +
            router.query.address.toString().substring(38, 42)
          ) : (
            <Skeleton width="320" />
          )}
        </h1>
      </div>

      <div className={styles.tabs}>
        <h3
          className={`${styles.tab} 
        ${tab === "listings" ? styles.activeTab : ""}`}
          onClick={() => setTab("listings")}
        >
          Listings
        </h3>
        <h3
          className={`${styles.tab}
        ${tab === "auctions" ? styles.activeTab : ""}`}
          onClick={() => setTab("auctions")}
        >
          Auctions
        </h3>
      </div>

      <div
        className={`${
          tab === "listings" ? styles.activeTabContent : styles.tabContent
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
          tab === "auctions" ? styles.activeTabContent : styles.tabContent
        }`}
      >
        {marketplace && !loadingListings ? (
          <ProfileListingGrid listings={auctions} type="auction" />
        ) : (
          <Skeleton />
        )}
      </div>
    </Container>
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
