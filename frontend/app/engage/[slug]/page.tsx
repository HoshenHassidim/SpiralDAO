"use client";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";

import SolutionCard from "../../../components/Cards/SolutionCard";
import SubmitSolutionModal from "@/components/SubmitSolutionModal";
import SolutionsFilters from "@/components/SolutionsFiltrer";

// Wagmi write
import { useContractWrite, useAccount } from "wagmi";
import addresses from "../../../constants/networkMapping.json";
// Graph reading
import GET_PROBLEM from "../../../constants/subgraphQueries/subgraphQueryGetProblem";
import { useQuery } from "@apollo/client";
// Toast notification
import createNotification from "../../../createNotification.js";
import abi from "../../../constants/Solutions.json";
import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "../../../components/Navbar.jsx";
import {
  ActiveSolutionType,
  CustomError,
  ProblemDataType,
  UserSolutionRating,
} from "@/common.types.js";
import Footer from "@/components/Footer";

export default function ProblemPage({ params }: { params: { slug: string } }) {
  const [solution, setSolution] = useState();
  const { register, handleSubmit } = useForm();

  const { address, isConnecting, isDisconnected } = useAccount();
  const [filterEngage, setFilterEngage] = useState("everything");
  const [sortOption, setsortOption] = useState("Newest");
  const [filterRated, setFilterRated] = useState("All");
  const [isClient, setIsClient] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [showSolutionModal, setShowSolutionModal] = useState(false);

  const router = useRouter();

  // Fetching the problem from id
  const { loading, error, data } = useQuery(GET_PROBLEM, {
    variables: { id: params.slug },
    pollInterval: 500,
  });
  console.log(data);
  // const problem = data?.activeProblems[0];

  function getUserRatingForSolution(solutionId: BigInt) {
    if (data && data.userSolutionRatings) {
      const userRating = data.userSolutionRatings.find(
        (rating: UserSolutionRating) =>
          rating.solutionId === solutionId &&
          rating.rater.toLowerCase() === address?.toLowerCase()
      );
      return userRating ? userRating.rating : 0;
    }
    return 0;
  }

  const filteredSolutions =
    data && data.activeProblems[0].solutions
      ? data.activeProblems[0].solutions.filter(
          (solution: ActiveSolutionType) => {
            console.log("solution: ", solution);
            // let meetsStatusCondition = false;
            let meetsCreatorCondition = true;
            let meetsRatingCondition = true;

            // // Handle Status filter
            // switch (filterStatus) {
            //   case "Awaiting Ranking":
            //     meetsStatusCondition =
            //       solution.isOpenForRating && solution.isOpenForNewSolutions;
            //     break;
            //   case "In Solution Phase":
            //     meetsStatusCondition =
            //       solution.isOpenForNewSolutions && !solution.isOpenForRating;
            //     break;
            //   default: // For "All Solutions"
            //     meetsStatusCondition = true;
            // }

            if (address) {
              // Handle Creator filter
              switch (filterEngage) {
                case "my solutions":
                  meetsCreatorCondition =
                    solution.creator.toLowerCase() === address?.toLowerCase();
                  break;
                case "not my solution":
                  meetsCreatorCondition = address
                    ? solution.creator.toLowerCase() !== address.toLowerCase()
                    : true;
                  break;
                default: // For "All Solutions"
                  meetsCreatorCondition = true;
              }
              switch (filterRated) {
                case "Rated":
                  meetsRatingCondition =
                    getUserRatingForSolution(solution.solutionId) > 0;
                  break;
                case "Not Rated":
                  meetsRatingCondition =
                    getUserRatingForSolution(solution.solutionId) === 0;
                  break;
                default: // For "All"
                  meetsRatingCondition = true;
              }
            }

            return (
              // meetsStatusCondition &&
              meetsCreatorCondition && meetsRatingCondition
            );
          }
        )
      : [];

  // Sorting logic based on the solutionId (since sorting by date means sorting by solution ID on the backend)
  if (sortOption === "Newest") {
    filteredSolutions.sort((a: ActiveSolutionType, b: ActiveSolutionType) => {
      return b.solutionId.valueOf() - a.solutionId.valueOf();
    });
  } else {
    filteredSolutions.sort((a: ActiveSolutionType, b: ActiveSolutionType) => {
      return a.solutionId.valueOf() - b.solutionId.valueOf();
    });
  }

  console.log(filteredSolutions);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div>
      <div className="overflow-x-hidden overflow-y-scroll h-screen">
        <Navbar />

        <section className="section-padding flex flex-col items-center bg-democracy-beige dark:bg-neutral-gray p-6 rounded-md border-b-4 border-tech-blue">
          <h1 className="title text-center mb-1">Challenge Details</h1>
          <h2 className="text-3xl font-semibold">
            {data?.activeProblems.length > 0 &&
              `Challenge name: ${data.activeProblems[0].name}`}
            {data?.activeProblems.length == 0 &&
              "Sorry, this challenge does not exist."}
          </h2>
          <h3 className="text-lg text-tech-blue mt-2">ID: {params.slug}</h3>
        </section>

        <section className="flex flex-col justify-center items-center">
          <section className="flex flex-wrap flex-col md:flex-row md:justify-between items-center bg-democracy-beige dark:bg-neutral-gray p-2 md:p-4 rounded-md">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="md:hidden mb-2"
            >
              {isFilterOpen ? "Hide Filters" : "View Filters"}
            </button>

            <SolutionsFilters
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
          {filteredSolutions?.length !== 0 && (
            <h3 className="text-2xl font-bold">Community Solutions</h3>
          )}
          {filteredSolutions?.map((solution: ActiveSolutionType) => (
            <SolutionCard
              key={solution.solutionId.toString()}
              {...solution}
              userAddress={address}
              userPreviousRating={getUserRatingForSolution(solution.solutionId)}
            />
          ))}
        </section>

        <section className="bottom-submit">
          <h2 className="bottom-submit-text">Inspired by this challenge?</h2>
          <button
            className="btn-primary"
            onClick={() => setShowSolutionModal(true)}
          >
            Offer Your Solution
          </button>
        </section>

        <SubmitSolutionModal
          isOpen={showSolutionModal}
          onClose={() => setShowSolutionModal(false)}
          problemId={params.slug}
        />

        <div className="floating-submit">
          <div className="floating-submit-text">
            <p className="font-secondary text-xs">Think differently?</p>
            <p className="font-secondary text-xs">
              Empower the community with your unique solution.
            </p>
          </div>
          <button
            className="btn-primary"
            onClick={() => setShowSolutionModal(true)}
          >
            Share Your Insight
          </button>
        </div>
        <Footer />
      </div>
    </div>
  );
}
