import { newMockEvent } from "matchstick-as"
import { ethereum, BigInt, Address } from "@graphprotocol/graph-ts"
import {
  ManagementOfferCancelled,
  ManagementOfferRated,
  NewManagementOffer,
  NewOffer,
  NewProject,
  NewRemovalOffer,
  OfferCancelled,
  OfferRated,
  ProjectManagerAssigned,
  RemovalOfferCancelled,
  RemovalOfferRated
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

export function createNewOfferEvent(
  offerId: BigInt,
  projectId: BigInt,
  proposer: Address
): NewOffer {
  let newOfferEvent = changetype<NewOffer>(newMockEvent())

  newOfferEvent.parameters = new Array()

  newOfferEvent.parameters.push(
    new ethereum.EventParam(
      "offerId",
      ethereum.Value.fromUnsignedBigInt(offerId)
    )
  )
  newOfferEvent.parameters.push(
    new ethereum.EventParam(
      "projectId",
      ethereum.Value.fromUnsignedBigInt(projectId)
    )
  )
  newOfferEvent.parameters.push(
    new ethereum.EventParam("proposer", ethereum.Value.fromAddress(proposer))
  )

  return newOfferEvent
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

export function createNewRemovalOfferEvent(
  removalOfferId: BigInt,
  projectId: BigInt,
  proposer: Address
): NewRemovalOffer {
  let newRemovalOfferEvent = changetype<NewRemovalOffer>(newMockEvent())

  newRemovalOfferEvent.parameters = new Array()

  newRemovalOfferEvent.parameters.push(
    new ethereum.EventParam(
      "removalOfferId",
      ethereum.Value.fromUnsignedBigInt(removalOfferId)
    )
  )
  newRemovalOfferEvent.parameters.push(
    new ethereum.EventParam(
      "projectId",
      ethereum.Value.fromUnsignedBigInt(projectId)
    )
  )
  newRemovalOfferEvent.parameters.push(
    new ethereum.EventParam("proposer", ethereum.Value.fromAddress(proposer))
  )

  return newRemovalOfferEvent
}

export function createOfferCancelledEvent(offerId: BigInt): OfferCancelled {
  let offerCancelledEvent = changetype<OfferCancelled>(newMockEvent())

  offerCancelledEvent.parameters = new Array()

  offerCancelledEvent.parameters.push(
    new ethereum.EventParam(
      "offerId",
      ethereum.Value.fromUnsignedBigInt(offerId)
    )
  )

  return offerCancelledEvent
}

export function createOfferRatedEvent(
  offerId: BigInt,
  rater: Address,
  rating: BigInt
): OfferRated {
  let offerRatedEvent = changetype<OfferRated>(newMockEvent())

  offerRatedEvent.parameters = new Array()

  offerRatedEvent.parameters.push(
    new ethereum.EventParam(
      "offerId",
      ethereum.Value.fromUnsignedBigInt(offerId)
    )
  )
  offerRatedEvent.parameters.push(
    new ethereum.EventParam("rater", ethereum.Value.fromAddress(rater))
  )
  offerRatedEvent.parameters.push(
    new ethereum.EventParam("rating", ethereum.Value.fromUnsignedBigInt(rating))
  )

  return offerRatedEvent
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

export function createRemovalOfferCancelledEvent(
  removalOfferId: BigInt
): RemovalOfferCancelled {
  let removalOfferCancelledEvent = changetype<RemovalOfferCancelled>(
    newMockEvent()
  )

  removalOfferCancelledEvent.parameters = new Array()

  removalOfferCancelledEvent.parameters.push(
    new ethereum.EventParam(
      "removalOfferId",
      ethereum.Value.fromUnsignedBigInt(removalOfferId)
    )
  )

  return removalOfferCancelledEvent
}

export function createRemovalOfferRatedEvent(
  removalOfferId: BigInt,
  rater: Address,
  rating: BigInt
): RemovalOfferRated {
  let removalOfferRatedEvent = changetype<RemovalOfferRated>(newMockEvent())

  removalOfferRatedEvent.parameters = new Array()

  removalOfferRatedEvent.parameters.push(
    new ethereum.EventParam(
      "removalOfferId",
      ethereum.Value.fromUnsignedBigInt(removalOfferId)
    )
  )
  removalOfferRatedEvent.parameters.push(
    new ethereum.EventParam("rater", ethereum.Value.fromAddress(rater))
  )
  removalOfferRatedEvent.parameters.push(
    new ethereum.EventParam("rating", ethereum.Value.fromUnsignedBigInt(rating))
  )

  return removalOfferRatedEvent
}
