import React from "react";
import Hero from "../../../components/Home/Hero";
describe("<Hero />", () => {
  let dummyListings: any;
  before(() => {
    cy.fixture("listings/direct-listings").then(
      (listings) => (dummyListings = listings)
    );
  });
  it("Renders Hero", () => {
    cy.mount(<Hero topAssets={dummyListings} />);
    cy.get("img")
      .should("have.attr", "src")
      .then((src) => {
        expect(src).to.equal(dummyListings[0].asset.image);
      });
  });
});
