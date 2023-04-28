import {
  ThirdwebNftMedia,
  useContract,
  useMetadata,
  useNFT,
  useValidDirectListings,
  useValidEnglishAuctions,
} from "@thirdweb-dev/react";
import Link from "next/link";
import {
  MARKETPLACE_ADDRESS,
  MOONEY_ADDRESS_SEPOLIA,
} from "../../const/contractAddresses";

import Skeleton from "../Skeleton/Skeleton";
import styles from "../NFT/NFT.module.css";

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
  8: bidBufferBps: BigNumber
  9: startTimestamp : BigNumber
  10: endTimestamp : BigNumber
  11: tokenType : number
  12: status : number
*/

export default function Listing({ listing, type = "direct" }: any) {
  const { contract: nftContract } = useContract(listing[2]);
  const { data: nft }: any = useNFT(nftContract, listing[3]);

  return (
    <>
      {type === "direct" && (
        <Link href={`/collection/${listing[2]}/${listing[3].toString()}`}>
          <div className="flex flex-col justify-center gap-4 items-left my-2 p-4 py-8 rounded-2xl bg-[#d1d1d150]">
            <div className="flex flex-col gap-2">
              <div>
                {"listing is active : "}
                {new Date(listing[8].toString() * 1000) > new Date(Date.now())
                  ? "✅"
                  : "❌"}
              </div>
              <h4 className="font-bold">{nft.metadata.name}</h4>
              <ThirdwebNftMedia metadata={nft.metadata} />
            </div>
            <div className={styles.nftPriceContainer}>
              <div>
                <p className={styles.nftPriceLabel}>Price</p>
                <p className={styles.nftPriceValue}>
                  {`${listing[6].toString()} MOONEY`}
                </p>
              </div>
            </div>
            <div className={styles.nftPriceContainer}>
              <div>
                <p className={styles.nftPriceLabel}>Listing Expiration</p>
                <p className={styles.nftPriceValue}>{`${new Date(
                  listing[8].toString() * 1000
                ).toLocaleDateString()} @ ${new Date(
                  listing[8].toString() * 1000
                ).toLocaleTimeString()}`}</p>
              </div>
            </div>
          </div>
        </Link>
      )}
      {type === "auction" && (
        <Link href={`/collection/${listing[2]}/${listing[3].toString()}`}>
          <div className="flex justify-center items-left my-2 p-4 py-8 rounded-2xl bg-[#d1d1d150]">
            <div className="flex flex-col gap-2">
              <div>
                {"listing is active : "}
                {new Date(listing[10].toString() * 1000) > new Date(Date.now())
                  ? "✅"
                  : "❌"}
              </div>
              <h4 className="font-bold">{listing.asset.name}</h4>
              <ThirdwebNftMedia metadata={listing.asset} />
              <div className={styles.nftPriceContainer}>
                <div>
                  <p className={styles.nftPriceLabel}>Buyout price</p>
                  <p className={styles.nftPriceValue}>
                    {`${listing[6].toString()} MOONEY`}
                  </p>
                </div>
              </div>
              <div className={styles.nftPriceContainer}>
                <div>
                  <p className={styles.nftPriceLabel}>Minimum bid</p>
                  <p className={styles.nftPriceValue}>
                    {`${listing[6].toString()} MOONEY`}
                  </p>
                </div>
              </div>
              <div className={styles.nftPriceContainer}>
                <div>
                  <p className={styles.nftPriceLabel}>Listing Expiration</p>
                  <p className={styles.nftPriceValue}>{`${new Date(
                    listing[10] * 1000
                  ).toLocaleDateString()} @ ${new Date(
                    listing[10] * 1000
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
