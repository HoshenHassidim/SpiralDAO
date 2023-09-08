import { gql } from "@apollo/client";

// See more example queries on https://thegraph.com/explorer/subgraph/protofire/maker-protocol
// GET_PROBLEMS_PAGE that returns the list of problems and solutions
const GET_PROBLEMS_PAGE = gql`
  query {
    userProblemRatings {
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
      solutions {
        solutionId
        hasProject
      }
    }

    # userSolutionRatings(orderBy: blockNumber, orderDirection: desc) {
    #   solutionId
    #   rater
    #   rating
    # }
    # activeSolutions(where: { isOpenForRating: true }) {
    #   solutionId
    #   problemId
    # }
  }
`;
export default GET_PROBLEMS_PAGE;
