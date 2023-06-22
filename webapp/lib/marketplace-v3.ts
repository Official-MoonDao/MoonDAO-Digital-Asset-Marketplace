import { useEffect, useMemo, useState } from "react";
import {
  AssetStats,
  AuctionListing,
  CollectionStats,
  DirectListing,
  serializable,
} from "./utils";
import { initSDK } from "./thirdweb";
import { MARKETPLACE_ADDRESS, MOONEY_DECIMALS, NETWORK } from "../const/config";
import {
  SmartContract,
  ThirdwebSDK,
  getAllDetectedFeatureNames,
} from "@thirdweb-dev/sdk";
import {
  useContract,
  useContractRead,
  useNFTs,
  useNetwork,
  useNetworkMismatch,
  useSigner,
} from "@thirdweb-dev/react";
import { Goerli } from "@thirdweb-dev/chains";
import { toast } from "react-hot-toast";
import { AnyMapping } from "three";

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

export async function multiCreateListings(
  marketplace: any,
  queuedListings: any,
  queuedAuctions: any
) {
  try {
    const encodedData = [];

    if (queuedListings.length > 0) {
      encodedData.push(
        ...queuedListings.map((listing: any) =>
          marketplace.interface.encodeFunctionData("createListing", [listing])
        )
      );
    }

    if (queuedAuctions.length > 0) {
      encodedData.push(
        ...queuedAuctions.map((auction: any) =>
          marketplace.interface.encodeFunctionData("createAuction", [auction])
        )
      );
    }

    const totalListingGas = Number(
      await queuedListings.reduce(
        async (arr: number, l: any) =>
          arr + (await marketplace.estimateGas.createListing(l)),
        0
      )
    );

    if (encodedData.length > 0) {
      const multicallTx = await marketplace.multicall(encodedData, {
        gasLimit: totalListingGas,
      });
      console.log(multicallTx);
      return multicallTx;
    } else throw new Error("No data to encode");
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
  validListings: DirectListing[],
  validAuctions: AuctionListing[],
  tokenId: string | number,
  contractAddress: string
) {
  const [listings, setListings] = useState<any>([]);
  const [auctions, setAuctions] = useState<any>([]);

  useEffect(() => {
    if (validListings && validAuctions && contractAddress) {
      const filteredListings =
        validListings[0] &&
        validListings?.filter(
          (l: DirectListing) =>
            l.assetContract.toLowerCase() === contractAddress.toLowerCase() &&
            +l.tokenId === Number(tokenId)
        );
      const filteredAuctions =
        validAuctions[0] &&
        validAuctions?.filter(
          (a: any) =>
            a.assetContract.toLowerCase() === contractAddress.toLowerCase() &&
            +a.tokenId === Number(tokenId)
        );
      setListings(filteredListings || []);
      setAuctions(filteredAuctions || []);
    }
  }, [validListings, validAuctions, contractAddress, tokenId]);

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
    if (validListings && validAuctions && walletAddress) {
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
    if (walletAddress && validListings && validAuctions) {
      const filteredListings =
        validListings[0] &&
        validListings?.filter(
          (l: DirectListing) =>
            l.seller &&
            l?.seller?.toLowerCase() === walletAddress?.toLowerCase() &&
            l.assetContract.toLowerCase() === collectionAddress.toLowerCase() &&
            +l.tokenId === Number(tokenId)
        );
      const filteredAuctions =
        validAuctions[0] &&
        validAuctions?.filter(
          (a: AuctionListing) =>
            a?.seller &&
            a.seller?.toLowerCase() === walletAddress?.toLowerCase() &&
            a.assetContract.toLowerCase() === collectionAddress.toLowerCase() &&
            +a.tokenId === Number(tokenId)
        );
      setListings(filteredListings);
      setAuctions(filteredAuctions);
    }
  }, [validListings, validAuctions, walletAddress]);

  return { listings, auctions };
}

