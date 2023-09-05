import {
  ManagementOfferCancelled as ManagementOfferCancelledEvent,
  ManagementOfferRated as ManagementOfferRatedEvent,
  NewManagementOffer as NewManagementOfferEvent,
  NewProject as NewProjectEvent,
  NewProjectManagerRemovalOffer as NewProjectManagerRemovalOfferEvent,
  ProjectManagerAssigned as ProjectManagerAssignedEvent,
  ProjectManagerRemovalOfferCancelled as ProjectManagerRemovalOfferCancelledEvent,
  ProjectManagerRemovalOfferRated as ProjectManagerRemovalOfferRatedEvent,
  ProjectManagerResigned as ProjectManagerResignedEvent,
  ProjectManagerVotedOut as ProjectManagerVotedOutEvent
} from "../generated/Projects/Projects"
import {
  ManagementOfferCancelled,
  ManagementOfferRated,
  NewManagementOffer,
  NewProject,
  NewProjectManagerRemovalOffer,
  ProjectManagerAssigned,
  ProjectManagerRemovalOfferCancelled,
  ProjectManagerRemovalOfferRated,
  ProjectManagerResigned,
  ProjectManagerVotedOut
} from "../generated/schema"

export function handleManagementOfferCancelled(
  event: ManagementOfferCancelledEvent
): void {
  let entity = new ManagementOfferCancelled(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.offerId = event.params.offerId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleManagementOfferRated(
  event: ManagementOfferRatedEvent
): void {
  let entity = new ManagementOfferRated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.offerId = event.params.offerId
  entity.rater = event.params.rater
  entity.rating = event.params.rating

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleNewManagementOffer(event: NewManagementOfferEvent): void {
  let entity = new NewManagementOffer(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.offerId = event.params.offerId
  entity.projectId = event.params.projectId
  entity.proposer = event.params.proposer

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleNewProject(event: NewProjectEvent): void {
  let entity = new NewProject(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.projectId = event.params.projectId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleNewProjectManagerRemovalOffer(
  event: NewProjectManagerRemovalOfferEvent
): void {
  let entity = new NewProjectManagerRemovalOffer(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.removalOfferId = event.params.removalOfferId
  entity.projectId = event.params.projectId
  entity.proposer = event.params.proposer

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleProjectManagerAssigned(
  event: ProjectManagerAssignedEvent
): void {
  let entity = new ProjectManagerAssigned(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.projectId = event.params.projectId
  entity.projectManager = event.params.projectManager

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleProjectManagerRemovalOfferCancelled(
  event: ProjectManagerRemovalOfferCancelledEvent
): void {
  let entity = new ProjectManagerRemovalOfferCancelled(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.removalOfferId = event.params.removalOfferId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleProjectManagerRemovalOfferRated(
  event: ProjectManagerRemovalOfferRatedEvent
): void {
  let entity = new ProjectManagerRemovalOfferRated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.removalOfferId = event.params.removalOfferId
  entity.rater = event.params.rater
  entity.rating = event.params.rating

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleProjectManagerResigned(
  event: ProjectManagerResignedEvent
): void {
  let entity = new ProjectManagerResigned(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.projectId = event.params.projectId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleProjectManagerVotedOut(
  event: ProjectManagerVotedOutEvent
): void {
  let entity = new ProjectManagerVotedOut(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.removalOfferId = event.params.removalOfferId
  entity.projectId = event.params.projectId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
