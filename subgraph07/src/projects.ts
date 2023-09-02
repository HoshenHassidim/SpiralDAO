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
  ProjectManagerVotedOut as ProjectManagerVotedOutEvent,
} from "../generated/Projects/Projects";
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
  ProjectManagerVotedOut,
  Project,
  ActiveManagementOffer,
  UserManagementOfferRating,
  ActiveSolution,
} from "../generated/schema";
import {
  BigInt,
  Bytes,
  store,
  Address,
  crypto,
  ethereum,
  log,
} from "@graphprotocol/graph-ts";

export function handleNewProject(event: NewProjectEvent): void {
  let entity = new NewProject(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.projectId = event.params.projectId;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();

  let idString = event.params.projectId.toString();
  let project = new Project(idString);
  project.projectId = event.params.projectId;
  project.projectManager = Address.fromString(
    "0x0000000000000000000000000000000000000000"
  );
  project.isOpenForManagementProposals = true;
  if (!event.params.projectId.equals(BigInt.fromI32(0))) {
    let idStringSolutionId = event.params.projectId.toString();
    let solution = ActiveSolution.load(idStringSolutionId);
    if (solution) {
      project.solution = solution.id;
    }
  }
  // project.solution = project.id;
  project.blockNumber = event.block.number;
  project.save();
}

export function handleNewManagementOffer(event: NewManagementOfferEvent): void {
  let entity = new NewManagementOffer(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.offerId = event.params.offerId;
  entity.projectId = event.params.projectId;
  entity.proposer = event.params.proposer;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();

  let idString = event.params.offerId.toString();
  let activeManagementOffer = new ActiveManagementOffer(idString);

  activeManagementOffer.offerId = event.params.offerId;
  activeManagementOffer.projectId = event.params.projectId;
  activeManagementOffer.proposer = event.params.proposer;
  activeManagementOffer.ratingCount = BigInt.fromI32(0);
  activeManagementOffer.ratingSum = BigInt.fromI32(0);
  activeManagementOffer.isActive = true;
  let idStringProjectId = event.params.projectId.toString();
  let project = Project.load(idStringProjectId);
  if (project) {
    activeManagementOffer.project = project.id;
  }
  activeManagementOffer.blockNumber = event.block.number;

  activeManagementOffer.save();
}

export function handleManagementOfferCancelled(
  event: ManagementOfferCancelledEvent
): void {
  let entity = new ManagementOfferCancelled(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.offerId = event.params.offerId;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();

  let idString = event.params.offerId.toString();
  let activeManagementOffer = ActiveManagementOffer.load(idString);

  if (activeManagementOffer != null) {
    store.remove("ActiveManagementOffer", idString);
  }
}

export function handleManagementOfferRated(
  event: ManagementOfferRatedEvent
): void {
  let entity = new ManagementOfferRated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.offerId = event.params.offerId;
  entity.rater = event.params.rater;
  entity.rating = event.params.rating;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();

  let idString = event.params.offerId.toString();
  let activeManagementOffer = ActiveManagementOffer.load(idString);

  if (activeManagementOffer != null) {
    // Create UserSolutionRatingId as bytes by combining problem ID and rater address
    let userManagementOfferRatingIdString = idString.concat(
      event.params.rater.toHex()
    );

    // Load prev rating using UserSolutionRatingId bytes
    let userManagementOfferRating = UserManagementOfferRating.load(
      userManagementOfferRatingIdString
    );

    // Validate rating
    let newRating = event.params.rating;
    let minRating = BigInt.fromI32(1);
    let maxRating = BigInt.fromI32(10);

    if (newRating.lt(minRating) || newRating.gt(maxRating)) {
      log.warning("Invalid rating: {}", [newRating.toString()]);
      return;
    }

    let prevRatingValue = BigInt.fromI32(0);
    if (userManagementOfferRating != null) {
      prevRatingValue = userManagementOfferRating.rating;
      // Update the rating in UserManagementOfferRating
      userManagementOfferRating.rating = newRating;
      userManagementOfferRating.save();
    } else {
      // If UserManagementOfferRating is null then create a new one
      userManagementOfferRating = new UserManagementOfferRating(
        userManagementOfferRatingIdString
      );
      userManagementOfferRating.offerId = event.params.offerId;
      userManagementOfferRating.rater = event.params.rater;
      userManagementOfferRating.rating = newRating;
      userManagementOfferRating.blockNumber = event.block.number;
      userManagementOfferRating.save();

      activeManagementOffer.ratingCount = activeManagementOffer.ratingCount.plus(
        BigInt.fromI32(1)
      );
    }

    // Update ratingSum in ActiveManagementOffer
    activeManagementOffer.ratingSum = activeManagementOffer.ratingSum
      .minus(prevRatingValue)
      .plus(newRating);

    activeManagementOffer.save();
  }
}

export function handleProjectManagerAssigned(
  event: ProjectManagerAssignedEvent
): void {
  let entity = new ProjectManagerAssigned(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.projectId = event.params.projectId;
  entity.projectManager = event.params.projectManager;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();

  let idString = event.params.projectId.toString();
  let project = Project.load(idString);
  if (project) {
    let managementOffers = project.managementOffers.load();
    for (let i = 0; i < managementOffers.length; i++) {
      managementOffers[i].isActive = false;
      managementOffers[i].save();
    }
    project.projectManager = event.params.projectManager;
    project.isOpenForManagementProposals = false;
    project.save();
  }
}

export function handleNewProjectManagerRemovalOffer(
  event: NewProjectManagerRemovalOfferEvent
): void {
  let entity = new NewProjectManagerRemovalOffer(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.removalOfferId = event.params.removalOfferId;
  entity.projectId = event.params.projectId;
  entity.proposer = event.params.proposer;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleProjectManagerRemovalOfferCancelled(
  event: ProjectManagerRemovalOfferCancelledEvent
): void {
  let entity = new ProjectManagerRemovalOfferCancelled(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.removalOfferId = event.params.removalOfferId;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleProjectManagerRemovalOfferRated(
  event: ProjectManagerRemovalOfferRatedEvent
): void {
  let entity = new ProjectManagerRemovalOfferRated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.removalOfferId = event.params.removalOfferId;
  entity.rater = event.params.rater;
  entity.rating = event.params.rating;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleProjectManagerResigned(
  event: ProjectManagerResignedEvent
): void {
  let entity = new ProjectManagerResigned(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.projectId = event.params.projectId;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleProjectManagerVotedOut(
  event: ProjectManagerVotedOutEvent
): void {
  let entity = new ProjectManagerVotedOut(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.removalOfferId = event.params.removalOfferId;
  entity.projectId = event.params.projectId;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}
