"use client";

import Navbar from "../../components/Navbar";
import Footer from "@/components/Footer";
import ProjectCard from "../../components/Cards/ProjectCard";
import TaskCard from "@/components/Cards/TaskCard";

//graph
import GET_OPPORTUNITIES_PAGE from "@/constants/subgraphQueries/subgraphQueryGetProjectForOpportunitiesPage";
import { useQuery } from "@apollo/client";
import { useState, useEffect } from "react";
//toast
import createNotification from "../../createNotification.js";
import {
  Task,
  ProjectType,
  ActiveTaskOffer,
  ActiveManagementOfferType,
} from "@/common.types";
import { useAccount } from "wagmi";

export default function Opportunities() {
  const { loading, error, data } = useQuery(GET_OPPORTUNITIES_PAGE, {
    pollInterval: 500,
  });

  const combinedItems = [...(data?.projects || []), ...(data?.tasks || [])];
  combinedItems.sort((a, b) => {
    return b.blockNumber - a.blockNumber;
  });

  // if (data) {
  //   console.log(data);
  // } else {
  //   console.log("no data");
  // }
  // console.log("combinedItems", combinedItems);

  const { address, isConnecting, isDisconnected } = useAccount();

  return (
    <div className="overflow-x-hidden overflow-y-scroll h-screen">
      <Navbar />

      <section className="section-padding flex flex-col items-center bg-democracy-beige dark:bg-neutral-gray p-6 rounded-md border-b-4 border-tech-blue">
        <h1 className="title text-center">Opportunities</h1>
        <h2 className="subtitle text-center my-4">
          Explore projects to manage or tasks to preform. Shape the future with
          your skills.
        </h2>
      </section>

      <section className="flex flex-col items-center justify-center gap-5 p-5">
        {combinedItems.map((item) => {
          if (item.__typename === "Project") {
            console.log("item", item);
            if (item.projectId != BigInt(0)) {
              let managementOffersCount = item.managementOffers.length;
              let areProposed = false;
              if (address) {
                areProposed = item.managementOffers.some(
                  (offer: ActiveManagementOfferType) =>
                    offer.proposer.toLowerCase() === address.toLowerCase()
                );
              }
              let openTasksCount = item.tasks.filter(
                (task: Task) => task.status === "OPEN"
              ).length;
              return (
                <ProjectCard
                  key={item.projectId.toString()}
                  projectId={item.projectId}
                  solutionName={item.solution?.name}
                  problemName={item.solution?.problem.name}
                  managementOffersCount={managementOffersCount}
                  isOpenForManagementProposals={
                    item.isOpenForManagementProposals
                  }
                  tasksCount={item.tasks.length}
                  projectManager={item.projectManager}
                  areProposed={areProposed}
                  openTasksCount={openTasksCount}
                  userAddress={address}
                />
              );
            }
          } else if (item.__typename === "Task") {
            let offersCount = item.taskOffers.length;
            let areProposed = false;
            if (address) {
              areProposed = item.taskOffers.some(
                (offer: ActiveTaskOffer) =>
                  offer.offeror.toLowerCase() === address.toLowerCase()
              );
            }
            return (
              <TaskCard
                key={item.taskId.toString()}
                {...item}
                offersCount={offersCount}
                userPreviousRating={0}
                areProposed={areProposed}
              />
            );
          }
        })}
      </section>

      {/* <section className="flex flex-col items-center justify-center gap-5 p-5">
        {data?.projects.map((project: ProjectType) => {
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
            );
          }
        })}
      </section> */}
      {/* <section className="section-padding flex flex-col items-center gap-5">
        {data?.tasks.map((task: Task) => {
          let offersCount = task.taskOffers.length;
          let areProposed = false;
          if (address) {
            areProposed = task.taskOffers.some(
              (offer) => offer.offeror.toLowerCase() === address.toLowerCase()
            );
          }
          return (
            <TaskCard
              key={task.taskId.toString()}
              {...task}
              offersCount={offersCount}
              userPreviousRating={0}
              areProposed={areProposed}
            />
          );
        })}
      </section> */}
      <Footer />
    </div>
  );
}
