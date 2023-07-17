import { gql } from "@apollo/client";

// See more example queries on https://thegraph.com/explorer/subgraph/protofire/maker-protocol
const GET_ACTIVE_MEMBERS = gql`
  {
    activeMembers(first: 5) {
      memberAddress
    }
  }
`;
export default GET_ACTIVE_MEMBERS;
