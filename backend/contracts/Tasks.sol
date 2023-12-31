// SPDX-License-Identifier: MIT
// Specifies the version of Solidity that the contract is written in

pragma solidity ^0.8.0;

// Imports
import "./Membership.sol"; // Import the DAO membership contract
import "./Projects.sol"; // Import the projects contract
import "./TokenManagement.sol"; // Import the token management contract
import "./AuthorizationManagement.sol";

contract Tasks {
    // Enum for tracking task status
    enum TaskStatus {
        OPEN,
        IN_PROGRESS,
        VERIFICATION,
        VERIFIED,
        NOT_COMPLETED,
        DELETED
    }

    // Define the Task struct
    struct Task {
        uint256 taskId; // Unique task ID
        uint256 projectId; // Project ID to which task belongs
        string taskName; // Task name
        uint256 taskValue; // Task value
        address performer; // Address of the performer who will complete the task
        uint256 completionRatingSum; // Sum of ratings received upon task completion
        uint256 numberOfCompletionRaters; // Number of ratings received upon task completion
        uint256 assignedOfferId; // ID of the assigned offer
        TaskStatus status; // Task status, using the TaskStatus enum defined above
        mapping(address => uint256) addressToOfferId;
        mapping(address => bool) hasProposed; // Mapping to keep track of who has proposed to the task
        bool isRemovalProposalActive; // Boolean to keep track of whether there is an active performer removal proposal
        performerRemovalOffer removalOffer; //
        uint256 verificationID; // Unique verification ID
        mapping(address => uint256) oldRating; //Mapping to keep track of user's old rating
    }

    // Mapping to keep track of who rated the task
    mapping(uint256 => mapping(address => bool)) private verificationRaters;

    // Counter for verification ID
    uint256 private verificationIDCounter;

    // Define the TaskOffer struct
    struct TaskOffer {
        uint256 taskOfferId; // Unique task offer ID
        uint256 taskId; // Task ID to which the offer is made
        address offeror; // Address of the member who made the offer
        uint256 ratingSum; // Sum of ratings received for the offer
        uint256 numberOfRaters; // Number of ratings received for the offer
        mapping(address => uint256) oldRating; //Mapping to keep track of old user vote rating
        mapping(address => bool) raters; // Mapping to keep track of who rated the offer
        bool isActive; // Boolean to keep track of whether this offer is active
    }

    struct performerRemovalOffer {
        // uint256 taskId; // Task ID to which the offer is made
        address removalOfferor; // Address of the member who made the offer
        uint256 removalRatingSum; // Sum of ratings received for the offer
        uint256 numberOfRemovalRaters; // Number of ratings received for the offer
        bool isOpenForRemovalRating; // Flag to indicate if the offer is open for rating
        mapping(address => uint256) oldRemovalRating; //Mapping to keep track of old user vote rating
        mapping(address => bool) removalRaters; // Mapping to keep track of who rated the offer
    }
    // State variables
    uint256 private taskCounter; // Counter for task ID
    uint256 private taskOfferCounter; // Counter for task offer ID
    uint256 private MIN_TASK_VALUE = 100; // Minimal task value
    uint256 constant MIN_TOTAL_RATERS_COUNT = 3;
    uint256 constant MIN_RAITNGS_PER_OFFER = 2;
    uint256 constant MIN_INDIVIDUAL_RATERS_COUNT = 2;
    uint256 constant MIN_RATING = 1;
    uint256 constant MAX_RATING = 10;
    uint256 constant MIN_AVG_RATING = 7;

    // Mapping to store tasks
    mapping(uint256 => Task) private tasks;

    // Mapping to store task offers for each task
    mapping(uint256 => uint256[]) private taskToTaskOffer;

    // Mapping to store task offers
    mapping(uint256 => TaskOffer) private taskOffers;

    // Mapping to prevent task name duplication within a project
    mapping(uint256 => mapping(string => bool)) private existingTaskNamesByProjectID;

    // Errors
    error invalidID();
    error mustBeProjectManager();
    error nameRequired();
    error nameAlreadyExists();
    error valueTooLow();
    error taskNotOpenForCancellation();
    error taskNotOpenForChanges();
    error taskNotOpenForProposals();
    error taskNotOpenForRating();
    error memberAlreadyProposed();
    error proposalsExist();
    error addressHasNotProposed();
    error offerNotOpenForRating();
    error onlyPerformerCanCancel();
    error ratingOutOfRange();
    error performerCannotRateOwnOffer();
    error noSuitableOffer();
    error onlyAssignedPerformerCanComplete();
    error taskNotAssigned();
    error userHasNotProposed();
    error performerCannotRateOwnTask();
    error taskNotInVerificationStage();
    error notEnoughRatings();
    error taskCannotBeChangedProposalsNeedToBeExecuted();
    error taskNotOpenForAssigning();
    error taskNotCompleted();
    error taskNotOpenForPerformerRemovalProposals();
    error removalProposalAlreadyActive();
    error performerCannotProposeToRemoveThemselves();
    error onlyProposerCanCancel();
    error performerRemovalOfferNotOpenForCancellation();
    error cannotCancelOnceVotingHasBegun();
    error performerRemovalOfferNotOpenForRating();
    error performerCannotRateAgainstThemselves();
    error offerNotActive();
    error insufficientNumberOfRaters();
    error averageRatingTooLow();
    error onlyProposalCreator();
    error insufficientTotalRatersForAllOffers();
    error mustBeAuthorised();
    error taskNotInProgress();

    // Events
    event NewTask(uint256 taskId, uint256 projectId, string taskName, uint256 taskValue); // Event emitted when a new task is added
    event TaskCanceled(uint256 taskId); // Event emitted when a task is cancelled
    event TaskChanged(uint256 taskId, string newTaskName, uint256 newTaskValue); // Event emitted when a task is changed
    event NewTaskOffer(uint256 offerId, uint256 taskId, address offeror); // Event emitted when a new offer is made
    event TaskOfferCanceled(uint256 offerId); // Event emitted when an offer is cancelled
    event TaskOfferRated(uint256 offerId, address rater, uint256 rating); // Event emitted when an offer is rated
    event TaskAssigned(uint256 taskId, uint256 offerId, address performer); // Event emitted when a task is assigned
    event TaskCompleted(uint256 taskId); // Event emitted when a task is completed
    event TaskExecutionRated(uint256 taskId, address rater, uint256 rating); // Event emitted when the execution of a task is rated
    event TaskVerified(uint256 taskId, bool areVerified); // Event emitted when a task is verified
    event NewPerformerRemovalOffer(uint256 taskId, address proposer); // Event emitted when a removal proposal is made
    event PerformerRemovalOfferCancelled(uint256 taskId); // Event emitted when a removal proposal is cancelled
    event PerformerRemovalOfferRated(uint256 taskId, address rater, uint256 rating); // Event emitted when performer removal offer is rated
    event TaskPerformerVotedOut(uint256 taskId); // Event emitted when the task performer is voted out
    event TaskPerformerResigned(uint256 taskId); // Event emitted when the task performer resigns

    // References to imported contracts
    Membership private membershipContract; // Reference to the Membership contract
    Projects private projectsContract; // Reference to the Projects contract
    TokenManagement private tokenManagementContract; // Reference to the TokenManagement contract
    AuthorizationManagement private authorizationManagementContract;

    // Modifier to ensure that task ID is valid
    modifier validTaskID(uint256 _taskId) {
        if (_taskId > taskCounter || _taskId == 0 || tasks[_taskId].status == TaskStatus.DELETED)
            revert invalidID();
        _;
    }

    // Modifier to allow only authorized contracts to perform certain actions.
    modifier onlyAuthorized() {
        if (!authorizationManagementContract.isAuthorized(msg.sender)) revert mustBeAuthorised();
        _;
    }

    // Constructor to initialize the imported contracts
    constructor(
        Membership _membershipContract,
        Projects _projectsContract,
        TokenManagement _tokenManagementContract,
        AuthorizationManagement _authorizationManagementContract
    ) {
        membershipContract = _membershipContract;
        projectsContract = _projectsContract;
        tokenManagementContract = _tokenManagementContract;
        authorizationManagementContract = _authorizationManagementContract;
    }

    // Function to add a new task to a project. This can only be called by the project manager
    // The task name must be unique within the project and the value must be greater than MIN_TASK_VALUE
    // It creates a new Task instance and stores it in the tasks mapping, increments the task counter
    // Emits a NewTask event upon successful creation of a new task
    function addTask(uint256 _projectId, string memory _taskName, uint256 _taskValue) external {
        if (projectsContract.getProjectManager(_projectId) != msg.sender) {
            revert mustBeProjectManager();
        }
        if (bytes(_taskName).length <= 0) revert nameRequired();
        if (existingTaskNamesByProjectID[_projectId][_taskName]) revert nameAlreadyExists();
        if (_taskValue < MIN_TASK_VALUE) revert valueTooLow();

        taskCounter++;

        Task storage newTask = tasks[taskCounter];
        newTask.taskId = taskCounter;
        newTask.projectId = _projectId;
        newTask.taskName = _taskName;
        newTask.taskValue = _taskValue;
        newTask.status = TaskStatus.OPEN;

        existingTaskNamesByProjectID[_projectId][_taskName] = true;

        emit NewTask(taskCounter, _projectId, _taskName, _taskValue);
    }

    // Function to cancel a task. This can only be called by the project manager and only if the task is in OPEN status
    // and has no task offers. It updates the status to DELETED, and emits a TaskCanceled event
    function cancelTask(uint256 _taskId) external {
        if (projectsContract.getProjectManager(tasks[_taskId].projectId) != msg.sender)
            revert mustBeProjectManager();

        if (tasks[_taskId].status != TaskStatus.OPEN) revert taskNotOpenForCancellation();
        if (taskToTaskOffer[_taskId].length != 0) revert proposalsExist();

        delete existingTaskNamesByProjectID[tasks[_taskId].projectId][tasks[_taskId].taskName];
        tasks[_taskId].status = TaskStatus.DELETED;

        emit TaskCanceled(_taskId);
    }

    // Utility function to compare two strings. It uses the keccak256 hash to compare the two strings
    function compareStrings(string memory a, string memory b) private pure returns (bool) {
        return keccak256(abi.encodePacked(a)) == keccak256(abi.encodePacked(b));
    }

    // Function to change the details of a task. This can only be called by the project manager and only if the task is in OPEN status
    // and has no task offers. It updates the task's name and value, and emits a TaskChanged event
    function changeTask(
        //Jacob - Maybe change this function name??
        uint256 _taskId,
        string memory _newTaskName,
        uint256 _newTaskValue
    ) external {
        if (projectsContract.getProjectManager(tasks[_taskId].projectId) != msg.sender)
            revert mustBeProjectManager();

        if (tasks[_taskId].status != TaskStatus.OPEN) revert taskNotOpenForChanges();
        if (taskToTaskOffer[_taskId].length != 0)
            revert taskCannotBeChangedProposalsNeedToBeExecuted();
        if (bytes(_newTaskName).length <= 0) revert nameRequired();
        if (_newTaskValue < MIN_TASK_VALUE) revert valueTooLow();

        if (!(compareStrings(_newTaskName, tasks[_taskId].taskName))) {
            if (existingTaskNamesByProjectID[tasks[_taskId].projectId][_newTaskName])
                revert nameAlreadyExists();
            delete existingTaskNamesByProjectID[tasks[_taskId].projectId][tasks[_taskId].taskName];
            tasks[_taskId].taskName = _newTaskName;

            existingTaskNamesByProjectID[tasks[_taskId].projectId][_newTaskName] = true;
        }

        tasks[_taskId].taskValue = _newTaskValue;

        emit TaskChanged(_taskId, _newTaskName, _newTaskValue);
    }

    // Function for a member to propose a task offer. This can only be called by a member
    // The task must be in OPEN status and the member has not already proposed for this task
    // It creates a new TaskOffer instance and stores it in the taskOffers mapping, increments the task offer counter

    // Emits a NewOffer event upon successful creation of a new task offer
    function proposeTaskOffer(uint256 _taskId) external {
        if (_taskId > taskCounter || _taskId == 0 || tasks[_taskId].status == TaskStatus.DELETED)
            revert invalidID();
        if (tasks[_taskId].status != TaskStatus.OPEN) revert taskNotOpenForProposals();
        if (tasks[_taskId].hasProposed[msg.sender] == true) revert memberAlreadyProposed();

        taskOfferCounter++;

        taskToTaskOffer[_taskId].push(taskOfferCounter);
        tasks[_taskId].addressToOfferId[msg.sender] = taskOfferCounter;
        tasks[_taskId].hasProposed[msg.sender] = true;

        TaskOffer storage newTaskOffer = taskOffers[taskOfferCounter];
        newTaskOffer.taskOfferId = taskOfferCounter;
        newTaskOffer.taskId = _taskId;
        newTaskOffer.offeror = msg.sender;
        newTaskOffer.isActive = true;

        emit NewTaskOffer(taskOfferCounter, _taskId, msg.sender);
    }

    // Function for a member to propose and begin a vote to remove the current task performer
    function proposerRemovePerformerOffer(uint256 _taskId) external {
        if (_taskId > taskCounter || _taskId == 0 || tasks[_taskId].status == TaskStatus.DELETED)
            revert invalidID();

        if (tasks[_taskId].status == TaskStatus.OPEN || tasks[_taskId].performer == address(0))
            revert taskNotOpenForPerformerRemovalProposals();
        if (msg.sender == tasks[_taskId].performer)
            revert performerCannotProposeToRemoveThemselves();
        if (tasks[_taskId].isRemovalProposalActive) revert removalProposalAlreadyActive();

        tasks[_taskId].isRemovalProposalActive = true;

        performerRemovalOffer storage newRemovalOffer = tasks[_taskId].removalOffer;
        // newRemovalOffer.taskId = _taskId;
        newRemovalOffer.removalOfferor = msg.sender;
        newRemovalOffer.isOpenForRemovalRating = true;

        emit NewPerformerRemovalOffer(_taskId, msg.sender);
    }

    // Function to cancel a task offer. This can only be called by the member who proposed the offer
    // The task offer must be open for rating
    // It updates the task offer's isActive property to false, and emits an TaskOfferCanceled event
    function cancelTaskOffer(uint256 _offerId) external {
        if (!taskOffers[_offerId].isActive) revert taskNotOpenForCancellation();
        if (taskOffers[_offerId].offeror != msg.sender) revert onlyPerformerCanCancel();

        taskOffers[_offerId].isActive = false;
        tasks[taskOffers[_offerId].taskId].hasProposed[msg.sender] = false;

        emit TaskOfferCanceled(_offerId);
    }

    // Function to cancel of performer removal offer. Can only be called my the member to made the proposal
    // Cannot be called once the offer has been voted on
    function cancelPerformerRemovalOffer(uint256 _taskId) external {
        if (_taskId > taskCounter || _taskId == 0 || tasks[_taskId].status == TaskStatus.DELETED)
            revert invalidID();

        performerRemovalOffer storage removalOffer = tasks[_taskId].removalOffer;

        if (msg.sender != removalOffer.removalOfferor) revert onlyProposerCanCancel();
        if (!removalOffer.isOpenForRemovalRating || !tasks[_taskId].isRemovalProposalActive)
            revert performerRemovalOfferNotOpenForCancellation();
        if (removalOffer.numberOfRemovalRaters > 0) revert cannotCancelOnceVotingHasBegun();

        tasks[_taskId].isRemovalProposalActive = false;
        removalOffer.isOpenForRemovalRating = false;
        removalOffer.removalOfferor = address(0);

        emit PerformerRemovalOfferCancelled(_taskId);
    }

    // Function to rate a task offer. This can only be called by a member
    // The task must be open and the offer must be open for rating
    // The member must not have already rated this offer and the rating must be between 1 and MAX_RATING
    // It updates the offer's rating sum and number of raters, and emits a TaskOfferRated event
    // function rateTaskOffer(uint256 _offerId, uint256 _rating) external {
    //     if (tasks[taskOffers[_offerId].taskId].status != TaskStatus.OPEN)
    //         revert taskNotOpenForRating();
    //     if (taskOffers[_offerId].offeror == msg.sender) revert performerCannotRateOwnOffer();
    //     if (!taskOffers[_offerId].isActive) revert offerNotActive();
    //     if (_rating < MIN_RATING || _rating > MAX_RATING) revert ratingOutOfRange();
    //     if ((tasks[taskOffers[_offerId].taskId].oldRating[msg.sender] > 0)) {
    //         taskOffers[_offerId].ratingSum -= tasks[taskOffers[_offerId].taskId].oldRating[
    //             msg.sender
    //         ];
    //     } else {
    //         taskOffers[_offerId].numberOfRaters++;
    //         taskOffers[_offerId].raters[msg.sender] = true;
    //     }
    //     tasks[taskOffers[_offerId].taskId].oldRating[msg.sender] = _rating;
    //     taskOffers[_offerId].ratingSum += _rating;
    //     emit TaskOfferRated(_offerId, msg.sender, _rating);
    // }
    function rateTaskOffer(uint256 _offerId, uint256 _rating) external {
        if (tasks[taskOffers[_offerId].taskId].status != TaskStatus.OPEN)
            revert taskNotOpenForRating();
        if (taskOffers[_offerId].offeror == msg.sender) revert performerCannotRateOwnOffer();
        if (!taskOffers[_offerId].isActive) revert offerNotActive();
        if (_rating < MIN_RATING || _rating > MAX_RATING) revert ratingOutOfRange();
        if ((taskOffers[_offerId].oldRating[msg.sender] > 0)) {
            taskOffers[_offerId].ratingSum -= taskOffers[_offerId].oldRating[msg.sender];
        } else {
            taskOffers[_offerId].numberOfRaters++;
            taskOffers[_offerId].raters[msg.sender] = true;
        }
        taskOffers[_offerId].oldRating[msg.sender] = _rating;
        taskOffers[_offerId].ratingSum += _rating;
        emit TaskOfferRated(_offerId, msg.sender, _rating);
    }

    function ratePerformerRemovalOffer(uint256 _taskId, uint256 _rating) external {
        if (_taskId > taskCounter || _taskId == 0 || tasks[_taskId].status == TaskStatus.DELETED)
            revert invalidID();
        performerRemovalOffer storage removalOffer = tasks[_taskId].removalOffer;
        if (!removalOffer.isOpenForRemovalRating) revert performerRemovalOfferNotOpenForRating();
        if (msg.sender == tasks[_taskId].performer) revert performerCannotRateAgainstThemselves();
        if (_rating < MIN_RATING || _rating > MAX_RATING) revert ratingOutOfRange();

        if ((removalOffer.oldRemovalRating[msg.sender] > 0)) {
            removalOffer.removalRatingSum -= removalOffer.oldRemovalRating[msg.sender];
        } else {
            removalOffer.numberOfRemovalRaters++;
            removalOffer.removalRaters[msg.sender] = true;
        }

        removalOffer.oldRemovalRating[msg.sender] = _rating;
        removalOffer.removalRatingSum += _rating;
        emit PerformerRemovalOfferRated(_taskId, msg.sender, _rating);
    }

    // Function to assign the task to a member who has the highest rating on the task offer.
    // The task must be open, and the highest rating must be at least MIN_AVG_RATING.
    // If a suitable offer is found, the task status is updated to IN_PROGRESS, and the task's performer and assignedOfferId are set.
    // Emits a TaskAssigned event upon successful assignment.
    function assignTask(uint256 _taskId) external {
        // Check if the task is open.
        if (_taskId > taskCounter || _taskId == 0 || tasks[_taskId].status == TaskStatus.DELETED)
            revert invalidID();
        if (tasks[_taskId].status != TaskStatus.OPEN) revert taskNotOpenForAssigning();

        // Initialize the variables to track the highest rating and the corresponding task offer ID.
        uint256 highestRating = 0;
        uint256 highestRatedOfferId = 0;
        uint256 totalRatersForAllOffers = 0;

        // Loop through all task offers for this task.
        for (uint256 i = 0; i < taskToTaskOffer[_taskId].length; i++) {
            uint256 offerId = taskToTaskOffer[_taskId][i];
            TaskOffer storage offer = taskOffers[offerId];
            if (!offer.isActive) continue;
            // Ensure that there are at least two raters for this offer.
            if (offer.numberOfRaters >= MIN_RAITNGS_PER_OFFER) {
                // Calculate the average rating for this offer.
                uint256 averageRating = offer.ratingSum / offer.numberOfRaters;

                // If the average rating is at least MIN_AVG_RATING and it is higher than the current highest rating, update the highest rating and corresponding offer ID.
                if (averageRating >= MIN_AVG_RATING && averageRating > highestRating) {
                    highestRating = averageRating;
                    highestRatedOfferId = offerId;
                }
            }
            totalRatersForAllOffers += offer.numberOfRaters;
        }

        if (totalRatersForAllOffers < MIN_TOTAL_RATERS_COUNT) {
            revert insufficientTotalRatersForAllOffers();
        }

        // Check if a suitable task offer (average rating of at least MIN_AVG_RATING) was found.
        if (highestRatedOfferId == 0) revert noSuitableOffer();

        // If a suitable offer was found, update the task status, assign the task to the member, and save the task offer ID.
        tasks[_taskId].status = TaskStatus.IN_PROGRESS;
        tasks[_taskId].performer = taskOffers[highestRatedOfferId].offeror;
        membershipContract.assignTaskToMember(taskOffers[highestRatedOfferId].offeror);
        tasks[_taskId].assignedOfferId = highestRatedOfferId;
        for (uint i = 0; i < taskToTaskOffer[_taskId].length; i++) {
            TaskOffer storage offer = taskOffers[taskToTaskOffer[_taskId][i]];
            if (!offer.isActive) continue;
            offer.isActive = false;
        }

        // Emit the TaskAssigned event.
        emit TaskAssigned(_taskId, highestRatedOfferId, taskOffers[highestRatedOfferId].offeror);
    }

    function checkPerformerRemovalOfferRatings(uint256 _taskId) external {
        // Check if the task is open.
        if (_taskId > taskCounter || _taskId == 0 || tasks[_taskId].status == TaskStatus.DELETED)
            revert invalidID();

        performerRemovalOffer storage removalOffer = tasks[_taskId].removalOffer;

        // Ensure that there are at least MIN_INDIVIDUAL_RATERS_COUNT raters for this offer.
        if (removalOffer.numberOfRemovalRaters < MIN_INDIVIDUAL_RATERS_COUNT) {
            revert insufficientNumberOfRaters();
        }
        // Calculate the average rating for this offer.
        uint256 averageRating = removalOffer.removalRatingSum / removalOffer.numberOfRemovalRaters;
        // If the average rating is at least MIN_AVG_RATING and it is higher than the current highest rating, update the highest rating and corresponding offer ID.
        if (averageRating < MIN_AVG_RATING) {
            revert averageRatingTooLow();
        }

        // Check if a suitable task offer (average rating of at least MIN_AVG_RATING) was found.
        removalOffer.isOpenForRemovalRating = false;
        removeTaskPerformer(_taskId);
        emit TaskPerformerVotedOut(_taskId);
    }

    function taskPerformerResign(uint256 _taskId) external {
        if (_taskId > taskCounter || _taskId == 0 || tasks[_taskId].status == TaskStatus.DELETED)
            revert invalidID();

        if (msg.sender != tasks[_taskId].performer) revert onlyProposalCreator();

        removeTaskPerformer(_taskId);
        emit TaskPerformerResigned(_taskId);
    }

    function removeTaskPerformer(uint256 _taskId) private {
        tasks[_taskId].performer = address(0);
        tasks[_taskId].status = TaskStatus.OPEN;
        tasks[_taskId].assignedOfferId = 0;

        for (uint256 i = 0; i < taskToTaskOffer[_taskId].length; i++) {
            address proposer = taskOffers[taskToTaskOffer[_taskId][i]].offeror;
            tasks[_taskId].hasProposed[proposer] = false;
        }
    }

    // Function to complete a task.
    // This function can only be called by the performer of the task and only for an assigned task.
    // Updates the task's status to VERIFICATION, and increments the verificationIDCounter.
    // Emits a TaskCompleted event upon successful task completion.

    function completeTask(uint256 _taskId) external {
        if (_taskId > taskCounter || _taskId == 0 || tasks[_taskId].status == TaskStatus.DELETED)
            revert invalidID();
        if (tasks[_taskId].status != TaskStatus.IN_PROGRESS) revert taskNotInProgress();
        if (tasks[_taskId].assignedOfferId < 1) revert taskNotAssigned(); // I don't think you need this case, but ask Choshen

        if (tasks[_taskId].performer != msg.sender) revert onlyAssignedPerformerCanComplete();
        // if (tasks[_taskId].status != TaskStatus.IN_PROGRESS) revert taskNotAssigned();
        // if (tasks[_taskId].status != TaskStatus.IN_PROGRESS) revert taskNotInProgress(); //DELETE IF TEST WORKS
        // Update the task's status and increment the verification ID counter.
        tasks[_taskId].status = TaskStatus.VERIFICATION;
        verificationIDCounter++;

        tasks[_taskId].verificationID = verificationIDCounter;

        // Emit the TaskCompleted event.
        emit TaskCompleted(_taskId);
    }

    // Function to rate a completed task.
    // The task must be in VERIFICATION status, and the rater cannot be the performer of the task.
    // The rater must not have already rated this task, and the rating must be between 1 and MAX_RATING.
    // Updates the task's completion rating sum and number of completion raters, and emits a TaskExecutionRated event.
    function rateCompletedTask(uint256 _taskId, uint256 _rating) external {
        if (_taskId > taskCounter || _taskId == 0 || tasks[_taskId].status == TaskStatus.DELETED)
            revert invalidID();
        if (tasks[_taskId].status != TaskStatus.VERIFICATION) revert taskNotCompleted();

        if (tasks[_taskId].performer == msg.sender) revert performerCannotRateOwnTask();
        if (_rating == 0 || _rating > MAX_RATING) revert ratingOutOfRange();
        if (verificationRaters[tasks[_taskId].verificationID][msg.sender]) {
            tasks[_taskId].completionRatingSum -= tasks[_taskId].oldRating[msg.sender];
        } else {
            tasks[_taskId].numberOfCompletionRaters++;
            verificationRaters[tasks[_taskId].verificationID][msg.sender] = true;
        }
        tasks[_taskId].oldRating[msg.sender] = _rating;
        tasks[_taskId].completionRatingSum += _rating;

        //membershipContract.addTaskAvg(tasks[_taskId].performer, msg.sender, _rating, _taskId);

        // Emit the TaskRated event.
        emit TaskExecutionRated(_taskId, msg.sender, _rating);
    }

    // Function to verify a task.
    // The task must be in the VERIFICATION status, and there must be at least two ratings.
    // If the average rating is at least MIN_AVG_RATING, the task status is updated to VERIFIED and the completion process is triggered. Otherwise, it is reset to IN_PROGRESS.
    // Emits a TaskVerified event upon successful task verification.
    function verifyTask(uint256 _taskId) external {
        if (_taskId > taskCounter || _taskId == 0 || tasks[_taskId].status == TaskStatus.DELETED)
            revert invalidID();
        if (tasks[_taskId].status != TaskStatus.VERIFICATION) revert taskNotInVerificationStage();
        if (tasks[_taskId].numberOfCompletionRaters < MIN_RAITNGS_PER_OFFER)
            revert notEnoughRatings();

        uint256 taskAvg = tasks[_taskId].completionRatingSum /
            tasks[_taskId].numberOfCompletionRaters;
        membershipContract.updateTasksAvg(tasks[_taskId].performer, _taskId, taskAvg);

        if (taskAvg >= MIN_AVG_RATING) {
            tasks[_taskId].status = TaskStatus.VERIFIED;
            address _projectManager = projectsContract.getProjectManager(
                (tasks[_taskId].projectId)
            );
            tokenManagementContract.completeTask(
                tasks[_taskId].performer,
                _projectManager,
                tasks[_taskId].taskValue,
                tasks[_taskId].projectId
            );
            emit TaskVerified(_taskId, true);
        } else {
            tasks[_taskId].numberOfCompletionRaters = 0;
            tasks[_taskId].completionRatingSum = 0;
            tasks[_taskId].status = TaskStatus.IN_PROGRESS;
            emit TaskVerified(_taskId, false);
        }
    }

    // Function that returns the details of a task offer.
    // The returned values include: taskOfferId, taskId, offeror, ratingSum, numberOfRaters, and isActive.
    function getTaskOfferDetails(
        uint256 _taskOfferId
    )
        external
        view
        returns (
            uint256 taskOfferId,
            uint256 taskId,
            address offeror,
            uint256 ratingSum,
            uint256 numberOfRaters,
            bool isActive
        )
    {
        TaskOffer storage taskOffer = taskOffers[_taskOfferId];
        return (
            taskOffer.taskOfferId,
            taskOffer.taskId,
            taskOffer.offeror,
            taskOffer.ratingSum,
            taskOffer.numberOfRaters,
            taskOffer.isActive
        );
    }

    // Function to retrieve an array of TaskOffer IDs for a given task ID
    function getTaskOffers(uint256 _taskId) external view returns (uint256[] memory) {
        return taskToTaskOffer[_taskId];
    }

    // Function that returns the details of a task.
    // The returned values include: taskId, projectId, taskName, taskValue, performer,
    // completionRatingSum, numberOfCompletionRaters, assignedOfferId, taskStatus, verificationID, and isRemovalProposalActive.
    function getTaskDetails(
        uint256 _taskId
    )
        external
        view
        returns (
            uint256 taskId,
            uint256 projectId,
            string memory taskName,
            uint256 taskValue,
            address performer,
            uint256 completionRatingSum,
            uint256 numberOfCompletionRaters,
            uint256 assignedOfferId,
            TaskStatus status,
            uint256 verificationID,
            bool isRemovalProposalActive
        )
    {
        Task storage task = tasks[_taskId];
        return (
            task.taskId,
            task.projectId,
            task.taskName,
            task.taskValue,
            task.performer,
            task.completionRatingSum,
            task.numberOfCompletionRaters,
            task.assignedOfferId,
            task.status,
            task.verificationID,
            task.isRemovalProposalActive
        );
    }

    // Function to retrieve the existence of a task name for a given project ID
    function doesTaskNameExist(
        uint256 _projectId,
        string memory _taskName
    ) external view returns (bool) {
        return existingTaskNamesByProjectID[_projectId][_taskName];
    }

    // Function to retrieve the total number of tasks
    function getTotalTasks() external view returns (uint256) {
        return taskCounter;
    }

    // Function that returns the current value of the verification ID counter.
    function getVerificationIDCounter() external view returns (uint256) {
        return verificationIDCounter;
    }

    // Function to retrieve the total number of task offers
    function getTotalTaskOffers() external view returns (uint256) {
        return taskOfferCounter;
    }

    // Function to retrieve the minimum task value
    function getMinTaskValue() external view returns (uint256) {
        return MIN_TASK_VALUE;
    }

    // Check if a specific address has proposed to a task
    function hasAddressProposed(uint256 _taskId, address _address) external view returns (bool) {
        return tasks[_taskId].hasProposed[_address];
    }

    // Check if a specific address is a rater in a task offer
    function isAddressRaterInTaskOffer(
        uint256 _taskOfferId,
        address _address
    ) external view returns (bool) {
        return taskOffers[_taskOfferId].raters[_address];
    }

    // Check if a specific address is a verification rater in a task
    function isAddressVerificationRaterInTask(
        uint256 _taskId,
        address _address
    ) external view returns (bool) {
        return verificationRaters[_taskId][_address];
    }

    function getTaskOfferId(uint256 _taskId) external view returns (uint256) {
        if (tasks[_taskId].hasProposed[msg.sender])
            return tasks[_taskId].addressToOfferId[msg.sender];
        else revert addressHasNotProposed();
    }
}
