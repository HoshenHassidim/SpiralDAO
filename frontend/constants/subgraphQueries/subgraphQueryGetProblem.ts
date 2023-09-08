import { gql } from "@apollo/client";

const GET_PROBLEM = gql`
  query ActiveProblem($id: String!) {
    activeProblems(where: { problemId: $id }) {
      problemId
      name
      creator
      ratingSum
      ratingCount
      solutions {
        solutionId
        name
        creator
        isOpenForRating
        ratingCount
        hasProject
      }
    }
    userSolutionRatings {
      solutionId
      rater
      rating
    }
  }
`;

export default GET_PROBLEM;
