import { newMockEvent } from "matchstick-as"
import { ethereum, BigInt, Address } from "@graphprotocol/graph-ts"
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
} from "../generated/Tasks/Tasks"

export function createNewOfferEvent(
  offerId: BigInt,
  taskId: BigInt,
  offeror: Address
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
    new ethereum.EventParam("taskId", ethereum.Value.fromUnsignedBigInt(taskId))
  )
  newOfferEvent.parameters.push(
    new ethereum.EventParam("offeror", ethereum.Value.fromAddress(offeror))
  )

  return newOfferEvent
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

export function createOfferCanceledEvent(
  taskId: BigInt,
  offerId: BigInt
): OfferCanceled {
  let offerCanceledEvent = changetype<OfferCanceled>(newMockEvent())

  offerCanceledEvent.parameters = new Array()

  offerCanceledEvent.parameters.push(
    new ethereum.EventParam("taskId", ethereum.Value.fromUnsignedBigInt(taskId))
  )
  offerCanceledEvent.parameters.push(
    new ethereum.EventParam(
      "offerId",
      ethereum.Value.fromUnsignedBigInt(offerId)
    )
  )

  return offerCanceledEvent
}

export function createOfferRatedEvent(
  offerId: BigInt,
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
    new ethereum.EventParam("rating", ethereum.Value.fromUnsignedBigInt(rating))
  )

  return offerRatedEvent
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
  rating: BigInt
): TaskExecutionRated {
  let taskExecutionRatedEvent = changetype<TaskExecutionRated>(newMockEvent())

  taskExecutionRatedEvent.parameters = new Array()

  taskExecutionRatedEvent.parameters.push(
    new ethereum.EventParam("taskId", ethereum.Value.fromUnsignedBigInt(taskId))
  )
  taskExecutionRatedEvent.parameters.push(
    new ethereum.EventParam("rating", ethereum.Value.fromUnsignedBigInt(rating))
  )

  return taskExecutionRatedEvent
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
