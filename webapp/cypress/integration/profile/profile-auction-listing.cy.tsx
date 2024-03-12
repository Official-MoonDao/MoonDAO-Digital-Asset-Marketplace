import React from "react";
import { AuctionListing } from "../../../lib/marketplace/marketplace-utils";
import { ThirdwebProvider } from "@thirdweb-dev/react";
import ProfileAuctionListing from "../../../components/Profile/ProfileAuctionListing";
import { MOONEY_DECIMALS } from "../../../const/config";

describe("<ProfileAuctionListing />", () => {
  let dummyAuctionListing: AuctionListing[];
  before(() => {
    cy.fixture("listings/auction-listings").then(
      (listings) => (dummyAuctionListing = listings)
    );
  });
  it("Renders Profile Auction Listing", () => {
    const { asset, quantity, buyoutBidAmount, minimumBidAmount, endTimestamp } =
      dummyAuctionListing[0];

    cy.mount(
      <ThirdwebProvider>
        <ProfileAuctionListing
          listing={dummyAuctionListing[0]}
          walletAddress="0x0"
          marketplace={undefined}
        />
      </ThirdwebProvider>
    );

    cy.get("#profile-auction-asset-name").should("have.text", asset.name);

    cy.get("#profile-auction-asset-quantity").should("have.text", quantity);

    cy.get("#profile-auction-asset-buyout").should(
      "have.text",
      `${Math.round(+buyoutBidAmount / MOONEY_DECIMALS)} MOONEY`
    );

    cy.get("#profile-auction-asset-min-bid").should(
      "have.text",
      `${Math.round(+minimumBidAmount / MOONEY_DECIMALS)} MOONEY`
    );

    cy.get("#profile-auction-asset-exp").should(
      "have.text",
      `${new Date(+endTimestamp * 1000).toLocaleDateString()} @ ${new Date(
        +endTimestamp * 1000
      ).toLocaleTimeString()}`
    );
  });
});
