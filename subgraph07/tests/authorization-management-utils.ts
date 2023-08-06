import { newMockEvent } from "matchstick-as"
import { ethereum, Address } from "@graphprotocol/graph-ts"
import {
  AdminChanged,
  AuthorizationGranted,
  AuthorizationRevoked
} from "../generated/AuthorizationManagement/AuthorizationManagement"

export function createAdminChangedEvent(newAdmin: Address): AdminChanged {
  let adminChangedEvent = changetype<AdminChanged>(newMockEvent())

  adminChangedEvent.parameters = new Array()

  adminChangedEvent.parameters.push(
    new ethereum.EventParam("newAdmin", ethereum.Value.fromAddress(newAdmin))
  )

  return adminChangedEvent
}

export function createAuthorizationGrantedEvent(
  account: Address
): AuthorizationGranted {
  let authorizationGrantedEvent = changetype<AuthorizationGranted>(
    newMockEvent()
  )

  authorizationGrantedEvent.parameters = new Array()

  authorizationGrantedEvent.parameters.push(
    new ethereum.EventParam("account", ethereum.Value.fromAddress(account))
  )

  return authorizationGrantedEvent
}

export function createAuthorizationRevokedEvent(
  account: Address
): AuthorizationRevoked {
  let authorizationRevokedEvent = changetype<AuthorizationRevoked>(
    newMockEvent()
  )

  authorizationRevokedEvent.parameters = new Array()

  authorizationRevokedEvent.parameters.push(
    new ethereum.EventParam("account", ethereum.Value.fromAddress(account))
  )

  return authorizationRevokedEvent
}
