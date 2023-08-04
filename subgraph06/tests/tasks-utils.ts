import { newMockEvent } from "matchstick-as"
import { ethereum, BigInt, Address } from "@graphprotocol/graph-ts"
import {
  NewPerformerRemovalOffer,
  NewTask,
  NewTaskOffer,
  PerformerRemovalOfferCancelled,
  PerformerRemovalOfferRated,
  TaskAssigned,
  TaskCanceled,
  TaskChanged,
  TaskCompleted,
  TaskExecutionRated,
  TaskOfferCanceled,
  TaskOfferRated,
  TaskPerformerResigned,
  TaskPerformerVotedOut,
  TaskVerified
} from "../generated/Tasks/Tasks"

export function createNewPerformerRemovalOfferEvent(
  taskId: BigInt,
  proposer: Address
): NewPerformerRemovalOffer {
  let newPerformerRemovalOfferEvent = changetype<NewPerformerRemovalOffer>(
    newMockEvent()
  )

  newPerformerRemovalOfferEvent.parameters = new Array()

  newPerformerRemovalOfferEvent.parameters.push(
    new ethereum.EventParam("taskId", ethereum.Value.fromUnsignedBigInt(taskId))
  )
  newPerformerRemovalOfferEvent.parameters.push(
    new ethereum.EventParam("proposer", ethereum.Value.fromAddress(proposer))
  )

  return newPerformerRemovalOfferEvent
}

export function createNewTaskEvent(
  taskId: BigInt,
  projectId: BigInt,
  taskName: string,
  taskValue: BigInt
): NewTask {
  let newTaskEvent = changetype<NewTask>(newMockEvent())

  newTaskEvent.parameters = new Array()

  newTaskEvent.parameters.push(
    new ethereum.EventParam("taskId", ethereum.Value.fromUnsignedBigInt(taskId))
  )
  newTaskEvent.parameters.push(
    new ethereum.EventParam(
      "projectId",
      ethereum.Value.fromUnsignedBigInt(projectId)
    )
  )
  newTaskEvent.parameters.push(
    new ethereum.EventParam("taskName", ethereum.Value.fromString(taskName))
  )
  newTaskEvent.parameters.push(
    new ethereum.EventParam(
      "taskValue",
      ethereum.Value.fromUnsignedBigInt(taskValue)
    )
  )

  return newTaskEvent
}

export function createNewTaskOfferEvent(
  offerId: BigInt,
  taskId: BigInt,
  offeror: Address
): NewTaskOffer {
  let newTaskOfferEvent = changetype<NewTaskOffer>(newMockEvent())

  newTaskOfferEvent.parameters = new Array()

  newTaskOfferEvent.parameters.push(
    new ethereum.EventParam(
      "offerId",
      ethereum.Value.fromUnsignedBigInt(offerId)
    )
  )
  newTaskOfferEvent.parameters.push(
    new ethereum.EventParam("taskId", ethereum.Value.fromUnsignedBigInt(taskId))
  )
  newTaskOfferEvent.parameters.push(
    new ethereum.EventParam("offeror", ethereum.Value.fromAddress(offeror))
  )

  return newTaskOfferEvent
}

export function createPerformerRemovalOfferCancelledEvent(
  taskId: BigInt
): PerformerRemovalOfferCancelled {
  let performerRemovalOfferCancelledEvent = changetype<
    PerformerRemovalOfferCancelled
  >(newMockEvent())

  performerRemovalOfferCancelledEvent.parameters = new Array()

  performerRemovalOfferCancelledEvent.parameters.push(
    new ethereum.EventParam("taskId", ethereum.Value.fromUnsignedBigInt(taskId))
  )

  return performerRemovalOfferCancelledEvent
}

export function createPerformerRemovalOfferRatedEvent(
  taskId: BigInt,
  rater: Address,
  rating: BigInt
): PerformerRemovalOfferRated {
  let performerRemovalOfferRatedEvent = changetype<PerformerRemovalOfferRated>(
    newMockEvent()
  )

  performerRemovalOfferRatedEvent.parameters = new Array()

  performerRemovalOfferRatedEvent.parameters.push(
    new ethereum.EventParam("taskId", ethereum.Value.fromUnsignedBigInt(taskId))
  )
  performerRemovalOfferRatedEvent.parameters.push(
    new ethereum.EventParam("rater", ethereum.Value.fromAddress(rater))
  )
  performerRemovalOfferRatedEvent.parameters.push(
    new ethereum.EventParam("rating", ethereum.Value.fromUnsignedBigInt(rating))
  )

  return performerRemovalOfferRatedEvent
}

export function createTaskAssignedEvent(
  taskId: BigInt,
  offerId: BigInt,
  performer: Address
): TaskAssigned {
  let taskAssignedEvent = changetype<TaskAssigned>(newMockEvent())

  taskAssignedEvent.parameters = new Array()

  taskAssignedEvent.parameters.push(
    new ethereum.EventParam("taskId", ethereum.Value.fromUnsignedBigInt(taskId))
  )
  taskAssignedEvent.parameters.push(
    new ethereum.EventParam(
      "offerId",
      ethereum.Value.fromUnsignedBigInt(offerId)
    )
  )
  taskAssignedEvent.parameters.push(
    new ethereum.EventParam("performer", ethereum.Value.fromAddress(performer))
  )

  return taskAssignedEvent
}

