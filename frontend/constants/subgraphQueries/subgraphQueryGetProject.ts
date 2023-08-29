import { gql } from "@apollo/client";

// See more example queries on https://thegraph.com/explorer/subgraph/protofire/maker-protocol
const GET_PROJECTS_PAGE = gql`
  query {
    activeManagementOffers(orderBy: blockNumber, orderDirection: desc) {
      offerId
      projectId
      proposer
      ratingCount
      ratingSum
    }
    projects(orderBy: blockNumber, orderDirection: desc) {
      projectId
      projectManager
      isOpenForManagementProposals
    }
    tasks {
      taskId
      performer
      status
      completionRatingSum
      numberOfCompletionRaters
      taskName
      projectId
    }
    problemRateds(orderBy: blockNumber, orderDirection: desc) {
      problemId
      rater
      rating
    }
    activeProblems(orderBy: blockNumber, orderDirection: desc) {
      problemId
      name
      creator
      ratingSum
      ratingCount
    }
    activeSolutions(orderBy: blockNumber, orderDirection: desc) {
      solutionId
      problemId
      name
      creator
      ratingSum
      ratingCount
      hasProject
    }
  }
`;
export default GET_PROJECTS_PAGE;
