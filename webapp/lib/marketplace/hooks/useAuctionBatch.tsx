import { MarketplaceV3 } from "@thirdweb-dev/sdk";
import { useState } from "react";
import { toast } from "react-hot-toast";

export function useAuctionBatch(marketplace: MarketplaceV3) {
  const [auctions, setAuctions] = useState<any[]>([]);

  function addAuction(auction: any) {
    setAuctions((prev) => [...prev, auction]);
  }

  function removeAuction(auctionIndex: number) {
    setAuctions(auctions.filter((_, i) => i !== auctionIndex));
  }

  function clearAll() {
    setAuctions([]);
  }

  function listAll() {
    if (auctions.length <= 1)
      toast.error("You must add at least 2 listings to create a batch listing");
    else
      marketplace.englishAuctions
        .createAuctionsBatch(auctions)
        .then(() => toast.success("Auctions created successfully"))
        .catch(() => toast.error("Error creating auctions"));
  }

  return { auctions, addAuction, removeAuction, listAll, clearAll };
}
