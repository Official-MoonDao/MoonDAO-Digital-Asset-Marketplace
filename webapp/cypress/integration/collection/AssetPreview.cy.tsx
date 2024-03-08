import React from "react";
import AssetPreview from "../../../components/Collection/AssetPreview";
describe("<AssetPreview />", () => {
  let dummyDirectListings: any;
  let dummyAuctionListings: any;
  before(() => {
    cy.fixture("listings/direct-listings").then(
      (listings) => (dummyDirectListings = listings)
    );
    cy.fixture("listings/auction-listings").then(
      (auctions) => (dummyAuctionListings = auctions)
    );
  });
  it("Renders Asset Preview", () => {
    cy.mount(
      <AssetPreview
        listing={dummyDirectListings[0]}
        validAuctions={dummyAuctionListings}
        validListings={dummyDirectListings}
      />
    );
    cy.get("img")
      .should("have.attr", "src")
      .then((src) => {
        expect(src).to.equal(dummyDirectListings[0].asset.image);
      });
  });
});
