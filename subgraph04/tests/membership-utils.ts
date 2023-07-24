import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import {
  MemberRegistered,
  MemberRegisteredWithoutName,
  MemberUnregistered,
  ProblemAndSolutionAccepted,
  ProjectManaged,
  TaskAssignedtoMember
} from "../generated/Membership/Membership"

export function createMemberRegisteredEvent(
  memberAddress: Address,
  username: string
): MemberRegistered {
  let memberRegisteredEvent = changetype<MemberRegistered>(newMockEvent())

  memberRegisteredEvent.parameters = new Array()

  memberRegisteredEvent.parameters.push(
    new ethereum.EventParam(
      "memberAddress",
      ethereum.Value.fromAddress(memberAddress)
    )
  )
  memberRegisteredEvent.parameters.push(
    new ethereum.EventParam("username", ethereum.Value.fromString(username))
  )

  return memberRegisteredEvent
}

export function createMemberRegisteredWithoutNameEvent(
  memberAddress: Address
): MemberRegisteredWithoutName {
  let memberRegisteredWithoutNameEvent = changetype<
    MemberRegisteredWithoutName
  >(newMockEvent())

  memberRegisteredWithoutNameEvent.parameters = new Array()

  memberRegisteredWithoutNameEvent.parameters.push(
    new ethereum.EventParam(
      "memberAddress",
      ethereum.Value.fromAddress(memberAddress)
    )
  )

  return memberRegisteredWithoutNameEvent
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

export function createProblemAndSolutionAcceptedEvent(
  problemCreator: Address,
  problemAcceptedCount: BigInt,
  solutionCreator: Address,
  solutionAcceptedCount: BigInt
): ProblemAndSolutionAccepted {
  let problemAndSolutionAcceptedEvent = changetype<ProblemAndSolutionAccepted>(
    newMockEvent()
  )

  problemAndSolutionAcceptedEvent.parameters = new Array()

  problemAndSolutionAcceptedEvent.parameters.push(
    new ethereum.EventParam(
      "problemCreator",
      ethereum.Value.fromAddress(problemCreator)
    )
  )
  problemAndSolutionAcceptedEvent.parameters.push(
    new ethereum.EventParam(
      "problemAcceptedCount",
      ethereum.Value.fromUnsignedBigInt(problemAcceptedCount)
    )
  )
  problemAndSolutionAcceptedEvent.parameters.push(
    new ethereum.EventParam(
      "solutionCreator",
      ethereum.Value.fromAddress(solutionCreator)
    )
  )
  problemAndSolutionAcceptedEvent.parameters.push(
    new ethereum.EventParam(
      "solutionAcceptedCount",
      ethereum.Value.fromUnsignedBigInt(solutionAcceptedCount)
    )
  )

  return problemAndSolutionAcceptedEvent
}

export function createProjectManagedEvent(
  _member: Address,
  ProjectManagedCount: BigInt
): ProjectManaged {
  let projectManagedEvent = changetype<ProjectManaged>(newMockEvent())

  projectManagedEvent.parameters = new Array()

  projectManagedEvent.parameters.push(
    new ethereum.EventParam("_member", ethereum.Value.fromAddress(_member))
  )
  projectManagedEvent.parameters.push(
    new ethereum.EventParam(
      "ProjectManagedCount",
      ethereum.Value.fromUnsignedBigInt(ProjectManagedCount)
    )
  )

  return projectManagedEvent
}

export function createTaskAssignedtoMemberEvent(
  memberAddress: Address,
  taskCount: BigInt
): TaskAssignedtoMember {
  let taskAssignedtoMemberEvent = changetype<TaskAssignedtoMember>(
    newMockEvent()
  )

  taskAssignedtoMemberEvent.parameters = new Array()

  taskAssignedtoMemberEvent.parameters.push(
    new ethereum.EventParam(
      "memberAddress",
      ethereum.Value.fromAddress(memberAddress)
    )
  )
  taskAssignedtoMemberEvent.parameters.push(
    new ethereum.EventParam(
      "taskCount",
      ethereum.Value.fromUnsignedBigInt(taskCount)
    )
  )

  return taskAssignedtoMemberEvent
}
