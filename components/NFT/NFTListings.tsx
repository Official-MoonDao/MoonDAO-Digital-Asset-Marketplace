import { useEffect, useRef, useState } from "react";
import styles from "./NFT.module.css";
import { BigConvert } from "../../lib/utils";
import { MOONEY_DECIMALS } from "../../const/config";
import { ThirdwebNftMedia } from "@thirdweb-dev/react";

/*
Listing Data Structure

  0: listingId : BigNumber
  1: listingCreator : string
  2: assetContract : string
  3: tokenId : BigNumber
  4: quantity : BigNumber
  5: currency : string
  6: pricePerToken : BigNumber
  7: startTimestamp : BigNumber
  8: endTimestamp : BigNumber
  9: reserved : boolean
  10: tokenType : number
  11: status : number

Auction Data Structure

  0: auctionId : BigNumber
  1: auctionCreator : string
  2: assetContract : string
  3: tokenId : BigNumber
  4: quantity : BigNumber
  5: currency : string
  6: minimumBidAmount: BigNumber
  7: buyoutBidAmount: BigNumber
  8: timeBufferInSeconds: BigNumber
  9: bidBufferBps: BigNumber
  10: startTimestamp : BigNumber
  11: endTimestamp : BigNumber
  12: tokenType : number
  13: status : number
*/

export default function NFTListings({ listings, auctions, nft }: any) {
  const [selected, setSelected] = useState({ type: "", listingId: "" });
  const listingContainerRef: any = useRef();

  if (!listings || !auctions || !nft) return <div></div>;

  function Listing({ listing, type = "direct" }: any) {
    if (!listing) return <></>;
    const buyOut = type === "direct" ? listing[6] : listing[7];
    const minBid = type === "direct" ? 0 : listing[6];
    const end = type === "direct" ? listing[8] : listing[11];
    const sellerAddress = listing[1];
    console.log(end);
    return (
      <div
        className={`flex flex-col gap-[5%] bg-[#1c1c1f] ${
          selected.listingId === BigConvert(listing[0]) &&
          selected.type === type &&
          "bg-[black]"
        }`}
        onClick={() => {
          setSelected({ type, listingId: BigConvert(listing[0]) });
        }}
      >
        <div className={"flex flex-col md:flex-row"}>
          <div className={styles.nftPriceContainer}>
            <div>
              <p className={styles.nftPriceLabel}>Seller</p>
              <p className={styles.nftPriceValue}>
                {sellerAddress.slice(0, 6) + "..." + sellerAddress.slice(-4)}
              </p>
            </div>
          </div>
          <div className={styles.nftPriceContainer}>
            <div>
              <p className={styles.nftPriceLabel}>Expiration</p>
              <p className={styles.nftPriceValue}>
                {type === "direct"
                  ? "None"
                  : new Date(+BigConvert(end.hex * 1000)).toLocaleDateString() +
                    " " +
                    new Date(+BigConvert(end.hex * 1000)).toLocaleTimeString()}
              </p>
            </div>
          </div>
          <div className={styles.nftPriceContainer}>
            <div>
              <p className={styles.nftPriceLabel}>Price</p>
              <p className={styles.nftPriceValue}>
                {+BigConvert(buyOut) / MOONEY_DECIMALS}
              </p>
            </div>
          </div>
          {type === "auction" && (
            <div className={styles.nftPriceContainer}>
              <div>
                <p className={styles.nftPriceLabel}>Minimum Bid</p>
                <p className={styles.nftPriceValue}>
                  {+BigConvert(minBid) / MOONEY_DECIMALS}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      ref={listingContainerRef}
      className="flex flex-col items-center gap-2 bg-[grey] min-h-[50vh] rounded-md"
    >
      <h3>Direct Listings</h3>
      <div className="flex flex-col w-full">
        {nft?.metadata.type === "ERC721" || auctions.length < 2 ? (
          <Listing listing={listings[0]} />
        ) : (
          listings.map((l: any, i: any) => (
            <div key={"direct-listing" + i}>
              <Listing listing={listings[0]} />
            </div>
          ))
        )}
      </div>

      <h3>Auctions</h3>
      <div className="flex flex-col w-full">
        {nft?.metadata.type === "ERC721" || auctions.length < 2 ? (
          <Listing listing={auctions[0]} type="auction" />
        ) : (
          auctions.map((a: any) => (
            <div key={"auction-listing" + i}>
              <Listing listing={auctions[0]} type="auction" />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
