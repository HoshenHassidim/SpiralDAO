import {
  SolutionCancelled as SolutionCancelledEvent,
  SolutionNameChanged as SolutionNameChangedEvent,
  SolutionProposed as SolutionProposedEvent,
  SolutionRated as SolutionRatedEvent
} from "../generated/Solutions/Solutions"
import {
  SolutionCancelled,
  SolutionNameChanged,
  SolutionProposed,
  SolutionRated
} from "../generated/schema"

export function handleSolutionCancelled(event: SolutionCancelledEvent): void {
  let entity = new SolutionCancelled(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.solutionId = event.params.solutionId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleSolutionNameChanged(
  event: SolutionNameChangedEvent
): void {
  let entity = new SolutionNameChanged(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.solutionId = event.params.solutionId
  entity.newName = event.params.newName

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleSolutionProposed(event: SolutionProposedEvent): void {
  let entity = new SolutionProposed(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.solutionId = event.params.solutionId
  entity.problemId = event.params.problemId
  entity.creator = event.params.creator
  entity.name = event.params.name

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleSolutionRated(event: SolutionRatedEvent): void {
  let entity = new SolutionRated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.solutionId = event.params.solutionId
  entity.rater = event.params.rater
  entity.rating = event.params.rating

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
