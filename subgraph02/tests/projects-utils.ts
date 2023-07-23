import { newMockEvent } from "matchstick-as"
import { ethereum, BigInt, Address } from "@graphprotocol/graph-ts"
import {
  NewOffer,
  NewProject,
  OfferCancelled,
  OfferRated,
  ProjectManagerAssigned
} from "../generated/Projects/Projects"

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
  voter: Address,
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
    new ethereum.EventParam("voter", ethereum.Value.fromAddress(voter))
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
