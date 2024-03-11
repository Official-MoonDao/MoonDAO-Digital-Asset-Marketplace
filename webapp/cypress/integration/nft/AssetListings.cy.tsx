import React from "react";
import {
  AuctionListing,
  DirectListing,
} from "../../../lib/marketplace/marketplace-utils";
import { ThirdwebProvider } from "@thirdweb-dev/react";
import AssetListings from "../../../components/NFT/AssetListings";

describe("<AssetListings />", () => {
  let dummyDirectListings: DirectListing[];
  let dummyAuctionListings: AuctionListing[];
  before(() => {
    cy.fixture("listings/direct-listings").then(
      (listings) => (dummyDirectListings = listings)
    );
    cy.fixture("listings/auction-listings").then(
      (auctions) => (dummyAuctionListings = auctions)
    );
  });
  it("Renders Asset Listings", async () => {
    cy.mount(
      <AssetListings
        tab={"listings"}
        setTab={() => {}}
        auctionListings={dummyAuctionListings}
        directListings={dummyDirectListings}
        currListing={dummyDirectListings[0]}
        setCurrListing={() => {}}
      />
    );

    cy.get("#asset-direct-listings").children().should("have.length", 3);

    cy.get("#asset-auction-listings").children().should("have.length", 3);
  });
});
