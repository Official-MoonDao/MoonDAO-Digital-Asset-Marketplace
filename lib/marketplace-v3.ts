import { useEffect, useState } from "react";
import { BigNumber } from "ethers";
import { BigConvert, serializable } from "./utils";

///Formatting////////////////////
////////////////////////////////
//JSON serializable data

/////SERVER SIDE FUNCTIONS/////
////////////////////////////////

//Get all valid listings from marketplace v3
export async function getAllValidListings(marketplace: any) {
  const totalListings = await marketplace.call("totalListings");
  const listings = await marketplace.call(
    "getAllValidListings",
    0,
    totalListings?.toNumber() - 1 >= 0 ? totalListings?.toNumber() - 1 : 0
  );
  if (listings.length < 1) return [];
  return serializable(listings);
}

//Get all valid auctions from marketplace v3
export async function getAllValidAuctions(marketplace: any) {
  try {
    const totalAuctions = await marketplace.call("totalAuctions");
    const auctions = await marketplace.call(
      "getAllValidAuctions",
      0,
      totalAuctions?.toNumber() - 1 >= 0 ? totalAuctions?.toNumber() - 1 : 0
    );

    if (auctions.length < 1) return [];
    return serializable(auctions);
  } catch (err) {
    console.log(err);
  }
}

export async function getAllValidOffersByTokenId(
  marketplace: any,
  tokenId: any
) {
  try {
    const totalOffers = await marketplace.call("totalOffers");
    if (totalOffers?.toNumber() <= 0) return [];
    const validOffers = await marketplace.call(
      "getAllValidOffers",
      0,
      totalOffers?.toNumber() - 1 >= 0 ? totalOffers?.toNumber() - 1 : 0
    );
    return serializable(validOffers);
  } catch (err) {
    console.log(err);
    return [];
  }
}

//////HOOKS//////////
/////////////////////

//Get all unique collections from Marketplace v3
export function useAllCollections(validListings: any, validAuctions: any) {
  const [collections, setCollections] = useState<any>([]);

  useEffect(() => {
    if (validListings && validAuctions) {
      const uniqueCollectionAddresses: any = [];
      const filteredListings = validListings?.filter(
        (l: any) =>
          !uniqueCollectionAddresses.includes(l.assetContract) &&
          uniqueCollectionAddresses.push(l.assetContract)
      );
      const filteredAuctions = validAuctions?.filter(
        (a: any) =>
          !uniqueCollectionAddresses.includes(a.assetContract) &&
          uniqueCollectionAddresses.push(a.assetContract)
      );

      let filteredCollections;
      if (filteredListings?.length > 0 && filteredAuctions?.length > 0)
        filteredCollections = [...filteredListings, ...filteredAuctions];
      else if (filteredListings?.length <= 0)
        filteredCollections = filteredAuctions;
      else filteredCollections = filteredListings;
      setCollections(filteredCollections);
    }
  }, [validListings, validAuctions]);

  return collections;
}

//Get listings for specific tokenId
export function useListingsAndAuctionsForTokenId(
  validListings: any,
  validAuctions: any,
  tokenId: number
) {
  const [listings, setListings] = useState<any>([]);
  const [auctions, setAuctions] = useState<any>([]);

  useEffect(() => {
    if (validListings && validAuctions) {
      const filteredListings =
        validListings[0] &&
        validListings?.filter(
          (l: any) => +BigConvert(l[3].hex) === Number(tokenId)
        );
      const filteredAuctions =
        validAuctions[0] &&
        validAuctions?.filter(
          (a: any) => +BigConvert(a[3].hex) === Number(tokenId)
        );
      setListings(filteredListings || []);
      setAuctions(filteredAuctions || []);
    }
  }, [validListings, validAuctions, tokenId]);

  return { listings, auctions };
}

//Get listings and auctions for a specific profile
export function useProfileListingsAndAuctions(
  validListings: any,
  validAuctions: any,
  walletAddress: string
) {
  const [listings, setListings] = useState<any>([]);
  const [auctions, setAuctions] = useState<any>([]);

  useEffect(() => {
    if (validListings && validAuctions) {
      const filteredListings = validListings?.filter(
        (l: any) => l[1] && l[1]?.toLowerCase() === walletAddress?.toLowerCase()
      );
      const filteredAuctions = validAuctions?.filter(
        (a: any) => a[1] && a[1]?.toLowerCase() === walletAddress?.toLowerCase()
      );
      console.log(validListings, validAuctions);
      setListings(filteredListings);
      setAuctions(filteredAuctions);
    }
  }, [validListings, validAuctions, walletAddress]);

  return { listings: validListings, auctions: validAuctions };
}
