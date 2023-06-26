import Link from "next/link";
import { DirectListing } from "../../lib/marketplace/marketplace-utils";
import { ThirdwebNftMedia, useContract, useNFT } from "@thirdweb-dev/react";
import { MOONEY_DECIMALS } from "../../const/config";
import Skeleton from "../Layout/Skeleton";
import CancelListing from "./CancelListing";

interface ProfileDirectListingProps {
  listing: DirectListing;
}

export default function ProfileDirectListing({ listing }: ProfileDirectListingProps) {
  const { contract: nftContract } = useContract(listing.assetContract);
  const { data: nft }: any = useNFT(nftContract, listing.tokenId);

  const buyOut = listing.pricePerToken;
  const end = listing.endTimestamp;
  return (
    <article className="relative flex flex-col justify-center my-2 hover:scale-[1.03] transition-all duration-150">
      {/*Status*/}
      <div
        className={`${
          +end * 1000 > Date.now() ? "bg-gradient-to-br from-yellow-600 via-amber-500 to-moon-secondary" : "bg-amber-700 opacity-70 text-gray-200"
        } px-2 py-1 rounded-full italic absolute top-2 left-3 text-sm`}
      >
        {"Status : "}
        {+end * 1000 > Date.now() ? "Active ✔" : "Sold ✖"}
      </div>
      {/*Image with link */}
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
        {/*Price */}
        <div>
          <p className="text-sm opacity-80">Price</p>
          <p className="tracking-wide">{`${+buyOut / MOONEY_DECIMALS} MOONEY`}</p>
        </div>
        {/*Expiration date*/}
        <div>
          <p className="text-sm opacity-80">Listing Expiration</p>
          <p>{`${new Date(+end * 1000).toLocaleDateString()} @ ${new Date(+end * 1000).toLocaleTimeString()}`}</p>
        </div>
        <CancelListing type="direct" listingId={+listing.listingId} />
      </div>
    </article>
  );
}
