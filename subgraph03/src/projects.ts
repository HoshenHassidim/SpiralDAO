import {
  ManagementOfferCancelled as ManagementOfferCancelledEvent,
  ManagementOfferRated as ManagementOfferRatedEvent,
  NewManagementOffer as NewManagementOfferEvent,
  NewProject as NewProjectEvent,
  ProjectManagerAssigned as ProjectManagerAssignedEvent,
} from "../generated/Projects/Projects";
import {
  ManagementOfferCancelled,
  ManagementOfferRated,
  NewManagementOffer,
  NewProject,
  ProjectManagerAssigned,
  Project,
  ActiveProjectOffer,
  UserProjectOfferRating,
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

  let idBytes = changetype<Bytes>(event.params.projectId);
  let project = new Project(idBytes);
  project.projectId = event.params.projectId;
  project.projectManager = Address.fromString(
    "0x0000000000000000000000000000000000000000"
  );
  project.isOpenForManagementProposals = true;
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

  let idBytes = changetype<Bytes>(event.params.offerId);
  let activeProjectOffer = new ActiveProjectOffer(idBytes);

  activeProjectOffer.offerId = event.params.offerId;
  activeProjectOffer.projectId = event.params.projectId;
  activeProjectOffer.proposer = event.params.proposer;
  activeProjectOffer.ratingCount = BigInt.fromI32(0);
  activeProjectOffer.ratingSum = BigInt.fromI32(0);
  activeProjectOffer.isOpenForRating = true;
  activeProjectOffer.blockNumber = event.block.number;

  activeProjectOffer.save();
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

  let idBytes = changetype<Bytes>(event.params.offerId);

  let idString = idBytes.toHex(); // convert to hex string

  let activeProjectOffer = ActiveProjectOffer.load(idBytes);

  if (activeProjectOffer != null) {
    store.remove("ActiveProjectOffer", idString);
  }
}

export function handleManagementOfferRated(
  event: ManagementOfferRatedEvent
): void {
  let entity = new ManagementOfferRated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.offerId = event.params.offerId;
  entity.voter = event.params.voter;
  entity.rating = event.params.rating;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();

  let idBytes = changetype<Bytes>(event.params.offerId);

  let activeProjectOffer = ActiveProjectOffer.load(idBytes);

  if (activeProjectOffer != null) {
    // Create UserSolutionRatingId as bytes by combining problem ID and rater address
    let userProjectOfferRatingIdBytes = idBytes.concat(event.params.voter);

    // Load prev rating using UserSolutionRatingId bytes
    let userProjectOfferRating = UserProjectOfferRating.load(
      userProjectOfferRatingIdBytes
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
    if (userProjectOfferRating != null) {
      prevRatingValue = userProjectOfferRating.rating;
      // Update the rating in UserProjectOfferRating
      userProjectOfferRating.rating = newRating;
      userProjectOfferRating.save();
    } else {
      // If UserProjectOfferRating is null then create a new one
      userProjectOfferRating = new UserProjectOfferRating(
        userProjectOfferRatingIdBytes
      );
      userProjectOfferRating.offerId = event.params.offerId;
      userProjectOfferRating.rater = event.params.voter;
      userProjectOfferRating.rating = newRating;
      userProjectOfferRating.blockNumber = event.block.number;
      userProjectOfferRating.save();

      activeProjectOffer.ratingCount = activeProjectOffer.ratingCount.plus(
        BigInt.fromI32(1)
      );
    }

    // Update ratingSum in ActiveProjectOffer
    activeProjectOffer.ratingSum = activeProjectOffer.ratingSum
      .minus(prevRatingValue)
      .plus(newRating);

    activeProjectOffer.save();
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

  let idBytes = changetype<Bytes>(event.params.projectId);
  let project = Project.load(idBytes);
  if (project) {
    project.projectManager = event.params.projectManager;
    project.isOpenForManagementProposals = false;
    project.save();
  }
}
