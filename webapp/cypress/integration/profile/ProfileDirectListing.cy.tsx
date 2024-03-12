import React from "react";
import { DirectListing } from "../../../lib/marketplace/marketplace-utils";
import { ThirdwebProvider } from "@thirdweb-dev/react";
import { MOONEY_DECIMALS } from "../../../const/config";
import ProfileDirectListing from "../../../components/Profile/ProfileDirectListing";

describe("<ProfileDirectListing />", () => {
  let dummyDirectListings: DirectListing[];
  before(() => {
    cy.fixture("listings/direct-listings").then(
      (listings) => (dummyDirectListings = listings)
    );
  });
  it("Renders Profile Direct Listing", () => {
    const { asset, quantity, pricePerToken, endTimestamp } =
      dummyDirectListings[0];

    cy.mount(
      <ThirdwebProvider>
        <ProfileDirectListing
          listing={dummyDirectListings[0]}
          walletAddress="0x0"
        />
      </ThirdwebProvider>
    );

    cy.get("#profile-direct-asset-name").should("have.text", asset.name);

    cy.get("#profile-direct-asset-quantity").should("have.text", quantity);

    cy.get("#profile-direct-asset-buyout").should(
      "have.text",
      `${Math.round(+pricePerToken / MOONEY_DECIMALS)} MOONEY`
    );

    cy.get("#profile-direct-asset-exp").should(
      "have.text",
      `${new Date(+endTimestamp * 1000).toLocaleDateString()} @ ${new Date(
        +endTimestamp * 1000
      ).toLocaleTimeString()}`
    );
  });
});
