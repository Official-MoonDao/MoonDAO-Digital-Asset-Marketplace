import { useEffect, useState } from "react";
import { AuctionListing, DirectListing } from "../../utils";
import { initSDK } from "../../thirdweb";
import { getAllDetectedFeatureNames } from "@thirdweb-dev/sdk";

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

  //limit search to 4 results
  return searchResults.slice(0, 4);
}
