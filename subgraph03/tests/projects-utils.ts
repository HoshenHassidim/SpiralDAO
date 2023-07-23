import { newMockEvent } from "matchstick-as"
import { ethereum, BigInt, Address } from "@graphprotocol/graph-ts"
import {
  ManagementOfferCancelled,
  ManagementOfferRated,
  NewManagementOffer,
  NewProject,
  ProjectManagerAssigned
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
  voter: Address,
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
    new ethereum.EventParam("voter", ethereum.Value.fromAddress(voter))
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