//Get all NFTs from collections accepted by the marketplace by wallet
export function useUserAssets(
  marketplace: SmartContract,
  validListings: DirectListing[],
  validAuctions: AuctionListing[],
  walletAddress: string
) {
  const [assets, setAssets] = useState<any>([]);

  const signer: any = useSigner();
  const networkMismatch = useNetworkMismatch();

  const { listings: profileListings, auctions: profileAuctions } =
    useListingsAndAuctionsForWallet(
      validListings,
      validAuctions,
      walletAddress
    );

  useEffect(() => {
    if (marketplace && signer && profileListings && profileAuctions) {
      marketplace.roles.get("asset").then(async (res: any) => {
        setAssets([]);
        await res.forEach(async (collection: any) => {
          if (networkMismatch) return;
          const sdk: ThirdwebSDK = ThirdwebSDK.fromSigner(signer, NETWORK);
          const contract: any = await sdk.getContract(collection);
          const extensions = getAllDetectedFeatureNames(contract.abi);
          let ownedAssets: any;
          if (extensions[0] === "ERC1155") {
            ownedAssets = await contract.erc1155.getOwned(signer.address);
            //Create a new array of ownedAssets with quantityOwned updated to reflect the number of assets not listed on the marketplace

            console.log(ownedAssets);
            ownedAssets = await ownedAssets.map((asset: any) => {
              const ownedQuantity = asset.quantityOwned;

              //only count direct listings, auction listings are automatically subtracted from asset.quantityOwned
              const listedQuantity = profileListings?.reduce(
                (arr: number, listing: any) =>
                  listing.assetContract.toLowerCase() ===
                    collection.toLowerCase() &&
                  listing.tokenId === asset.metadata.id
                    ? arr + Number(listing?.quantity)
                    : arr,
                0
              );

              return {
                ...asset,
                collection,
                quantityOwned: ownedQuantity - listedQuantity,
              };
            });
          } else {
            ownedAssets = await contract.erc721.getOwned(signer.address);
            ownedAssets = ownedAssets.filter(
              (asset: any) =>
                !profileListings?.find(
                  (listing: any) =>
                    listing.assetContract === collection &&
                    listing.tokenId === asset.metadata.id
                ) &&
                !profileAuctions?.find(
                  (auction: any) =>
                    auction.assetContract === collection &&
                    auction.tokenId === asset.metadata.id
                )
            );
          }

          const collectionName = await contract.call("name");

          //add collection data to ownedAssets
          ownedAssets = await ownedAssets.map((asset: any) => ({
            ...asset,
            collection,
            collectionName,
          }));

          //add ownedAssets to assets array and filter out any duplicates (on address change duplicates are created and then filtered out, this is a quick fix)
          ownedAssets.length > 0 &&
            setAssets((prev: any) => [
              ...prev.filter((a: any) => a.collection !== collection),
              ...ownedAssets,
            ]);
        });
      });
    }
  }, [marketplace, signer, profileListings, profileAuctions]);
  return assets;
}

//Check if ended auction has a payout
export function useClaimableAuction(
  winningBid: number,
  buyoutBidAmount: number,
  endTimestamp: string | number
) {
  const claimable = useMemo(() => {
    const now = Date.now() / 1000;
    return (
      winningBid >= +buyoutBidAmount / MOONEY_DECIMALS ||
      (winningBid > 0 && +endTimestamp < now)
    );
  }, [winningBid, buyoutBidAmount]);
  return claimable;
}

/////STATS/////////////////////////////////////////////
////////////////////////////////////////////////////////

function getFloorPrice(listings: DirectListing[], auctions: AuctionListing[]) {
  //get floor price for validListings
  const listingFloor =
    listings && listings[0]
      ? Math.min(...listings.map((listing) => +listing.pricePerToken))
      : 0; //get floor price for validAuctions
  const auctionFloor =
    auctions && auctions[0]
      ? Math.min(...auctions.map((auction) => +auction.buyoutBidAmount))
      : 0;

  //true floor price for asset
  if (listingFloor === 0) return auctionFloor;
  if (auctionFloor === 0) return listingFloor;
  return +listingFloor < +auctionFloor ? listingFloor : auctionFloor;
}

//Get stats for a specific asset
export function useAssetStats(
  validListings: DirectListing[],
  validAuctions: AuctionListing[],
  contractAddress: string,
  tokenId: string
) {
  const [stats, setStats] = useState<AssetStats>({
    floorPrice: 0,
    owners: 0,
    supply: 0,
  });

  const { contract }: any = useContract(contractAddress);

  const { listings: assetListings, auctions: assetAuctions } =
    useListingsAndAuctionsForTokenId(
      validListings,
      validAuctions,
      tokenId,
      contractAddress
    );

  useEffect(() => {
    let floorPrice, owners, supply;
    if (assetListings && assetAuctions && contract) {
      floorPrice =
        +getFloorPrice(assetListings, assetAuctions) / MOONEY_DECIMALS;
      const extensions = getAllDetectedFeatureNames(contract?.abi);
      (async () => {
        if (extensions[0] !== "ERC1155") {
          const allOwners = await contract.erc721.getAllOwners();
          owners = new Set(
            allOwners.map((o: any) => o.tokenId === tokenId && o.owner)
          ).size;
          supply = await contract.erc721.totalCount();
        } else {
          supply = await contract.erc1155.totalSupply(tokenId);
        }
        setStats({
          floorPrice: floorPrice || 0,
          owners: owners || 0,
          supply: supply?.toNumber() || 0,
        });
      })();
    }
  }, [assetListings, assetAuctions, contract]);

  return stats;
}

