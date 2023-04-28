import { useEffect, useState } from "react";

///Formatting////////////////////
////////////////////////////////

//JSON serializable data
function serializable(data: any) {
  return JSON.parse(JSON.stringify(data));
}
/////SERVER SIDE FUNCTIONS/////
////////////////////////////////

//Get all valid listings from marketplace v3
export async function getAllValidListings(marketplace: any) {
  const totalListings = await marketplace.call("totalListings");
  const listings = await marketplace.call(
    "getAllValidListings",
    0,
    totalListings?.toNumber() - 1
  );
  return serializable(listings);
}

//Get all valid auctions from marketplace v3
export async function getAllValidAuctions(marketplace: any) {
  const totalAuctions = await marketplace.call("totalAuctions");
  const auctions = await marketplace.call(
    "getAllValidAuctions",
    0,
    totalAuctions?.toNumber() - 1
  );
  console.log(auctions);
  return serializable(auctions);
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
      const filteredListings = validListings?.filter(
        (l: any) => l[10] === Number(tokenId)
      );
      const filteredAuctions = validAuctions?.filter(
        (a: any) => a[10] === Number(tokenId)
      );
      setListings(filteredListings);
      setAuctions(filteredAuctions);
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
        (l: any) => l[1] === walletAddress
      );
      const filteredAuctions = validAuctions?.filter(
        (a: any) => a[1] === walletAddress
      );
      setListings(filteredListings);
      setAuctions(filteredAuctions);
    }
  }, []);

  return { listings, auctions };
}
