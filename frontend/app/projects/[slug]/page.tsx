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

import GET_PROJECTS_PAGE from "../../../constants/subgraphQueries/subgraphQueryGetProject";
import { Task } from "@/common.types";

export default function PrjectPage({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const { address, isConnecting, isDisconnected } = useAccount();

  // Graph to fetch problems and projects
  const { loading, error, data } = useQuery(GET_PROJECTS_PAGE, {
    variables: { id: params.slug },
    pollInterval: 500,
  });

  let openTasksCount = data?.projects[0].tasks?.filter(
    (task: Task) => task.status === "OPEN"
  ).length;
  console.log(openTasksCount);
  // console.log(data);

  return (
    <div>
      <div className="overflow-x-hidden overflow-y-scroll h-screen">
        <Navbar />

        {/* // Presentation of the project: */}

        <section className="section-padding flex flex-col items-center bg-democracy-beige dark:bg-neutral-gray p-6 rounded-md border-b-4 border-tech-blue">
          <h1 className="title text-center mb-1">Project Challenge</h1>
          <h2 className="text-3xl font-semibold">
            {data?.projects.length == 0
              ? "Sorry, this project does not exist"
              : !error &&
                data &&
                data.projects.length > 0 &&
                data.projects[0].name}
          </h2>
          <h3 className="text-lg text-tech-blue mt-2">ID: {params.slug}</h3>
        </section>
        <section className="section-padding flex flex-col items-center bg-democracy-beige dark:bg-neutral-gray p-6 rounded-md border-b-4 border-tech-blue">
          {data?.projects[0].isOpenForManagementProposals == true && (
            <button
              className="btn btn-primary"
              onClick={() => router.push(`/managementOffers/${params.slug}`)}
            >
              View Management Offers or Submit a Management Offer for this
              Project
            </button>
          )}
          {openTasksCount > 0 && (
            <button
              className="btn btn-primary"
              onClick={() => router.push(`/projectTasks/${params.slug}`)}
            >
              View Open Tasks of this Project
            </button>
          )}
        </section>
      </div>
    </div>
  );
}
