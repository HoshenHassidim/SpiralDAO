import {
  MemberRegistered as MemberRegisteredEvent,
  MemberUnregistered as MemberUnregisteredEvent
} from "../generated/Membership/Membership"
import { MemberRegistered, MemberUnregistered } from "../generated/schema"

export function handleMemberRegistered(event: MemberRegisteredEvent): void {
  let entity = new MemberRegistered(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.memberAddress = event.params.memberAddress

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleMemberUnregistered(event: MemberUnregisteredEvent): void {
  let entity = new MemberUnregistered(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.memberAddress = event.params.memberAddress

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
