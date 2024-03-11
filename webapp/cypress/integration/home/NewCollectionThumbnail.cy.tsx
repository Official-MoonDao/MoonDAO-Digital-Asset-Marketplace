import React from "react";
import {
  AuctionListing,
  DirectListing,
} from "../../../lib/marketplace/marketplace-utils";
import { ThirdwebProvider } from "@thirdweb-dev/react";
import NewCollectionThumbnail from "../../../components/Home/Showcases/NewCollectionThumbnail";

describe("<NewCollectionThumbnail />", () => {
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
  it("Renders New Collection Thumbnail", () => {
    const { assetContractAddress } = dummyDirectListings[0];

    cy.mount(
      <ThirdwebProvider>
        <NewCollectionThumbnail
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
