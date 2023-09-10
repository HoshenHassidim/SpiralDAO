import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { Address, BigInt } from "@graphprotocol/graph-ts"
import { MemberRegistered } from "../generated/schema"
import { MemberRegistered as MemberRegisteredEvent } from "../generated/Membership/Membership"
import { handleMemberRegistered } from "../src/membership"
import { createMemberRegisteredEvent } from "./membership-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let memberAddress = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let username = "Example string value"
    let newMemberRegisteredEvent = createMemberRegisteredEvent(
      memberAddress,
      username
    )
    handleMemberRegistered(newMemberRegisteredEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("MemberRegistered created and stored", () => {
    assert.entityCount("MemberRegistered", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "MemberRegistered",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "memberAddress",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "MemberRegistered",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "username",
      "Example string value"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})