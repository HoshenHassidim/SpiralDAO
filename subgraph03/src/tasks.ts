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
  TaskVerified as TaskVerifiedEvent,
} from "../generated/Tasks/Tasks";
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
  TaskVerified,
  Task,
  ActiveTaskOffer,
  UserTaskOfferRating,
} from "../generated/schema";
import {
  BigInt,
  Bytes,
  store,
  Address,
  crypto,
  ethereum,
  log,
} from "@graphprotocol/graph-ts";

export function handleNewTask(event: NewTaskEvent): void {
  let entity = new NewTask(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.taskId = event.params.taskId;
  entity.projectId = event.params.projectId;
  entity.taskName = event.params.taskName;
  entity.taskValue = event.params.taskValue;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleTaskCanceled(event: TaskCanceledEvent): void {
  let entity = new TaskCanceled(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.taskId = event.params.taskId;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleTaskChanged(event: TaskChangedEvent): void {
  let entity = new TaskChanged(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.taskId = event.params.taskId;
  entity.newTaskName = event.params.newTaskName;
  entity.newTaskValue = event.params.newTaskValue;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

/////////////////

export function handleNewTaskOffer(event: NewTaskOfferEvent): void {
  let entity = new NewTaskOffer(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.offerId = event.params.offerId;
  entity.taskId = event.params.taskId;
  entity.offeror = event.params.offeror;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();

  let idBytes = changetype<Bytes>(event.params.offerId);
  let activeTaskOffer = new ActiveTaskOffer(idBytes);

  activeTaskOffer.offerId = event.params.offerId;
  activeTaskOffer.taskId = event.params.taskId;
  activeTaskOffer.offeror = event.params.offeror;
  activeTaskOffer.ratingCount = BigInt.fromI32(0);
  activeTaskOffer.ratingSum = BigInt.fromI32(0);
  activeTaskOffer.isOpenForRating = true;
  activeTaskOffer.blockNumber = event.block.number;

  activeTaskOffer.save();
}

export function handleTaskOfferCanceled(event: TaskOfferCanceledEvent): void {
  let entity = new TaskOfferCanceled(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.taskId = event.params.taskId;
  entity.offerId = event.params.offerId;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();

  let idBytes = changetype<Bytes>(event.params.offerId);

  let idString = idBytes.toHex(); // convert to hex string

  let activeTaskOffer = ActiveTaskOffer.load(idBytes);

  if (activeTaskOffer != null) {
    store.remove("ActiveTaskOffer", idString);
  }
}

export function handleTaskOfferRated(event: TaskOfferRatedEvent): void {
  let entity = new TaskOfferRated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.offerId = event.params.offerId;
  entity.rating = event.params.rating;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();

  // let idBytes = changetype<Bytes>(event.params.offerId);

  // let activeTaskOffer = ActiveTaskOffer.load(idBytes);

  // if (activeTaskOffer != null) {
  //   // Create UserSolutionRatingId as bytes by combining problem ID and rater address
  //   let userProjectOfferRatingIdBytes = idBytes.concat(event.params.voter);

  //   // Load prev rating using UserSolutionRatingId bytes
  //   let userProjectOfferRating = UserTaskOfferRating.load(
  //     userProjectOfferRatingIdBytes
  //   );

  //   // Validate rating
  //   let newRating = event.params.rating;
  //   let minRating = BigInt.fromI32(1);
  //   let maxRating = BigInt.fromI32(10);

  //   if (newRating.lt(minRating) || newRating.gt(maxRating)) {
  //     log.warning("Invalid rating: {}", [newRating.toString()]);
  //     return;
  //   }

  //   let prevRatingValue = BigInt.fromI32(0);
  //   if (userProjectOfferRating != null) {
  //     prevRatingValue = userProjectOfferRating.rating;
  //     // Update the rating in UserTaskOfferRating
  //     userProjectOfferRating.rating = newRating;
  //     userProjectOfferRating.save();
  //   } else {
  //     // If UserTaskOfferRating is null then create a new one
  //     userProjectOfferRating = new UserTaskOfferRating(
  //       userProjectOfferRatingIdBytes
  //     );
  //     userProjectOfferRating.offerId = event.params.offerId;
  //     userProjectOfferRating.rater = event.params.voter;
  //     userProjectOfferRating.rating = newRating;
  //     userProjectOfferRating.blockNumber = event.block.number;
  //     userProjectOfferRating.save();

  //     activeTaskOffer.ratingCount = activeTaskOffer.ratingCount.plus(
  //       BigInt.fromI32(1)
  //     );
  //   }

  //   // Update ratingSum in ActiveTaskOffer
  //   activeTaskOffer.ratingSum = activeTaskOffer.ratingSum
  //     .minus(prevRatingValue)
  //     .plus(newRating);

  //   activeTaskOffer.save();
  // }
}

export function handleTaskAssigned(event: TaskAssignedEvent): void {
  let entity = new TaskAssigned(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.taskId = event.params.taskId;
  entity.offerId = event.params.offerId;
  entity.performer = event.params.performer;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

////////////////

export function handleTaskCompleted(event: TaskCompletedEvent): void {
  let entity = new TaskCompleted(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.taskId = event.params.taskId;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleTaskExecutionRated(event: TaskExecutionRatedEvent): void {
  let entity = new TaskExecutionRated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.taskId = event.params.taskId;
  entity.rating = event.params.rating;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleTaskVerified(event: TaskVerifiedEvent): void {
  let entity = new TaskVerified(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.taskId = event.params.taskId;
  entity.areVerified = event.params.areVerified;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}
