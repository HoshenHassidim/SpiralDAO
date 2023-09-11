"use client";

import Navbar from "../../components/Navbar";
import ProjectCard from "../../components/Cards/ProjectCard";

import Link from "next/link";
import { AiOutlinePlus } from "react-icons/ai";

//graph
import type { NextPage } from "next";
import GET_PROJECTS_PAGE from "../../constants/subgraphQueries/subgraphQueryGetProjects";
import { useQuery } from "@apollo/client";
import { useState, useEffect } from "react";
//toast
import createNotification from "../../createNotification.js";
import {
  ActiveProblemType,
  ActiveSolutionType,
  ErrorType,
  ProjectType,
} from "@/common.types";
import { useAccount } from "wagmi";
import Footer from "@/components/Footer";

export default function Projects() {
  const [error, setError] = useState<ErrorType | null>(null);

  const {
    loading: projectLoading,
    error: subgraphQueryError,
    data: projectData,
  } = useQuery(GET_PROJECTS_PAGE, {
    pollInterval: 500,
  });

  const { address, isConnecting, isDisconnected } = useAccount();

  useEffect(() => {
    if (error) {
      createNotification(error.metaMessages[0], "error");

      setError(null);
    }
  }, [error]);

  return (
    <div>
      <div className="overflow-x-hidden overflow-y-scroll h-screen">
        <Navbar />

        <section className="section-padding flex flex-col items-center  bg-democracy-beige dark:bg-neutral-gray p-6 rounded-md border-b-4 border-tech-blue">
          <h1 className="title text-center">Community Projects</h1>
          <h2 className="subtitle text-center my-4">
            Collaborate, contribute, and co-create.
            <br />
            Dive into the ongoing challenges and see how you can make an impact.
          </h2>
        </section>

        {/* <ToastContainer /> */}
        <section className="flex flex-col items-center justify-center gap-5 p-5">
          {projectData &&
            projectData.projects.map((project: ProjectType) => {
              if (project.projectId != BigInt(0)) {
                let managementOffersCount = project.managementOffers.length;
                let areProposed = false;
                if (address) {
                  areProposed = project.managementOffers.some(
                    (offer) =>
                      offer.proposer.toLowerCase() === address.toLowerCase()
                  );
                }
                let openTasksCount = project.tasks.filter(
                  (task) => task.status === "OPEN"
                ).length;
                return (
                  console.log("project.projectId", project.projectId),
                  (
                    <ProjectCard
                      key={project.projectId.toString()}
                      projectId={project.projectId}
                      solutionName={project.solution?.name}
                      problemName={project.solution?.problem.name}
                      managementOffersCount={managementOffersCount}
                      isOpenForManagementProposals={
                        project.isOpenForManagementProposals
                      }
                      tasksCount={project.tasks.length}
                      projectManager={project.projectManager}
                      areProposed={areProposed}
                      openTasksCount={openTasksCount}
                      userAddress={address}
                    />
                  )
                );
              }
            })}
        </section>

        {/* <Link className="fixed sm:bottom-5 sm:right-5 bottom-2 right-2" href="/problems/new">
        
          <button className="transition-colors duration-150 bg-[#3AB3D7] hover:bg-blue-500  text-white rounded-full p-2">
            <AiOutlinePlus className="w-8 h-8" /> 
          </button>
        
      </Link> */}
        <Footer />
      </div>
    </div>
  );
}
