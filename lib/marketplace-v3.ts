import { use, useEffect, useState } from "react";
import { BigNumber } from "ethers";
import { BigConvert, serializable } from "./utils";
import { getAllUserNFTs } from "./opensea";

/////FUNCTIONS/////
////////////////////////////////

//Get all valid listings from marketplace
export async function getAllValidListings(marketplace: any) {
  try {
    const totalListings = await marketplace.call("totalListings");
    const listings = await marketplace.call(
      "getAllValidListings",
      0,
      totalListings?.toNumber() - 1 >= 0 ? totalListings?.toNumber() - 1 : 0
    );
    return serializable(listings);
  } catch (err) {
    console.log(err);
    return [];
  }
}

//Get all valid auctions from marketplace
export async function getAllValidAuctions(marketplace: any) {
  try {
    const totalAuctions = await marketplace.call("totalAuctions");
    const auctions = await marketplace.call(
      "getAllValidAuctions",
      0,
      totalAuctions?.toNumber() - 1 >= 0 ? totalAuctions?.toNumber() - 1 : 0
    );
    return serializable(auctions);
  } catch (err) {
    console.log(err);
    return [];
  }
}

//Get all valid offers from marketplace
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

//Get all unique collections from Marketplace
export function useAllCollections(validListings: any, validAuctions: any) {
  const [collections, setCollections] = useState<any>([]);

  useEffect(() => {
    if (validListings && validAuctions) {
      console.log(validListings, validAuctions);
      const uniqueCollectionAddresses: any = [];
      const filteredListings = validListings?.filter(
        (l: any) =>
          !uniqueCollectionAddresses.includes(l[2]) &&
          uniqueCollectionAddresses.push(l[2])
      );
      const filteredAuctions = validAuctions?.filter(
        (a: any) =>
          !uniqueCollectionAddresses.includes(a[2]) &&
          uniqueCollectionAddresses.push(a[2])
      );

      let filteredCollections;
      if (filteredListings?.length > 0 && filteredAuctions?.length > 0)
        filteredCollections = [...filteredListings, ...filteredAuctions];
      else if (filteredListings?.length <= 0)
        filteredCollections = filteredAuctions;
      else filteredCollections = filteredListings;
      setCollections(filteredCollections);
    }
    console.log(collections);
  }, [validListings, validAuctions]);

  return collections;
}

//Get all unique assets for a specific collection from Marketplace
export function useAllAssets(listings: any, auctions: any) {
  const [assets, setAssets] = useState([]);
  useEffect(() => {
    if (listings || auctions) {
      const uniqueAssets: any = [];
      const filteredAssets: any = [];
      const length: number =
        listings.length > auctions.length ? listings.length : auctions.length;
      for (let i = 0; i < length; i++) {
        if (
          listings[i] &&
          !uniqueAssets.includes(BigConvert(listings[i][3].hex))
        ) {
          const tokenId: any = BigConvert(listings[i][3].hex);
          uniqueAssets.push(tokenId);
          filteredAssets.push(listings[i]);
        }
        if (
          auctions[i] &&
          !uniqueAssets.includes(BigConvert(auctions[i][3].hex))
        ) {
          const tokenId: any = BigConvert(auctions[i][0].hex);
          uniqueAssets.push(tokenId);
          filteredAssets.push(auctions[i]);
        }
      }
      setAssets(filteredAssets);
    }
  }, [listings, auctions]);
  return assets;
}

//Get listings and auctions for specific tokenId
export function useListingsAndAuctionsForTokenId(
  validListings: any,
  validAuctions: any,
  tokenId: number,
  collectionAddress: string
) {
  const [listings, setListings] = useState<any>([]);
  const [auctions, setAuctions] = useState<any>([]);

  useEffect(() => {
    if (validListings && validAuctions) {
      console.log(validListings, validAuctions);
      const filteredListings =
        validListings[0] &&
        validListings?.filter(
          (l: any) =>
            l[2].toLowerCase() === collectionAddress.toLowerCase() &&
            +BigConvert(l[3].hex) === Number(tokenId)
        );
      const filteredAuctions =
        validAuctions[0] &&
        validAuctions?.filter(
          (a: any) =>
            a[2].toLowerCase() === collectionAddress.toLowerCase() &&
            +BigConvert(a[3].hex) === Number(tokenId)
        );
      setListings(filteredListings || []);
      setAuctions(filteredAuctions || []);
    }
  }, [validListings, validAuctions, tokenId]);

  return { listings, auctions };
}

//Get listings and auctions for a specific wallet
export function useListingsAndAuctionsForWallet(
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

  return { listings, auctions };
}

//Get listings and auctions for a specific tokenId and wallet
export function useListingsAndAuctionsForTokenIdAndWallet(
  validListings: any,
  validAuctions: any,
  tokenId: any,
  collectionAddress: any,
  walletAddress: any
) {
  const [listings, setListings] = useState<any>([]);
  const [auctions, setAuctions] = useState<any>([]);
  useEffect(() => {
    if (validListings && validAuctions) {
      const filteredListings = validListings?.filter(
        (l: any) =>
          l[1] &&
          l[1]?.toLowerCase() === walletAddress?.toLowerCase() &&
          l[2] === collectionAddress &&
          +BigConvert(l[3].hex) === Number(tokenId)
      );
      const filteredAuctions = validAuctions?.filter(
        (a: any) =>
          a[1] &&
          a[1]?.toLowerCase() === walletAddress?.toLowerCase() &&
          a[2] === collectionAddress &&
          +BigConvert(a[3].hex) === Number(tokenId)
      );
      console.log(validListings, validAuctions);
      setListings(filteredListings);
      setAuctions(filteredAuctions);
    }
  }, [validListings, validAuctions, walletAddress]);

  return { listings, auctions };
}

//Check if user has permissions to list NFTs
export function useUserCanList(marketplace: any, address: string) {
  const [userCanList, setUserCanList] = useState(false);
  useEffect(() => {
    if (marketplace && address) {
      (async () => {
        const listerAddresses = await marketplace.roles.get("lister");
        console.log(listerAddresses, address);
        if (listerAddresses.includes(address)) setUserCanList(true);
      })();
    }
  }, [marketplace, address]);
  return userCanList;
}
