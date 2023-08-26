"use client";
import { useRouter } from "next/navigation";
import { useQuery } from "@apollo/client";
import { useState, useEffect } from "react";
import { useAccount, useContractWrite } from "wagmi";

import abi from "../../../constants/Problems.json";
import addresses from "../../../constants/networkMapping.json";
import createNotification from "../../../createNotification.js";

// Components
import ProjectCompleteTasks from "../../../components/ProjectCompleteTasks";
import ProjectAddTasks from "../../../components/ProjectAddTasks";
import RatingTaskStars from "../../../components/RatingTaskStars";
import RatingManagerOfferStars from "../../../components/RatingManagerOfferStars";

import Link from "next/link";

import Navbar from "../../../components/Navbar";

import GET_PROJECTS_PAGE from "../../../constants/subgraphQueryGetProject";
import {
  ActiveProblemType,
  ActiveSolutionType,
  CustomError,
  ProjectType,
  Task,
} from "@/common.types";

export default function ProblemPage({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const { address, isConnecting, isDisconnected } = useAccount();

  // Graph to fetch problems and projects
  const {
    loading: projectLoading,
    error: subgraphQueryError,
    data: projectData,
  } = useQuery(GET_PROJECTS_PAGE);

  if (projectData) {
    console.log(projectData);
  }
  const currentProject = projectData?.projects.find(
    (pj: ProjectType) => pj.projectId === BigInt(params.slug)
  );

  //Wagmi to propose as a offer (manager)
  const { data, isLoading, isSuccess, write } = useContractWrite({
    address: addresses[4002].Projects[0] as `0x${string}`,
    abi: abi,
    functionName: "proposeOffer",
    args: [params.slug],
    onError(error: CustomError) {
      createNotification(
        error.metaMessages ? error.metaMessages[0] : "An error occurred",
        "error"
      );
    },
    onSuccess(projectData) {
      createNotification("Successfully proposed for a manager role", "success");
    },
  });

  return (
    <div>
      <div className="overflow-x-hidden h-screen">
        <Navbar />

        <section className="flex flex-col gap-2 justify-center items-center">
          <Link
            href="/projects"
            className="mt-5 text-white opacity-80 font-semibold"
          >
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Back
            </button>
          </Link>

          <section className="projectInfo">
            {params.slug}

            {projectData &&
              projectData.projects.map((project: ProjectType) => {
                if (project.projectId == BigInt(params.slug)) {
                  let solution = projectData.activeSolutions.find(
                    (s: ActiveSolutionType) => s.solutionId == project.projectId
                  );
                  let problem = projectData.activeProblems.find(
                    (p: ActiveProblemType) => p.problemId == project.projectId
                  );
                  return (
                    <div key={project.projectId.toString()}>
                      <div className="flex flex-col">
                        <span className="self-end">
                          By{" "}
                          {address && address.toLowerCase() == problem.creator
                            ? "My Problem"
                            : problem.creator.substr(0, 4) +
                              "..." +
                              problem.creator.substr(
                                problem.creator.length - 4
                              )}
                        </span>
                        <h2 className="text-lg font-bold mb-5 ">
                          {problem.name}
                        </h2>
                      </div>

                      <hr className="mb-3" />
                      <div className="flex flex-col">
                        <div className="mb-4 flex flex-row items-center justify-between">
                          <h2 className="text-lg">Solution</h2>
                          <p className="text-sm self-end">
                            By{" "}
                            {address &&
                            address.toLowerCase() == solution.creator
                              ? "My Solution"
                              : solution.creator.substr(0, 4) +
                                "..." +
                                solution.creator.substr(
                                  solution.creator.length - 4
                                )}
                          </p>
                        </div>
                        <p className="text-sm">{solution.name}</p>
                      </div>
                    </div>
                  );
                }
              })}
          </section>
          <section>
            <h2 className="text-xl mt-5">Tasks</h2>
            {projectData &&
              projectData.tasks.map((task: Task) => {
                if (task.projectId === BigInt(params.slug)) {
                  return (
                    <div
                      key={task.taskId.toString()}
                      className="flex flex-col items-center"
                    >
                      <span>{task.taskName}</span>
                      <span>
                        {task.performer ==
                        "0x0000000000000000000000000000000000000000" ? (
                          <button
                            onClick={() => {
                              write();
                            }}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                          >
                            Offer to complete Task
                          </button>
                        ) : (
                          "Task Performer: " + task.performer
                        )}
                      </span>
                      <div className="flex flex-row">
                        <RatingTaskStars taskId={task.projectId} />
                      </div>
                    </div>
                  );
                }
              })}
          </section>

          {currentProject?.isOpenForManagementProposals && (
            <section className="managers">
              <h2 className="text-xl mt-5">Managers</h2>

              <div className="flex justify-center">
                <button
                  onClick={() => {
                    write();
                  }}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Apply for Manager
                </button>
              </div>

              {projectData?.activeProjectOffers.map((offer: any) => {
                {
                  console.log(offer);
                }
                if (offer.projectId === params.slug) {
                  return (
                    <div
                      key={offer.offerId.toString()}
                      className="flex flex-col items-center"
                    >
                      <span>{offer.proposer}</span>

                      <div className="flex flex-row">
                        <RatingManagerOfferStars offerId={offer.offerId} />
                      </div>
                    </div>
                  );
                }
              })}
            </section>
          )}

          {address?.toLowerCase() == currentProject?.projectManager && (
            <ProjectAddTasks
              address={addresses[4002].Tasks[0]}
              projectId={params.slug}
            />
          )}
        </section>
        {/* <ProjectCompleteTasks /> */}
      </div>
    </div>
  );
}
