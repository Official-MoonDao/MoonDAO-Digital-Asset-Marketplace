import { useEffect, useState } from "react";
import {
  AllAuctions,
  AllListings,
  AuctionListing,
  DirectListing,
  serializable,
} from "./utils";

/////FUNCTIONS/////
////////////////////////////////

export async function getAllListings(marketplace: any) {
  try {
    const totalListings = await marketplace.call("totalListings");
    const listings = await marketplace.call(
      "getAllListings",
      0,
      totalListings?.toNumber() - 1 >= 0 ? totalListings?.toNumber() - 1 : 0
    );
    return serializable(listings);
  } catch (err) {
    console.log(err);
    return [];
  }
}

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

export async function getAllAuctions(marketplace: any) {
  try {
    const totalAuctions = await marketplace.call("totalAuctions");
    const auctions = await marketplace.call(
      "getAllAuctions",
      0,
      totalAuctions?.toNumber() - 1 >= 0 ? totalAuctions?.toNumber() - 1 : 0
    );
    return serializable(auctions);
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
  tokenId: string | number
) {
  try {
    const totalOffers = await marketplace.call("totalOffers");
    if (!totalOffers || totalOffers?.toNumber() <= 0) return null;
    const validOffers = await marketplace.call(
      "getAllValidOffers",
      0,
      totalOffers?.toNumber() - 1 >= 0 ? totalOffers?.toNumber() - 1 : 0
    );
    return serializable(validOffers, totalOffers);
  } catch (err) {
    console.log(err);
    return [];
  }
}

////MULTICALL FUNCTIONS////

export async function multiAuctionPayout(
  marketplace: any,
  auctionIds: [number]
) {
  try {
    const encodedData = auctionIds.map((id: number) =>
      marketplace.interface.encodeFunctionData("collectAuctionPayout", [id])
    );
    const multicallTx = await marketplace.callStatic.multicall(encodedData);
    return multicallTx;
  } catch (err) {
    console.log(err);
  }
}

export async function multiCancelListings(
  marketplace: any,
  auctionIds: [number],
  listingIds: [number]
) {
  try {
    const encodedData = [];
    if (auctionIds.length > 0) {
      encodedData.push(
        ...auctionIds.map((id: number) =>
          marketplace.interface.encodeFunctionData("cancelAuction", [id])
        )
      );
    }
    if (listingIds.length > 0) {
      encodedData.push(
        listingIds.map((id: number) =>
          marketplace.interface.encodeFunctionData("cancelListing", [id])
        )
      );
    }
    const multicallTx = await marketplace.callStatic.multicall(encodedData);
    return multicallTx;
  } catch (err) {
    console.log(err);
  }
}

//////HOOKS//////////
/////////////////////

//Get all unique collections from Marketplace
export function useAllCollections(
  validListings: DirectListing[],
  validAuctions: AuctionListing[]
) {
  const [collections, setCollections] = useState<any>([]);

  useEffect(() => {
    if (validListings && validAuctions) {
      const uniqueCollectionAddresses: any = [];
      const filteredListings = validListings[0]
        ? validListings?.filter(
            (l: DirectListing) =>
              !uniqueCollectionAddresses.includes(l.assetContract) &&
              uniqueCollectionAddresses.push(l.assetContract)
          )
        : [];
      const filteredAuctions = validAuctions[0]
        ? validAuctions?.filter(
            (a: AuctionListing) =>
              !uniqueCollectionAddresses.includes(a.assetContract) &&
              uniqueCollectionAddresses.push(a.assetContract)
          )
        : [];

      let filteredCollections;
      setCollections([...filteredAuctions, ...filteredListings]);
    }
    console.log(collections);
  }, [validListings, validAuctions]);

  return collections;
}

//Get all unique assets for a specific collection from Marketplace
export function useAllAssets(
  listings: DirectListing[],
  auctions: AuctionListing[],
  assetContract: string
) {
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
          listings[i].assetContract === assetContract &&
          !uniqueAssets.includes(listings[i].tokenId)
        ) {
          const tokenId: any = listings[i].tokenId;
          uniqueAssets.push(tokenId);
          filteredAssets.push(listings[i]);
        }
        if (
          auctions[i] &&
          auctions[i].assetContract === assetContract &&
          !uniqueAssets.includes(auctions[i].tokenId)
        ) {
          const tokenId: any = auctions[i].tokenId;
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
  validListings: DirectListing[] | [],
  validAuctions: AuctionListing[] | [],
  tokenId: string | number,
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
          (l: DirectListing) =>
            l.assetContract.toLowerCase() === collectionAddress.toLowerCase() &&
            +l.tokenId === Number(tokenId)
        );
      const filteredAuctions =
        validAuctions[0] &&
        validAuctions?.filter(
          (a: any) =>
            a.assetContract.toLowerCase() === collectionAddress.toLowerCase() &&
            +a.tokenId === Number(tokenId)
        );
      setListings(filteredListings || []);
      setAuctions(filteredAuctions || []);
    }
  }, [validListings, validAuctions, tokenId]);

  return { listings, auctions } as {
    listings: DirectListing[];
    auctions: AuctionListing[];
  };
}

