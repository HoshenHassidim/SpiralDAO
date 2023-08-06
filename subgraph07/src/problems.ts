import {
  NewProblem as NewProblemEvent,
  ProblemCancelled as ProblemCancelledEvent,
  ProblemChanged as ProblemChangedEvent,
  ProblemRated as ProblemRatedEvent,
  ProblemRatingCriteriaMet as ProblemRatingCriteriaMetEvent
} from "../generated/Problems/Problems"
import {
  NewProblem,
  ProblemCancelled,
  ProblemChanged,
  ProblemRated,
  ProblemRatingCriteriaMet
} from "../generated/schema"

export function handleNewProblem(event: NewProblemEvent): void {
  let entity = new NewProblem(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.problemId = event.params.problemId
  entity.creator = event.params.creator
  entity.name = event.params.name

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleProblemCancelled(event: ProblemCancelledEvent): void {
  let entity = new ProblemCancelled(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.problemId = event.params.problemId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleProblemChanged(event: ProblemChangedEvent): void {
  let entity = new ProblemChanged(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.problemId = event.params.problemId
  entity.name = event.params.name

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleProblemRated(event: ProblemRatedEvent): void {
  let entity = new ProblemRated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.problemId = event.params.problemId
  entity.rater = event.params.rater
  entity.rating = event.params.rating

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleProblemRatingCriteriaMet(
  event: ProblemRatingCriteriaMetEvent
): void {
  let entity = new ProblemRatingCriteriaMet(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.problemId = event.params.problemId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
