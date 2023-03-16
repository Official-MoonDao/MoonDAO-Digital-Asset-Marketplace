import { useContract, useNFTs } from "@thirdweb-dev/react";
import React from "react";
import CollectionGrid from "../components/Collection/CollectionGrid";
import Container from "../components/Container/Container";
import {
  MARKETPLACE_ADDRESS,
  NFT_COLLECTION_ADDRESS,
} from "../const/contractAddresses";

const NFT_COLLECTIONS = [
  { type: "nft", address: "0xCF7241560C960783E1Bb90f233f8cfF782f7ABa1" },
  { type: "nft-drop", address: "0xdbb3aaA438e49a93c3E3E213AEbF2F5370993D2d" },
];

export default function Buy() {
  // const { contract: marketplace } = useContract(
  //   MARKETPLACE_ADDRESS,
  //   "marketplace-v3"
  // );

  // const { data: listings, isLoading } = useValidDirectListings(marketplace, {
  //   tokenContract: NFT_COLLECTION_ADDRESS,
  // });
  // console.log(listings);

  // let data = listings?.map((l) => ({ metadata: l.asset }));
  return (
    <Container maxWidth="lg">
      <h1>Buy NFTs</h1>
      <p>Pick from a collection</p>
      <CollectionGrid collections={NFT_COLLECTIONS} />
    </Container>
  );
}
