import {
  NewProblem as NewProblemEvent,
  ProblemCancelled as ProblemCancelledEvent,
  ProblemChanged as ProblemChangedEvent,
  ProblemRated as ProblemRatedEvent,
} from "../generated/Problems/Problems";
import {
  NewProblem,
  ProblemCancelled,
  ProblemChanged,
  ProblemRated,
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
  entity.Problems_id = event.params.id;
  entity.creator = event.params.creator;
  entity.name = event.params.name;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();

  let idBytes = changetype<Bytes>(event.params.id);
  let activeProblem = new ActiveProblem(idBytes);

  activeProblem.Problems_id = event.params.id;
  activeProblem.creator = event.params.creator;
  activeProblem.name = event.params.name;
  activeProblem.ratingCount = BigInt.fromI32(0);
  activeProblem.ratingSum = BigInt.fromI32(0);
  activeProblem.isOpenForRating = true;
  activeProblem.blockNumber = event.block.number;
  activeProblem.save();
}

export function handleProblemCancelled(event: ProblemCancelledEvent): void {
  let entity = new ProblemCancelled(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.Problems_id = event.params.id;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();

  let idBytes = changetype<Bytes>(event.params.id);

  let idString = idBytes.toHex(); // convert to hex string

  let activeProblem = ActiveProblem.load(idBytes);

  if (activeProblem != null) {
    store.remove("ActiveProblem", idString);
  }
}

export function handleProblemChanged(event: ProblemChangedEvent): void {
  let entity = new ProblemChanged(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.Problems_id = event.params.id;
  entity.name = event.params.name;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();

  let idBytes = changetype<Bytes>(event.params.id);
  let activeProblem = ActiveProblem.load(idBytes);
  if (activeProblem) {
    activeProblem.name = event.params.name;
    activeProblem.save();
  }
}

export function handleProblemRated(event: ProblemRatedEvent): void {
  let entity = new ProblemRated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.Problems_id = event.params.id;
  entity.rater = event.params.rater;
  entity.rating = event.params.rating;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();

  let idBytes = changetype<Bytes>(event.params.id);

  let activeProblem = ActiveProblem.load(idBytes);

  if (activeProblem != null) {
    // Create UserProblemRatingId as bytes by combining problem ID and rater address
    let userProblemRatingIdBytes = idBytes.concat(event.params.rater);

    // Load prev rating using UserProblemRatingId bytes
    let userProblemRating = UserProblemRating.load(userProblemRatingIdBytes);

    // Validate rating
    let newRating = event.params.rating;
    let minRating = BigInt.fromI32(1);
    let maxRating = BigInt.fromI32(10);

    if (newRating.lt(minRating) || newRating.gt(maxRating)) {
      log.warning("Invalid rating: {}", [newRating.toString()]);
      return;
    }

    let prevRatingValue = BigInt.fromI32(0);
    if (userProblemRating != null) {
      prevRatingValue = userProblemRating.rating;
      // Update the rating in UserProblemRating
      userProblemRating.rating = newRating;
      userProblemRating.save();
    } else {
      // If UserProblemRating is null then create a new one
      userProblemRating = new UserProblemRating(userProblemRatingIdBytes);
      userProblemRating.Problems_id = event.params.id;
      userProblemRating.rater = event.params.rater;
      userProblemRating.rating = newRating;
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
