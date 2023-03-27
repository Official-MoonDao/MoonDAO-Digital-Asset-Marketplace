import { useActiveListings, useContract } from "@thirdweb-dev/react";
import { useEffect, useState } from "react";
import CollectionGrid from "../components/Collection/CollectionGrid";
import Container from "../components/Container/Container";
import { MARKETPLACE_ADDRESS } from "../const/contractAddresses";

export default function Buy() {
  const { contract: marketplace } = useContract(
    MARKETPLACE_ADDRESS,
    "marketplace"
  );

  const { data: listings, isLoading } = useActiveListings(marketplace);
  const [collections, setCollections] = useState<any>([]);

  useEffect(() => {
    if (listings && listings[0]) {
      const uniqueCollectionAddresses: any = [];
      const filteredCollections = listings.filter(
        (l: any) =>
          !uniqueCollectionAddresses.includes(l.assetContractAddress) &&
          uniqueCollectionAddresses.push(l.assetContractAddress)
      );
      setCollections(filteredCollections);
    }
  }, [listings]);

  return (
    <Container maxWidth="lg" className="">
      <h1>Buy NFTs</h1>
      {marketplace && listings && listings[0] ? (
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
