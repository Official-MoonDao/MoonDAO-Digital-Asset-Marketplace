import { useAddress } from "@thirdweb-dev/react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Container from "../../components/Container/Container";
import Skeleton from "../../components/Skeleton/Skeleton";
import { MARKETPLACE_ADDRESS } from "../../const/config";
import styles from "../../styles/Profile.module.css";
import { GetServerSideProps } from "next";
import { initSDK } from "../../lib/thirdweb";
import {
  getAllAuctions,
  getAllValidListings,
  useListingsAndAuctionsForWallet,
} from "../../lib/marketplace-v3";
import ProfileListingGrid from "../../components/Profile/ProfileListingGrid";

export default function ProfilePage({
  validListings,
  allAuctions,
  walletAddress,
}: any) {
  const router = useRouter();
  const address = useAddress();
  const [userIsOwner, setUserIsOwner] = useState<boolean>(false);

  const { listings, auctions } = useListingsAndAuctionsForWallet(
    validListings,
    allAuctions,
    walletAddress
  );
  const [tab, setTab] = useState<"listings" | "auctions">("listings");

  useEffect(() => {
    if (address) {
      if (router.query && router.query.address?.toString() === address)
        setUserIsOwner(true);
    }
  }, [address, router]);

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
        <ProfileListingGrid listings={listings} />
      </div>

      <div
        className={`${
          tab === "auctions" ? styles.activeTabContent : styles.tabContent
        }`}
      >
        <ProfileListingGrid listings={auctions} type="auction" />
      </div>
    </Container>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const walletAddress = params?.address;
  const sdk = initSDK();
  const marketplace = await sdk.getContract(MARKETPLACE_ADDRESS);
  const validListings = await getAllValidListings(marketplace);
  const allAuctions = await getAllAuctions(marketplace);

  return {
    props: {
      validListings,
      allAuctions,
      walletAddress,
    },
  };
};
