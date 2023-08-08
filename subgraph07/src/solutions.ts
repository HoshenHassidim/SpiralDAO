import {
  SolutionCancelled as SolutionCancelledEvent,
  SolutionNameChanged as SolutionNameChangedEvent,
  SolutionProjectCriteriaMet as SolutionProjectCriteriaMetEvent,
  SolutionProposed as SolutionProposedEvent,
  SolutionRated as SolutionRatedEvent,
  Solutions,
} from "../generated/Solutions/Solutions";
import {
  SolutionCancelled,
  SolutionNameChanged,
  SolutionProjectCriteriaMet,
  SolutionProposed,
  SolutionRated,
  ActiveSolution,
  UserSolutionRating,
  ActiveProblem,
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

export function handleSolutionProposed(event: SolutionProposedEvent): void {
  let entity = new SolutionProposed(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.solutionId = event.params.solutionId;
  entity.problemId = event.params.problemId;
  entity.creator = event.params.creator;
  entity.name = event.params.name;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();

  let idString = event.params.solutionId.toString();
  let activeSolution = new ActiveSolution(idString);

  activeSolution.solutionId = event.params.solutionId;
  activeSolution.problemId = event.params.problemId;
  activeSolution.creator = event.params.creator;
  activeSolution.name = event.params.name;
  activeSolution.ratingCount = BigInt.fromI32(0);
  activeSolution.ratingSum = BigInt.fromI32(0);

  let idStringProblemId = event.params.problemId.toString();
  let problem = ActiveProblem.load(idStringProblemId);
  if (problem != null) {
    activeSolution.problem = problem.id;
  }
  activeSolution.isOpenForRating = true;
  activeSolution.hasProject = false;
  activeSolution.blockNumber = event.block.number;
  activeSolution.save();
}

export function handleSolutionCancelled(event: SolutionCancelledEvent): void {
  let entity = new SolutionCancelled(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.solutionId = event.params.solutionId;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();

  let idString = event.params.solutionId.toString();
  let activeSolution = ActiveSolution.load(idString);

  if (activeSolution != null) {
    store.remove("ActiveSolution", idString);
  }
}

export function handleSolutionNameChanged(
  event: SolutionNameChangedEvent
): void {
  let entity = new SolutionNameChanged(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.solutionId = event.params.solutionId;
  entity.newName = event.params.newName;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();

  let idString = event.params.solutionId.toString();
  let activeSolution = ActiveSolution.load(idString);
  if (activeSolution) {
    activeSolution.name = event.params.newName;
    activeSolution.save();
  }
}

export function handleSolutionRated(event: SolutionRatedEvent): void {
  let entity = new SolutionRated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.solutionId = event.params.solutionId;
  entity.rater = event.params.rater;
  entity.rating = event.params.rating;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();

  let idString = event.params.solutionId.toString();
  let activeSolution = ActiveSolution.load(idString);

  if (activeSolution != null) {
    // Create UserSolutionRatingId as bytes by combining problem ID and rater address
    let userSolutionRatingIdString = idString.concat(
      event.params.rater.toHex()
    );

    // Load prev rating using UserSolutionRatingId bytes
    let userSolutionRating = UserSolutionRating.load(
      userSolutionRatingIdString
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
    if (userSolutionRating != null) {
      prevRatingValue = userSolutionRating.rating;
      // Update the rating in UserSolutionRating
      userSolutionRating.rating = newRating;
      userSolutionRating.save();
    } else {
      // If UserSolutionRating is null then create a new one
      userSolutionRating = new UserSolutionRating(userSolutionRatingIdString);
      userSolutionRating.solutionId = event.params.solutionId;
      userSolutionRating.rater = event.params.rater;
      userSolutionRating.rating = newRating;
      userSolutionRating.blockNumber = event.block.number;
      userSolutionRating.save();

      activeSolution.ratingCount = activeSolution.ratingCount.plus(
        BigInt.fromI32(1)
      );
    }

    // Update ratingSum in ActiveSolution
    activeSolution.ratingSum = activeSolution.ratingSum
      .minus(prevRatingValue)
      .plus(newRating);

    activeSolution.save();
  }
}

export function handleSolutionProjectCriteriaMet(
  event: SolutionProjectCriteriaMetEvent
): void {
  let entity = new SolutionProjectCriteriaMet(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.solutionId = event.params.solutionId;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();

  let idString = event.params.solutionId.toString();
  let activeSolution = ActiveSolution.load(idString);

  if (activeSolution) {
    activeSolution.isOpenForRating = false;
    activeSolution.hasProject = true;
    activeSolution.save();
    let idStringProblemId = activeSolution.problemId.toString();
    let problem = ActiveProblem.load(idStringProblemId);
    if (problem) {
      let solutions = problem.solutions.load();
      for (let i = 0; i < solutions.length; i++) {
        if (solutions[i].solutionId != event.params.solutionId) {
          solutions[i].isOpenForRating = false;
          solutions[i].save();
        }
      }
      problem.isOpenForNewSolutions = false;
      problem.save();
    }
  }
}
