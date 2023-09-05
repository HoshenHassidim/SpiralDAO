import { gql } from "@apollo/client";

// See more example queries on https://thegraph.com/explorer/subgraph/protofire/maker-protocol
const GET_TaskOffers_PAGE = gql`
  query ($id: String!) {
    tasks(where: { taskId: $id }) {
      taskId
      performer
      taskName
      status
      taskOffers {
        offerId
        offeror
        ratingCount
        isActive
      }
      project {
        projectId
        solution {
          name
        }
      }
    }
    userTaskOfferRatings {
      offerId
      rater
      rating
    }
  }
`;
export default GET_TaskOffers_PAGE;
