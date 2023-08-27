"use client";

import Navbar from "../../components/Navbar";
import Problem from "../../components/Problem";
import Link from "next/link";
import { AiOutlinePlus } from "react-icons/ai";
import GET_NEW_PROBLEMS from "../../constants/subgraphQueries";
import { useQuery } from "@apollo/client";
import { useState, useEffect } from "react";
import { ActiveProblemType } from "@/common.types";
import { useAccount } from "wagmi";

function status(problem: ActiveProblemType) {
  if (problem.isOpenForRating) {
    return "Awaiting Ranking";
  } else if (problem.isOpenForNewSolutions) {
    return "In Solution Phase";
  } else {
    return "Closed";
  }
}

export default function EngagePage() {
  const { address, isConnecting, isDisconnected } = useAccount();

  const {
    loading,
    error: subgraphQueryError,
    data,
  } = useQuery(GET_NEW_PROBLEMS, {
    // variables: { address: address },
    pollInterval: 500,
  });

  const [filterStatus, setFilterStatus] = useState("All Problems");
  const [filterEngage, setFilterEngage] = useState("everything");
  const [sortDate, setSortDate] = useState("Newest");

  const filteredProblems =
    data && data.activeProblems
      ? data.activeProblems.filter((problem: ActiveProblemType) => {
          let meetsStatusCondition = false;
          let meetsCreatorCondition = false;

          // Handle Status filter
          switch (filterStatus) {
            case "Awaiting Ranking":
              meetsStatusCondition =
                problem.isOpenForRating && problem.isOpenForNewSolutions;
              break;
            case "In Solution Phase":
              meetsStatusCondition =
                problem.isOpenForNewSolutions && !problem.isOpenForRating;
              break;
            default: // For "All Problems"
              meetsStatusCondition = true;
          }

          // Handle Creator filter
          switch (filterEngage) {
            case "my problems":
              meetsCreatorCondition =
                problem.creator.toLowerCase() === address?.toLowerCase();
              break;
            case "not my problem":
              meetsCreatorCondition = problem.creator !== address;
              break;
            default: // For "All Problems"
              meetsCreatorCondition = true;
          }

          return meetsStatusCondition && meetsCreatorCondition;
        })
      : [];

  // Sorting logic based on the problemId (since sorting by date means sorting by problem ID on the backend)
  if (sortDate === "Newest") {
    filteredProblems.sort((a: ActiveProblemType, b: ActiveProblemType) => {
      return b.problemId.valueOf() - a.problemId.valueOf();
    });
  } else {
    filteredProblems.sort((a: ActiveProblemType, b: ActiveProblemType) => {
      return a.problemId.valueOf() - b.problemId.valueOf();
    });
  }

  return (
    <div className="overflow-x-hidden">
      <Navbar />

      <section className="section-padding flex flex-col items-center">
        <h1 className="title text-center">
          Engage with Challenges & Solutions
        </h1>
        <h2 className="subtitle text-center my-4">
          Discover the myriad of problems posed by our community and contribute
          your own insights or solutions.
        </h2>
      </section>

      <section className="section-padding flex flex-col md:flex-row md:justify-between items-start md:items-center bg-democracy-beige dark:bg-neutral-gray p-4 rounded-md">
        <div className="flex flex-col md:flex-row gap-4">
          <label>Filter By:</label>
          {/* You'll need dropdown or select components for the following options */}
          <select
            className="input-field"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option>All Problems</option>
            <option>Awaiting Ranking</option>
            <option>In Solution Phase</option>
          </select>

          {/* <label>Category/Topic:</label>
          <select className="input-field">
            <option>Technology</option>
            <option>Environment</option>
            <option>Social Issues</option>
          </select> */}

          <label>Date Added:</label>
          <select
            className="input-field"
            value={sortDate}
            onChange={(e) => setSortDate(e.target.value)}
          >
            <option>Newest</option>
            <option>Oldest</option>
          </select>

          <label>My Intervention:</label>
          <select
            className="input-field"
            value={filterEngage}
            onChange={(e) => setFilterEngage(e.target.value)}
          >
            <option value="everything">All Problems</option>
            <option value="my problems">My Problems</option>
            <option value="not my problem">Others' Problems</option>
          </select>
        </div>

        {/* <div className="flex flex-col md:flex-row gap-4 mt-4 md:mt-0">
          <label>Sort By:</label>
          <select className="input-field">
            <option>Popularity</option>
            <option>Recent Activity</option>
            <option>Most Discussed</option>
          </select>
        </div> */}
      </section>

      <section className="section-padding flex flex-col items-center gap-5">
        {filteredProblems?.map((problem: ActiveProblemType) => (
          <Problem
            key={problem.problemId.toString()}
            id={problem.problemId}
            title={problem.name}
            creator={problem.creator}
            ratingCount={problem.ratingCount}
            isOpenForRating={problem.isOpenForRating}
            isOpenForNewSolutions={problem.isOpenForNewSolutions}
            userAddress={address}
            status={status(problem)}
          />
        ))}
      </section>

      {/* <section className="flex flex-col items-center justify-center gap-5 p-5">
        {data?.activeProblems.map((problem: ProblemType) => (
          <Problem
            key={problem.problemId}
            id={problem.problemId}
            title={problem.name}
            creator={problem.creator}
          />
        ))}
      </section> */}

      <Link
        className="fixed sm:bottom-5 sm:right-5 bottom-2 right-2"
        href="/engage/new"
      >
        <button className="transition-colors duration-150 bg-[#3AB3D7] hover:bg-blue-500  text-white rounded-full p-2">
          <AiOutlinePlus className="w-8 h-8" />
        </button>
      </Link>
    </div>
  );
}
