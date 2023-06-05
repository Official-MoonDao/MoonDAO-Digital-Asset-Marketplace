import CollectionGrid from "../components/Collection/CollectionGrid";
import Container from "../components/Container/Container";
import { MARKETPLACE_ADDRESS } from "../const/config";
import {
  getAllValidAuctions,
  getAllValidListings,
  useAllCollections,
} from "../lib/marketplace-v3";
import { initSDK } from "../lib/thirdweb";

export default function Buy({ validListings, validAuctions }: any) {
  const collections = useAllCollections(validListings, validAuctions);
  console.log(collections);
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
  const validListings = await getAllValidListings(marketplace);
  const validAuctions = await getAllValidAuctions(marketplace);
  return {
    props: { validListings, validAuctions },
  };
}
