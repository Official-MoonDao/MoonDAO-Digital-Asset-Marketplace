import {
  ThirdwebNftMedia,
  useContract,
  useValidDirectListings,
  useValidEnglishAuctions,
} from "@thirdweb-dev/react";
import Link from "next/link";
import { MARKETPLACE_ADDRESS } from "../../const/contractAddresses";

import Skeleton from "../Skeleton/Skeleton";
import styles from "../NFT/NFT.module.css";

export default function Listing({ listing, type = "direct" }: any) {
  console.log(listing);
  return (
    <>
      {type === "direct" && listing.type === 0 && (
        <Link
          href={`/collection/${
            listing.assetContractAddress
          }/${listing.tokenId.toString()}`}
        >
          <div className="flex flex-col justify-center gap-4 items-left my-2 p-4 py-8 rounded-2xl bg-[#d1d1d150]">
            <div className="flex flex-col gap-2">
              <div>
                {"listing is active : "}
                {new Date(listing.secondsUntilEnd.toString() * 1000) >
                new Date(Date.now())
                  ? "✅"
                  : "❌"}
              </div>
              <h4 className="font-bold">{listing.asset.name}</h4>
              <ThirdwebNftMedia metadata={listing.asset} />
            </div>
            <div className={styles.nftPriceContainer}>
              <div>
                <p className={styles.nftPriceLabel}>Price</p>
                <p className={styles.nftPriceValue}>
                  {`${listing.buyoutCurrencyValuePerToken.displayValue} ${listing.buyoutCurrencyValuePerToken.symbol}`}
                </p>
              </div>
            </div>
            <div className={styles.nftPriceContainer}>
              <div>
                <p className={styles.nftPriceLabel}>Listing Expiration</p>
                <p className={styles.nftPriceValue}>{`${new Date(
                  listing.secondsUntilEnd.toString() * 1000
                ).toLocaleDateString()} @ ${new Date(
                  listing.secondsUntilEnd.toString() * 1000
                ).toLocaleTimeString()}`}</p>
              </div>
            </div>
          </div>
        </Link>
      )}
      {type === "auction" && listing.type === 1 && (
        <Link
          href={`/collection/${
            listing.assetContractAddress
          }/${listing.tokenId.toString()}`}
        >
          <div className="flex justify-center items-left my-2 p-4 py-8 rounded-2xl bg-[#d1d1d150]">
            <div className="flex flex-col gap-2">
              <div>
                {"listing is active : "}
                {new Date(listing.endTimeInEpochSeconds.toString() * 1000) >
                new Date(Date.now())
                  ? "✅"
                  : "❌"}
              </div>
              <h4 className="font-bold">{listing.asset.name}</h4>
              <ThirdwebNftMedia metadata={listing.asset} />
              <div className={styles.nftPriceContainer}>
                <div>
                  <p className={styles.nftPriceLabel}>Buyout price</p>
                  <p className={styles.nftPriceValue}>
                    {`${listing.buyoutCurrencyValuePerToken.displayValue} ${listing.buyoutCurrencyValuePerToken.symbol}`}
                  </p>
                </div>
              </div>
              <div className={styles.nftPriceContainer}>
                <div>
                  <p className={styles.nftPriceLabel}>Minimum bid</p>
                  <p className={styles.nftPriceValue}>
                    {`${listing.reservePriceCurrencyValuePerToken.displayValue} ${listing.reservePriceCurrencyValuePerToken.symbol}`}
                  </p>
                </div>
              </div>
              <div className={styles.nftPriceContainer}>
                <div>
                  <p className={styles.nftPriceLabel}>Listing Expiration</p>
                  <p className={styles.nftPriceValue}>{`${new Date(
                    listing.endTimeInEpochSeconds * 1000
                  ).toLocaleDateString()} @ ${new Date(
                    listing.endTimeInEpochSeconds * 1000
                  ).toLocaleTimeString()}`}</p>
                </div>
              </div>
            </div>
          </div>
        </Link>
      )}
    </>
  );
}
