import { gql } from "@apollo/client";

// See more example queries on https://thegraph.com/explorer/subgraph/protofire/maker-protocol
const GET_OPPORTUNITIES_PAGE = gql`
  query {
    projects(where: { isOpenForManagementProposals: true }) {
      projectId
      projectManager
      isOpenForManagementProposals
      tasks {
        taskId
        taskValue
        status
      }
      managementOffers {
        proposer
      }
      solution {
        name
        problem {
          name
        }
      }
      blockNumber
    }
    tasks(where: { status: "OPEN" }) {
      taskId
      taskName
      taskValue
      performer
      completionRatingSum
      numberOfCompletionRaters
      status
      projectId
      taskOffers {
        offerId
        offeror
      }
      blockNumber
    }
  }
`;
export default GET_OPPORTUNITIES_PAGE;
