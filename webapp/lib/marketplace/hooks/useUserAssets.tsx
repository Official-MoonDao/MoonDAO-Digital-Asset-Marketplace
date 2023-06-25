import {
  MarketplaceV3,
  ThirdwebSDK,
  getAllDetectedFeatureNames,
} from "@thirdweb-dev/sdk";
import { AuctionListing, DirectListing } from "../marketplace-utils";
import { useEffect, useState } from "react";
import { useNetworkMismatch, useSigner } from "@thirdweb-dev/react";
import { NETWORK } from "../../../const/config";
import { useListingsByWallet } from "./useListingsByWallet";

//Get all NFTs from collections accepted by the marketplace by wallet
export function useUserAssets(
  marketplace: MarketplaceV3 | undefined,
  validListings: DirectListing[],
  validAuctions: AuctionListing[],
  walletAddress: string
) {
  const [assets, setAssets] = useState<any>([]);

  const signer: any = useSigner();
  const networkMismatch = useNetworkMismatch();

  const { listings: profileListings, auctions: profileAuctions } =
    useListingsByWallet(validListings, validAuctions, walletAddress);

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