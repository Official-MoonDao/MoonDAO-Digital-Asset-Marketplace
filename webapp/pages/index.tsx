import type { NextPage } from "next";
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
import { useEffect, useState } from "react";
import { useFilter } from "../lib/marketplace/marketplace-subgraph";
import {
  AuctionListing,
  DirectListing,
} from "../lib/marketplace/marketplace-utils";
import Metadata from "../components/Layout/Metadata";

type HomeProps = {
  validListings: DirectListing[];
  validAuctions: AuctionListing[];
};

export default function Home({ validListings, validAuctions }: HomeProps) {
  const { collections: trendingCollections, assets: trendingAssets } =
    useFilter("trending", validListings, validAuctions);

  const { collections: newCollections, assets: newAssets } = useFilter(
    "new",
    validListings,
    validAuctions
  );

  useEffect(() => {}, []);

  return (
    <main className="flex flex-col items-center px-6 md:px-10">
      <Metadata title="Home" />
      <Hero top4={trendingAssets.slice(0, 4)} />
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
      validListings,
      validAuctions,
    },
    revalidate: 60,
  };
}