//Get stats for a speicific collection
export function useCollectionStats(
  validListings: DirectListing[],
  validAuctions: AuctionListing[],
  collectionContract: any
) {
  const [collectionListings, setCollectionListings] = useState<any>([]);
  const [collectionAuctions, setCollectionAuctions] = useState<any>([]);

  const [stats, setStats] = useState<CollectionStats>({
    floorPrice: 0,
    listed: 0,
    supply: 0,
  });
  //Get nfts for a specific collection
  useEffect(() => {
    if (!collectionContract) return;
    if (validListings) {
      const filteredListings =
        validListings[0] &&
        validListings?.filter(
          (l: DirectListing) =>
            l.assetContract.toLowerCase() ===
            collectionContract.getAddress().toLowerCase()
        );
      setCollectionListings(filteredListings);
    }
    if (validAuctions) {
      const filteredAuctions =
        validAuctions[0] &&
        validAuctions?.filter(
          (a: AuctionListing) =>
            a.assetContract.toLowerCase() ===
            collectionContract.getAddress().toLowerCase()
        );
      setCollectionAuctions(filteredAuctions);
    }
  }, [validListings, validAuctions, collectionContract]);

  //Get stats
  useEffect(() => {
    if (collectionContract && (collectionListings || collectionAuctions)) {
      const floorPrice = getFloorPrice(collectionListings, collectionAuctions);
      const listed =
        collectionListings.reduce(
          (arr: number, l: any) => arr + Number(l.quantity),
          0
        ) +
        collectionAuctions.reduce(
          (arr: number, a: any) => arr + Number(a.quantity),
          0
        );

      let supply: any;
      (async () => {
        const extensions = getAllDetectedFeatureNames(collectionContract?.abi);
        if (extensions[0] === "ERC1155") {
          supply = await collectionContract.erc1155.totalCount();
        } else {
          supply = await collectionContract.erc721.totalCount();
        }
        setStats({
          floorPrice: +floorPrice / MOONEY_DECIMALS,
          listed,
          supply: supply?.toNumber() || 0,
        });
      })();
    }
  }, [collectionListings, collectionAuctions]);
  return stats;
}

//Search for collection or asset by name, return collection or asset url
export function useSearch(
  text: string,
  validListings: DirectListing[],
  validAuctions: AuctionListing[]
) {
  const [validAssets, setValidAssets] = useState<any>([]);
  const [searchResults, setSearchResults] = useState<any>([]);

  function uniqueAssets() {
    if (validListings || validAuctions) {
      const listings = validListings;
      const auctions = validAuctions;
      const uniqueAssets: any = [];
      const filteredAssets: any = [];
      const length: number =
        listings.length > auctions.length ? listings.length : auctions.length;
      for (let i = 0; i < length; i++) {
        if (
          listings[i] &&
          !uniqueAssets.includes(
            listings[i].assetContract + listings[i].tokenId
          )
        ) {
          const tokenId: any = listings[i].tokenId;
          uniqueAssets.push(listings[i].assetContract + tokenId);
          filteredAssets.push(listings[i]);
        }
        if (
          auctions[i] &&
          !uniqueAssets.includes(
            auctions[i].assetContract + auctions[i].tokenId
          )
        ) {
          const tokenId: any = auctions[i].tokenId;
          uniqueAssets.push(auctions[i].assetContract + tokenId);
          filteredAssets.push(auctions[i]);
        }
      }
      setValidAssets(filteredAssets);
    }
  }

  useEffect(() => {
    uniqueAssets();
  }, [validListings, validAuctions]);

  useEffect(() => {
    if (!text || text?.trim() === "" || text.length < 2) return;
    //update unique assets
    uniqueAssets();

    validAssets.map(async (l: any) => {
      setSearchResults([]);
      const sdk = initSDK();
      const contract: any = await sdk.getContract(l.assetContract);

      const extensions = getAllDetectedFeatureNames(contract.abi);
      let nft: any;
      if (extensions[0] === "ERC1155") {
        nft = {
          ...(await contract.erc1155.get(l.tokenId)),
          collection: l.assetContract,
        };
      } else {
        nft = {
          ...(await contract.erc721.get(l.tokenId)),
          collection: l.assetContract,
        };
      }
      if (nft.metadata.name.toLowerCase().includes(text.toLowerCase()))
        setSearchResults((prev: any) => [...prev, nft]);
    });
  }, [text]);

  return searchResults;
}
