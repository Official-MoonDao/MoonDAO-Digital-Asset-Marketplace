import { MOONEY_DECIMALS } from "../../const/config";
import styles from "./NFT.module.css";

interface ListingProps {
  type: "direct" | "auction";
  listing: any;
  setCurrListing: Function;
}

export default function Listing({ type = "direct", listing, setCurrListing }: ListingProps) {
  const listingId = type === "direct" ? listing?.listingId : listing?.auctionId;
  const sellerAddress = listing.seller;
  const buyOut = type === "direct" ? listing.pricePerToken : listing.buyoutBidAmount;
  const minBid = type === "direct" ? 0 : listing.minimumBidAmount;
  const end = listing.endTimestamp;

  if (!listingId) return <></>;

  return (
    <div className={"flex flex-col mt-1"} onClick={() => setCurrListing({ type, listing })}>
      <div className="flex w-full gap-2 justify-between items-center  min-h-[52px]">
        {/*Seller*/}
        <div>
          <p className="truncate w-full text-sm leading-5 font-medium text-white text-opacity-60">Seller</p>
          <p className="mt-1">{sellerAddress.slice(0, 6) + "..." + sellerAddress.slice(-4)}</p>
        </div>
        {/*Price*/}
        <div className="text-right tracking-wide">
          <p className="truncate w-full text-sm leading-5 font-medium text-moon-gold text-opacity-80">{"Price (MOONEY)"}</p>
          <p className="mt-1">{+buyOut / MOONEY_DECIMALS}</p>
        </div>
      </div>

      <div className="flex mt-4 w-full gap-2 justify-between items-center min-h-[52px]">
        {/*Bid*/}
        {type === "auction" ? (
          <div className="">
            <p className="truncate w-full text-sm text-moon-gold leading-5 font-medium text-opacity-80">{"Min Bid"}</p>
            <p>{+minBid / MOONEY_DECIMALS}</p>
          </div>
        ) : (
          <div>{/*Important empty div as forces expiration to stick to left even if not auction*/}</div>
        )}
        {/*Expiration*/}
        <div className="text-right">
          <p className="truncate w-full text-sm leading-5 font-medium text-white text-opacity-60">{"Expiration"}</p>
          <p className="mt-1">{new Date(+end * 1000).toLocaleDateString() + " @ " + new Date(+end * 1000).toLocaleTimeString()}</p>
        </div>
      </div>
    </div>
  );
}
