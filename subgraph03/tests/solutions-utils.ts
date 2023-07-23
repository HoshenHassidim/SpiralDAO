import { newMockEvent } from "matchstick-as"
import { ethereum, BigInt, Address } from "@graphprotocol/graph-ts"
import {
  SolutionCancelled,
  SolutionNameChanged,
  SolutionProposed,
  SolutionRated
} from "../generated/Solutions/Solutions"

export function createSolutionCancelledEvent(
  solutionId: BigInt
): SolutionCancelled {
  let solutionCancelledEvent = changetype<SolutionCancelled>(newMockEvent())

  solutionCancelledEvent.parameters = new Array()

  solutionCancelledEvent.parameters.push(
    new ethereum.EventParam(
      "solutionId",
      ethereum.Value.fromUnsignedBigInt(solutionId)
    )
  )

  return solutionCancelledEvent
}

export function createSolutionNameChangedEvent(
  solutionId: BigInt,
  newName: string
): SolutionNameChanged {
  let solutionNameChangedEvent = changetype<SolutionNameChanged>(newMockEvent())

  solutionNameChangedEvent.parameters = new Array()

  solutionNameChangedEvent.parameters.push(
    new ethereum.EventParam(
      "solutionId",
      ethereum.Value.fromUnsignedBigInt(solutionId)
    )
  )
  solutionNameChangedEvent.parameters.push(
    new ethereum.EventParam("newName", ethereum.Value.fromString(newName))
  )

  return solutionNameChangedEvent
}

export function createSolutionProposedEvent(
  solutionId: BigInt,
  problemId: BigInt,
  creator: Address,
  name: string
): SolutionProposed {
  let solutionProposedEvent = changetype<SolutionProposed>(newMockEvent())

  solutionProposedEvent.parameters = new Array()

  solutionProposedEvent.parameters.push(
    new ethereum.EventParam(
      "solutionId",
      ethereum.Value.fromUnsignedBigInt(solutionId)
    )
  )
  solutionProposedEvent.parameters.push(
    new ethereum.EventParam(
      "problemId",
      ethereum.Value.fromUnsignedBigInt(problemId)
    )
  )
  solutionProposedEvent.parameters.push(
    new ethereum.EventParam("creator", ethereum.Value.fromAddress(creator))
  )
  solutionProposedEvent.parameters.push(
    new ethereum.EventParam("name", ethereum.Value.fromString(name))
  )

  return solutionProposedEvent
}

export function createSolutionRatedEvent(
  solutionId: BigInt,
  rater: Address,
  rating: BigInt
): SolutionRated {
  let solutionRatedEvent = changetype<SolutionRated>(newMockEvent())

  solutionRatedEvent.parameters = new Array()

  solutionRatedEvent.parameters.push(
    new ethereum.EventParam(
      "solutionId",
      ethereum.Value.fromUnsignedBigInt(solutionId)
    )
  )
  solutionRatedEvent.parameters.push(
    new ethereum.EventParam("rater", ethereum.Value.fromAddress(rater))
  )
  solutionRatedEvent.parameters.push(
    new ethereum.EventParam("rating", ethereum.Value.fromUnsignedBigInt(rating))
  )

  return solutionRatedEvent
}
