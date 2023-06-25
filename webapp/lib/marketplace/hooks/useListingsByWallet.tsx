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
      const filteredListings =
        validListings[0] &&
        validListings?.filter(
          (l: DirectListing) =>
            l.seller && l.seller.toLowerCase() === walletAddress?.toLowerCase()
        );
      const filteredAuctions =
        validAuctions[0] &&
        validAuctions?.filter(
          (a: AuctionListing) =>
            a.seller && a.seller.toLowerCase() === walletAddress?.toLowerCase()
        );
      setListings(filteredListings);
      setAuctions(filteredAuctions);
    }
  }, [validListings, validAuctions, walletAddress]);

  return { listings, auctions };
}
