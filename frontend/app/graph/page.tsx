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
    <div className="flex flex-wrap">
      {data &&
        data.activeMembers.map((d) => (
          <div className=" m-5 p-5 bg-blue-500 rounded-xl" key={d}>{d.memberAddress}</div>
        ))}
    </div>
  );
};
export default GraphExample;
