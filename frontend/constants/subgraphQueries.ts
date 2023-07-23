import { gql } from "@apollo/client";

// See more example queries on https://thegraph.com/explorer/subgraph/protofire/maker-protocol
const GET_NEW_PROBLEMS = gql`

  {
    problemRateds ( orderBy :blockNumber orderDirection: desc){
    Problems_id
    rater
    rating
  }
  activeProblems  (orderBy :blockNumber orderDirection: desc){
    Problems_id
    name
    creator
    ratingSum
    ratingCount
  }
}
`;
export default GET_NEW_PROBLEMS;
