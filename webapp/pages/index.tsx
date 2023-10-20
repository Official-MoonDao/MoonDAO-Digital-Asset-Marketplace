import Hero from "../components/Home/Hero";
import CollectionShowcase from "../components/Home/Showcases/CollectionShowcase";
import TrendingShowcase from "../components/Home/Showcases/TrendingShowcase";
import NewShowcase from "../components/Home/Showcases/NewShowcase";
import { initSDK } from "../lib/thirdweb";
import { MARKETPLACE_ADDRESS } from "../const/config";
import {
  getAllValidAuctions,
  getAllValidListings,
} from "../lib/marketplace/marketplace-listings";
import { useFilter } from "../lib/marketplace/marketplace-subgraph";
import {
  AuctionListing,
  DirectListing,
} from "../lib/marketplace/marketplace-utils";
import Metadata from "../components/Layout/Metadata";
import { useContract } from "@thirdweb-dev/react";
import { useEffect, useState } from "react";

type HomeProps = {
  _validListings: DirectListing[];
  _validAuctions: AuctionListing[];
};

export default function Home({ _validListings, _validAuctions }: HomeProps) {
  const { contract: marketplace } = useContract(
    MARKETPLACE_ADDRESS,
    "marketplace-v3"
  );

  const [validListings, setValidListings] =
    useState<DirectListing[]>(_validListings);
  const [validAuctions, setValidAuctions] =
    useState<AuctionListing[]>(_validAuctions);

  const { collections: trendingCollections, assets: trendingAssets } =
    useFilter("trending", validListings, validAuctions);

  const { collections: newCollections, assets: newAssets } = useFilter(
    "new",
    validListings,
    validAuctions
  );

  //Use SSG data if marketplace contract hasn't loaded yet
  useEffect(() => {
    if (marketplace) {
      getAllValidListings(marketplace).then((listings: DirectListing[]) => {
        setValidListings(listings);
      });
      getAllValidAuctions(marketplace).then((auctions: AuctionListing[]) => {
        setValidAuctions(auctions);
      });
    }
  }, [_validAuctions, _validListings]);

  return (
    <main className="flex flex-col items-center px-6 md:px-10">
      <Metadata title="Home" />
      <Hero
        topAssets={trendingAssets.slice(
          0,
          trendingAssets.length < 4 ? trendingAssets.length : 4
        )}
      />

      <CollectionShowcase
        collections={trendingCollections}
        validListings={validListings}
        validAuctions={validAuctions}
      />
      <TrendingShowcase
        assets={trendingAssets}
        validListings={validListings}
        validAuctions={validAuctions}
      />
      <NewShowcase
        collections={newCollections}
        validListings={validListings}
        validAuctions={validAuctions}
      />
    </main>
  );
}

export async function getStaticProps() {
  const sdk = initSDK();
  const marketplace = await sdk.getContract(
    MARKETPLACE_ADDRESS,
    "marketplace-v3"
  );
  const validListings: DirectListing[] = await getAllValidListings(marketplace);
  const validAuctions: AuctionListing[] = await getAllValidAuctions(
    marketplace
  );
  return {
    props: {
      _validListings: validListings,
      _validAuctions: validAuctions,
    },
    revalidate: 60,
  };
}
