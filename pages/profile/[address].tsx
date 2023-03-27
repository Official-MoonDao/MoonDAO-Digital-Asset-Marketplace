import {
  useActiveListings,
  useAddress,
  useContract,
  useListings,
} from "@thirdweb-dev/react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Container from "../../components/Container/Container";
import ListingGrid from "../../components/Listing/ListingGrid";
import Skeleton from "../../components/Skeleton/Skeleton";
import { MARKETPLACE_ADDRESS } from "../../const/contractAddresses";
import { getAllUserNFTs } from "../../lib/opensea";
import styles from "../../styles/Profile.module.css";
import randomColor from "../../util/randomColor";

const [randomColor1, randomColor2, randomColor3, randomColor4] = [
  randomColor(),
  randomColor(),
  randomColor(),
  randomColor(),
];

export default function ProfilePage() {
  const router = useRouter();
  const address = useAddress();
  const [tab, setTab] = useState<"listings" | "auctions">("listings");

  const { contract: marketplace } = useContract(
    MARKETPLACE_ADDRESS,
    "marketplace"
  );

  //get all user listings
  const { data: listings, isLoading: loadingListings } = useListings(
    marketplace,
    {
      seller: router.query.address as string,
    }
  );

  //get all user nfts from opensea
  const [userNFTs, setUserNFTs]: any = useState([{ metadata: {} }]);
  useEffect(() => {
    if (address) {
      (async () => {
        const userNFTs = await getAllUserNFTs(address);
        setUserNFTs(userNFTs);
      })();
      if (router.query && router.query.address?.toString() !== address)
        router.push(`/profile/${address}`);
    }
    console.log(listings);
  }, [address, listings, router]);

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
        {loadingListings ? (
          <p>Loading...</p>
        ) : listings && listings.length === 0 ? (
          <p>Nothing for sale yet! Head to the sell tab to list an NFT.</p>
        ) : (
          <ListingGrid listings={listings} />
        )}
      </div>

      <div
        className={`${
          tab === "auctions" ? styles.activeTabContent : styles.tabContent
        }`}
      >
        {loadingListings ? (
          <p>Loading...</p>
        ) : listings && listings.length === 0 ? (
          <p>Nothing for sale yet! Head to the sell tab to list an NFT.</p>
        ) : (
          <ListingGrid listings={listings} type="auction" />
        )}
      </div>
    </Container>
  );
}
