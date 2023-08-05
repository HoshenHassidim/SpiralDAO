import {
  MemberRegistered as MemberRegisteredEvent,
  MemberRegisteredWithoutName as MemberRegisteredWithoutNameEvent,
  ProblemAndSolutionAccepted as ProblemAndSolutionAcceptedEvent,
  ProjectManaged as ProjectManagedEvent,
  TaskAssignedtoMember as TaskAssignedtoMemberEvent,
  UsernameChanged as UsernameChangedEvent,
} from "../generated/Membership/Membership";
import {
  MemberRegistered,
  MemberRegisteredWithoutName,
  ProblemAndSolutionAccepted,
  ProjectManaged,
  TaskAssignedtoMember,
  UsernameChanged,
  ActiveMember,
} from "../generated/schema";
import { BigInt, Bytes, store } from "@graphprotocol/graph-ts";

export function handleMemberRegistered(event: MemberRegisteredEvent): void {
  let entity = new MemberRegistered(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.memberAddress = event.params.memberAddress;
  entity.username = event.params.username;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();

  let activeMember = new ActiveMember(event.params.memberAddress);
  activeMember.memberAddress = event.params.memberAddress;
  activeMember.username = event.params.username;
  activeMember.blockNumber = event.block.number;
  activeMember.save();
}

export function handleMemberRegisteredWithoutName(
  event: MemberRegisteredWithoutNameEvent
): void {
  let entity = new MemberRegisteredWithoutName(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.memberAddress = event.params.memberAddress;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();

  let activeMember = new ActiveMember(event.params.memberAddress);
  activeMember.memberAddress = event.params.memberAddress;
  activeMember.blockNumber = event.block.number;
  activeMember.save();
}

export function handleProblemAndSolutionAccepted(
  event: ProblemAndSolutionAcceptedEvent
): void {
  let entity = new ProblemAndSolutionAccepted(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.problemCreator = event.params.problemCreator;
  entity.problemAcceptedCount = event.params.problemAcceptedCount;
  entity.solutionCreator = event.params.solutionCreator;
  entity.solutionAcceptedCount = event.params.solutionAcceptedCount;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleProjectManaged(event: ProjectManagedEvent): void {
  let entity = new ProjectManaged(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity._member = event.params._member;
  entity.ProjectManagedCount = event.params.ProjectManagedCount;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleTaskAssignedtoMember(
  event: TaskAssignedtoMemberEvent
): void {
  let entity = new TaskAssignedtoMember(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.memberAddress = event.params.memberAddress;
  entity.taskCount = event.params.taskCount;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleUsernameChanged(event: UsernameChangedEvent): void {
  let entity = new UsernameChanged(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity._member = event.params._member;
  entity._username = event.params._username;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();

  let activeMember = ActiveMember.load(event.params._member);
  if (activeMember) {
    activeMember.username = event.params._username;
    activeMember.save();
  }
}
