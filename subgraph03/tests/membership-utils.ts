import { newMockEvent } from "matchstick-as"
import { ethereum, Address } from "@graphprotocol/graph-ts"
import {
  MemberRegistered,
  MemberUnregistered
} from "../generated/Membership/Membership"

export function createMemberRegisteredEvent(
  memberAddress: Address
): MemberRegistered {
  let memberRegisteredEvent = changetype<MemberRegistered>(newMockEvent())

  memberRegisteredEvent.parameters = new Array()

  memberRegisteredEvent.parameters.push(
    new ethereum.EventParam(
      "memberAddress",
      ethereum.Value.fromAddress(memberAddress)
    )
  )

  return memberRegisteredEvent
}

export function createMemberUnregisteredEvent(
  memberAddress: Address
): MemberUnregistered {
  let memberUnregisteredEvent = changetype<MemberUnregistered>(newMockEvent())

  memberUnregisteredEvent.parameters = new Array()

  memberUnregisteredEvent.parameters.push(
    new ethereum.EventParam(
      "memberAddress",
      ethereum.Value.fromAddress(memberAddress)
    )
  )

  return memberUnregisteredEvent
}
