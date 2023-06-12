import CollectionGrid from "../components/Collection/CollectionGrid";
import SectionHeader from "../components/SectionHeader";
import { MARKETPLACE_ADDRESS } from "../const/config";
import { getAllValidAuctions, getAllValidListings, useAllCollections } from "../lib/marketplace-v3";
import { initSDK } from "../lib/thirdweb";
import VerticalStar from "../assets/VerticalStar";

export default function Buy({ validListings, validAuctions }: any) {
  const collections = useAllCollections(validListings, validAuctions);
  /*Reminder to remove Console Logs before Live*/
  //Remove containers and styling
  console.log(collections);
  return (
    <div className="pt-10 md:pt-12 lg:pt-16 xl:pt-20 m flex flex-col items-center w-full">
      <div className="flex flex-col items-center md:items-start">
        {/*Title*/}
        <h2 className="font-GoodTimes tracking-wide flex items-center text-3xl lg:text-4xl bg-clip-text text-transparent bg-gradient-to-br from-moon-secondary to-indigo-100">
          Buy NFTS
          <span className="ml-2 lg:ml-4">
            <VerticalStar />
          </span>
        </h2>
        {/*Collection Grid with coollection preview components inside*/}
        {collections ? (
          <>
            <p className="mt-[14px] lg:mt-6">Pick from a collection</p>
            <CollectionGrid collections={collections} />
          </>
        ) : (
          <p className="mt-[14px] lg:mt-6">No collections available at this time.</p>
        )}
      </div>
    </div>
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
