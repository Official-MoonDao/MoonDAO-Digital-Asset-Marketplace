import { ThirdwebNftMedia, useAddress, useContract, useNFT } from "@thirdweb-dev/react";
import Link from "next/link";
import { MARKETPLACE_ADDRESS, MOONEY_DECIMALS } from "../../const/config";
import Skeleton from "../Layout/Skeleton";
import { AuctionListing } from "../../lib/marketplace/marketplace-utils";
import { useEffect, useState } from "react";
import ClaimAuctionPayout from "./ClaimAuctionPayout";
import { useClaimableAuction } from "../../lib/marketplace/hooks";
import CancelListing from "./CancelListing";

interface ProfileAuctionListingProps {
  listing: AuctionListing;
}

export default function ProfileAuctionListing({ listing }: ProfileAuctionListingProps) {
  const address = useAddress();
  const buyOut = listing?.buyoutBidAmount;
  const minBid = listing.minimumBidAmount;
  const end = listing.endTimestamp;

  const [winningBid, setWinningBid] = useState<number>(0);

  const { contract: nftContract } = useContract(listing.assetContract);
  const { data: nft }: any = useNFT(nftContract, listing.tokenId);

  const { contract: marketplace } = useContract(MARKETPLACE_ADDRESS, "marketplace-v3");

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
    <article className="relative flex flex-col justify-center my-2 hover:scale-[1.03] transition-all duration-150">
      <div
        className={`${
          +end * 1000 > Date.now() ? "bg-gradient-to-br from-yellow-600 via-amber-500 to-moon-secondary" : "bg-gray-800 opacity-70 text-gray-200"
        } px-2 py-1 rounded-full italic absolute top-2 left-3 text-sm`}
      >
        {"Status : "}
        {+end * 1000 > Date.now() ? "Active ✔" : claimable ? "Sold ✖" : "Expired"}
      </div>
      {/*Image with Link*/}
      <div>
        {nft ? (
          <Link href={`/collection/${listing.assetContract}/${listing.tokenId}`}>
            <ThirdwebNftMedia className="rounded-xl object-cover" metadata={nft?.metadata} />
          </Link>
        ) : (
          <Skeleton height={"300px"} width={"300px"} borderRadius="12px" />
        )}
      </div>

      <div className="w-[300px] rounded-b-xl -mt-2 py-2 px-3 flex flex-col gap-3 bg-gradient-to-br from-moon-secondary via-indigo-900 to-moon-secondary">
        {/*Title*/}
        <h4 className="font-GoodTimes tracking-wider text-lg">{nft?.metadata?.name}</h4>
        {/*Price*/}
        <div>
          <p className="text-sm opacity-80">Buyout price</p>
          <p className="tracking-wide">{`${+buyOut / MOONEY_DECIMALS} MOONEY`}</p>
        </div>

        {/*Minimum bid*/}
        <div>
          <p className="text-sm opacity-80">Minimum bid</p>
          <p className="tracking-wide">{`${+minBid / MOONEY_DECIMALS} MOONEY`}</p>
        </div>
        {/*Expiration Date */}
        <div>
          <p className="text-sm opacity-80">Listing Expiration</p>
          <p>{`${new Date(+end * 1000).toLocaleDateString()} @ ${new Date(+end * 1000).toLocaleTimeString()}`}</p>
        </div>

        {/* Auctions that have ended and have a payout */}
        {claimable && (
          <>
            {address && address === listing.seller && <ClaimAuctionPayout claimable={claimable} auctionId={+listing.auctionId} />}

            <p className="w-full text-center text-[75%]">{`(Payout: ${winningBid} MOONEY)`}</p>
          </>
        )}
        {/* Expired Auctions /w No bids */}
        {address && address === listing.seller && +end * 1000 < Date.now() && !claimable && <CancelListing type="auction" listingId={+listing.auctionId} />}
      </div>
    </article>
  );
}
