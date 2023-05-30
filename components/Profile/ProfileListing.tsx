import {
  ThirdwebNftMedia,
  useAddress,
  useContract,
  useNFT,
} from "@thirdweb-dev/react";
import Link from "next/link";
import { MOONEY_DECIMALS } from "../../const/config";

import styles from "../NFT/NFT.module.css";
import { useEffect } from "react";
import { AuctionListing, BigConvert, DirectListing } from "../../lib/utils";

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

interface ProfileListingProps {
  listing: DirectListing | AuctionListing | any;
  type: string;
}

export default function ProfileListing({
  listing,
  type = "direct",
}: ProfileListingProps) {
  const { contract: nftContract } = useContract(listing.assetContract);
  const { data: nft }: any = useNFT(nftContract, listing.tokenId);

  const buyOut =
    type === "direct" ? listing?.pricePerToken : listing?.buyoutBidAmount;
  const minBid = type === "direct" ? 0 : listing.minimumBidAmount;
  const end = listing.endTimestamp;

  return (
    <>
      {type === "direct" && nft && (
        <Link href={`/collection/${listing.assetContract}/${listing.tokenId}`}>
          <div className="flex flex-col justify-center gap-4 items-left my-2 p-4 py-8 rounded-2xl bg-[#d1d1d150]">
            <div className="flex flex-col gap-2">
              <div>
                {"listing is active : "}
                {end * 1000 > Date.now() ? "✅" : "❌"}
              </div>
              <h4 className="font-bold">{nft?.metadata?.name}</h4>
              <ThirdwebNftMedia metadata={nft?.metadata} />
            </div>
            <div className={styles.nftPriceContainer}>
              <div>
                <p className={styles.nftPriceLabel}>Price</p>
                <p className={styles.nftPriceValue}>
                  {`${buyOut / MOONEY_DECIMALS} MOONEY`}
                </p>
              </div>
            </div>
            <div className={styles.nftPriceContainer}>
              <div>
                <p className={styles.nftPriceLabel}>Listing Expiration</p>
                <p className={styles.nftPriceValue}>{`${new Date(
                  end * 1000
                ).toLocaleDateString()} @ ${new Date(
                  end * 1000
                ).toLocaleTimeString()}`}</p>
              </div>
            </div>
          </div>
        </Link>
      )}
      {type === "auction" && nft && (
        <Link href={`/collection/${listing.assetContract}/${listing.tokenId}`}>
          <div className="flex justify-center items-left my-2 p-4 py-8 rounded-2xl bg-[#d1d1d150]">
            <div className="flex flex-col gap-2">
              <div>
                {"listing is active : "}
                {end * 1000 > Date.now() ? "✅" : "❌"}
              </div>
              <h4 className="font-bold">{nft?.metadata?.name}</h4>
              <ThirdwebNftMedia metadata={nft?.metadata} />
              <div className={styles.nftPriceContainer}>
                <div>
                  <p className={styles.nftPriceLabel}>Buyout price</p>
                  <p className={styles.nftPriceValue}>
                    {`${buyOut / MOONEY_DECIMALS} MOONEY`}
                  </p>
                </div>
              </div>
              <div className={styles.nftPriceContainer}>
                <div>
                  <p className={styles.nftPriceLabel}>Minimum bid</p>
                  <p className={styles.nftPriceValue}>
                    {`${buyOut / MOONEY_DECIMALS} MOONEY`}
                  </p>
                </div>
              </div>
              <div className={styles.nftPriceContainer}>
                <div>
                  <p className={styles.nftPriceLabel}>Listing Expiration</p>
                  <p className={styles.nftPriceValue}>{`${new Date(
                    end * 1000
                  ).toLocaleDateString()} @ ${new Date(
                    end * 1000
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
