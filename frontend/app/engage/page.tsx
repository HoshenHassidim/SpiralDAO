"use client";

import Navbar from "../../components/Navbar";
import ProblemCard from "../../components/Cards/ProblemCard";
import Link from "next/link";
import { AiOutlinePlus } from "react-icons/ai";
import GET_NEW_PROBLEMS from "../../constants/subgraphQueries/subgraphQueryGetProblems";
import { useQuery } from "@apollo/client";
import { useState, useEffect } from "react";
import {
  ActiveProblemType,
  ActiveSolutionType,
  UserProblemRating,
} from "@/common.types";
import { useAccount } from "wagmi";
import SubmitProblemModal from "@/components/SubmitProblemModal";
import ProblemsFilters from "@/components/ProblemsFiltrer";
import Footer from "@/components/Footer";

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

  const [filterStatus, setFilterStatus] = useState("Active Problems");
  const [filterEngage, setFilterEngage] = useState("everything");
  const [sortOption, setsortOption] = useState("Newest");
  const [filterRated, setFilterRated] = useState("All");
  const [isClient, setIsClient] = useState(false);
  const [showProblemModal, setShowProblemModal] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  function getUserRatingForProblem(problemId: BigInt) {
    if (data && data.userProblemRatings) {
      const userRating = data.userProblemRatings.find(
        (rating: UserProblemRating) =>
          rating.problemId === problemId &&
          rating.rater.toLowerCase() === address?.toLowerCase()
      );
      return userRating ? userRating.rating : 0;
    }
    return 0;
  }

  const filteredProblems =
    data && data.activeProblems
      ? data.activeProblems.filter((problem: ActiveProblemType) => {
          let meetsStatusCondition = false;
          let meetsCreatorCondition = true;
          let meetsRatingCondition = true;

          // Handle Status filter
          switch (filterStatus) {
            case "Awaiting Ranking":
              meetsStatusCondition = problem.isOpenForRating;
              break;
            case "In Solution Phase":
              meetsStatusCondition = problem.isOpenForNewSolutions;
              break;
            case "All Problems":
              meetsStatusCondition = true;
              break;
            default: // For "All open problems"
              meetsStatusCondition =
                problem.isOpenForNewSolutions || problem.isOpenForRating;
          }

          if (address) {
            // Handle Creator filter
            switch (filterEngage) {
              case "my problems":
                meetsCreatorCondition =
                  problem.creator.toLowerCase() === address?.toLowerCase();
                break;
              case "not my problem":
                meetsCreatorCondition = address
                  ? problem.creator.toLowerCase() !== address.toLowerCase()
                  : true;
                break;
              default: // For "All Problems"
                meetsCreatorCondition = true;
            }
            switch (filterRated) {
              case "Rated":
                meetsRatingCondition =
                  getUserRatingForProblem(problem.problemId) > 0;
                break;
              case "Not Rated":
                meetsRatingCondition =
                  getUserRatingForProblem(problem.problemId) === 0;
                break;
              default: // For "All"
                meetsRatingCondition = true;
            }
          }

          return (
            meetsStatusCondition &&
            meetsCreatorCondition &&
            meetsRatingCondition
          );
        })
      : [];

  // Sorting logic based on the problemId (since sorting by date means sorting by problem ID on the backend)
  if (sortOption === "Newest") {
    filteredProblems.sort((a: ActiveProblemType, b: ActiveProblemType) => {
      return b.problemId.valueOf() - a.problemId.valueOf();
    });
  } else if (sortOption === "Oldest") {
    filteredProblems.sort((a: ActiveProblemType, b: ActiveProblemType) => {
      return a.problemId.valueOf() - b.problemId.valueOf();
    });
  } else if (sortOption === "Most Ratings") {
    // sorting by highest ratings first
    filteredProblems.sort((a: ActiveProblemType, b: ActiveProblemType) => {
      return b.ratingCount.valueOf() - a.ratingCount.valueOf();
    });
  } else if (sortOption === "Fewest Ratings") {
    // sorting by least ratings first
    filteredProblems.sort((a: ActiveProblemType, b: ActiveProblemType) => {
      return a.ratingCount.valueOf() - b.ratingCount.valueOf();
    });
  } else if (sortOption === "Most Solutions") {
    // sorting by highest number of solutions first
    filteredProblems.sort((a: ActiveProblemType, b: ActiveProblemType) => {
      return b.solutions.length - a.solutions.length;
    });
  } else if (sortOption === "Fewest Solutions") {
    // sorting by least number of solutions first
    filteredProblems.sort((a: ActiveProblemType, b: ActiveProblemType) => {
      return a.solutions.length - b.solutions.length;
    });
  }

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div>
      <div className="overflow-x-hidden overflow-y-scroll h-screen">
        <Navbar />

        <section className="section-padding flex flex-col items-center  bg-democracy-beige dark:bg-neutral-gray p-6 rounded-md border-b-4 border-tech-blue">
          <h1 className="title text-center">
            Engage with Challenges & Solutions
          </h1>
          <h2 className="subtitle text-center my-4">
            Explore community-driven challenges. Submit your own, propose
            solutions, voice your ratings, and collaborate on impactful ideas.
          </h2>
        </section>

        <section className="flex flex-col justify-center items-center">
          <section className="flex flex-wrap flex-col md:flex-row md:justify-between items-center bg-democracy-beige dark:bg-neutral-gray p-2 md:p-4 rounded-md">
            {/* Button to toggle filter visibility on small screens */}
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="md:hidden mb-2"
            >
              {isFilterOpen ? "Hide Filters" : "Show Filters"}
            </button>

            {/* Hide filters on small screens when isFilterOpen is false, always show on larger screens */}
            <ProblemsFilters
              filterStatus={filterStatus}
              setFilterStatus={setFilterStatus}
              filterEngage={filterEngage}
              setFilterEngage={setFilterEngage}
              filterRated={filterRated}
              setFilterRated={setFilterRated}
              sortOption={sortOption}
              setsortOption={setsortOption}
              isClient={isClient}
              address={address || null}
              className={isFilterOpen ? "" : "hidden md:flex"}
            />
          </section>
        </section>

        <section className="section-padding flex flex-col items-center gap-5">
          {filteredProblems?.map((problem: ActiveProblemType) => {
            let projectId: BigInt = BigInt(0);
            problem.solutions.some((solution: ActiveSolutionType) => {
              if (solution.hasProject) {
                projectId = solution.solutionId;
              }
            });
            return (
              <ProblemCard
                key={problem.problemId.toString()}
                {...problem}
                solutionCount={problem.solutions.length}
                userAddress={address}
                userPreviousRating={getUserRatingForProblem(problem.problemId)}
                projectId={projectId}
              />
            );
          })}
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

        <section className="bottom-submit">
          <h2 className="bottom-submit-text">
            Can't find a challenge you're passionate about? Propose your own!
          </h2>
          <button
            className="btn-primary"
            onClick={() => setShowProblemModal(true)}
          >
            Submit a Problem
          </button>
        </section>

        <SubmitProblemModal
          isOpen={showProblemModal}
          onClose={() => setShowProblemModal(false)}
        />

        <div className="floating-submit">
          <div className="floating-submit-text">
            <p className="font-secondary text-xs">Have a challenge in mind?</p>
            <p className="font-secondary text-xs">
              Can't find what you're passionate about?
            </p>
          </div>
          <button
            className="btn-primary"
            onClick={() => setShowProblemModal(true)}
          >
            Propose your own!
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
}
