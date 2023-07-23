import { newMockEvent } from "matchstick-as"
import { ethereum, BigInt, Address } from "@graphprotocol/graph-ts"
import {
  NewProblem,
  ProblemCancelled,
  ProblemChanged,
  ProblemRated
} from "../generated/Problems/Problems"

export function createNewProblemEvent(
  id: BigInt,
  creator: Address,
  name: string
): NewProblem {
  let newProblemEvent = changetype<NewProblem>(newMockEvent())

  newProblemEvent.parameters = new Array()

  newProblemEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromUnsignedBigInt(id))
  )
  newProblemEvent.parameters.push(
    new ethereum.EventParam("creator", ethereum.Value.fromAddress(creator))
  )
  newProblemEvent.parameters.push(
    new ethereum.EventParam("name", ethereum.Value.fromString(name))
  )

  return newProblemEvent
}

export function createProblemCancelledEvent(id: BigInt): ProblemCancelled {
  let problemCancelledEvent = changetype<ProblemCancelled>(newMockEvent())

  problemCancelledEvent.parameters = new Array()

  problemCancelledEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromUnsignedBigInt(id))
  )

  return problemCancelledEvent
}

export function createProblemChangedEvent(
  id: BigInt,
  name: string
): ProblemChanged {
  let problemChangedEvent = changetype<ProblemChanged>(newMockEvent())

  problemChangedEvent.parameters = new Array()

  problemChangedEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromUnsignedBigInt(id))
  )
  problemChangedEvent.parameters.push(
    new ethereum.EventParam("name", ethereum.Value.fromString(name))
  )

  return problemChangedEvent
}

export function createProblemRatedEvent(
  id: BigInt,
  rater: Address,
  rating: BigInt
): ProblemRated {
  let problemRatedEvent = changetype<ProblemRated>(newMockEvent())

  problemRatedEvent.parameters = new Array()

  problemRatedEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromUnsignedBigInt(id))
  )
  problemRatedEvent.parameters.push(
    new ethereum.EventParam("rater", ethereum.Value.fromAddress(rater))
  )
  problemRatedEvent.parameters.push(
    new ethereum.EventParam("rating", ethereum.Value.fromUnsignedBigInt(rating))
  )

  return problemRatedEvent
}
