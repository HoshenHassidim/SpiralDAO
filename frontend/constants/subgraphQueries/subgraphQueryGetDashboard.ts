import { gql } from "@apollo/client";

// See more example queries on https://thegraph.com/explorer/subgraph/protofire/maker-protocol
const GET_Dashboard_PAGE = gql`
  query ($id: String!) {
    tokenBalances(where: { member: $id }) {
      member
      projectId
      balance
    }

    activeProblems(where: { creator: $id }) {
      problemId
      name
      creator
      ratingCount
      isOpenForRating
      isOpenForNewSolutions
      solutions {
        solutionId
        hasProject
      }
    }

    activeSolutions(where: { creator: $id }) {
      solutionId
      name
      creator
      isOpenForRating
      ratingCount
      hasProject
    }

    projects(where: { projectManager: $id }) {
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

    activeManagementOffers(where: { proposer: $id }) {
      offerId
      proposer
      ratingCount
      isActive
      projectId
    }

    activeTaskOffers(where: { offeror: $id }) {
      offerId
      offeror
      ratingCount
      isActive
      taskId
    }

    tasks(where: { performer: $id }) {
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
    }
  }
`;
export default GET_Dashboard_PAGE;
