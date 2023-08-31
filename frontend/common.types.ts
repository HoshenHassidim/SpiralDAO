// common.types.ts

export interface ActiveProblemType {
  id: string;
  problemId: BigInt;
  creator: string;
  name: string;
  ratingCount: BigInt;
  ratingSum: BigInt;
  solutions: ActiveSolutionType[];
  isOpenForRating: boolean;
  isOpenForNewSolutions: boolean;
  blockNumber: BigInt;
  status: string;
}

export interface ProblemCardProps {
  id: string;
  creator: string;
  name: string;
  ratingCount: BigInt;
  isOpenForRating: boolean;
  isOpenForNewSolutions: boolean;
  status: string;
  userAddress?: string;
  userPreviousRating: BigInt;
}

export interface ActiveSolutionType {
  id: string;
  solutionId: BigInt;
  problemId: BigInt;
  problem: ActiveProblemType;
  creator: string;
  name: string;
  ratingCount: BigInt;
  ratingSum: BigInt;
  isOpenForRating: boolean;
  hasProject: boolean;
  blockNumber: BigInt;
}

export interface ProjectType {
  id: string;
  projectId: BigInt;
  projectManager: string; // Assuming Bytes translates to string in TypeScript for the address. Adjust if needed.
  isOpenForManagementProposals: boolean;
  managementOffers: ActiveManagementOfferType[];
  blockNumber: BigInt;
}

export interface ActiveManagementOfferType {
  id: string;
  offerId: BigInt;
  projectId: BigInt;
  project: ProjectType;
  proposer: string; // Adjust if needed.
  ratingCount: BigInt;
  ratingSum: BigInt;
  isActive: boolean;
  blockNumber: BigInt;
}

export interface ErrorType {
  metaMessages: string[];
  // ... any other properties that the error might have.
}

export interface CustomError extends Error {
  metaMessages?: string[];
}

export type Inputs = {
  example: string;
  exampleRequired: string;
};

export interface ProblemDataType {
  activeProblems: ActiveProblemType[];
  // ...other fields
}

export interface ProblemType {
  problemId: string;
  name: string;
  creator: string;
}

// entities.types.ts

export interface TokenBalance {
  id: string;
  member: string; // Bytes - Address
  projectId: BigInt;
  balance: BigInt;
}

export interface ActiveMember {
  id: string; // Bytes
  memberAddress: string; // Address
  username?: string;
  blockNumber: BigInt;
}

export interface UserProblemRating {
  id: string; // ID
  problemId: BigInt;
  rater: string; // Address
  rating: BigInt;
  blockNumber: BigInt;
}

export interface UserSolutionRating {
  id: string; // ID
  solutionId: BigInt;
  rater: string; // Address
  rating: BigInt;
  blockNumber: BigInt;
}

export interface UserManagementOfferRating {
  id: string; // ID
  offerId: BigInt;
  rater: string; // Address
  rating: BigInt;
  blockNumber: BigInt;
}

export interface Task {
  id: string; // ID
  taskId: BigInt;
  projectId: BigInt;
  taskName: string;
  taskValue: BigInt;
  performer?: string; // Address
  completionRatingSum: BigInt;
  numberOfCompletionRaters: BigInt;
  status: string;
  taskOffers: ActiveTaskOffer[];
  blockNumber: BigInt;
}

export interface ActiveTaskOffer {
  id: string; // ID
  offerId: BigInt;
  taskId: BigInt;
  task: Task;
  offeror: string; // Address
  ratingCount: BigInt;
  ratingSum: BigInt;
  isActive: boolean;
  blockNumber: BigInt;
}

export interface UserTaskOfferRating {
  id: string; // ID
  offerId: BigInt;
  rater: string; // Address
  rating: BigInt;
  blockNumber: BigInt;
}

export interface UserTaskCompletionRating {
  id: string; // ID
  offerId: BigInt;
  rater: string; // Address
  rating: BigInt;
  blockNumber: BigInt;
}

export type HumanToOriginalKey =
  | "awaiting-ranking"
  | "in-solution-phase"
  | "all-problems"
  | "my-problems"
  | "not-my-problems"
  | "rated"
  | "not-rated"
  | "everything"
  | "newest"
  | "oldest"
  | "most-ratings"
  | "fewest-ratings"
  | "most-solutions"
  | "fewest-solutions";
