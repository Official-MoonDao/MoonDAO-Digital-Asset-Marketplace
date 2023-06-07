////Advanced filtering for auctions and listings using the MarketplaceV3 subgraph. The subgraph provides historical data for all events emiited by the marketplace contract.

import { useEffect, useState } from "react";
import { cacheExchange, createClient, fetchExchange } from "urql";
import { AuctionListing, DirectListing } from "./utils";

///INIT GRAPH CLIENT//////////////////////////////////
///////////////////////////////////////////////////////
const SUBGRAPH_URL =
  "https://api.studio.thegraph.com/query/38443/moondao-marketplace-test/v0.0.3";

const graphClient:any = createClient({
  url: SUBGRAPH_URL,
  exchanges: [fetchExchange, cacheExchange],
});

async function graphQuery(query: string) {
  return await graphClient.query(query).toPromise();
}

//FILTERS//////////////////////////////////////////////
///////////////////////////////////////////////////////

// ListingIds and AuctionIds that are trending (have the most bids/sales)
export async function queryTrending() {
  const query = `
    query {
        newSales(first: 100, orderBy: blockTimestamp, orderDirection: desc) {
            listingId
            assetContract
            tokenId
          }
          newBids(first: 100, orderBy: blockTimestamp, orderDirection: desc) {
            auctionId
            assetContract
            auction_tokenId
          }
    }
    `;
  const res = await graphQuery(query);

  const trendingCount: any = { newSales: {}, newBids: {} };
  res.data.newSales.forEach((sale: any) => {
    if (trendingCount.newSales[sale.listingId]) {
      trendingCount.newSales[sale.listingId] += 1;
    } else {
      trendingCount.newSales[sale.listingId] = 1;
    }
  });
  res.data.newBids.forEach((bid: any) => {
    if (trendingCount.newBids[bid.auctionId]) {
      trendingCount.newBids[bid.auctionId] += 1;
    } else {
      trendingCount.newBids[bid.auctionId] = 1;
    }
  });

  console.log(Object.entries(trendingCount.newBids).sort((a:any,b:any)=> b[1]-a[1]));

  return { listings: trendingListings, auctions: trendingAuctions };
}

// ListingIds & AuctionIds that are ending soon
export async function queryExpiringSoon() {
  const query = `
    query {
        newListings(orderBy: listing_endTimestamp, orderDirection: asc) {
            listingId
            assetContract
            listing_endTimestamp
            listing_tokenId
          }
          newAuctions(orderBy: auction_endTimestamp, orderDirection: asc) {
            auctionId
            assetContract
            auction_endTimestamp
            auction_tokenId
          }
    }
    `;

  const res = await graphQuery(query);
  return { listings: res.data.newListings, auctions: res.data.newAuctions };
}

//////HOOKS////////////////////////////////////////////
///////////////////////////////////////////////////////

export function useFilter(filter:{type: string, assetOrCollection: string}, collections:[any], validListings: DirectListing[], validAuctions: AuctionListing[]) {
    const { type, assetOrCollection } = filter;;

  const [filteredListings, setFilteredListings] = useState<DirectListing[]>([]);
  const [filteredAuctions, setFilteredAuctions] = useState<AuctionListing[]>([]);

  const [filteredListingsByCollection, setFilteredListingsByCollection] =
    useState<DirectListing[]>([]);
  const [filteredAuctionsByCollection, setFilteredAuctionsByCollection] =
    useState<AuctionListing[]>([]);

  function handleFilter(res: any) {
    const {listings, auctions} = res;
    if (assetOrCollection === "asset") {
        //todo set filtered assets
        console.log(listings, auctions);


    } else {
        // set filtered collections
      console.log(listings, auctions);
    }
  }

  useEffect(() => {
    if (type === "trending") {
      queryTrending().then((res: any) => {
        console.log(res);
        handleFilter(res);
      });
    } else if (type === "expiring") {
      queryExpiringSoon().then((res: any) => {
        handleFilter(res);
      });
    }

    console.log(type);
  }, [type, assetOrCollection]);

  return { collections:{listings: filteredListingsByCollection, auctions:filteredAuctionsByCollection }, assets: {listings: filteredListings, auctions: filteredAuctions}};
}





/* 

listingId, assetContract
validListing, validAuctions



*/