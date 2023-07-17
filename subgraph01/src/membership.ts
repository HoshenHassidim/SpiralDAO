import {
  MemberRegistered as MemberRegisteredEvent,
  MemberUnregistered as MemberUnregisteredEvent,
} from "../generated/Membership/Membership";
import {
  MemberRegistered,
  MemberUnregistered,
  ActiveMember,
} from "../generated/schema";
import { store } from "@graphprotocol/graph-ts";

export function handleMemberRegistered(event: MemberRegisteredEvent): void {
  let entity = new MemberRegistered(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.memberAddress = event.params.memberAddress;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();

  // Add the member to the ActiveMember table
  let activeMember = new ActiveMember(event.params.memberAddress);
  activeMember.memberAddress = event.params.memberAddress;
  activeMember.save();
}

export function handleMemberUnregistered(event: MemberUnregisteredEvent): void {
  let entity = new MemberUnregistered(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.memberAddress = event.params.memberAddress;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();

  // Remove the member from the ActiveMember table
  let activeMember = ActiveMember.load(event.params.memberAddress);
  if (activeMember) {
    store.remove("ActiveMember", activeMember.id.toHexString());
  }
}