//Get listings and auctions for a specific wallet
export function useListingsAndAuctionsForWallet(
  validListings: DirectListing[],
  validAuctions: AuctionListing[],
  walletAddress: string
) {
  const [listings, setListings] = useState<any>([]);
  const [auctions, setAuctions] = useState<any>([]);

  useEffect(() => {
    if (validListings && validAuctions) {
      const filteredListings =
        validListings[0] &&
        validListings?.filter(
          (l: DirectListing) =>
            l.seller && l.seller.toLowerCase() === walletAddress?.toLowerCase()
        );
      const filteredAuctions =
        validAuctions[0] &&
        validAuctions?.filter(
          (a: AuctionListing) =>
            a.seller && a.seller.toLowerCase() === walletAddress?.toLowerCase()
        );
      setListings(filteredListings);
      setAuctions(filteredAuctions);
    }
  }, [validListings, validAuctions, walletAddress]);

  return { listings, auctions };
}

//Get listings and auctions for a specific tokenId and wallet
export function useListingsAndAuctionsForTokenIdAndWallet(
  validListings: DirectListing[],
  validAuctions: AuctionListing[],
  tokenId: string | number,
  collectionAddress: string,
  walletAddress: string
) {
  const [listings, setListings] = useState<any>([]);
  const [auctions, setAuctions] = useState<any>([]);
  useEffect(() => {
    if (validListings && validAuctions) {
      const filteredListings =
        validListings[0] &&
        validListings?.filter(
          (l: DirectListing) =>
            l.seller &&
            l?.seller?.toLowerCase() === walletAddress?.toLowerCase() &&
            l.assetContract === collectionAddress &&
            +l.tokenId === Number(tokenId)
        );
      const filteredAuctions =
        validAuctions[0] &&
        validAuctions?.filter(
          (a: AuctionListing) =>
            a?.seller &&
            a.seller?.toLowerCase() === walletAddress?.toLowerCase() &&
            a.assetContract === collectionAddress &&
            +a.tokenId === Number(tokenId)
        );
      setListings(filteredListings);
      setAuctions(filteredAuctions);
    }
  }, [validListings, validAuctions, walletAddress]);

  return { listings, auctions };
}

//filter listings and auctions for fitler page
export function useFilterAllListings(
  allListings: AllListings,
  allAuctions: AllAuctions,
  filterType: { filter: string; assetOrCollection: string }
) {
  const [filteredListings, setFilteredListings] = useState<any>([]);
  const { valid: validListings } = allListings;
  const { valid: validAuctions } = allAuctions;

  function historicalDataFilter(
    type: { filter: string; assetOrCollection: string },
    startTimestamp: number = Date.now() / 1000
  ) {
    const historicalDataTypes = {
      trending: (arr: [any]) => {
        return arr.filter((l: DirectListing | AuctionListing) => {});
      }, //collections or assets w/ most sales since timestamp
      expiration: (arr: [any]) => {
        return arr.filter((l: DirectListing | AuctionListing) => {});
      }, //collections or assets by expiration date
    };
    if (allListings && allListings.all[0]) {
    }
  }

  const FILTERS = {
    all: () => setFilteredListings([...validListings, ...validAuctions]),
    direct: () => setFilteredListings(validListings),
    auction: () => setFilteredListings(validAuctions),
    trending: "",
  };

  return 1;
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

export function useClaimableAuctions(
  marketplace: any,
  address: string | undefined
) {
  const [claimableAuctions, setClaimableAuctions] = useState<any>([]);
  useEffect(() => {
    if (marketplace && address) {
      (async () => {
        const totalAuctions = await marketplace.call("totalAuctions");
        const auctions = await marketplace.call(
          "getAllAuctions",
          0,
          totalAuctions?.toNumber() - 1 >= 0 ? totalAuctions?.toNumber() - 1 : 0
        );
        const formattedAuctions = serializable(auctions);
        const claimable = formattedAuctions.filter(
          (a: any) =>
            a?.seller.toLowerCase() === address?.toLowerCase() &&
            a.status === "1"
        );
        console.log(claimable);
        setClaimableAuctions(claimable);
      })();
    }
  }, [marketplace, address]);
  return claimableAuctions;
}

//Get all listings
