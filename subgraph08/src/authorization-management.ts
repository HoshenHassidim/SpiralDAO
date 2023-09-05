import {
  AdminChanged as AdminChangedEvent,
  AuthorizationGranted as AuthorizationGrantedEvent,
  AuthorizationRevoked as AuthorizationRevokedEvent
} from "../generated/AuthorizationManagement/AuthorizationManagement"
import {
  AdminChanged,
  AuthorizationGranted,
  AuthorizationRevoked
} from "../generated/schema"

export function handleAdminChanged(event: AdminChangedEvent): void {
  let entity = new AdminChanged(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.newAdmin = event.params.newAdmin

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleAuthorizationGranted(
  event: AuthorizationGrantedEvent
): void {
  let entity = new AuthorizationGranted(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.account = event.params.account

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleAuthorizationRevoked(
  event: AuthorizationRevokedEvent
): void {
  let entity = new AuthorizationRevoked(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.account = event.params.account

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
