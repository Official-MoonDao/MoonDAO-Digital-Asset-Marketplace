import {
  ThirdwebNftMedia,
  useActiveListings,
  useAddress,
  useContract,
  useOwnedNFTs,
  useValidDirectListings,
  useValidEnglishAuctions,
} from "@thirdweb-dev/react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Container from "../../components/Container/Container";
import ListingWrapper from "../../components/Listing/ListingWrapper";
import NFTGrid from "../../components/NFT/NFTGrid";
import Skeleton from "../../components/Skeleton/Skeleton";
import {
  MARKETPLACE_ADDRESS,
  NFT_COLLECTION_ADDRESS,
} from "../../const/contractAddresses";
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
  const [tab, setTab] = useState<"nfts" | "listings" | "auctions">("nfts");
  const { contract: nftCollection } = useContract(NFT_COLLECTION_ADDRESS);

  const { contract: marketplace } = useContract(
    MARKETPLACE_ADDRESS,
    "marketplace"
  );

  //get all user listings
  const { data: listings, isLoading: loadingListings } = useActiveListings(
    marketplace,
    {
      seller: router.query.address as string,
    }
  );

  //get all user nfts from opensea
  const [userNFTs, setUserNFTs]: any = useState([{ metadata: {} }]);
  useEffect(() => {
    if (address)
      (async () => {
        await getAllUserNFTs(address, (nfts: [any]) => setUserNFTs(nfts));
        console.log(userNFTs);
      })();
    console.log(listings);
  }, [address, listings]);

  return (
    <Container maxWidth="lg">
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
        ${tab === "nfts" ? styles.activeTab : ""}`}
          onClick={() => setTab("nfts")}
        >
          NFTs
        </h3>
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
          tab === "nfts" ? styles.activeTabContent : styles.tabContent
        }`}
      >
        <div className="flex flex-wrap gap-[5%] mt-[5%]">
          {userNFTs[0]?.metadata?.id &&
            userNFTs.map((nft: any, i: number) => (
              <div
                className="hover:translate-y-[-4%] duration-300 ease-in my-[2.5%] "
                key={`userNFT-${i}`}
                onClick={() =>
                  router.push(
                    `/collection/${nft.metadata.asset_contract.address}/${nft.metadata.token_id}`
                  )
                }
              >
                <ThirdwebNftMedia
                  className="rounded-md hover:drop-shadow-[0_10px_20px_#d1d1d1] ease-in duration-300"
                  metadata={nft?.metadata}
                />
              </div>
            ))}
        </div>
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
          <div className="flex flex-col gap-2 w-full min-h-[65vh]">
            {listings?.map((listing, i) => (
              <div
                className="flex justify-center items-left my-2 p-4 py-8 rounded-2xl bg-[#d1d1d150]"
                key={`listing-${i}`}
              >
                {listing.type === 0 ? (
                  <div className="flex flex-col">
                    <div>
                      <h4>{listing.asset.name}</h4>
                    </div>
                    <h4>
                      {listing.buyoutCurrencyValuePerToken.displayValue +
                        " MOONEY"}
                    </h4>
                    <h4>{listing.quantity.toString()}</h4>
                  </div>
                ) : (
                  <>
                    <h4>{listing.asset.name}</h4>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* <div
        className={`${
          tab === "auctions" ? styles.activeTabContent : styles.tabContent
        }`}
      >
        {loadingAuctions ? (
          <p>Loading...</p>
        ) : auctionListings && auctionListings.length === 0 ? (
          <p>Nothing for sale yet! Head to the sell tab to list an NFT.</p>
        ) : (
          auctionListings?.map((listing) => (
            <ListingWrapper listing={listing} key={listing.id} />
          ))
        )}
      </div> */}
    </Container>
  );
}
