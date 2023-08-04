import {
  NewProblem as NewProblemEvent,
  ProblemCancelled as ProblemCancelledEvent,
  ProblemChanged as ProblemChangedEvent,
  ProblemRated as ProblemRatedEvent
} from "../generated/Problems/Problems"
import {
  NewProblem,
  ProblemCancelled,
  ProblemChanged,
  ProblemRated
} from "../generated/schema"

export function handleNewProblem(event: NewProblemEvent): void {
  let entity = new NewProblem(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.Problems_id = event.params.id
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
  entity.Problems_id = event.params.id

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleProblemChanged(event: ProblemChangedEvent): void {
  let entity = new ProblemChanged(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.Problems_id = event.params.id
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
  entity.Problems_id = event.params.id
  entity.rater = event.params.rater
  entity.rating = event.params.rating

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
