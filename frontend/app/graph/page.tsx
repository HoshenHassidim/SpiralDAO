"use client";
import type { NextPage } from "next";
import GET_ACTIVE_MEMBERS from "../../constants/subgraphQueries";
import { useQuery } from "@apollo/client";

const GraphExample: NextPage = () => {
  const {
    loading,
    error: subgraphQueryError,
    data,
  } = useQuery(GET_ACTIVE_MEMBERS);
  if (data) {
    console.log(data.activeMembers);
  }
  return (
    <div>
      Hiiiii
      {data &&
        data.activeMembers.map((d) => {
          <div>{d}</div>;
        })}
    </div>
  );
};
export default GraphExample;