export function createTaskCanceledEvent(taskId: BigInt): TaskCanceled {
  let taskCanceledEvent = changetype<TaskCanceled>(newMockEvent())

  taskCanceledEvent.parameters = new Array()

  taskCanceledEvent.parameters.push(
    new ethereum.EventParam("taskId", ethereum.Value.fromUnsignedBigInt(taskId))
  )

  return taskCanceledEvent
}

export function createTaskChangedEvent(
  taskId: BigInt,
  newTaskName: string,
  newTaskValue: BigInt
): TaskChanged {
  let taskChangedEvent = changetype<TaskChanged>(newMockEvent())

  taskChangedEvent.parameters = new Array()

  taskChangedEvent.parameters.push(
    new ethereum.EventParam("taskId", ethereum.Value.fromUnsignedBigInt(taskId))
  )
  taskChangedEvent.parameters.push(
    new ethereum.EventParam(
      "newTaskName",
      ethereum.Value.fromString(newTaskName)
    )
  )
  taskChangedEvent.parameters.push(
    new ethereum.EventParam(
      "newTaskValue",
      ethereum.Value.fromUnsignedBigInt(newTaskValue)
    )
  )

  return taskChangedEvent
}

export function createTaskCompletedEvent(taskId: BigInt): TaskCompleted {
  let taskCompletedEvent = changetype<TaskCompleted>(newMockEvent())

  taskCompletedEvent.parameters = new Array()

  taskCompletedEvent.parameters.push(
    new ethereum.EventParam("taskId", ethereum.Value.fromUnsignedBigInt(taskId))
  )

  return taskCompletedEvent
}

export function createTaskExecutionRatedEvent(
  taskId: BigInt,
  rater: Address,
  rating: BigInt
): TaskExecutionRated {
  let taskExecutionRatedEvent = changetype<TaskExecutionRated>(newMockEvent())

  taskExecutionRatedEvent.parameters = new Array()

  taskExecutionRatedEvent.parameters.push(
    new ethereum.EventParam("taskId", ethereum.Value.fromUnsignedBigInt(taskId))
  )
  taskExecutionRatedEvent.parameters.push(
    new ethereum.EventParam("rater", ethereum.Value.fromAddress(rater))
  )
  taskExecutionRatedEvent.parameters.push(
    new ethereum.EventParam("rating", ethereum.Value.fromUnsignedBigInt(rating))
  )

  return taskExecutionRatedEvent
}

export function createTaskOfferCanceledEvent(
  offerId: BigInt
): TaskOfferCanceled {
  let taskOfferCanceledEvent = changetype<TaskOfferCanceled>(newMockEvent())

  taskOfferCanceledEvent.parameters = new Array()

  taskOfferCanceledEvent.parameters.push(
    new ethereum.EventParam(
      "offerId",
      ethereum.Value.fromUnsignedBigInt(offerId)
    )
  )

  return taskOfferCanceledEvent
}

export function createTaskOfferRatedEvent(
  offerId: BigInt,
  rater: Address,
  rating: BigInt
): TaskOfferRated {
  let taskOfferRatedEvent = changetype<TaskOfferRated>(newMockEvent())

  taskOfferRatedEvent.parameters = new Array()

  taskOfferRatedEvent.parameters.push(
    new ethereum.EventParam(
      "offerId",
      ethereum.Value.fromUnsignedBigInt(offerId)
    )
  )
  taskOfferRatedEvent.parameters.push(
    new ethereum.EventParam("rater", ethereum.Value.fromAddress(rater))
  )
  taskOfferRatedEvent.parameters.push(
    new ethereum.EventParam("rating", ethereum.Value.fromUnsignedBigInt(rating))
  )

  return taskOfferRatedEvent
}

export function createTaskPerformerResignedEvent(
  taskId: BigInt
): TaskPerformerResigned {
  let taskPerformerResignedEvent = changetype<TaskPerformerResigned>(
    newMockEvent()
  )

  taskPerformerResignedEvent.parameters = new Array()

  taskPerformerResignedEvent.parameters.push(
    new ethereum.EventParam("taskId", ethereum.Value.fromUnsignedBigInt(taskId))
  )

  return taskPerformerResignedEvent
}

export function createTaskPerformerVotedOutEvent(
  taskId: BigInt
): TaskPerformerVotedOut {
  let taskPerformerVotedOutEvent = changetype<TaskPerformerVotedOut>(
    newMockEvent()
  )

  taskPerformerVotedOutEvent.parameters = new Array()

  taskPerformerVotedOutEvent.parameters.push(
    new ethereum.EventParam("taskId", ethereum.Value.fromUnsignedBigInt(taskId))
  )

  return taskPerformerVotedOutEvent
}

export function createTaskVerifiedEvent(
  taskId: BigInt,
  areVerified: boolean
): TaskVerified {
  let taskVerifiedEvent = changetype<TaskVerified>(newMockEvent())

  taskVerifiedEvent.parameters = new Array()

  taskVerifiedEvent.parameters.push(
    new ethereum.EventParam("taskId", ethereum.Value.fromUnsignedBigInt(taskId))
  )
  taskVerifiedEvent.parameters.push(
    new ethereum.EventParam(
      "areVerified",
      ethereum.Value.fromBoolean(areVerified)
    )
  )

  return taskVerifiedEvent
}
