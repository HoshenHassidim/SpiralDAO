import {
  AuthorizationGranted as AuthorizationGrantedEvent,
  AuthorizationRevoked as AuthorizationRevokedEvent,
} from "../generated/AuthorizationManagement/AuthorizationManagement";
import {
  AuthorizationGranted,
  AuthorizationRevoked,
  AuthorizedContract,
} from "../generated/schema";
import { BigInt, Bytes, store } from "@graphprotocol/graph-ts";

export function handleAuthorizationGranted(
  event: AuthorizationGrantedEvent
): void {
  let entity = new AuthorizationGranted(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.account = event.params.account;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();

  let authorizedContract = new AuthorizedContract(event.params.account);
  authorizedContract.account = event.params.account;
  authorizedContract.blockNumber = event.block.number;
  authorizedContract.save();
}

export function handleAuthorizationRevoked(
  event: AuthorizationRevokedEvent
): void {
  let entity = new AuthorizationRevoked(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.account = event.params.account;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();

  let authorizedContract = AuthorizedContract.load(event.params.account);
  if (authorizedContract) {
    store.remove("AuthorizedContract", authorizedContract.id.toHexString());
  }
}
