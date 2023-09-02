import {
  NewPerformerRemovalOffer as NewPerformerRemovalOfferEvent,
  NewTask as NewTaskEvent,
  NewTaskOffer as NewTaskOfferEvent,
  PerformerRemovalOfferCancelled as PerformerRemovalOfferCancelledEvent,
  PerformerRemovalOfferRated as PerformerRemovalOfferRatedEvent,
  TaskAssigned as TaskAssignedEvent,
  TaskCanceled as TaskCanceledEvent,
  TaskChanged as TaskChangedEvent,
  TaskCompleted as TaskCompletedEvent,
  TaskExecutionRated as TaskExecutionRatedEvent,
  TaskOfferCanceled as TaskOfferCanceledEvent,
  TaskOfferRated as TaskOfferRatedEvent,
  TaskPerformerResigned as TaskPerformerResignedEvent,
  TaskPerformerVotedOut as TaskPerformerVotedOutEvent,
  TaskVerified as TaskVerifiedEvent,
} from "../generated/Tasks/Tasks";
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
  TaskVerified,
  Task,
  ActiveTaskOffer,
  UserTaskOfferRating,
  UserTaskCompletionRating,
  Project,
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

  let idString = event.params.taskId.toString();
  let task = new Task(idString);
  task.taskId = event.params.taskId;
  task.projectId = event.params.projectId;
  let idStringProjectId = event.params.projectId.toString();
  let project = Project.load(idStringProjectId);
  if (project) {
    task.project = project.id;
  }
  task.taskName = event.params.taskName;
  task.taskValue = event.params.taskValue;
  task.performer = Address.fromString(
    "0x0000000000000000000000000000000000000000"
  );
  task.completionRatingSum = BigInt.fromI32(0);
  task.numberOfCompletionRaters = BigInt.fromI32(0);
  task.status = "OPEN";
  task.blockNumber = event.block.number;
  task.save();
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

  let idString = event.params.taskId.toString();
  let task = Task.load(idString);

  if (task != null) {
    store.remove("Task", idString);
  }
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

  let idString = event.params.taskId.toString();
  let task = Task.load(idString);
  if (task) {
    task.taskName = event.params.newTaskName;
    task.taskValue = event.params.newTaskValue;
    task.save();
  }
}

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

  let idString = event.params.offerId.toString();
  let activeTaskOffer = new ActiveTaskOffer(idString);

  activeTaskOffer.offerId = event.params.offerId;
  activeTaskOffer.taskId = event.params.taskId;
  activeTaskOffer.offeror = event.params.offeror;
  activeTaskOffer.ratingCount = BigInt.fromI32(0);
  activeTaskOffer.ratingSum = BigInt.fromI32(0);
  activeTaskOffer.isActive = true;

  let idStringTaskId = event.params.taskId.toString();
  let task = Task.load(idStringTaskId);
  if (task) {
    activeTaskOffer.task = task.id;
  }
  activeTaskOffer.blockNumber = event.block.number;

  activeTaskOffer.save();
}

