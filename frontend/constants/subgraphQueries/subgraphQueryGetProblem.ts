import { gql } from "@apollo/client";

const GET_PROBLEM = gql`
  query ActiveProblem($id: String!) {
    activeProblems(where: { problemId: $id }) {
      problemId
      name
      creator
      ratingSum
      ratingCount
    }
  }
`;

export default GET_PROBLEM;
