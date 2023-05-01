import { useAddress } from "@thirdweb-dev/react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Container from "../../components/Container/Container";
import Skeleton from "../../components/Skeleton/Skeleton";
import { MARKETPLACE_ADDRESS } from "../../const/config";
import { getAllUserNFTs } from "../../lib/opensea";
import styles from "../../styles/Profile.module.css";
import randomColor from "../../util/randomColor";
import { GetServerSideProps } from "next";
import { initSDK } from "../../lib/thirdweb";
import {
  getAllValidAuctions,
  getAllValidListings,
  useProfileListingsAndAuctions,
} from "../../lib/marketplace-v3";
import ProfileListingGrid from "../../components/Profile/ProfileListingGrid";

const [randomColor1, randomColor2, randomColor3, randomColor4] = [
  randomColor(),
  randomColor(),
  randomColor(),
  randomColor(),
];

export default function ProfilePage({
  validListings,
  validAuctions,
  walletAddress,
}: any) {
  const router = useRouter();
  const address: any = useAddress();
  const { listings, auctions } = useProfileListingsAndAuctions(
    validListings,
    validAuctions,
    walletAddress
  );
  const [tab, setTab] = useState<"listings" | "auctions">("listings");

  //get all user nfts from opensea
  const [userNFTs, setUserNFTs]: any = useState([{ metadata: {} }]);
  useEffect(() => {
    console.log(listings, auctions);
  }, [listings, auctions]);
  useEffect(() => {
    if (address) {
      (async () => {
        const userNFTs = await getAllUserNFTs(address);
        setUserNFTs(userNFTs);
      })();
      if (router.query && router.query.address?.toString() !== address)
        router.push(`/profile/${address}`);
    }
  }, [address, router]);

  return (
    <Container maxWidth="lg" className="">
      <div className={styles.profileHeader}>
        <div
          className={styles.coverImage}
          style={{
            background: `linear-gradient(90deg, ${randomColor1}, ${randomColor2})`,
          }}
        />
        <div
          className={styles.profilePicture}
          style={{
            background: `linear-gradient(90deg, ${randomColor3}, ${randomColor4})`,
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
        {listings && listings.length === 0 ? (
          <p>Nothing for sale yet! Head to the sell tab to list an NFT.</p>
        ) : (
          <ProfileListingGrid listings={listings} />
        )}
      </div>

      <div
        className={`${
          tab === "auctions" ? styles.activeTabContent : styles.tabContent
        }`}
      >
        {auctions && auctions.length === 0 ? (
          <p>Nothing for sale yet! Head to the sell tab to list an NFT.</p>
        ) : (
          <ProfileListingGrid listings={auctions} type="auction" />
        )}
      </div>
    </Container>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const walletAddress = params?.address;
  const sdk = initSDK();
  const marketplace = await sdk.getContract(MARKETPLACE_ADDRESS);
  const validListings = await getAllValidListings(marketplace);
  const validAuctions = await getAllValidAuctions(marketplace);

  return {
    props: {
      validListings,
      validAuctions,
      walletAddress,
    },
  };
};
