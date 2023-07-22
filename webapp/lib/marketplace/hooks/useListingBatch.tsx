import { MarketplaceV3 } from "@thirdweb-dev/sdk";
import { useState } from "react";
import { toast } from "react-hot-toast";

export function useListingBatch(marketplace: MarketplaceV3) {
  const [listings, setListings] = useState<any[]>([]);

  function addListing(listing: any) {
    setListings((prev) => [...prev, listing]);
  }

  function removeListing(listingIndex: number) {
    setListings(listings.filter((_, i) => i !== listingIndex));
  }

  function clearAll() {
    setListings([]);
  }

  function listAll() {
    if (listings.length <= 1)
      toast.error("You must add at least 2 listings to create a batch listing");
    else
      marketplace.directListings
        .createListingsBatch(listings)
        .then(() => toast.success("Listings created successfully"))
        .catch(() => toast.error("Error creating listings"));
  }

  return { listings, addListing, removeListing, listAll, clearAll };
}
