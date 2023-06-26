import { BigNumber } from "ethers";

export type DirectListing = {
  listingId: string | number;
  seller: string;
  assetContract: string;
  tokenId: string;
  quantity: string;
  currency: string;
  pricePerToken: string | number;
  startTimestamp: string | number;
  endTimestamp: string | number;
  reserved: boolean;
  tokenType: string | number;
  status: string | number;
  popularity: any;
};

export type AuctionListing = {
  auctionId: string | number;
  seller: string;
  assetContract: string;
  tokenId: string;
  quantity: string;
  currency: string;
  minimumBidAmount: string | number;
  buyoutBidAmount: string | number;
  timeBufferInSeconds: string | number;
  bidBufferBps: string | number;
  startTimestamp: string | number;
  endTimestamp: string | number;
  tokenType: string | number;
  status: string | number;
  popularity: any;
};

export type CurrListing = {
  type: string;
  listing: any;
};

export type DirectSubmission = {
  assetContract: string;
  tokenId: string;
  currency: string;
  quantity: string;
  pricePerToken: string;
  startTimestamp: string;
  endTimestamp: string;
  reserved: boolean;
};

export type AuctionSubmission = {
  assetContract: string;
  tokenId: string;
  currency: string;
  quantity: string;
  minimumBidAmount: string;
  buyoutBidAmount: string;
  timeBufferInSeconds: string;
  bidBufferBps: string;
  startTimestamp: string;
  endTimestamp: string;
};

export type LocalQue = {
  queuedListings: DirectSubmission[];
  queuedAuctions: AuctionSubmission[];
};

export type AssetStats = {
  floorPrice: string | number | undefined;
  supply: string | number | undefined;
  listed: string | number | undefined;
};

export type CollectionStats = {
  floorPrice: string | number;
  listed: string | number;
  supply: string | number;
};

export function BigConvert(data: any) {
  return !data ? 0 : BigNumber.from(data).toString();
}

export function serializable(data: any) {
  //data = array of listings = [[{listingData1}], [{listingData2}]]
  let formatted;
  if (data.length === 0) return [null];

  if (data[0]["auctionId"]) {
    formatted = data.map(
      (listing: any) =>
        ({
          auctionId: BigConvert(listing[0]),
          seller: listing[1],
          assetContract: listing[2],
          tokenId: BigConvert(listing[3]),
          quantity: BigConvert(listing[4]),
          currency: listing[5],
          minimumBidAmount: BigConvert(listing[6]),
          buyoutBidAmount: BigConvert(listing[7]),
          timeBufferInSeconds: BigConvert(listing[8]),
          bidBufferBps: BigConvert(listing[9]),
          startTimestamp: BigConvert(listing[10]),
          endTimestamp: BigConvert(listing[11]),
          tokenType: BigConvert(listing[12]),
          status: BigConvert(listing[13]),
        } as AuctionListing)
    );
  } else {
    formatted = data.map(
      (listing: any) =>
        ({
          listingId: BigConvert(listing[0]),
          seller: listing[1],
          assetContract: listing[2],
          tokenId: BigConvert(listing[3]),
          quantity: BigConvert(listing[4]),
          currency: listing[5],
          pricePerToken: BigConvert(listing[6]),
          startTimestamp: BigConvert(listing[7]),
          endTimestamp: BigConvert(listing[8]),
          reserved: listing[9],
          tokenType: BigConvert(listing[10]),
          status: BigConvert(listing[11]),
        } as DirectListing)
    );
  }
  return JSON.parse(JSON.stringify(formatted));
}

//////HOOKS////////////////////////////////////////////
////////////////////////////////////////////////////////
