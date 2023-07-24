import {
  MemberRegistered as MemberRegisteredEvent,
  MemberRegisteredWithoutName as MemberRegisteredWithoutNameEvent,
  MemberUnregistered as MemberUnregisteredEvent,
  ProblemAndSolutionAccepted as ProblemAndSolutionAcceptedEvent,
  ProjectManaged as ProjectManagedEvent,
  TaskAssignedtoMember as TaskAssignedtoMemberEvent
} from "../generated/Membership/Membership"
import {
  MemberRegistered,
  MemberRegisteredWithoutName,
  MemberUnregistered,
  ProblemAndSolutionAccepted,
  ProjectManaged,
  TaskAssignedtoMember
} from "../generated/schema"

export function handleMemberRegistered(event: MemberRegisteredEvent): void {
  let entity = new MemberRegistered(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.memberAddress = event.params.memberAddress
  entity.username = event.params.username

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleMemberRegisteredWithoutName(
  event: MemberRegisteredWithoutNameEvent
): void {
  let entity = new MemberRegisteredWithoutName(
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

export function handleProblemAndSolutionAccepted(
  event: ProblemAndSolutionAcceptedEvent
): void {
  let entity = new ProblemAndSolutionAccepted(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.problemCreator = event.params.problemCreator
  entity.problemAcceptedCount = event.params.problemAcceptedCount
  entity.solutionCreator = event.params.solutionCreator
  entity.solutionAcceptedCount = event.params.solutionAcceptedCount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleProjectManaged(event: ProjectManagedEvent): void {
  let entity = new ProjectManaged(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity._member = event.params._member
  entity.ProjectManagedCount = event.params.ProjectManagedCount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleTaskAssignedtoMember(
  event: TaskAssignedtoMemberEvent
): void {
  let entity = new TaskAssignedtoMember(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.memberAddress = event.params.memberAddress
  entity.taskCount = event.params.taskCount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
