import { initSDK } from "../../../lib/thirdweb";
import { MARKETPLACE_ADDRESS } from "../../../const/config";
import {
  getAllAuctions,
  getAllListings,
  getAllValidAuctions,
  getAllValidListings,
  useFilterAllListings,
} from "../../../lib/marketplace-v3";

import {
  DirectListing,
  AuctionListing,
  AllListings,
  AllAuctions,
} from "../../../lib/utils";
import { useEffect, useState } from "react";

interface FilteredListingsPageProps {
  allListings: AllListings;
  allAuctions: AllAuctions;
  filterType: string;
}

export default function FilteredListingsPage({
  allListings,
  allAuctions,
  filterType,
}: FilteredListingsPageProps) {
  const [filter, setFilter] = useState<any>({
    filter: filterType,
    assetOrCollection: "asset",
  });
  const filteredListings = useFilterAllListings(
    allListings,
    allAuctions,
    filter
  );
  useEffect(() => {
    console.log(filteredListings);
  }, [filteredListings]);
  return <div></div>;
}

export async function getServerSideProps(context: any) {
  const { filterType } = context.query;
  const sdk = initSDK();
  const marketplace = await sdk.getContract(MARKETPLACE_ADDRESS);
  const listings: DirectListing[] = await getAllListings(marketplace);
  const auctions: AuctionListing[] = await getAllAuctions(marketplace);
  const validListings: DirectListing[] = await getAllValidListings(marketplace);
  const validAuctions: AuctionListing[] = await getAllValidAuctions(
    marketplace
  );
  return {
    props: {
      allListings: { all: listings, valid: validListings },
      allAuctions: { all: auctions, valid: validAuctions },
      filterType: filterType || "all",
    },
  };
}
