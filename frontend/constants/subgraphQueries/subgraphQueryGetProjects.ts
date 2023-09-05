import { gql } from "@apollo/client";

// See more example queries on https://thegraph.com/explorer/subgraph/protofire/maker-protocol
const GET_PROJECTS_PAGE = gql`
  query {
    projects {
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
    }
  }
`;
export default GET_PROJECTS_PAGE;
