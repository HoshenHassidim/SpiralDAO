import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { BigInt, Address } from "@graphprotocol/graph-ts"
import { ManagementOfferCancelled } from "../generated/schema"
import { ManagementOfferCancelled as ManagementOfferCancelledEvent } from "../generated/Projects/Projects"
import { handleManagementOfferCancelled } from "../src/projects"
import { createManagementOfferCancelledEvent } from "./projects-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let offerId = BigInt.fromI32(234)
    let newManagementOfferCancelledEvent = createManagementOfferCancelledEvent(
      offerId
    )
    handleManagementOfferCancelled(newManagementOfferCancelledEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("ManagementOfferCancelled created and stored", () => {
    assert.entityCount("ManagementOfferCancelled", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "ManagementOfferCancelled",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "offerId",
      "234"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
