import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { BigInt, Address } from "@graphprotocol/graph-ts"
import { ProjectTokenCreated } from "../generated/schema"
import { ProjectTokenCreated as ProjectTokenCreatedEvent } from "../generated/TokenManagement/TokenManagement"
import { handleProjectTokenCreated } from "../src/token-management"
import { createProjectTokenCreatedEvent } from "./token-management-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let projectId = BigInt.fromI32(234)
    let problemCreator = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let solutionCreator = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let problemCreatorProjectTokens = BigInt.fromI32(234)
    let problemCreatorDaoTokens = BigInt.fromI32(234)
    let solutionCreatorProjectTokens = BigInt.fromI32(234)
    let solutionCreatorDaoTokens = BigInt.fromI32(234)
    let newProjectTokenCreatedEvent = createProjectTokenCreatedEvent(
      projectId,
      problemCreator,
      solutionCreator,
      problemCreatorProjectTokens,
      problemCreatorDaoTokens,
      solutionCreatorProjectTokens,
      solutionCreatorDaoTokens
    )
    handleProjectTokenCreated(newProjectTokenCreatedEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("ProjectTokenCreated created and stored", () => {
    assert.entityCount("ProjectTokenCreated", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "ProjectTokenCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "projectId",
      "234"
    )
    assert.fieldEquals(
      "ProjectTokenCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "problemCreator",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "ProjectTokenCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "solutionCreator",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "ProjectTokenCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "problemCreatorProjectTokens",
      "234"
    )
    assert.fieldEquals(
      "ProjectTokenCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "problemCreatorDaoTokens",
      "234"
    )
    assert.fieldEquals(
      "ProjectTokenCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "solutionCreatorProjectTokens",
      "234"
    )
    assert.fieldEquals(
      "ProjectTokenCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "solutionCreatorDaoTokens",
      "234"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
