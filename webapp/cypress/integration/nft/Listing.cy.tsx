import React from "react";
import { DirectListing } from "../../../lib/marketplace/marketplace-utils";
import Listing from "../../../components/NFT/Listing";
import { MOONEY_DECIMALS } from "../../../const/config";

describe("<Listing />", () => {
  let dummyDirectListings: DirectListing[];
  before(() => {
    cy.fixture("listings/direct-listings").then(
      (listings) => (dummyDirectListings = listings)
    );
  });
  it("Renders Listing", () => {
    const { creatorAddress, quantity, pricePerToken } = dummyDirectListings[0];

    cy.mount(
      <Listing
        type="direct"
        listing={dummyDirectListings[0]}
        setCurrListing={() => {}}
      />
    );

    //seller address
    cy.get("p")
      .contains(creatorAddress.slice(0, 6) + "..." + creatorAddress.slice(-4))
      .should("exist");

    //quantity
    cy.get("p").contains(quantity).should("exist");

    //buyOut price
    cy.get("p")
      .contains((+pricePerToken / MOONEY_DECIMALS).toFixed(1))
      .should("exist");
  });
});
