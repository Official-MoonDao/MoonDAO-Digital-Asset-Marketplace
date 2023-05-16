import { MOONEY_DECIMALS } from "../../const/config";
import { BigConvert } from "../../lib/utils";
import styles from "./NFT.module.css";

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

export default function Listing({
  type = "direct",
  listing,
  setCurrListing,
}: any) {
  const listingId = listing[0];
  const sellerAddress = listing[1];
  const buyOut = type === "direct" ? listing[6] : listing[7];
  const minBid = type === "direct" ? 0 : listing[6];
  const end = type === "direct" ? listing[8] : listing[11];
  if (!listingId) return <></>;
  return (
    <div
      className="flex flex-col"
      onClick={() => setCurrListing({ type, listing })}
    >
      <div className={styles.priceContainer}>
        <div>
          <p className={styles.nftPriceLabel}>Seller</p>
          <p className={styles.nftPrice}>
            {sellerAddress.slice(0, 6) + "..." + sellerAddress.slice(-4)}
          </p>
        </div>
        <div>
          <p className={styles.nftPriceLabel}>{"Price (MOONEY)"}</p>
          <p className={styles.nftPrice}>
            {+BigConvert(buyOut) / MOONEY_DECIMALS}
          </p>
        </div>
      </div>

      <div className={styles.priceContainer}>
        {type === "auction" && (
          <div>
            <p className={styles.nftPriceLabel}>{"Min Bid"}</p>
            <p className={styles.nftPrice}>
              {+BigConvert(minBid) / MOONEY_DECIMALS}
            </p>
          </div>
        )}
        <div>
          <p className={styles.nftPriceLabel}>{"Expiration"}</p>
          <p className={styles.nftPrice}>
            {new Date(+BigConvert(end) * 1000).toLocaleDateString() +
              " @ " +
              new Date(+BigConvert(end) * 1000).toLocaleTimeString()}
          </p>
        </div>
      </div>
    </div>
  );
}
