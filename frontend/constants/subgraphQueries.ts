import { gql } from "@apollo/client";

// See more example queries on https://thegraph.com/explorer/subgraph/protofire/maker-protocol
const GET_NEW_PROBLEMS = gql`

  query {
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
  
 userSolutionRatings (orderBy :blockNumber orderDirection: desc){
  solutionId
  rater
  rating
}
activeSolutions (orderBy :blockNumber orderDirection: desc){
  solutionId
  problemId
  name
  creator
  ratingSum
  ratingCount
} 

problemRateds (orderBy :blockNumber orderDirection: desc){
  Problems_id
  rater
  rating
}

tokenBalances(first: 5) {
    member
    projectId
    balance
  }


}
`;
export default GET_NEW_PROBLEMS;


  
