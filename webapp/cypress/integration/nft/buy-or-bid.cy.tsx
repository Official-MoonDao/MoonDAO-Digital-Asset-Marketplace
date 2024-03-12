import React from "react";
import { DirectListing } from "../../../lib/marketplace/marketplace-utils";
import BuyOrBid from "../../../components/NFT/BuyOrBid";
import { ThirdwebProvider } from "@thirdweb-dev/react";

describe("<BuyOrBid />", () => {
  let dummyDirectListings: DirectListing[];
  before(() => {
    cy.fixture("listings/direct-listings").then(
      (listings) => (dummyDirectListings = listings)
    );
  });

  it("Renders Buy Or Bid", () => {
    const { assetContractAddress, tokenId } = dummyDirectListings[0];

    cy.mountNextRouter(`/collection/${assetContractAddress}/${tokenId}`);

    cy.mount(
      <ThirdwebProvider>
        <BuyOrBid
          marketplace={undefined}
          walletAddress=""
          winningBid={"1"}
          currListing={{ type: "direct", listing: dummyDirectListings[0] }}
        />
      </ThirdwebProvider>
    );

    cy.get("#buy-asset-container")
      .get("button")
      .should("have.text", `Connect Wallet`);
  });
});
