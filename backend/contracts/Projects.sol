// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Importing necessary contracts
import "./Membership.sol";
import "./Solutions.sol";
import "./TokenManagement.sol";

// Contract for managing projects
contract Projects {
    // State variables
    uint256 private offerCounter;
    uint256 private removalOfferCounter;
    uint256 constant MAX_RATING = 10;
    uint256 constant MIN_TOTAL_RATERS_COUNT = 4;
    uint256 constant MIN_RAITNGS_PER_OFFER = 3;

    // Project structure
    struct Project {
        uint256 solutionId;
        bool isOpenForManagementProposals;
        bool isOpenForManagmentRemovalProposal;
        address projectManager;
    }

    // Offer structure
    struct Offer {
        uint256 offerId;
        uint256 projectId;
        address manager;
        uint256 ratingSum;
        uint256 numberOfRaters;
        bool isOpenForRating;
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
    error projectDoesNotExist();
    error notOpenForRemovalProposals();
    error invalidID();
    error onlyManager();
    error notOpenForRating();
    error ratingOutOfRange();
    error managerCannotRateAgainstThemselves();

    // Project ID to Project mapping (solutionId is used as projectId)
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

    // Events
    event NewProject(uint256 projectId);
    event NewOffer(uint256 offerId, uint256 projectId, address proposer);
    event NewRemovalOffer(uint256 removalOfferId, uint256 projectId, address proposer);
    event OfferCancelled(uint256 offerId);
    event RemovalOfferCancelled(uint256 removalOfferId);
    event OfferRated(uint256 offerId, address rater, uint256 rating);
    event RemovalOfferRated(uint256 removalOfferId, address rater, uint256 rating);

    // Modifier to ensure only registered members can propose, cancel or rate an offer
    modifier onlyMember() {
        require(
            membershipContract.isRegisteredMember(msg.sender),
            "Only registered members can perform this action"
        );
        _;
    }

    // Constructor to initialize the imported contracts
    constructor(
        address _membershipContract,
        address _solutionsContract,
        address _tokenManagementContract
    ) {
        membershipContract = Membership(_membershipContract);
        solutionsContract = Solutions(_solutionsContract);
        tokenManagementContract = TokenManagement(_tokenManagementContract);
    }

    // Private function to create a new project from a solution
    function createProject(uint256 _solutionId) private {
        require(_solutionId > 0, "Solution ID must be positive");
        require(
            solutionsContract.canBecomeProject(_solutionId),
            "Solution does not meet the criteria to become a project"
        );

        // Retrieve problem and solution creators
        (address problemCreator, address solutionCreator) = solutionsContract.getCreators(
            _solutionId
        );

        // Create a new token contract for the project with problem and solution creators as parameters
        tokenManagementContract.newProjectToken(
            _solutionId,
            "ProjectToken",
            "PT",
            problemCreator,
            solutionCreator
        );

        // Create new project and store it in the mapping
        projects[_solutionId] = Project(_solutionId, true, false, address(0));

        emit NewProject(_solutionId); // Emit the event
    }

    // External function to propose a management offer for a project
    function proposeOffer(uint256 _solutionId) external onlyMember {
        require(solutionsContract.getSolutionCounter() >= _solutionId, "Invalid solution ID");
        require(_solutionId > 0, "Solution ID must be positive");
        if (projects[_solutionId].solutionId == 0) {
            createProject(_solutionId); // Check if the solution has a project, if not, create one
        }

        uint256 projectId = _solutionId; // The project ID is the same as the solutionId

        // Ensuring that the project is open for management proposals
        require(
            projects[projectId].isOpenForManagementProposals,
            "Project is not open for management proposals"
        );

        // Ensuring the user has not already proposed for this project
        require(!hasProposed[projectId][msg.sender], "User has already proposed for this project");

        hasProposed[projectId][msg.sender] = true; // Mark the user as having proposed for this project

        offerCounter++; // Increment the offer counter

        // Create new offer and store in mapping
        Offer storage newOffer = offers[offerCounter];
        newOffer.offerId = offerCounter;
        newOffer.projectId = projectId;
        newOffer.manager = msg.sender;
        newOffer.ratingSum = 0;
        newOffer.numberOfRaters = 0;
        newOffer.isOpenForRating = true;

        projectToOffers[projectId].push(offerCounter); // Update the project to offer mapping

        emit NewOffer(offerCounter, projectId, msg.sender); // Emit the event
    }

    // External function to cancel a management offer
    function cancelOffer(uint256 _offerId) external onlyMember {
        require(_offerId > 0 && _offerId <= offerCounter, "Invalid offer ID");

        Offer storage offer = offers[_offerId];

        require(offer.manager == msg.sender, "Only the manager can cancel the offer");
        require(offer.isOpenForRating, "Offer is not open for rating");

        offer.isOpenForRating = false; // Mark the offer as not open for rating

        emit OfferCancelled(_offerId); // Emit the event
    }

    // External function to rate a management offer
    function rateOffer(uint256 _offerId, uint256 _rating) external onlyMember {
        require(_offerId > 0 && _offerId <= offerCounter, "Invalid offer ID");
        require(_rating >= 1 && _rating <= MAX_RATING, "Rating must be between 1 and MAX_RATING");

        Offer storage offer = offers[_offerId];

        require(offer.manager != msg.sender, "Offer manager cannot rate their own offer");
        require(offer.isOpenForRating, "Offer is not open for rating");

        if (offer.oldRating[msg.sender] > 0) {
            offer.ratingSum -= offer.oldRating[msg.sender];
        } else {
            offer.numberOfRaters++;
        }
        offer.oldRating[msg.sender] = _rating;
        offer.ratingSum += _rating;

        emit OfferRated(_offerId, msg.sender, _rating); // Emit the event
    }

    // External function to assign the project manager
    function assignProjectManager(uint256 _projectId) external {
        require(_projectId > 0, "Project ID must be positive");
        require(projects[_projectId].solutionId > 0, "Project does not exist");

        Project storage project = projects[_projectId];

        uint256 bestOfferId = 0;
        uint256 bestRating = 0;
        uint256 totalRatersForAllOffers = 0;

        // Iterate over all offers for the project to find the best one
        for (uint256 i = 0; i < projectToOffers[_projectId].length; i++) {
            Offer storage offer = offers[projectToOffers[_projectId][i]];

            if (offer.numberOfRaters >= MIN_RAITNGS_PER_OFFER && offer.isOpenForRating) {
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

        // If the best offer's average rating is above 7, assign the project manager
        if (bestRating > 7) {
            project.isOpenForManagementProposals = false;
            projects[_projectId].projectManager = offers[bestOfferId].manager;
            project.isOpenForManagmentRemovalProposal = true;
        }
    }
    
    // External function to propose a management removal offer for a project
    function proposeRemoveManager(uint256 _projectId) external onlyMember{
        if (_projectId < 0) revert IDMustBePositive();
        if (projects[_projectId].solutionId <= 0) revert projectDoesNotExist();
        
        if (projects[_projectId].isOpenForManagmentRemovalProposal == false) revert notOpenForRemovalProposals(); 

        removalOfferCounter++;

        RemovalOffer storage newRemovalOffer = removalOffers[removalOfferCounter];
        newRemovalOffer.remOfferId = removalOfferCounter;
        newRemovalOffer.projectId = _projectId;
        newRemovalOffer.proposer = msg.sender;
        newRemovalOffer.removalRatingSum = 0;
        newRemovalOffer.removalNumberOfRaters = 0;
        newRemovalOffer.isOpenForRemovalRating = true;

        emit NewRemovalOffer(offerCounter, _projectId, msg.sender);
    }

    //!!! CAN PROBABLY BE GENERALIZED MAYBE?
    // External function to cancel a management removal offer
    function cancelRemovalOffer(uint256 _removalOfferId) external onlyMember {
        if (_removalOfferId < 0 || _removalOfferId > removalOfferCounter) revert invalidID();

        RemovalOffer storage removalOffer = removalOffers[_removalOfferId];

        if (removalOffer.proposer != msg.sender) revert onlyManager();
        if (!removalOffer.isOpenForRemovalRating) revert notOpenForRating();

        removalOffer.isOpenForRemovalRating = false; // Mark the offer as not open for rating

        emit OfferCancelled(_removalOfferId); // Emit the event
    }

    // External function to rate a managment removal offer
    function rateRemovalOffer(uint256 _removalOfferId, uint256 _rating) external onlyMember {
        if (_removalOfferId < 0 || _removalOfferId > removalOfferCounter) revert invalidID();
        if (_rating < 1 || _rating > MAX_RATING) revert ratingOutOfRange();

        RemovalOffer storage removalOffer = removalOffers[_removalOfferId];

        if (projects[removalOffers[_removalOfferId].projectId].projectManager == msg.sender) revert managerCannotRateAgainstThemselves();
        if (!removalOffer.isOpenForRemovalRating) revert notOpenForRating();

        if (removalOffer.oldRemovalRating[msg.sender] > 0) {
            removalOffer.removalRatingSum -= removalOffer.oldRemovalRating[msg.sender];
        } else {
            removalOffer.removalNumberOfRaters++;
        }
        removalOffer.oldRemovalRating[msg.sender] = _rating;
        removalOffer.removalRatingSum += _rating;
        
        emit RemovalOfferRated(_removalOfferId, msg.sender, _rating);
    }

    function removeProjectManager(uint256 _removalOfferId) external {
        if (removalOffers[_removalOfferId].projectId <= 0) revert IDMustBePositive();
        if (projects[removalOffers[_removalOfferId].projectId].solutionId <= 0) revert projectDoesNotExist();

        RemovalOffer storage removalOffer = removalOffers[_removalOfferId];
        Project storage project = projects[removalOffer.projectId];

        // Check if the total raters meet the requirements
        if (removalOffer.removalNumberOfRaters < MIN_TOTAL_RATERS_COUNT) revert insufficientTotalRatersForAllOffers();

        // If the best offer's average rating is above 7, assign the project manager
        if ((removalOffer.removalRatingSum / removalOffer.removalNumberOfRaters) > 7) {
            project.isOpenForManagmentRemovalProposal = false;
            project.projectManager = address(0);
            project.isOpenForManagementProposals = true;

            uint256 projectId = removalOffer.projectId;
            for (uint256 i = 0; i < projectToOffers[projectId].length; i++) {
                address proposer = offers[projectToOffers[projectId][i]].manager;
                hasProposed[projectId][proposer] = false;
            }
        }
    }

    // Function to view details about an offer
    function viewOfferDetails(
        uint256 _offerId
    ) external view returns (uint256, uint256, address, uint256, uint256, bool) {
        require(_offerId > 0 && _offerId <= offerCounter, "Invalid offer ID");

        Offer storage offer = offers[_offerId];

        // Return the offer details: offerId, projectId, manager, ratingSum, numberOfRaters, isOpenForRating
        return (
            offer.offerId,
            offer.projectId,
            offer.manager,
            offer.ratingSum,
            offer.numberOfRaters,
            offer.isOpenForRating
        );
    }

    function viewRemovalOfferDetails(uint256 _removalOfferId) external view returns(
        uint256, uint256, address, uint256, uint256, bool
    ) {
        if (_removalOfferId <= 0 || _removalOfferId > removalOfferCounter) revert invalidID(); 

        RemovalOffer storage removalOffer = removalOffers[_removalOfferId];
        
    }

    // Function to view details about a project
    function viewProjectDetails(uint256 _projectId) external view returns (uint256, bool) {
        require(_projectId > 0, "Project ID must be positive");
        require(projects[_projectId].solutionId > 0, "Project does not exist");

        Project storage project = projects[_projectId];

        // Return the project details: projectId (same as solutionId), isOpenForManagementProposals
        return (project.solutionId, project.isOpenForManagementProposals);
    }

    // Function to view the offers for a project
    function viewProjectOffers(uint256 _projectId) external view returns (uint256[] memory) {
        require(_projectId > 0, "Project ID must be positive");
        require(projects[_projectId].solutionId > 0, "Project does not exist");

        // Return the array of offer IDs for the project
        return projectToOffers[_projectId];
    }

    // Function to view the manager of a specific project
    function getProjectManager(uint256 _projectId) external view returns (address) {
        require(_projectId > 0, "Project ID must be positive");
        require(projects[_projectId].solutionId > 0, "Project does not exist");

        // Return the project manager
        return projects[_projectId].projectManager;
    }

    // Getter function for offerCounter
    function getOfferCounter() external view returns (uint256) {
        return offerCounter;
    }

    // Getter function for removalOfferCounter
    function getRemovalOfferCounter() external view returns (uint256) {
        return removalOfferCounter;
    }
}
