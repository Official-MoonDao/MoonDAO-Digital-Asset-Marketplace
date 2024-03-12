import React from "react";
import SectionHeader from "../../../components/Layout/SectionHeader";
describe("<SectionHeader />", () => {
  it("Renders Section Header", () => {
    cy.mount(<SectionHeader title="test" />);
    cy.get("#section-header").contains("test");
  });
});
