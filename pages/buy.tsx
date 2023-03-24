import { useActiveListings, useContract, useNFTs } from "@thirdweb-dev/react";
import { GetStaticProps } from "next";
import React, { useEffect } from "react";
import CollectionGrid from "../components/Collection/CollectionGrid";
import Container from "../components/Container/Container";
import {
  MARKETPLACE_ADDRESS,
  NFT_COLLECTION_ADDRESS,
} from "../const/contractAddresses";

export default function Buy() {
  const { contract: marketplace } = useContract(
    MARKETPLACE_ADDRESS,
    "marketplace"
  );

  const { data: listings, isLoading } = useActiveListings(marketplace);

  return (
    <Container maxWidth="lg">
      <h1>Buy NFTs</h1>
      <p>Pick from a collection</p>
      {listings && listings[0] && (
        <CollectionGrid
          collections={listings?.map((l) => ({
            address: l.assetContractAddress,
          }))}
        />
      )}
    </Container>
  );
}
