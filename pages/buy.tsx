import { useEffect } from "react";
import CollectionGrid from "../components/Collection/CollectionGrid";
import Container from "../components/Container/Container";
import { MARKETPLACE_ADDRESS } from "../const/contractAddresses";
import {
  getAllValidAuctions,
  getAllValidListings,
  useAllCollections,
} from "../lib/marketplace-v3";
import { initSDK } from "../lib/thirdweb";

export default function Buy({ listings, auctions }: any) {
  const collections = useAllCollections(listings, auctions);
  return (
    <Container maxWidth="lg" className="">
      <h1>Buy NFTs</h1>
      {collections ? (
        <>
          <p>Pick from a collection</p>
          <CollectionGrid collections={collections} />
        </>
      ) : (
        <p>no collections are available at this time</p>
      )}
    </Container>
  );
}

export async function getServerSideProps() {
  const sdk = initSDK();
  const marketplace = await sdk.getContract(MARKETPLACE_ADDRESS);
  const listings = await getAllValidListings(marketplace);
  const auctions = await getAllValidAuctions(marketplace);
  return {
    props: { listings, auctions },
  };
}
