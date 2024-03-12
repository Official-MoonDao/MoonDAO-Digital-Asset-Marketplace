import React from "react";
import {
  AuctionListing,
  DirectListing,
} from "../../../lib/marketplace/marketplace-utils";
import { ThirdwebProvider } from "@thirdweb-dev/react";
import TrendingThumbnail from "../../../components/Home/Showcases/TrendingThumbnail";

describe("<TrendingThumbnail />", () => {
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
  it("Renders Trending Thumbnail", () => {
    const { assetContractAddress, tokenId } = dummyDirectListings[0];

    cy.mount(
      <ThirdwebProvider>
        <TrendingThumbnail
          asset={dummyDirectListings[0]}
          validAuctions={dummyAuctionListings}
          validListings={dummyDirectListings}
        />
      </ThirdwebProvider>
    );

    cy.get("a").should(
      "have.attr",
      "href",
      `/collection/${assetContractAddress}/${tokenId}`
    );

    cy.get("img").should(
      "have.attr",
      "src",
      dummyDirectListings[0].asset.image
    );
  });
});
