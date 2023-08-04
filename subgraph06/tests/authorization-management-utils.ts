import { newMockEvent } from "matchstick-as"
import { ethereum, Address } from "@graphprotocol/graph-ts"
import {
  AuthorizationGranted,
  AuthorizationRevoked
} from "../generated/AuthorizationManagement/AuthorizationManagement"

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
