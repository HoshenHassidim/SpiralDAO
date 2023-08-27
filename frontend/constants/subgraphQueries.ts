import { gql } from "@apollo/client";

// See more example queries on https://thegraph.com/explorer/subgraph/protofire/maker-protocol
// GET_PROBLEMS_PAGE that returns the list of problems and solutions
const GET_PROBLEMS_PAGE = gql`
  query ActiveProblems {
    problemRateds(orderBy: blockNumber, orderDirection: desc) {
      problemId
      rater
      rating
    }
    activeProblems {
      problemId
      name
      creator
      ratingCount
      isOpenForRating
      isOpenForNewSolutions
    }

    userSolutionRatings(orderBy: blockNumber, orderDirection: desc) {
      solutionId
      rater
      rating
    }

    activeSolutions(orderBy: blockNumber, orderDirection: desc) {
      solutionId
      problemId
      name
      creator
      ratingSum
      ratingCount
    }

    problemRateds(orderBy: blockNumber, orderDirection: desc) {
      problemId
      rater
      rating
    }
  }
`;
export default GET_PROBLEMS_PAGE;
