import React from "react";
import AssetPreview from "../../../components/Collection/AssetPreview";
import * as NextRouter from "next/router";
import {
  AuctionListing,
  DirectListing,
} from "../../../lib/marketplace/marketplace-utils";
import { ThirdwebProvider } from "@thirdweb-dev/react";
import CollectionPreview from "../../../components/Collection/CollectionPreview";
describe("<CollectionPreview />", () => {
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
  it("Renders Collection Preview", () => {
    const { assetContractAddress } = dummyDirectListings[0];

    cy.mount(
      <ThirdwebProvider>
        <CollectionPreview
          collection={dummyDirectListings[0]}
          validAuctions={dummyAuctionListings}
          validListings={dummyDirectListings}
        />
      </ThirdwebProvider>
    );

    cy.get("a").should(
      "have.attr",
      "href",
      `/collection/${assetContractAddress}`
    );
  });
});
