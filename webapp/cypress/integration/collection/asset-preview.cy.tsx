import React from "react";
import AssetPreview from "../../../components/Collection/AssetPreview";
import * as NextRouter from "next/router";
import {
  AuctionListing,
  DirectListing,
} from "../../../lib/marketplace/marketplace-utils";
import { ThirdwebProvider } from "@thirdweb-dev/react";
describe("<AssetPreview />", () => {
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
  it("Renders Asset Preview", () => {
    const { assetContractAddress, tokenId } = dummyDirectListings[0];

    cy.mount(
      <ThirdwebProvider>
        <AssetPreview
          listing={dummyDirectListings[0]}
          validAuctions={dummyAuctionListings}
          validListings={dummyDirectListings}
        />
      </ThirdwebProvider>
    );

    cy.get("img")
      .should("have.attr", "src")
      .then((src) => {
        expect(src).to.equal(dummyDirectListings[0].asset.image);
      });

    //get anchor tag
    cy.get("a").should("have.attr", "href", `/collection/${assetContractAddress}/${tokenId}`);
  });
});
