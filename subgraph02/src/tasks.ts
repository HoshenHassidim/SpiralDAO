import {
  NewOffer as NewOfferEvent,
  NewTask as NewTaskEvent,
  OfferCanceled as OfferCanceledEvent,
  OfferRated as OfferRatedEvent,
  TaskAssigned as TaskAssignedEvent,
  TaskCanceled as TaskCanceledEvent,
  TaskChanged as TaskChangedEvent,
  TaskCompleted as TaskCompletedEvent,
  TaskExecutionRated as TaskExecutionRatedEvent,
  TaskVerified as TaskVerifiedEvent
} from "../generated/Tasks/Tasks"
import {
  NewOffer,
  NewTask,
  OfferCanceled,
  OfferRated,
  TaskAssigned,
  TaskCanceled,
  TaskChanged,
  TaskCompleted,
  TaskExecutionRated,
  TaskVerified
} from "../generated/schema"

export function handleNewOffer(event: NewOfferEvent): void {
  let entity = new NewOffer(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.offerId = event.params.offerId
  entity.taskId = event.params.taskId
  entity.offeror = event.params.offeror

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleNewTask(event: NewTaskEvent): void {
  let entity = new NewTask(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.taskId = event.params.taskId
  entity.projectId = event.params.projectId
  entity.taskName = event.params.taskName
  entity.taskValue = event.params.taskValue

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleOfferCanceled(event: OfferCanceledEvent): void {
  let entity = new OfferCanceled(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.taskId = event.params.taskId
  entity.offerId = event.params.offerId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleOfferRated(event: OfferRatedEvent): void {
  let entity = new OfferRated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.offerId = event.params.offerId
  entity.rating = event.params.rating

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleTaskAssigned(event: TaskAssignedEvent): void {
  let entity = new TaskAssigned(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.taskId = event.params.taskId
  entity.offerId = event.params.offerId
  entity.performer = event.params.performer

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleTaskCanceled(event: TaskCanceledEvent): void {
  let entity = new TaskCanceled(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.taskId = event.params.taskId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleTaskChanged(event: TaskChangedEvent): void {
  let entity = new TaskChanged(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.taskId = event.params.taskId
  entity.newTaskName = event.params.newTaskName
  entity.newTaskValue = event.params.newTaskValue

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleTaskCompleted(event: TaskCompletedEvent): void {
  let entity = new TaskCompleted(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.taskId = event.params.taskId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleTaskExecutionRated(event: TaskExecutionRatedEvent): void {
  let entity = new TaskExecutionRated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.taskId = event.params.taskId
  entity.rating = event.params.rating

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleTaskVerified(event: TaskVerifiedEvent): void {
  let entity = new TaskVerified(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.taskId = event.params.taskId
  entity.areVerified = event.params.areVerified

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
