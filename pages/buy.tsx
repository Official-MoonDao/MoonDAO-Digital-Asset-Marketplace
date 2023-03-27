import { useActiveListings, useContract } from "@thirdweb-dev/react";
import CollectionGrid from "../components/Collection/CollectionGrid";
import Container from "../components/Container/Container";
import { MARKETPLACE_ADDRESS } from "../const/contractAddresses";

export default function Buy() {
  const { contract: marketplace } = useContract(
    MARKETPLACE_ADDRESS,
    "marketplace"
  );

  const { data: listings, isLoading } = useActiveListings(marketplace);

  console.log(listings);

  return (
    <Container maxWidth="lg" className="">
      <h1>Buy NFTs</h1>
      {marketplace && listings && listings[0] ? (
        <>
          <p>Pick from a collection</p>
          <CollectionGrid
            collections={listings?.map((l) => ({
              address: l.assetContractAddress,
            }))}
          />
        </>
      ) : (
        <p>no collections are available at this time</p>
      )}
    </Container>
  );
}
