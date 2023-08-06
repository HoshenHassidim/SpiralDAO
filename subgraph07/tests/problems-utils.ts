import { newMockEvent } from "matchstick-as"
import { ethereum, BigInt, Address } from "@graphprotocol/graph-ts"
import {
  NewProblem,
  ProblemCancelled,
  ProblemChanged,
  ProblemRated,
  ProblemRatingCriteriaMet
} from "../generated/Problems/Problems"

export function createNewProblemEvent(
  problemId: BigInt,
  creator: Address,
  name: string
): NewProblem {
  let newProblemEvent = changetype<NewProblem>(newMockEvent())

  newProblemEvent.parameters = new Array()

  newProblemEvent.parameters.push(
    new ethereum.EventParam(
      "problemId",
      ethereum.Value.fromUnsignedBigInt(problemId)
    )
  )
  newProblemEvent.parameters.push(
    new ethereum.EventParam("creator", ethereum.Value.fromAddress(creator))
  )
  newProblemEvent.parameters.push(
    new ethereum.EventParam("name", ethereum.Value.fromString(name))
  )

  return newProblemEvent
}

export function createProblemCancelledEvent(
  problemId: BigInt
): ProblemCancelled {
  let problemCancelledEvent = changetype<ProblemCancelled>(newMockEvent())

  problemCancelledEvent.parameters = new Array()

  problemCancelledEvent.parameters.push(
    new ethereum.EventParam(
      "problemId",
      ethereum.Value.fromUnsignedBigInt(problemId)
    )
  )

  return problemCancelledEvent
}

export function createProblemChangedEvent(
  problemId: BigInt,
  name: string
): ProblemChanged {
  let problemChangedEvent = changetype<ProblemChanged>(newMockEvent())

  problemChangedEvent.parameters = new Array()

  problemChangedEvent.parameters.push(
    new ethereum.EventParam(
      "problemId",
      ethereum.Value.fromUnsignedBigInt(problemId)
    )
  )
  problemChangedEvent.parameters.push(
    new ethereum.EventParam("name", ethereum.Value.fromString(name))
  )

  return problemChangedEvent
}

export function createProblemRatedEvent(
  problemId: BigInt,
  rater: Address,
  rating: BigInt
): ProblemRated {
  let problemRatedEvent = changetype<ProblemRated>(newMockEvent())

  problemRatedEvent.parameters = new Array()

  problemRatedEvent.parameters.push(
    new ethereum.EventParam(
      "problemId",
      ethereum.Value.fromUnsignedBigInt(problemId)
    )
  )
  problemRatedEvent.parameters.push(
    new ethereum.EventParam("rater", ethereum.Value.fromAddress(rater))
  )
  problemRatedEvent.parameters.push(
    new ethereum.EventParam("rating", ethereum.Value.fromUnsignedBigInt(rating))
  )

  return problemRatedEvent
}

export function createProblemRatingCriteriaMetEvent(
  problemId: BigInt
): ProblemRatingCriteriaMet {
  let problemRatingCriteriaMetEvent = changetype<ProblemRatingCriteriaMet>(
    newMockEvent()
  )

  problemRatingCriteriaMetEvent.parameters = new Array()

  problemRatingCriteriaMetEvent.parameters.push(
    new ethereum.EventParam(
      "problemId",
      ethereum.Value.fromUnsignedBigInt(problemId)
    )
  )

  return problemRatingCriteriaMetEvent
}
