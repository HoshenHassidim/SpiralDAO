import {
  NewOffer as NewOfferEvent,
  NewProject as NewProjectEvent,
  OfferCancelled as OfferCancelledEvent,
  OfferRated as OfferRatedEvent,
  ProjectManagerAssigned as ProjectManagerAssignedEvent
} from "../generated/Projects/Projects"
import {
  NewOffer,
  NewProject,
  OfferCancelled,
  OfferRated,
  ProjectManagerAssigned
} from "../generated/schema"

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
  entity.voter = event.params.voter
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
