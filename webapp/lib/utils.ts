import { BigNumber } from "ethers";
import { useEffect, useState } from "react";

export interface DirectListing {
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
}

export interface AuctionListing {
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
  popularity:any;
}

export interface AllListings {
  all: DirectListing[];
  valid: DirectListing[];
}

export interface AllAuctions {
  all: AuctionListing[];
  valid: AuctionListing[];
}

export function BigConvert(data: any) {
  return !data ? 0 : BigNumber.from(data).toString();
}

export function serializable(data: any, totalOffers: any = "") {
  //data = array of listings = [[{listingData1}], [{listingData2}]]
  let formatted;
  if (data.length === 0) return [null];
  if (totalOffers !== "") {
    return data;
  }
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

export function useClickOutside(ref: any, _enabled: boolean) {
  const [enabled, setEnabled] = useState(false);
  function handleClickOutside(e: Event) {
    ref.current && !ref.current.contains(e.target) && setEnabled(false);
    document.removeEventListener("click", handleClickOutside);
  }
  useEffect(() => {
    if (_enabled) {
      setEnabled(true);
      document.addEventListener("click", handleClickOutside);
    }
  }, [_enabled]);

  return enabled;
}
