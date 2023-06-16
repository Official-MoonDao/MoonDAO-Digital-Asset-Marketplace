////Advanced filtering for auctions and listings using the MarketplaceV3 subgraph. The subgraph provides historical data for all events emiited by the marketplace contract.

import { useEffect, useMemo, useState } from "react";
import { cacheExchange, createClient, fetchExchange } from "urql";
import { AuctionListing, DirectListing } from "./utils";

///INIT GRAPH CLIENT//////////////////////////////////
///////////////////////////////////////////////////////
const SUBGRAPH_URL =
  "https://api.studio.thegraph.com/query/38443/moondao-marketplace-test/v0.0.3";

const graphClient: any = createClient({
  url: SUBGRAPH_URL,
  exchanges: [fetchExchange, cacheExchange],
});

async function graphQuery(query: string) {
  const data = await graphClient.query(query).toPromise();
  return data;
}

//FILTERS//////////////////////////////////////////////
///////////////////////////////////////////////////////

// ListingIds and AuctionIds that are trending (have the most bids/sales)
export async function queryTrending(
  validListings: DirectListing[],
  validAuctions: AuctionListing[]
) {
  const query = `
    query {
        newSales(first: 25, orderBy: blockTimestamp, orderDirection: desc) {
            listingId
            assetContract
            tokenId
          }
          newBids(first: 25, orderBy: blockTimestamp, orderDirection: desc) {
            auctionId
            assetContract
            auction_tokenId
          }
    }
    `;

  const {
    data: { newSales, newBids },
  } = await graphQuery(query);
  //Find assets with the most bids/sales
  const trendingCount: any = {};

  newSales.forEach((sale: any) => {
    const key = sale.assetContract.toLowerCase() + "/" + sale.tokenId;
    if (trendingCount[key]) {
      trendingCount[key] += 1;
    } else {
      trendingCount[key] = 1;
    }
  });
  newBids.forEach((bid: any) => {
    const key = bid.assetContract.toLowerCase() + "/" + bid.auction_tokenId;
    if (trendingCount[key]) {
      trendingCount[key] += 1;
    } else {
      trendingCount[key] = 1;
    }
  });

  let allListings = !validListings[0]
    ? validAuctions
    : !validAuctions[0]
    ? validListings
    : [...validListings, ...validAuctions];

  const trendingListings: any = {};

  allListings.forEach((listing: any) => {
    const trendingCountKey: string =
      listing.assetContract.toLowerCase() + "/" + listing.tokenId;
    if (!trendingListings[trendingCountKey]) {
      trendingListings[trendingCountKey] = {
        ...listing,
        popularity: trendingCount[trendingCountKey] || 0,
      };
    }
  });

  return Object.values(trendingListings).sort(
    (a: any, b: any) => b.popularity - a.popularity
  );
}

function filterExpiring(
  validListings: DirectListing[],
  validAuctions: AuctionListing[]
) {
  let allListings = !validListings[0]
    ? validAuctions
    : !validAuctions[0]
    ? validListings
    : [...validListings, ...validAuctions];
  return allListings.sort((a: any, b: any) => b.endTimestamp - a.endTimestamp);
}

//////HOOKS////////////////////////////////////////////
///////////////////////////////////////////////////////

export function useFilter(
  type: string,
  validListings: DirectListing[],
  validAuctions: AuctionListing[]
) {
  const [filteredAssets, setFilteredAssets] = useState<any>([]);

  const collections = useMemo(() => {
    const uniqueCollectionAddresses: any = [];
    return filteredAssets[0]
      ? filteredAssets?.filter(
          (l: DirectListing | AuctionListing) =>
            l &&
            !uniqueCollectionAddresses.includes(l.assetContract) &&
            uniqueCollectionAddresses.push(l.assetContract)
        )
      : [];
  }, [filteredAssets]);

  const assets = useMemo(() => {
    const uniqueAssets: any = [];
    return filteredAssets[0]
      ? filteredAssets?.filter(
          (l: DirectListing | AuctionListing) =>
            l &&
            !uniqueAssets.includes(l.assetContract + l.tokenId) &&
            uniqueAssets.push(l.assetContract + l.tokenId)
        )
      : [];
  }, [filteredAssets]);

  useEffect(() => {
    if (type === "all") {
      setFilteredAssets([...validListings, ...validAuctions]);
    }
    if (type === "trending") {
      queryTrending(validListings, validAuctions).then(
        (filteredListings: any) => {
          setFilteredAssets(filteredListings);
        }
      );
    } else if (type === "expiring" || type === "new") {
      const filteredListings = filterExpiring(validListings, validAuctions);
      setFilteredAssets(
        type === "new"
          ? filteredListings.sort((a: any, b: any) => b - a)
          : filteredListings
      );
    }
  }, [validListings, validAuctions, type]);

  return { collections, assets };
}
