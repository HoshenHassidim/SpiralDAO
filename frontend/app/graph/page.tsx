"use client";
import type { NextPage } from "next";
import Navbar from "../../components/Navbar.jsx"
import {GET_NEW_PROBLEMS} from "../../constants/subgraphQueries";
import { useQuery } from "@apollo/client";

const GraphExample: NextPage = () => {
  const {
    loading,
    error: subgraphQueryError,
    data,
  } = useQuery(GET_NEW_PROBLEMS);
  if (data) {
    console.log(data.newProblems);
  }
  return (
    <div className="overflow-x-hidden">
      <Navbar />
      {data &&
        data.newProblems.map((d) => (
          <div className=" m-5 p-5 bg-blue-500 rounded-xl" key={d}>{d.name}</div>
        ))}
    </div>
  );
};
export default GraphExample;
