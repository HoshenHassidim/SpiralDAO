import { gql } from "@apollo/client";

// See more example queries on https://thegraph.com/explorer/subgraph/protofire/maker-protocol
const GET_PROJECTS_PAGE = gql`
  query {
    activeManagementOffers {
      offerId
      projectId
      proposer
    }
    projects {
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

    activeSolutions {
      solutionId
      name
      creator
      hasProject
      problem {
        name
      }
    }

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
        offerId
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
