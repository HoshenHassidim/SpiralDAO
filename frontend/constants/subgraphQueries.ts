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
  


activeProjectOffers(orderBy :blockNumber orderDirection: desc){
  offerId
  projectId
  proposer
  ratingCount
  ratingSum
  
}
projects(orderBy :blockNumber orderDirection: desc){
  projectId
  projectManager
  isOpenForManagementProposals
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


}
`;
export default GET_NEW_PROBLEMS;

export const GET_PROBLEM = gql`
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
  
