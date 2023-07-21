import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { BigInt, Address } from "@graphprotocol/graph-ts"
import { NewOffer } from "../generated/schema"
import { NewOffer as NewOfferEvent } from "../generated/Tasks/Tasks"
import { handleNewOffer } from "../src/tasks"
import { createNewOfferEvent } from "./tasks-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let offerId = BigInt.fromI32(234)
    let taskId = BigInt.fromI32(234)
    let offeror = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let newNewOfferEvent = createNewOfferEvent(offerId, taskId, offeror)
    handleNewOffer(newNewOfferEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("NewOffer created and stored", () => {
    assert.entityCount("NewOffer", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "NewOffer",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "offerId",
      "234"
    )
    assert.fieldEquals(
      "NewOffer",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "taskId",
      "234"
    )
    assert.fieldEquals(
      "NewOffer",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "offeror",
      "0x0000000000000000000000000000000000000001"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
