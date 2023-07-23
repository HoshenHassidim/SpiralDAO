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
} from "../generated/schema";
import { BigInt, Bytes, store, Address } from "@graphprotocol/graph-ts";

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

  let activeProblem = new ActiveProblem(
    Bytes.fromHexString(event.params.id.toHex()) as Bytes
  );
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

  let activeProblemId = event.params.id.toHex();
  store.remove("ActiveProblem", activeProblemId);
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

  let activeProblem = ActiveProblem.load(
    Address.fromString(event.params.id.toHex()) as Bytes
  );
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

  let activeProblem = ActiveProblem.load(
    Address.fromString(event.params.id.toHex()) as Bytes
  );
  if (activeProblem && activeProblem.isOpenForRating) {
    activeProblem.ratingCount = activeProblem.ratingCount.plus(
      BigInt.fromI32(1)
    );
    activeProblem.ratingSum = activeProblem.ratingSum.plus(event.params.rating);
    activeProblem.save();
  }
}
