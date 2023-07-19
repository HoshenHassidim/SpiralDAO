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
    uint256 constant MAX_RATING = 10;
    uint256 constant MIN_TOTAL_RATERS_COUNT = 4;
    uint256 constant MIN_RAITNGS_PER_OFFER = 3;

    // Project structure
    struct Project {
        uint256 solutionId;
        bool isOpenForManagementProposals;
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
        mapping(address => uint) oldRating;
    }

    error insufficientTotalRatersForAllOffers();
    error mustBeMember();
    error IDMustBePositive();
    error solutionDoesNotMeetCriteria();
    error invalidID();
    error solutionIDMustBePositive();
    error projectNotOpenForProposals();
    error userAlreadyProposed();
    error onlyManager();
    error notOpenForRating();
    error projectDoesNotExist();
    error ratingOutOfRange();
    error managerCannotRateOwnOffer();

    // Project ID to Project mapping (solutionId is used as projectId)
    mapping(uint256 => Project) private projects;

    // Project ID to array of Offer IDs mapping
    mapping(uint256 => uint256[]) private projectToOffers;

    // Offer ID to Offer mapping
    mapping(uint256 => Offer) private offers;

    // Mapping to track which addresses have proposed for a project
    mapping(uint256 => mapping(address => bool)) private hasProposed;

    // References to imported contracts
    Membership private membershipContract;
    Solutions private solutionsContract;
    TokenManagement private tokenManagementContract;

    // Events
    event NewProject(uint256 projectId);
    event NewOffer(uint256 offerId, uint256 projectId, address proposer);
    event OfferCancelled(uint256 offerId);
    event OfferRated(uint256 offerId, address voter, uint256 rating);

    // Modifier to ensure only registered members can propose, cancel or rate an offer
    modifier onlyMember() {
        if (!membershipContract.isRegisteredMember(msg.sender)) revert mustBeMember();
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
        if (_solutionId <= 0) revert IDMustBePositive();
        if (!solutionsContract.canBecomeProject(_solutionId)) revert solutionDoesNotMeetCriteria();

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
        projects[_solutionId] = Project(_solutionId, true, address(0));

        emit NewProject(_solutionId); // Emit the event
    }

    // External function to propose a management offer for a project
    function proposeOffer(uint256 _solutionId) external onlyMember {
        if (solutionsContract.getSolutionCounter() < _solutionId || _solutionId == 0)
            revert invalidID();
        if (_solutionId < 0) revert IDMustBePositive();
        if (projects[_solutionId].solutionId == 0) {
            createProject(_solutionId); // Check if the solution has a project, if not, create one
        }

        uint256 projectId = _solutionId; // The project ID is the same as the solutionId

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
        newOffer.isOpenForRating = true;

        projectToOffers[projectId].push(offerCounter); // Update the project to offer mapping

        emit NewOffer(offerCounter, projectId, msg.sender); // Emit the event
    }

    // External function to cancel a management offer
    function cancelOffer(uint256 _offerId) external onlyMember {
        if (_offerId <= 0 || _offerId > offerCounter) revert invalidID();

        Offer storage offer = offers[_offerId];

        if (offer.manager != msg.sender) revert onlyManager();
        if (!offer.isOpenForRating) revert notOpenForRating();

        offer.isOpenForRating = false; // Mark the offer as not open for rating

        emit OfferCancelled(_offerId); // Emit the event
    }

    // External function to rate a management offer
    function rateOffer(uint256 _offerId, uint256 _rating) external onlyMember {
        if (_offerId <= 0 || _offerId > offerCounter) revert invalidID();
        if (_rating < 1 || _rating > MAX_RATING) revert ratingOutOfRange();

        Offer storage offer = offers[_offerId];

        if (offer.manager == msg.sender) revert managerCannotRateOwnOffer();
        if (!offer.isOpenForRating) revert notOpenForRating();

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
        if (_projectId <= 0) revert IDMustBePositive();
        if (projects[_projectId].solutionId <= 0) revert projectDoesNotExist();

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
        }
    }

    // Function to view details about an offer
    function viewOfferDetails(
        uint256 _offerId
    ) external view returns (uint256, uint256, address, uint256, uint256, bool) {
        if (_offerId <= 0 || _offerId > offerCounter) revert invalidID();

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

    // Function to view details about a project
    function viewProjectDetails(uint256 _projectId) external view returns (uint256, bool) {
        if (_projectId <= 0) revert IDMustBePositive();
        if (projects[_projectId].solutionId <= 0) revert projectDoesNotExist();

        Project storage project = projects[_projectId];

        // Return the project details: projectId (same as solutionId), isOpenForManagementProposals
        return (project.solutionId, project.isOpenForManagementProposals);
    }

    // Function to view the offers for a project
    function viewProjectOffers(uint256 _projectId) external view returns (uint256[] memory) {
        if (_projectId <= 0) revert IDMustBePositive();
        if (projects[_projectId].solutionId <= 0) revert projectDoesNotExist();

        // Return the array of offer IDs for the project
        return projectToOffers[_projectId];
    }

    // Function to view the manager of a specific project
    function getProjectManager(uint256 _projectId) external view returns (address) {
        if (_projectId <= 0) revert IDMustBePositive();
        if (projects[_projectId].solutionId <= 0) revert projectDoesNotExist();

        // Return the project manager
        return projects[_projectId].projectManager;
    }

    // Getter function for offerCounter
    function getOfferCounter() external view returns (uint256) {
        return offerCounter;
    }
}
