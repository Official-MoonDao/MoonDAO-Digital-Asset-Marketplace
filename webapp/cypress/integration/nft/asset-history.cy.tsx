import React from "react";
import { DirectListing } from "../../../lib/marketplace/marketplace-utils";
import { ThirdwebProvider, ThirdwebSDK } from "@thirdweb-dev/react";
import AssetHistory from "../../../components/NFT/AssetHistory";
import { Mumbai } from "@thirdweb-dev/chains";

describe("<AssetHistory />", () => {
  let dummyDirectListings: DirectListing[];
  before(() => {
    cy.fixture("listings/direct-listings").then(
      (listings) => (dummyDirectListings = listings)
    );
  });
  it("Renders Asset History", async () => {
    const { assetContractAddress, tokenId } = dummyDirectListings[0];

    const sdk = new ThirdwebSDK(Mumbai);

    const contract = await sdk.getContract(assetContractAddress);

    cy.mount(
      <ThirdwebProvider>
        <AssetHistory contract={contract} tokenId={tokenId} />
      </ThirdwebProvider>
    );

    //check that length of asset transfer events is greater than 0
    cy.get("#asset-transfer-events")
      .children()
      .should("have.length.greaterThan", 0);
  });
});
