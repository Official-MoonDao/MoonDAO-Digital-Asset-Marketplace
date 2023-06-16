import Link from "next/link";
import { DirectListing } from "../../lib/utils";
import { NFT } from "@thirdweb-dev/sdk";
import styles from "../NFT/NFT.module.css";
import { ThirdwebNftMedia, useContract, useNFT } from "@thirdweb-dev/react";
import { MOONEY_DECIMALS } from "../../const/config";
import Skeleton from "../Skeleton/Skeleton";
import CancelListing from "./CancelListing";

interface ProfileDirectListingProps {
  listing: DirectListing;
}

export default function ProfileDirectListing({
  listing,
}: ProfileDirectListingProps) {
  const { contract: nftContract } = useContract(listing.assetContract);
  const { data: nft }: any = useNFT(nftContract, listing.tokenId);

  const buyOut = listing.pricePerToken;
  const end = listing.endTimestamp;
  return (
    <div className="flex flex-col justify-center gap-4 items-left my-2 p-4 py-8 rounded-2xl bg-[#d1d1d150]">
      <div className="flex flex-col gap-2">
        <div>
          {"Status : "}
          {+end * 1000 > Date.now() ? "Active ✔" : "Sold ✖"}
        </div>
        <h4 className="font-bold">{nft?.metadata?.name}</h4>
        {nft ? (
          <Link
            href={`/collection/${listing.assetContract}/${listing.tokenId}`}
          >
            <ThirdwebNftMedia metadata={nft?.metadata} />
          </Link>
        ) : (
          <Skeleton height={"300px"} />
        )}
      </div>
      <div className={styles.nftPriceContainer}>
        <div>
          <p className={styles.nftPriceLabel}>Price</p>
          <p className={styles.nftPriceValue}>
            {`${+buyOut / MOONEY_DECIMALS} MOONEY`}
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
      <CancelListing type="direct" listingId={+listing.listingId} />
    </div>
  );
}
