import { gql } from "@apollo/client";

// See more example queries on https://thegraph.com/explorer/subgraph/protofire/maker-protocol
const GET_NEW_PROBLEMS = gql`
  {
    newProblems(first: 7, orderBy: Problems_id, orderDirection: desc) {
      Problems_id
      name
      creator
    }
  }
`;
export default GET_NEW_PROBLEMS;
