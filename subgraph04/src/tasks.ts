import {
  NewTask as NewTaskEvent,
  NewTaskOffer as NewTaskOfferEvent,
  TaskAssigned as TaskAssignedEvent,
  TaskCanceled as TaskCanceledEvent,
  TaskChanged as TaskChangedEvent,
  TaskCompleted as TaskCompletedEvent,
  TaskExecutionRated as TaskExecutionRatedEvent,
  TaskOfferCanceled as TaskOfferCanceledEvent,
  TaskOfferRated as TaskOfferRatedEvent,
  TaskVerified as TaskVerifiedEvent
} from "../generated/Tasks/Tasks"
import {
  NewTask,
  NewTaskOffer,
  TaskAssigned,
  TaskCanceled,
  TaskChanged,
  TaskCompleted,
  TaskExecutionRated,
  TaskOfferCanceled,
  TaskOfferRated,
  TaskVerified
} from "../generated/schema"

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

export function handleNewTaskOffer(event: NewTaskOfferEvent): void {
  let entity = new NewTaskOffer(
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
  entity.rater = event.params.rater
  entity.rating = event.params.rating

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleTaskOfferCanceled(event: TaskOfferCanceledEvent): void {
  let entity = new TaskOfferCanceled(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.taskId = event.params.taskId
  entity.offerId = event.params.offerId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleTaskOfferRated(event: TaskOfferRatedEvent): void {
  let entity = new TaskOfferRated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.offerId = event.params.offerId
  entity.rater = event.params.rater
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
