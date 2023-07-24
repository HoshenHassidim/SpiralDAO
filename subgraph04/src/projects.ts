import {
  ManagementOfferCancelled as ManagementOfferCancelledEvent,
  ManagementOfferRated as ManagementOfferRatedEvent,
  NewManagementOffer as NewManagementOfferEvent,
  NewOffer as NewOfferEvent,
  NewProject as NewProjectEvent,
  NewRemovalOffer as NewRemovalOfferEvent,
  OfferCancelled as OfferCancelledEvent,
  OfferRated as OfferRatedEvent,
  ProjectManagerAssigned as ProjectManagerAssignedEvent,
  RemovalOfferCancelled as RemovalOfferCancelledEvent,
  RemovalOfferRated as RemovalOfferRatedEvent
} from "../generated/Projects/Projects"
import {
  ManagementOfferCancelled,
  ManagementOfferRated,
  NewManagementOffer,
  NewOffer,
  NewProject,
  NewRemovalOffer,
  OfferCancelled,
  OfferRated,
  ProjectManagerAssigned,
  RemovalOfferCancelled,
  RemovalOfferRated
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

export function handleNewOffer(event: NewOfferEvent): void {
  let entity = new NewOffer(
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

export function handleNewRemovalOffer(event: NewRemovalOfferEvent): void {
  let entity = new NewRemovalOffer(
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

export function handleOfferCancelled(event: OfferCancelledEvent): void {
  let entity = new OfferCancelled(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.offerId = event.params.offerId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleOfferRated(event: OfferRatedEvent): void {
  let entity = new OfferRated(
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

export function handleRemovalOfferCancelled(
  event: RemovalOfferCancelledEvent
): void {
  let entity = new RemovalOfferCancelled(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.removalOfferId = event.params.removalOfferId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleRemovalOfferRated(event: RemovalOfferRatedEvent): void {
  let entity = new RemovalOfferRated(
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
