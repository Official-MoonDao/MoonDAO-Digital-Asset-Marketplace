import { MOONEY_DECIMALS } from "../../const/config";
import styles from "./NFT.module.css";

interface ListingProps {
  type: "direct" | "auction";
  listing: any;
  setCurrListing: Function;
}

export default function Listing({
  type = "direct",
  listing,
  setCurrListing,
}: ListingProps) {
  const listingId = type === "direct" ? listing?.listingId : listing?.auctionId;
  const sellerAddress = listing.seller;
  const buyOut =
    type === "direct" ? listing.pricePerToken : listing.buyoutBidAmount;
  const minBid = type === "direct" ? 0 : listing.minimumBidAmount;
  const end = listing.endTimestamp;
  if (!listingId) return <></>;
  return (
    <div
      className={"flex flex-col"}
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
          <p className={styles.nftPrice}>{+buyOut / MOONEY_DECIMALS}</p>
        </div>
      </div>

      <div className={styles.priceContainer}>
        {type === "auction" && (
          <>
            <div>
              <p className={styles.nftPriceLabel}>{"Min Bid"}</p>
              <p className={styles.nftPrice}>{+minBid / MOONEY_DECIMALS}</p>
            </div>
          </>
        )}
        <div>
          <p className={styles.nftPriceLabel}>{"Expiration"}</p>
          <p className={styles.nftPrice}>
            {new Date(+end * 1000).toLocaleDateString() +
              " @ " +
              new Date(+end * 1000).toLocaleTimeString()}
          </p>
        </div>
      </div>
    </div>
  );
}
