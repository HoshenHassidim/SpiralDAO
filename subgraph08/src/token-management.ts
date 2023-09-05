import {
  ProjectTokenCreated as ProjectTokenCreatedEvent,
  TokensMinted as TokensMintedEvent,
} from "../generated/TokenManagement/TokenManagement";
import {
  ProjectTokenCreated,
  TokensMinted,
  TokenBalance,
} from "../generated/schema";
import { BigInt, Bytes, store } from "@graphprotocol/graph-ts";

export function handleProjectTokenCreated(
  event: ProjectTokenCreatedEvent
): void {
  let entity = new ProjectTokenCreated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.projectId = event.params.projectId;
  entity.problemCreator = event.params.problemCreator;
  entity.solutionCreator = event.params.solutionCreator;
  entity.problemCreatorProjectTokens = event.params.problemCreatorProjectTokens;
  entity.problemCreatorDaoTokens = event.params.problemCreatorDaoTokens;
  entity.solutionCreatorProjectTokens =
    event.params.solutionCreatorProjectTokens;
  entity.solutionCreatorDaoTokens = event.params.solutionCreatorDaoTokens;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();

  updateTokenBalance(
    event.params.problemCreator,
    event.params.projectId,
    event.params.problemCreatorProjectTokens
  );
  updateTokenBalance(
    event.params.solutionCreator,
    event.params.projectId,
    event.params.solutionCreatorProjectTokens
  );

  // Handle DAO tokens
  updateTokenBalance(
    event.params.problemCreator,
    BigInt.fromI32(0),
    event.params.problemCreatorDaoTokens
  );
  updateTokenBalance(
    event.params.solutionCreator,
    BigInt.fromI32(0),
    event.params.solutionCreatorDaoTokens
  );
}

export function handleTokensMinted(event: TokensMintedEvent): void {
  let entity = new TokensMinted(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.account = event.params.account;
  entity.projectId = event.params.projectId;
  entity.projectTokens = event.params.projectTokens;
  entity.daoTokens = event.params.daoTokens;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();

  updateTokenBalance(
    event.params.account,
    event.params.projectId,
    event.params.projectTokens
  );

  // Handle DAO tokens
  updateTokenBalance(
    event.params.account,
    BigInt.fromI32(0),
    event.params.daoTokens
  );
}

function updateTokenBalance(
  member: Bytes,
  projectId: BigInt,
  amount: BigInt
): void {
  let tokenId = member.toHex() + "-" + projectId.toString();
  let memberTokens = TokenBalance.load(tokenId);

  if (memberTokens == null) {
    memberTokens = new TokenBalance(tokenId);
    memberTokens.member = member;
    memberTokens.projectId = projectId;
    memberTokens.balance = amount;
  } else {
    memberTokens.balance = memberTokens.balance.plus(amount);
  }
  memberTokens.save();
}
