// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Importing necessary contracts
import "./Membership.sol";
import "./Solutions.sol";
import "./TokenManagement.sol";
import "./AuthorizationManagement.sol";

// Contract for managing projects
contract Projects {
    // State variables
    uint256 private offerCounter;
    uint256 private removalOfferCounter;
    uint256 constant MAX_RATING = 10;
    uint256 constant MIN_TOTAL_RATERS_COUNT = 4;
    uint256 constant MIN_RAITNGS_PER_OFFER = 3;
    uint256 constant MIN_RATERS_DAO_REMOVAL = 5;
    uint256 constant MIN_RATING_DAO_REMOVAL = 8;
    uint256 public projectCounter = 0;
    uint256 constant MIN_AVG_RATING = 7;

    // Project structure
    struct Project {
        uint256 projectId;
        bool isOpenForManagementProposals;
        bool isOpenForManagmentRemovalProposal;
        address projectManager;
        bool hasManager;
    }

    // Offer structure
    struct Offer {
        uint256 offerId;
        uint256 projectId;
        address manager;
        uint256 ratingSum;
        uint256 numberOfRaters;
        bool isActive;
        mapping(address => uint256) oldRating;
    }

    // Removal Offer structure
    struct RemovalOffer {
        uint256 remOfferId;
        uint256 projectId;
        address proposer;
        uint256 removalRatingSum;
        uint256 removalNumberOfRaters;
        bool isOpenForRemovalRating;
        mapping(address => uint256) oldRemovalRating;
    }

    // Errors
    error insufficientTotalRatersForAllOffers();
    error IDMustBePositive();
    error solutionDoesNotMeetCriteria();
    error invalidID();
    error projectIdMustBePositive();
    error projectNotOpenForProposals();
    error userAlreadyProposed();
    error onlyManager();
    error notOpenForRating();
    error projectDoesNotExist();
    error ratingOutOfRange();
    error managerCannotRateOwnOffer();
    error notOpenForRemovalProposals();
    error managerCannotRateAgainstThemselves();
    error offerNotActive();
    error cannotCancelOnceVotingBegins();
    error DAONotOpenForProposals();
    error managerHasBeenAssigned();
    error mustBeAuthorised();

    // Project ID to Project mapping
    mapping(uint256 => Project) private projects;

    // Project ID to array of Offer IDs mapping
    mapping(uint256 => uint256[]) private projectToOffers;

    // Offer ID to Offer mapping
    mapping(uint256 => Offer) private offers;

    // Removal Offer ID to Removal Offer mapping
    mapping(uint256 => RemovalOffer) private removalOffers;

    // Mapping to track which addresses have proposed for a project
    mapping(uint256 => mapping(address => bool)) private hasProposed;

    // References to imported contracts
    Membership private membershipContract;
    Solutions private solutionsContract;
    TokenManagement private tokenManagementContract;
    AuthorizationManagement private authorizationManagementContract;

    // Events
    event NewProject(uint256 projectId);
    event NewManagementOffer(uint256 offerId, uint256 projectId, address proposer);
    event ManagementOfferCancelled(uint256 offerId);
    event ManagementOfferRated(uint256 offerId, address rater, uint256 rating);
    event ProjectManagerAssigned(uint256 indexed projectId, address projectManager);
    event NewProjectManagerRemovalOffer(
        uint256 removalOfferId,
        uint256 projectId,
        address proposer
    );
    event ProjectManagerRemovalOfferCancelled(uint256 removalOfferId);
    event ProjectManagerRemovalOfferRated(uint256 removalOfferId, address rater, uint256 rating);
    event ProjectManagerResigned(uint256 projectId);
    event ProjectManagerVotedOut(uint256 removalOfferId, uint256 projectId);

    // Constructor to initialize the imported contracts
    constructor(
        Membership _membershipContract,
        AuthorizationManagement _authorizationManagementContract,
        Solutions _solutionsContract,
        TokenManagement _tokenManagementContract
    ) {
        membershipContract = _membershipContract;
        authorizationManagementContract = _authorizationManagementContract;
        solutionsContract = _solutionsContract;
        tokenManagementContract = _tokenManagementContract;
        projects[0] = Project(0, false, true, msg.sender, true);
        emit NewProject(0);
        emit ProjectManagerAssigned(0, msg.sender);
    }

    // Modifier to allow only authorized contracts to perform certain actions.
    modifier onlyAuthorized() {
        if (!authorizationManagementContract.isAuthorized(msg.sender)) revert mustBeAuthorised();
        _;
    }

    // Private function to create a new project from a solution
    function createProject(uint256 _projectId) private {
        if (_projectId <= 0) revert IDMustBePositive();
        if (!solutionsContract.canBecomeProjectView(_projectId))
            revert solutionDoesNotMeetCriteria();
        if (projectToOffers[_projectId].length == 0) {
            solutionsContract.canBecomeProject(_projectId);
        }
        // Retrieve problem and solution creators
        (address problemCreator, address solutionCreator) = solutionsContract.getCreators(
            _projectId
        );
        projectCounter++;

        // Create a new token contract for the project with problem and solution creators as parameters
        tokenManagementContract.newProjectToken(
            _projectId,
            "ProjectToken",
            "PT",
            problemCreator,
            solutionCreator
        );

        membershipContract.proposedProblemAndSolutionAccepted(problemCreator, solutionCreator);

        // Create new project and store it in the mapping
        projects[_projectId] = Project(_projectId, true, false, address(0), false);

        emit NewProject(_projectId); // Emit the event
    }

    // External function to propose a management offer for a project

    function proposeManagementOffer(uint256 _projectId) external {
        // if (solutionsContract.getSolutionCounter() < _projectId || _projectId == 0)
        if (solutionsContract.getSolutionCounter() < _projectId || _projectId < 0)
            revert invalidID();
        if (_projectId != 0) {
            if (projects[_projectId].projectId == 0) {
                createProject(_projectId); // Check if the solution has a project, if not, create one
            }
        }

        uint256 projectId = _projectId; // The project ID is the same as the projectId

        // Ensuring that the project is open for management proposals
        if (!projects[projectId].isOpenForManagementProposals) revert projectNotOpenForProposals();

        // Ensuring the user has not already proposed for this project
        if (hasProposed[projectId][msg.sender]) revert userAlreadyProposed();

        hasProposed[projectId][msg.sender] = true; // Mark the user as having proposed for this project

        offerCounter++; // Increment the offer counter

        // Create new offer and store in mapping
        Offer storage newOffer = offers[offerCounter];
        newOffer.offerId = offerCounter;
        newOffer.projectId = projectId;
        newOffer.manager = msg.sender;
        newOffer.ratingSum = 0;
        newOffer.numberOfRaters = 0;
        newOffer.isActive = true;

        projectToOffers[projectId].push(offerCounter); // Update the project to offer mapping

        emit NewManagementOffer(offerCounter, projectId, msg.sender); // Emit the event
    }

    function proposeManagementOfferDAO() external {
        Project memory DAOProject = projects[0];
        // Ensuring that the project is open for management proposals
        if (!DAOProject.isOpenForManagementProposals) revert DAONotOpenForProposals();

        // Ensuring the user has not already proposed for this project
        if (hasProposed[0][msg.sender]) revert userAlreadyProposed();

        hasProposed[0][msg.sender] = true; // Mark the user as having proposed for this project

        offerCounter++; // Increment the offer counter

        // Create new offer and store in mapping
        Offer storage newOffer = offers[offerCounter];
        newOffer.offerId = offerCounter;
        newOffer.projectId = 0;
        newOffer.manager = msg.sender;
        newOffer.ratingSum = 0;
        newOffer.numberOfRaters = 0;
        newOffer.isActive = true;

        projectToOffers[0].push(offerCounter); // Update the project to offer mapping

        emit NewManagementOffer(offerCounter, 0, msg.sender); // Emit the event
    }

    // External function to cancel a management offer

    function cancelManagementOffer(uint256 _offerId) external {
        if (_offerId <= 0 || _offerId > offerCounter) revert invalidID();

        Offer storage offer = offers[_offerId];

        if (offer.manager != msg.sender) revert onlyManager();
        if (!offer.isActive) revert offerNotActive();

        offer.isActive = false;
        hasProposed[offers[_offerId].projectId][msg.sender] = false;

        emit ManagementOfferCancelled(_offerId); // Emit the event
    }

    // External function to rate a management offer

    function rateManagementOffer(uint256 _offerId, uint256 _rating) external {
        if (_offerId <= 0 || _offerId > offerCounter) revert invalidID();
        if (_rating < 1 || _rating > MAX_RATING) revert ratingOutOfRange();

        Offer storage offer = offers[_offerId];

        if (!offer.isActive) revert offerNotActive();
        if (offer.manager == msg.sender) revert managerCannotRateOwnOffer();

        if (offer.oldRating[msg.sender] > 0) {
            offer.ratingSum -= offer.oldRating[msg.sender];
        } else {
            offer.numberOfRaters++;
        }
        offer.oldRating[msg.sender] = _rating;
        offer.ratingSum += _rating;

        emit ManagementOfferRated(_offerId, msg.sender, _rating); // Emit the event
    }

    // External function to assign the project manager
    function assignProjectManager(uint256 _projectId) external {
        if (_projectId < 0) revert IDMustBePositive();
        if (!doesProjectExist(_projectId)) revert projectDoesNotExist();
        if (doesProjectHaveManager(_projectId)) revert managerHasBeenAssigned();
        if (!projects[_projectId].isOpenForManagementProposals) revert projectNotOpenForProposals();

        Project storage project = projects[_projectId];

        uint256 bestOfferId = 0;
        uint256 bestRating = 0;
        uint256 totalRatersForAllOffers = 0;

        // Iterate over all offers for the project to find the best one
        for (uint256 i = 0; i < projectToOffers[_projectId].length; i++) {
            Offer storage offer = offers[projectToOffers[_projectId][i]];
            if (!offer.isActive) continue;
            if (offer.numberOfRaters >= MIN_RAITNGS_PER_OFFER) {
                uint256 averageRating = offer.ratingSum / offer.numberOfRaters;

                // If the current offer has a better rating, set it as the best
                if (averageRating > bestRating) {
                    bestOfferId = offer.offerId;
                    bestRating = averageRating;
                }
            }
            totalRatersForAllOffers += offer.numberOfRaters;
        }

        // Check if the total raters meet the requirements
        if (totalRatersForAllOffers < MIN_TOTAL_RATERS_COUNT) {
            revert insufficientTotalRatersForAllOffers();
        }

        // If the best offer's average rating is above MIN_AVG_RATING, assign the project manager
        if (bestRating > MIN_AVG_RATING) {
            project.isOpenForManagementProposals = false;
            projects[_projectId].projectManager = offers[bestOfferId].manager;
            projects[_projectId].hasManager = true;
            project.isOpenForManagmentRemovalProposal = true;
            for (uint256 i = 0; i < projectToOffers[_projectId].length; i++) {
                Offer storage offer = offers[projectToOffers[_projectId][i]];
                if (!offer.isActive) continue;
                offer.isActive = false;
            }
            membershipContract.managedProject(projects[_projectId].projectManager);
            // Emit the event to track the project manager assignment
            emit ProjectManagerAssigned(_projectId, offers[bestOfferId].manager);
        }
    }

    // External function to allow a manager to resign
    function managerResign(uint256 _projectId) external {
        if (_projectId < 0) revert IDMustBePositive();
        if (!doesProjectExist(_projectId)) revert projectDoesNotExist();

        if (msg.sender != projects[_projectId].projectManager) revert onlyManager();

        removeProjectManager(_projectId);

        emit ProjectManagerResigned(_projectId);
    }

    // External function to propose a management removal offer for a project
    function proposeRemoveManager(uint256 _projectId) external {
        if (_projectId < 0) revert IDMustBePositive();
        if (!doesProjectExist(_projectId)) revert projectDoesNotExist();

        if (projects[_projectId].isOpenForManagmentRemovalProposal == false)
            revert notOpenForRemovalProposals();

        removalOfferCounter++;

        RemovalOffer storage newRemovalOffer = removalOffers[removalOfferCounter];
        newRemovalOffer.remOfferId = removalOfferCounter;
        newRemovalOffer.projectId = _projectId;
        newRemovalOffer.proposer = msg.sender;
        newRemovalOffer.removalRatingSum = 0;
        newRemovalOffer.removalNumberOfRaters = 0;
        newRemovalOffer.isOpenForRemovalRating = true;

        emit NewProjectManagerRemovalOffer(offerCounter, _projectId, msg.sender);
    }

    // External function to cancel a management removal offer
    function cancelRemovalOffer(uint256 _removalOfferId) external {
        if (_removalOfferId < 0 || _removalOfferId > removalOfferCounter) revert invalidID();

        RemovalOffer storage removalOffer = removalOffers[_removalOfferId];

        if (removalOffer.proposer != msg.sender) revert onlyManager();
        if (removalOffer.removalNumberOfRaters > 0) revert cannotCancelOnceVotingBegins();
        if (!removalOffer.isOpenForRemovalRating) revert notOpenForRating();

        removalOffer.isOpenForRemovalRating = false; // Mark the offer as not open for rating

        emit ProjectManagerRemovalOfferCancelled(_removalOfferId); // Emit the event
    }

    // External function to rate a managment removal offer
    function rateRemovalOffer(uint256 _removalOfferId, uint256 _rating) external {
        if (_removalOfferId < 0 || _removalOfferId > removalOfferCounter) revert invalidID();
        if (_rating < 1 || _rating > MAX_RATING) revert ratingOutOfRange();

        RemovalOffer storage removalOffer = removalOffers[_removalOfferId];

        if (projects[removalOffer.projectId].projectManager == msg.sender)
            revert managerCannotRateAgainstThemselves();
        if (!removalOffer.isOpenForRemovalRating) revert notOpenForRating();

        if (removalOffer.oldRemovalRating[msg.sender] > 0) {
            removalOffer.removalRatingSum -= removalOffer.oldRemovalRating[msg.sender];
        } else {
            removalOffer.removalNumberOfRaters++;
        }
        removalOffer.oldRemovalRating[msg.sender] = _rating;
        removalOffer.removalRatingSum += _rating;

        emit ProjectManagerRemovalOfferRated(_removalOfferId, msg.sender, _rating);
    }

    function checkRemovalRatings(uint256 _removalOfferId) external {
        uint256 MIN_RATING_REMOVAL;
        uint256 MIN_RATERS_REMOVAL;
        if (removalOffers[_removalOfferId].projectId < 0) revert IDMustBePositive();
        if (!doesProjectExist(removalOffers[_removalOfferId].projectId))
            revert projectDoesNotExist();
        RemovalOffer storage removalOffer = removalOffers[_removalOfferId];
        // Project storage project = projects[removalOffer.projectId];
        if (removalOffer.projectId != 0) MIN_RATING_REMOVAL = MIN_RAITNGS_PER_OFFER;
        else MIN_RATERS_REMOVAL = MIN_RATERS_DAO_REMOVAL;

        // Check if the total raters meet the requirements
        if (removalOffer.removalNumberOfRaters < MIN_RATERS_REMOVAL)
            revert insufficientTotalRatersForAllOffers();

        if (removalOffer.projectId != 0) MIN_RATING_REMOVAL = 7;
        else MIN_RATING_REMOVAL = MIN_RATING_DAO_REMOVAL;

        // If the best offer's average rating is above MIN_RATING_REMOVAL, assign the project manager
        if ((removalOffer.removalRatingSum / removalOffer.removalNumberOfRaters) > MIN_AVG_RATING) {
            removalOffer.isOpenForRemovalRating = false;
            removeProjectManager(removalOffer.projectId);
            emit ProjectManagerVotedOut(_removalOfferId, removalOffer.projectId);
        }
    }

    function removeProjectManager(uint256 _projectId) private {
        Project storage project = projects[_projectId];

        project.isOpenForManagmentRemovalProposal = false;
        project.projectManager = address(0);
        project.isOpenForManagementProposals = true;
        project.hasManager = false;

        for (uint256 i = 0; i < projectToOffers[_projectId].length; i++) {
            address proposer = offers[projectToOffers[_projectId][i]].manager;
            hasProposed[_projectId][proposer] = false;
        }
    }

    // Function to view details about an offer
    function viewOfferDetails(
        uint256 _offerId
    ) external view returns (uint256, uint256, address, uint256, uint256, bool) {
        if (_offerId <= 0 || _offerId > offerCounter) revert invalidID();

        Offer storage offer = offers[_offerId];

        // Return the offer details: offerId, projectId, manager, ratingSum, numberOfRaters, isActive
        return (
            offer.offerId,
            offer.projectId,
            offer.manager,
            offer.ratingSum,
            offer.numberOfRaters,
            offer.isActive
        );
    }

    function viewRemovalOfferDetails(
        uint256 _removalOfferId
    ) external view returns (uint256, uint256, address, uint256, uint256, bool) {
        if (_removalOfferId <= 0 || _removalOfferId > removalOfferCounter) revert invalidID();

        RemovalOffer storage removalOffer = removalOffers[_removalOfferId];

        // Return the offer details: remofferId, projectId, proposer, removalRatingSum, removalNumberOfRaters, isOpenForRemovalRating
        return (
            removalOffer.remOfferId,
            removalOffer.projectId,
            removalOffer.proposer,
            removalOffer.removalRatingSum,
            removalOffer.removalNumberOfRaters,
            removalOffer.isOpenForRemovalRating
        );
    }

    // Function to view details about a project
    function viewProjectDetails(uint256 _projectId) external view returns (uint256, bool, bool) {
        if (!doesProjectExist(_projectId)) revert projectDoesNotExist();

        Project storage project = projects[_projectId];

        // Return the project details: projectId (same as projectId), isOpenForManagementProposals
        return (
            project.projectId,
            project.isOpenForManagementProposals,
            project.isOpenForManagmentRemovalProposal
        );
    }

    // Function to view the offers for a project
    function viewProjectOffers(uint256 _projectId) external view returns (uint256[] memory) {
        if (_projectId <= 0) revert IDMustBePositive();
        if (!doesProjectExist(_projectId)) revert projectDoesNotExist();

        // Return the array of offer IDs for the project
        return projectToOffers[_projectId];
    }

    // Function to view the manager of a specific project
    function getProjectManager(uint256 _projectId) external view returns (address) {
        // if (_projectId <= 0) revert IDMustBePositive();
        if (!doesProjectExist(_projectId)) revert projectDoesNotExist();

        // Return the project manager
        return projects[_projectId].projectManager;
    }

    // Getter function for offerCounter
    function getManagementOfferCounter() external view returns (uint256) {
        return offerCounter;
    }

    // Getter function for removalOfferCounter
    function getManagementRemovalOfferCounter() external view returns (uint256) {
        return removalOfferCounter;
    }

    function doesProjectExist(uint256 projectId) public view returns (bool) {
        return projects[projectId].hasManager || projects[projectId].isOpenForManagementProposals;
    }

    function doesProjectHaveManager(uint256 projectId) public view returns (bool) {
        return projects[projectId].hasManager;
    }
}
