import { newMockEvent } from "matchstick-as"
import { ethereum, BigInt, Address } from "@graphprotocol/graph-ts"
import {
  ManagementOfferCancelled,
  ManagementOfferRated,
  NewManagementOffer,
  NewProject,
  NewProjectManagerRemovalOffer,
  ProjectManagerAssigned,
  ProjectManagerRemovalOfferCancelled,
  ProjectManagerRemovalOfferRated,
  ProjectManagerResigned,
  ProjectManagerVotedOut
} from "../generated/Projects/Projects"

export function createManagementOfferCancelledEvent(
  offerId: BigInt
): ManagementOfferCancelled {
  let managementOfferCancelledEvent = changetype<ManagementOfferCancelled>(
    newMockEvent()
  )

  managementOfferCancelledEvent.parameters = new Array()

  managementOfferCancelledEvent.parameters.push(
    new ethereum.EventParam(
      "offerId",
      ethereum.Value.fromUnsignedBigInt(offerId)
    )
  )

  return managementOfferCancelledEvent
}

export function createManagementOfferRatedEvent(
  offerId: BigInt,
  rater: Address,
  rating: BigInt
): ManagementOfferRated {
  let managementOfferRatedEvent = changetype<ManagementOfferRated>(
    newMockEvent()
  )

  managementOfferRatedEvent.parameters = new Array()

  managementOfferRatedEvent.parameters.push(
    new ethereum.EventParam(
      "offerId",
      ethereum.Value.fromUnsignedBigInt(offerId)
    )
  )
  managementOfferRatedEvent.parameters.push(
    new ethereum.EventParam("rater", ethereum.Value.fromAddress(rater))
  )
  managementOfferRatedEvent.parameters.push(
    new ethereum.EventParam("rating", ethereum.Value.fromUnsignedBigInt(rating))
  )

  return managementOfferRatedEvent
}

export function createNewManagementOfferEvent(
  offerId: BigInt,
  projectId: BigInt,
  proposer: Address
): NewManagementOffer {
  let newManagementOfferEvent = changetype<NewManagementOffer>(newMockEvent())

  newManagementOfferEvent.parameters = new Array()

  newManagementOfferEvent.parameters.push(
    new ethereum.EventParam(
      "offerId",
      ethereum.Value.fromUnsignedBigInt(offerId)
    )
  )
  newManagementOfferEvent.parameters.push(
    new ethereum.EventParam(
      "projectId",
      ethereum.Value.fromUnsignedBigInt(projectId)
    )
  )
  newManagementOfferEvent.parameters.push(
    new ethereum.EventParam("proposer", ethereum.Value.fromAddress(proposer))
  )

  return newManagementOfferEvent
}

export function createNewProjectEvent(projectId: BigInt): NewProject {
  let newProjectEvent = changetype<NewProject>(newMockEvent())

  newProjectEvent.parameters = new Array()

  newProjectEvent.parameters.push(
    new ethereum.EventParam(
      "projectId",
      ethereum.Value.fromUnsignedBigInt(projectId)
    )
  )

  return newProjectEvent
}

export function createNewProjectManagerRemovalOfferEvent(
  removalOfferId: BigInt,
  projectId: BigInt,
  proposer: Address
): NewProjectManagerRemovalOffer {
  let newProjectManagerRemovalOfferEvent = changetype<
    NewProjectManagerRemovalOffer
  >(newMockEvent())

  newProjectManagerRemovalOfferEvent.parameters = new Array()

  newProjectManagerRemovalOfferEvent.parameters.push(
    new ethereum.EventParam(
      "removalOfferId",
      ethereum.Value.fromUnsignedBigInt(removalOfferId)
    )
  )
  newProjectManagerRemovalOfferEvent.parameters.push(
    new ethereum.EventParam(
      "projectId",
      ethereum.Value.fromUnsignedBigInt(projectId)
    )
  )
  newProjectManagerRemovalOfferEvent.parameters.push(
    new ethereum.EventParam("proposer", ethereum.Value.fromAddress(proposer))
  )

  return newProjectManagerRemovalOfferEvent
}

export function createProjectManagerAssignedEvent(
  projectId: BigInt,
  projectManager: Address
): ProjectManagerAssigned {
  let projectManagerAssignedEvent = changetype<ProjectManagerAssigned>(
    newMockEvent()
  )

  projectManagerAssignedEvent.parameters = new Array()

  projectManagerAssignedEvent.parameters.push(
    new ethereum.EventParam(
      "projectId",
      ethereum.Value.fromUnsignedBigInt(projectId)
    )
  )
  projectManagerAssignedEvent.parameters.push(
    new ethereum.EventParam(
      "projectManager",
      ethereum.Value.fromAddress(projectManager)
    )
  )

  return projectManagerAssignedEvent
}

export function createProjectManagerRemovalOfferCancelledEvent(
  removalOfferId: BigInt
): ProjectManagerRemovalOfferCancelled {
  let projectManagerRemovalOfferCancelledEvent = changetype<
    ProjectManagerRemovalOfferCancelled
  >(newMockEvent())

  projectManagerRemovalOfferCancelledEvent.parameters = new Array()

  projectManagerRemovalOfferCancelledEvent.parameters.push(
    new ethereum.EventParam(
      "removalOfferId",
      ethereum.Value.fromUnsignedBigInt(removalOfferId)
    )
  )

  return projectManagerRemovalOfferCancelledEvent
}

export function createProjectManagerRemovalOfferRatedEvent(
  removalOfferId: BigInt,
  rater: Address,
  rating: BigInt
): ProjectManagerRemovalOfferRated {
  let projectManagerRemovalOfferRatedEvent = changetype<
    ProjectManagerRemovalOfferRated
  >(newMockEvent())

  projectManagerRemovalOfferRatedEvent.parameters = new Array()

  projectManagerRemovalOfferRatedEvent.parameters.push(
    new ethereum.EventParam(
      "removalOfferId",
      ethereum.Value.fromUnsignedBigInt(removalOfferId)
    )
  )
  projectManagerRemovalOfferRatedEvent.parameters.push(
    new ethereum.EventParam("rater", ethereum.Value.fromAddress(rater))
  )
  projectManagerRemovalOfferRatedEvent.parameters.push(
    new ethereum.EventParam("rating", ethereum.Value.fromUnsignedBigInt(rating))
  )

  return projectManagerRemovalOfferRatedEvent
}

export function createProjectManagerResignedEvent(
  projectId: BigInt
): ProjectManagerResigned {
  let projectManagerResignedEvent = changetype<ProjectManagerResigned>(
    newMockEvent()
  )

  projectManagerResignedEvent.parameters = new Array()

  projectManagerResignedEvent.parameters.push(
    new ethereum.EventParam(
      "projectId",
      ethereum.Value.fromUnsignedBigInt(projectId)
    )
  )

  return projectManagerResignedEvent
}

export function createProjectManagerVotedOutEvent(
  removalOfferId: BigInt,
  projectId: BigInt
): ProjectManagerVotedOut {
  let projectManagerVotedOutEvent = changetype<ProjectManagerVotedOut>(
    newMockEvent()
  )

  projectManagerVotedOutEvent.parameters = new Array()

  projectManagerVotedOutEvent.parameters.push(
    new ethereum.EventParam(
      "removalOfferId",
      ethereum.Value.fromUnsignedBigInt(removalOfferId)
    )
  )
  projectManagerVotedOutEvent.parameters.push(
    new ethereum.EventParam(
      "projectId",
      ethereum.Value.fromUnsignedBigInt(projectId)
    )
  )

  return projectManagerVotedOutEvent
}
