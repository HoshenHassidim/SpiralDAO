import { gql } from "@apollo/client";

// See more example queries on https://thegraph.com/explorer/subgraph/protofire/maker-protocol
const GET_PROJECT_TASKS_PAGE = gql`
  query ($id: String!) {
    projects(where: { projectId: $id }) {
      projectId
      projectManager
      isOpenForManagementProposals
      managementOffers {
        offerId
        proposer
        ratingCount
        isActive
      }
      tasks {
        taskId
        taskName
        taskValue
        performer
        completionRatingSum
        numberOfCompletionRaters
        status
        taskOffers {
          offerId
          offeror
          ratingSum
          ratingCount
          isActive
        }
      }
      solution {
        name
        problem {
          name
        }
      }
    }
    userTaskCompletionRatings {
      taskId
      rater
      rating
    }
  }
`;
export default GET_PROJECT_TASKS_PAGE;
