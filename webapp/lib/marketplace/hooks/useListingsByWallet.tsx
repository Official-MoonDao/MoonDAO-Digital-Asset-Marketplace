import { useEffect, useState } from "react";
import { AuctionListing, DirectListing } from "../marketplace-utils";

//Get listings and auctions for a specific wallet
export function useListingsByWallet(
  validListings: DirectListing[],
  validAuctions: AuctionListing[],
  walletAddress: string
) {
  const [listings, setListings] = useState<any>([]);
  const [auctions, setAuctions] = useState<any>([]);

  useEffect(() => {
    if (validListings && validAuctions && walletAddress) {
      console.log(
        "listingsByWallet",
        validListings,
        validAuctions,
        walletAddress
      );
      const filteredListings =
        validListings[0] &&
        validListings?.filter(
          (l: DirectListing) =>
            l.creatorAddress && l.creatorAddress === walletAddress
        );
      const filteredAuctions =
        validAuctions[0] &&
        validAuctions?.filter(
          (a: AuctionListing) =>
            a.creatorAddress && a.creatorAddress === walletAddress
        );
      setListings(filteredListings);
      setAuctions(filteredAuctions);
    }
  }, [validListings, validAuctions, walletAddress]);

  return { listings, auctions };
}
