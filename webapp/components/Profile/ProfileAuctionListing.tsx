import {
  ThirdwebNftMedia,
  useAddress,
  useContract,
  useNFT,
} from "@thirdweb-dev/react";
import Link from "next/link";
import { MARKETPLACE_ADDRESS, MOONEY_DECIMALS } from "../../const/config";

import styles from "../NFT/NFT.module.css";
import { AuctionListing } from "../../lib/utils";
import { useEffect, useState } from "react";
import ClaimAuctionPayout from "./ClaimAuctionPayout";
import { useClaimableAuction } from "../../lib/marketplace/hooks";
import CancelListing from "./CancelListing";

interface ProfileAuctionListingProps {
  listing: AuctionListing;
}

export default function ProfileAuctionListing({
  listing,
}: ProfileAuctionListingProps) {
  const address = useAddress();
  const buyOut = listing?.buyoutBidAmount;
  const minBid = listing.minimumBidAmount;
  const end = listing.endTimestamp;

  const [winningBid, setWinningBid] = useState<number>(0);

  const { contract: nftContract } = useContract(listing.assetContract);
  const { data: nft }: any = useNFT(nftContract, listing.tokenId);

  const { contract: marketplace } = useContract(
    MARKETPLACE_ADDRESS,
    "marketplace-v3"
  );

  const claimable = useClaimableAuction(winningBid, +buyOut, end);

  useEffect(() => {
    if (marketplace) {
      marketplace
        .call("getWinningBid", [+listing.auctionId])
        .then((bid: any) => {
          setWinningBid(bid[2].toString() / MOONEY_DECIMALS);
        })
        .catch((e: any) => console.log(e));
    }
  }, [marketplace]);

  if (listing.status === "3" || listing.status === "2") return <></>;
  return (
    <div className="flex justify-center items-left my-2 p-4 py-8 rounded-2xl bg-[#d1d1d150]">
      <div className="flex flex-col gap-2">
        <div>
          {"Status : "}
          {+end * 1000 > Date.now()
            ? "Active ✔"
            : claimable
            ? "Sold ✖"
            : "Expired"}
        </div>
        <h4 className="font-bold">{nft?.metadata?.name}</h4>
        {nft && (
          <Link
            href={`/collection/${listing.assetContract}/${listing.tokenId}`}
          >
            <ThirdwebNftMedia metadata={nft?.metadata} />
          </Link>
        )}
        <div className={styles.nftPriceContainer}>
          <div>
            <p className={styles.nftPriceLabel}>Buyout price</p>
            <p className={styles.nftPriceValue}>
              {`${+buyOut / MOONEY_DECIMALS} MOONEY`}
            </p>
          </div>
        </div>
        <div className={styles.nftPriceContainer}>
          <div>
            <p className={styles.nftPriceLabel}>Minimum bid</p>
            <p className={styles.nftPriceValue}>
              {`${+minBid / MOONEY_DECIMALS} MOONEY`}
            </p>
          </div>
        </div>
        <div className={styles.nftPriceContainer}>
          <div>
            <p className={styles.nftPriceLabel}>Listing Expiration</p>
            <p className={styles.nftPriceValue}>{`${new Date(
              +end * 1000
            ).toLocaleDateString()} @ ${new Date(
              +end * 1000
            ).toLocaleTimeString()}`}</p>
          </div>
        </div>
        {/* Auctions that have ended and have a payout */}
        {claimable && (
          <>
            {address && address === listing.seller && (
              <ClaimAuctionPayout
                claimable={claimable}
                auctionId={+listing.auctionId}
              />
            )}

            <p className="w-full text-center text-[75%]">{`(Payout: ${winningBid} MOONEY)`}</p>
          </>
        )}
        {/* Expired Auctions /w No bids */}
        {address &&
          address === listing.seller &&
          +end * 1000 < Date.now() &&
          !claimable && (
            <CancelListing type="auction" listingId={+listing.auctionId} />
          )}
      </div>
    </div>
  );
}