export function handleTaskOfferCanceled(event: TaskOfferCanceledEvent): void {
  let entity = new TaskOfferCanceled(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.offerId = event.params.offerId;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();

  let idString = event.params.offerId.toString();
  let activeTaskOffer = ActiveTaskOffer.load(idString);

  if (activeTaskOffer != null) {
    store.remove("ActiveTaskOffer", idString);
  }
}

export function handleTaskOfferRated(event: TaskOfferRatedEvent): void {
  let entity = new TaskOfferRated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.offerId = event.params.offerId;
  entity.rater = event.params.rater;
  entity.rating = event.params.rating;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();

  let idString = event.params.offerId.toString();

  let activeTaskOffer = ActiveTaskOffer.load(idString);

  if (activeTaskOffer != null) {
    let userTaskOfferRatingIdString = idString.concat(
      event.params.rater.toHex()
    );
    let userTaskOfferRating = UserTaskOfferRating.load(
      userTaskOfferRatingIdString
    );

    // Validate rating
    let newRating = event.params.rating;
    let minRating = BigInt.fromI32(1);
    let maxRating = BigInt.fromI32(10);

    if (newRating.lt(minRating) || newRating.gt(maxRating)) {
      log.warning("Invalid rating: {}", [newRating.toString()]);
      return;
    }

    let prevRatingValue = BigInt.fromI32(0);
    if (userTaskOfferRating != null) {
      prevRatingValue = userTaskOfferRating.rating;
      // Update the rating in UserTaskOfferRating
      userTaskOfferRating.rating = newRating;
      userTaskOfferRating.save();
    } else {
      // If UserTaskOfferRating is null then create a new one
      userTaskOfferRating = new UserTaskOfferRating(
        userTaskOfferRatingIdString
      );
      userTaskOfferRating.offerId = event.params.offerId;
      userTaskOfferRating.rater = event.params.rater;
      userTaskOfferRating.rating = newRating;
      userTaskOfferRating.blockNumber = event.block.number;
      userTaskOfferRating.save();

      activeTaskOffer.ratingCount = activeTaskOffer.ratingCount.plus(
        BigInt.fromI32(1)
      );
    }

    // Update ratingSum in ActiveTaskOffer
    activeTaskOffer.ratingSum = activeTaskOffer.ratingSum
      .minus(prevRatingValue)
      .plus(newRating);

    activeTaskOffer.save();
  }
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

  let idString = event.params.taskId.toString();
  let task = Task.load(idString);
  if (task) {
    let taskOffers = task.taskOffers.load();
    for (let i = 0; i < taskOffers.length; i++) {
      taskOffers[i].isActive = false;
      taskOffers[i].save();
    }
    task.performer = event.params.performer;
    task.status = "IN_PROGRESS";
    task.save();
  }
}

export function handleTaskCompleted(event: TaskCompletedEvent): void {
  let entity = new TaskCompleted(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.taskId = event.params.taskId;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();

  let idString = event.params.taskId.toString();
  let task = Task.load(idString);
  if (task) {
    task.status = "VERIFICATION";
    task.save();
  }
}

export function handleTaskExecutionRated(event: TaskExecutionRatedEvent): void {
  let entity = new TaskExecutionRated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.taskId = event.params.taskId;
  entity.rater = event.params.rater;
  entity.rating = event.params.rating;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();

  let idString = event.params.taskId.toString();
  let task = Task.load(idString);

  if (task != null) {
    let userTaskOfferRatingIdString = idString.concat(
      event.params.rater.toHex()
    );
    let userTaskCompletionRating = UserTaskCompletionRating.load(
      userTaskOfferRatingIdString
    );

    // Validate rating
    let newRating = event.params.rating;
    let minRating = BigInt.fromI32(1);
    let maxRating = BigInt.fromI32(10);

    if (newRating.lt(minRating) || newRating.gt(maxRating)) {
      log.warning("Invalid rating: {}", [newRating.toString()]);
      return;
    }

    let prevRatingValue = BigInt.fromI32(0);
    if (userTaskCompletionRating != null) {
      prevRatingValue = userTaskCompletionRating.rating;
      // Update the rating in UserTaskCompletionRating
      userTaskCompletionRating.rating = newRating;
      userTaskCompletionRating.save();
    } else {
      // If UserTaskCompletionRating is null then create a new one
      userTaskCompletionRating = new UserTaskCompletionRating(
        userTaskOfferRatingIdString
      );
      userTaskCompletionRating.offerId = event.params.taskId;
      userTaskCompletionRating.rater = event.params.rater;
      userTaskCompletionRating.rating = newRating;
      userTaskCompletionRating.blockNumber = event.block.number;
      userTaskCompletionRating.save();

      task.numberOfCompletionRaters = task.numberOfCompletionRaters.plus(
        BigInt.fromI32(1)
      );
    }

    // Update ratingSum in Task
    task.completionRatingSum = task.completionRatingSum
      .minus(prevRatingValue)
      .plus(newRating);

    task.save();
  }
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

  let idString = event.params.taskId.toString();
  let task = Task.load(idString);
  if (task) {
    if (event.params.areVerified) {
      task.status = "VERIFIED";
      task.save();
    } else {
      task.status = "IN_PROGRESS";
      task.save();
    }
  }
}

export function handleNewPerformerRemovalOffer(
  event: NewPerformerRemovalOfferEvent
): void {
  let entity = new NewPerformerRemovalOffer(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.taskId = event.params.taskId;
  entity.proposer = event.params.proposer;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handlePerformerRemovalOfferCancelled(
  event: PerformerRemovalOfferCancelledEvent
): void {
  let entity = new PerformerRemovalOfferCancelled(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.taskId = event.params.taskId;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handlePerformerRemovalOfferRated(
  event: PerformerRemovalOfferRatedEvent
): void {
  let entity = new PerformerRemovalOfferRated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.taskId = event.params.taskId;
  entity.rater = event.params.rater;
  entity.rating = event.params.rating;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleTaskPerformerResigned(
  event: TaskPerformerResignedEvent
): void {
  let entity = new TaskPerformerResigned(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.taskId = event.params.taskId;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleTaskPerformerVotedOut(
  event: TaskPerformerVotedOutEvent
): void {
  let entity = new TaskPerformerVotedOut(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.taskId = event.params.taskId;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}
