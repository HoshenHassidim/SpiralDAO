import { gql } from "@apollo/client";

// See more example queries on https://thegraph.com/explorer/subgraph/protofire/maker-protocol
const GET_NEW_PROJECTS = gql`

  query {
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

tasks {
    taskId
    performer
    status
    completionRatingSum
    numberOfCompletionRaters
    taskName
    projectId
  }


}
`;
export default GET_NEW_PROJECTS;


  
