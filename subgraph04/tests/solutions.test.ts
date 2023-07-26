import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { BigInt, Address } from "@graphprotocol/graph-ts"
import { SolutionCancelled } from "../generated/schema"
import { SolutionCancelled as SolutionCancelledEvent } from "../generated/Solutions/Solutions"
import { handleSolutionCancelled } from "../src/solutions"
import { createSolutionCancelledEvent } from "./solutions-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let solutionId = BigInt.fromI32(234)
    let newSolutionCancelledEvent = createSolutionCancelledEvent(solutionId)
    handleSolutionCancelled(newSolutionCancelledEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("SolutionCancelled created and stored", () => {
    assert.entityCount("SolutionCancelled", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "SolutionCancelled",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "solutionId",
      "234"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
