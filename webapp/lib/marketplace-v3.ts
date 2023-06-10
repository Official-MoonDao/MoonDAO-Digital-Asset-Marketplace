import { useEffect, useMemo, useState } from "react";
import {
  AssetStats,
  AuctionListing,
  DirectListing,
  serializable,
} from "./utils";
import { initSDK } from "./thirdweb";
import { MARKETPLACE_ADDRESS, MOONEY_DECIMALS } from "../const/config";

/////FUNCTIONS///////////////////
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
export async function getAllValidOffers(marketplace: any, tokenId: any) {
  try {
    const totalOffers = await marketplace.call("totalOffers");
    if (!totalOffers || totalOffers?.toNumber() <= 0) return null;
    const validOffers = await marketplace.call(
      "getAllValidOffers",
      0,
      totalOffers?.toNumber() - 1 >= 0 ? totalOffers?.toNumber() - 1 : 0
    );
    console.log(validOffers);
    return serializable(validOffers, totalOffers);
  } catch (err) {
    console.log(err);
    return [];
  }
}

////MULTICALL FUNCTIONS////////////////////////////////
////////////////////////////////////////////////////////

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

//////HOOKS/////////////////////////////////////////////
////////////////////////////////////////////////////////

//Get all unique collections from Marketplace
export function useAllCollections(
  validListings: DirectListing[],
  validAuctions: AuctionListing[]
) {
  const [collections, setCollections] = useState<any>([]);

  useEffect(() => {
    if (validListings || validAuctions) {
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

      setCollections([...filteredAuctions, ...filteredListings]);
    }
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

export function useClaimableAuction(
  winningBid: number,
  buyoutBidAmount: number
) {
  const claimable = useMemo(() => {
    return winningBid >= +buyoutBidAmount / MOONEY_DECIMALS;
  }, [winningBid, buyoutBidAmount]);
  return claimable;
}

export function useStats(contractAddress: string, tokenId: string) {
  const [validListings, setValidListings] = useState<any>([]);
  const [validAuctions, setValidAuctions] = useState<any>([]);

  const { listings: assetListings, auctions: assetAuctions } =
    useListingsAndAuctionsForTokenId(
      validListings,
      validAuctions,
      tokenId,
      contractAddress
    );

  const [stats, setStats] = useState<AssetStats>({
    floorPrice: 0,
    supply: 0,
    owners: 0,
  });

  function getFloorPrice() {
    //get floor price for validListings
    const listingFloor = assetListings[0]
      ? assetListings.reduce((acc: any, listing: any) => {
          if (!acc) return listing.pricePerToken;
          if (listing.pricePerToken < acc) return listing.pricePerToken;
          return acc;
        }).pricePerToken
      : 0;

    //get floor price for validAuctions
    const auctionFloor = assetAuctions[0]
      ? assetAuctions.reduce((acc: any, auction: any) => {
          if (!acc) return auction.buyoutBidAmount;
          if (auction.buyout < acc) return auction.buyoutBidAmount;
          return acc;
        }).buyoutBidAmount
      : 0;

    //true floor price for asset
    if (listingFloor === 0) return auctionFloor;
    if (auctionFloor === 0) return listingFloor;
    return listingFloor < auctionFloor ? listingFloor : auctionFloor;
  }

  useEffect(() => {
    if (contractAddress && tokenId) {
      const sdk = initSDK();
      sdk.getContract(MARKETPLACE_ADDRESS).then((marketplace: any) => {
        getAllValidListings(marketplace).then((listings: any) => {
          setValidListings(listings);
        });
        getAllValidAuctions(marketplace).then((auctions: any) => {
          setValidAuctions(auctions);
        });
      });
    }
  }, [contractAddress, tokenId]);

  useEffect(() => {
    if (assetListings && assetAuctions) {
      console.log("LISTINGS", assetListings, assetAuctions);
      const floorPrice = getFloorPrice();
      setStats((prev: any) => ({
        ...prev,
        floorPrice: +floorPrice / MOONEY_DECIMALS,
      }));
    }
  }, [assetListings, assetAuctions]);

  return stats;
}