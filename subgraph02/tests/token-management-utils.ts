import { newMockEvent } from "matchstick-as"
import { ethereum, BigInt, Address } from "@graphprotocol/graph-ts"
import {
  ProjectTokenCreated,
  TokensMinted
} from "../generated/TokenManagement/TokenManagement"

export function createProjectTokenCreatedEvent(
  projectId: BigInt,
  problemCreator: Address,
  solutionCreator: Address,
  problemCreatorProjectTokens: BigInt,
  problemCreatorDaoTokens: BigInt,
  solutionCreatorProjectTokens: BigInt,
  solutionCreatorDaoTokens: BigInt
): ProjectTokenCreated {
  let projectTokenCreatedEvent = changetype<ProjectTokenCreated>(newMockEvent())

  projectTokenCreatedEvent.parameters = new Array()

  projectTokenCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "projectId",
      ethereum.Value.fromUnsignedBigInt(projectId)
    )
  )
  projectTokenCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "problemCreator",
      ethereum.Value.fromAddress(problemCreator)
    )
  )
  projectTokenCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "solutionCreator",
      ethereum.Value.fromAddress(solutionCreator)
    )
  )
  projectTokenCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "problemCreatorProjectTokens",
      ethereum.Value.fromUnsignedBigInt(problemCreatorProjectTokens)
    )
  )
  projectTokenCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "problemCreatorDaoTokens",
      ethereum.Value.fromUnsignedBigInt(problemCreatorDaoTokens)
    )
  )
  projectTokenCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "solutionCreatorProjectTokens",
      ethereum.Value.fromUnsignedBigInt(solutionCreatorProjectTokens)
    )
  )
  projectTokenCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "solutionCreatorDaoTokens",
      ethereum.Value.fromUnsignedBigInt(solutionCreatorDaoTokens)
    )
  )

  return projectTokenCreatedEvent
}

export function createTokensMintedEvent(
  account: Address,
  projectId: BigInt,
  projectTokens: BigInt,
  daoTokens: BigInt
): TokensMinted {
  let tokensMintedEvent = changetype<TokensMinted>(newMockEvent())

  tokensMintedEvent.parameters = new Array()

  tokensMintedEvent.parameters.push(
    new ethereum.EventParam("account", ethereum.Value.fromAddress(account))
  )
  tokensMintedEvent.parameters.push(
    new ethereum.EventParam(
      "projectId",
      ethereum.Value.fromUnsignedBigInt(projectId)
    )
  )
  tokensMintedEvent.parameters.push(
    new ethereum.EventParam(
      "projectTokens",
      ethereum.Value.fromUnsignedBigInt(projectTokens)
    )
  )
  tokensMintedEvent.parameters.push(
    new ethereum.EventParam(
      "daoTokens",
      ethereum.Value.fromUnsignedBigInt(daoTokens)
    )
  )

  return tokensMintedEvent
}
