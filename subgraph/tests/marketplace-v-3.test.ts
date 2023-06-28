import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { Address, BigInt, Bytes } from "@graphprotocol/graph-ts"
import { ContractURIUpdated } from "../generated/schema"
import { ContractURIUpdated as ContractURIUpdatedEvent } from "../generated/MarketplaceV3/MarketplaceV3"
import { handleContractURIUpdated } from "../src/marketplace-v-3"
import { createContractURIUpdatedEvent } from "./marketplace-v-3-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let prevURI = "Example string value"
    let newURI = "Example string value"
    let newContractURIUpdatedEvent = createContractURIUpdatedEvent(
      prevURI,
      newURI
    )
    handleContractURIUpdated(newContractURIUpdatedEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("ContractURIUpdated created and stored", () => {
    assert.entityCount("ContractURIUpdated", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "ContractURIUpdated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "prevURI",
      "Example string value"
    )
    assert.fieldEquals(
      "ContractURIUpdated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "newURI",
      "Example string value"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
