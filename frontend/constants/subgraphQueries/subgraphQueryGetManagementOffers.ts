import { gql } from "@apollo/client";

// See more example queries on https://thegraph.com/explorer/subgraph/protofire/maker-protocol
const GET_ManagementOffers_PAGE = gql`
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
      solution {
        name
        problem {
          name
        }
      }
    }
    userManagementOfferRatings {
      offerId
      rater
      rating
    }
  }
`;
export default GET_ManagementOffers_PAGE;
