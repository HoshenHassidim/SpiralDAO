"use client";

import Navbar from "../../components/Navbar";
import Project from "../../components/Project";

import Link from "next/link";
import { AiOutlinePlus } from "react-icons/ai";

//graph
import type { NextPage } from "next";
import GET_NEW_PROJECTS from "../../constants/subgraphQueryGetProject";
import GET_NEW_PROBLEMS from "../../constants/subgraphQueries";
import { useQuery } from "@apollo/client";
import { useState, useEffect } from "react";
//toast
import createNotification from "../../createNotification.js";

interface ActiveProblemType {
  id: string;
  problemId: BigInt;
  creator: string;
  name: string;
  ratingCount: BigInt;
  ratingSum: BigInt;
  solutions: ActiveSolutionType[];
  isOpenForRating: boolean;
  isOpenForNewSolutions: boolean;
  blockNumber: BigInt;
}

interface ActiveSolutionType {
  id: string;
  solutionId: BigInt;
  problemId: BigInt;
  problem: ActiveProblemType;
  creator: string;
  name: string;
  ratingCount: BigInt;
  ratingSum: BigInt;
  isOpenForRating: boolean;
  hasProject: boolean;
  blockNumber: BigInt;
}
interface ProjectType {
  id: string;
  projectId: BigInt;
  projectManager: string; // Assuming Bytes translates to string in TypeScript for the address. Adjust if needed.
  isOpenForManagementProposals: boolean;
  managementOffers: ActiveManagementOfferType[];
  blockNumber: BigInt;
}

interface ActiveManagementOfferType {
  id: string;
  offerId: BigInt;
  projectId: BigInt;
  project: ProjectType;
  proposer: string; // Adjust if needed.
  ratingCount: BigInt;
  ratingSum: BigInt;
  isActive: boolean;
  blockNumber: BigInt;
}

interface ErrorType {
  metaMessages: string[];
  // ... any other properties that the error might have.
}

export default function Projects() {
  const [error, setError] = useState<ErrorType | null>(null);
  const {
    loading,
    error: subgraphQueryError,
    data,
  } = useQuery(GET_NEW_PROJECTS);

  const {
    loading: problemLoading,
    error: subgraphQueryErrorProblem,
    data: problemData,
  } = useQuery(GET_NEW_PROBLEMS);

  if (data) {
    console.log(data);
    console.log(problemData);
  }

  useEffect(() => {
    if (error) {
      createNotification(error.metaMessages[0], "error");

      setError(null);
    }
  }, [error]);

  return (
    <div className="overflow-x-hidden">
      <Navbar />

      {/* <ToastContainer /> */}
      <section className="flex flex-col items-center justify-center gap-5 p-5">
        {problemData &&
          data &&
          data.projects.map((project: ProjectType) => {
            // <Problem key={project.projectID} id={project.projectID} title={project.name} creator={project.creator} setError={setError}/>
            // project.projectId
            let solution = problemData.activeSolutions.find(
              (p: ActiveSolutionType) =>
                p.hasProject && p.solutionId === project.projectId
            );
            console.log("solution found:", solution);

            if (solution) {
              console.log("Matching solution found:", solution);
              let problem = problemData.activeProblems.find(
                (p: ActiveProblemType) => p.problemId === solution.problemId
              );

              if (problem) {
                console.log("Matching problem for the solution:", problem);

                return (
                  <Project
                    key={solution.solutionId}
                    id={solution.solutionId}
                    solutionTitle={solution.name}
                    solutionCreator={solution.creator}
                    problemTitle={problem.name}
                    problemCreator={problem.creator}
                    setError={setError}
                  />
                );
              } else {
                console.log(
                  "No matching problem found for the solution:",
                  solution
                );
              }
            } else {
              console.log(
                "No matching solution found for the project:",
                project
              );
            }
          })}
      </section>

      {/* <Link className="fixed sm:bottom-5 sm:right-5 bottom-2 right-2" href="/problems/new">
        
          <button className="transition-colors duration-150 bg-[#3AB3D7] hover:bg-blue-500  text-white rounded-full p-2">
            <AiOutlinePlus className="w-8 h-8" /> 
          </button>
        
      </Link> */}
    </div>
  );
}
