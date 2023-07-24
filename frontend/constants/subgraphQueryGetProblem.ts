import { gql } from "@apollo/client";

const GET_PROBLEM = gql`
  query ActiveProblem($id: String!) {
    activeProblems(where: { Problems_id: $id }) {
      Problems_id
      name
      creator
      ratingSum
      ratingCount
    }
  }
`;

export default GET_PROBLEM