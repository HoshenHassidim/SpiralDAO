import {
  NewProblem as NewProblemEvent,
  ProblemCancelled as ProblemCancelledEvent,
  ProblemChanged as ProblemChangedEvent,
  ProblemRated as ProblemRatedEvent,
  ProblemRatingCriteriaMet as ProblemRatingCriteriaMetEvent,
} from "../generated/Problems/Problems";
import {
  NewProblem,
  ProblemCancelled,
  ProblemChanged,
  ProblemRated,
  ProblemRatingCriteriaMet,
  ActiveProblem,
  UserProblemRating,
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

export function handleNewProblem(event: NewProblemEvent): void {
  let entity = new NewProblem(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.problemId = event.params.problemId;
  entity.creator = event.params.creator;
  entity.name = event.params.name;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();

  let idString = event.params.problemId.toString();
  let activeProblem = new ActiveProblem(idString);

  activeProblem.problemId = event.params.problemId;
  activeProblem.creator = event.params.creator;
  activeProblem.name = event.params.name;
  activeProblem.ratingCount = BigInt.fromI32(0);
  activeProblem.ratingSum = BigInt.fromI32(0);
  activeProblem.isOpenForRating = true;
  activeProblem.isOpenForNewSolutions = false;
  activeProblem.blockNumber = event.block.number;
  activeProblem.save();
}

export function handleProblemCancelled(event: ProblemCancelledEvent): void {
  let entity = new ProblemCancelled(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.problemId = event.params.problemId;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();

  let idString = event.params.problemId.toString();
  let activeProblem = ActiveProblem.load(idString);
  if (activeProblem != null) {
    store.remove("ActiveProblem", idString);
  }
}

export function handleProblemChanged(event: ProblemChangedEvent): void {
  let entity = new ProblemChanged(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.problemId = event.params.problemId;
  entity.name = event.params.name;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();

  let idString = event.params.problemId.toString();
  let activeProblem = ActiveProblem.load(idString);
  if (activeProblem) {
    activeProblem.name = event.params.name;
    activeProblem.save();
  }
}

export function handleProblemRated(event: ProblemRatedEvent): void {
  let entity = new ProblemRated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.problemId = event.params.problemId;
  entity.rater = event.params.rater;
  entity.rating = event.params.rating;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();

  let idString = event.params.problemId.toString();
  let activeProblem = ActiveProblem.load(idString);

  if (activeProblem != null) {
    // Create UserProblemRatingId as string by combining problem ID and rater address (converted to string)
    let userProblemRatingIdString = idString.concat(event.params.rater.toHex());

    // Load prev rating using UserProblemRatingId string
    let userProblemRating = UserProblemRating.load(userProblemRatingIdString);

    // Validate rating
    let newRating = event.params.rating;

    let prevRatingValue = BigInt.fromI32(0);
    if (userProblemRating != null) {
      prevRatingValue = userProblemRating.rating;
      // Update the rating in UserProblemRating
      userProblemRating.rating = newRating;
      userProblemRating.save();
    } else {
      // If UserProblemRating is null then create a new one
      userProblemRating = new UserProblemRating(userProblemRatingIdString);
      userProblemRating.problemId = event.params.problemId;
      userProblemRating.rater = event.params.rater;
      userProblemRating.rating = newRating;
      userProblemRating.problem = activeProblem.id;

      userProblemRating.blockNumber = event.block.number;
      userProblemRating.save();

      activeProblem.ratingCount = activeProblem.ratingCount.plus(
        BigInt.fromI32(1)
      );
    }

    // Update ratingSum in ActiveProblem
    activeProblem.ratingSum = activeProblem.ratingSum
      .minus(prevRatingValue)
      .plus(newRating);

    activeProblem.save();
  }
}

export function handleProblemRatingCriteriaMet(
  event: ProblemRatingCriteriaMetEvent
): void {
  let entity = new ProblemRatingCriteriaMet(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.problemId = event.params.problemId;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();

  let idString = event.params.problemId.toString();
  let activeProblem = ActiveProblem.load(idString);
  if (activeProblem) {
    activeProblem.isOpenForRating = false;
    activeProblem.isOpenForNewSolutions = true;
    activeProblem.save();
  }
}
