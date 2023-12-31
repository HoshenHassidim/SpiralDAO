import {
  ProjectTokenCreated as ProjectTokenCreatedEvent,
  TokensMinted as TokensMintedEvent
} from "../generated/TokenManagement/TokenManagement"
import { ProjectTokenCreated, TokensMinted } from "../generated/schema"

export function handleProjectTokenCreated(
  event: ProjectTokenCreatedEvent
): void {
  let entity = new ProjectTokenCreated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.projectId = event.params.projectId
  entity.problemCreator = event.params.problemCreator
  entity.solutionCreator = event.params.solutionCreator
  entity.problemCreatorProjectTokens = event.params.problemCreatorProjectTokens
  entity.problemCreatorDaoTokens = event.params.problemCreatorDaoTokens
  entity.solutionCreatorProjectTokens =
    event.params.solutionCreatorProjectTokens
  entity.solutionCreatorDaoTokens = event.params.solutionCreatorDaoTokens

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleTokensMinted(event: TokensMintedEvent): void {
  let entity = new TokensMinted(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.account = event.params.account
  entity.projectId = event.params.projectId
  entity.projectTokens = event.params.projectTokens
  entity.daoTokens = event.params.daoTokens

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
