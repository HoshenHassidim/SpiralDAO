"use client";

import Navbar from "../../components/Navbar";
import ProblemCard from "@/components/Cards/ProblemCard";
import SolutionCard from "@/components/Cards/SolutionCard";
import ProjectCard from "@/components/Cards/ProjectCard";
import ManagementOfferCard from "@/components/Cards/ManagementOfferCard";
import TaskCard from "@/components/Cards/TaskCard";
import TaskOfferCard from "@/components/Cards/TaskOfferCard";
import Link from "next/link";
import { AiOutlinePlus } from "react-icons/ai";
import GET_Dashboard_PAGE from "@/constants/subgraphQueries/subgraphQueryGetDashboard";
import { useQuery } from "@apollo/client";
import { useState, useEffect, use } from "react";
import {
  ActiveManagementOfferType,
  ActiveProblemType,
  ActiveSolutionType,
  ActiveTaskOffer,
  ProjectType,
  Task,
  TokenBalance,
  UserProblemRating,
} from "@/common.types";
import { useAccount } from "wagmi";
import SubmitProblemModal from "@/components/SubmitProblemModal";
import ProblemsFilters from "@/components/ProblemsFiltrer";
import { Web3Button } from "@web3modal/react";
import Footer from "@/components/Footer";

type SectionProps = {
  title: string;
  children: React.ReactNode;
};

function Section({ title, children }: SectionProps) {
  return (
    <section className="section-padding flex flex-col items-center gap-5 lg:p-5">
      <h3 className="text-2xl font-bold">{title}</h3>
      {children}
    </section>
  );
}

export default function DashboardPage() {
  const { address, isConnecting, isDisconnected } = useAccount();
  const [isTokenBalancesCollapsed, setIsTokenBalancesCollapsed] =
    useState(false);
  const [sortKey, setSortKey] = useState<"projectId" | "balance">("projectId");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [isProblemsSectionCollapsed, setIsProblemsSectionCollapsed] =
    useState(true);
  const [isSolutionsSectionCollapsed, setIsSolutionsSectionCollapsed] =
    useState(true);
  const [isProjectsSectionCollapsed, setIsProjectsSectionCollapsed] =
    useState(true);
  const [
    isManagementOffersSectionCollapsed,
    setIsManagementOffersSectionCollapsed,
  ] = useState(true);
  const [isTasksSectionCollapsed, setIsTasksSectionCollapsed] = useState(true);
  const [isTaskOffersSectionCollapsed, setIsTaskOffersSectionCollapsed] =
    useState(true);

  function toggleTokenBalancesSection() {
    setIsTokenBalancesCollapsed((prevState) => !prevState);
  }
  function toggleProblemsSection() {
    setIsProblemsSectionCollapsed((prevState) => !prevState);
  }
  function toggleSolutionsSection() {
    setIsSolutionsSectionCollapsed((prevState) => !prevState);
  }
  function toggleProjectsSection() {
    setIsProjectsSectionCollapsed((prevState) => !prevState);
  }
  function toggleManagementOffersSection() {
    setIsManagementOffersSectionCollapsed((prevState) => !prevState);
  }
  function toggleTasksSection() {
    setIsTasksSectionCollapsed((prevState) => !prevState);
  }
  function toggleTaskOffersSection() {
    setIsTaskOffersSectionCollapsed((prevState) => !prevState);
  }

  function getAddressDisplay(address: string | undefined) {
    if (!address) {
      return "No address";
    }
    return `${address.substr(0, 6)}...${address.substr(address.length - 4)}`;
  }

  const {
    loading,
    error: subgraphQueryError,
    data,
  } = useQuery(GET_Dashboard_PAGE, {
    variables: { id: address },
    pollInterval: 500,
  });

  function handleSort(key: "projectId" | "balance") {
    if (sortKey === key) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  }

  const sortedBalances = Array.isArray(data?.tokenBalances)
    ? [...data.tokenBalances].sort((a, b) => {
        if (sortKey === "projectId") {
          return sortDirection === "asc"
            ? a.projectId - b.projectId
            : b.projectId - a.projectId;
        } else {
          return sortDirection === "asc"
            ? a.balance - b.balance
            : b.balance - a.balance;
        }
      })
    : [];

  // if (loading) {
  //   return <p>Loading...</p>;
  // }

  // if (subgraphQueryError) {
  //   return <p>Error: {subgraphQueryError.message}</p>;
  // }

  return (
    <div className="overflow-x-hidden overflow-y-scroll h-screen">
      <Navbar />
      <section className="section-padding flex flex-col items-center  bg-democracy-beige dark:bg-neutral-gray p-6 rounded-md border-b-4 border-tech-blue">
        <h1 className="title text-center">Welcome to your Dashboard</h1>
        <h2 className="subtitle text-center my-4">
          The Dashboard is where you can see your token balance and all the
          problems, solutions, projects, management offers and tasks you are
          involved in.
        </h2>
      </section>

      {data?.tokenBalances !== undefined && data.tokenBalances.length !== 0 && (
        <Section title="Your Token Balances">
          <button className="btn-primary" onClick={toggleTokenBalancesSection}>
            {isTokenBalancesCollapsed
              ? "Show Token Balances"
              : "Hide Token Balances"}
          </button>

          {!isTokenBalancesCollapsed && (
            <table className="w-full text-left bg-democracy-beige dark:bg-neutral-gray rounded-md overflow-hidden">
              <thead>
                <tr className=" hover:shadow-xl bg-gradient-to-r from-tech-blue to-future-neon">
                  <th
                    className="p-4 cursor-pointer"
                    onClick={() => handleSort("projectId")}
                  >
                    Project Id
                    {sortKey === "projectId" &&
                      (sortDirection === "asc" ? "▲" : "▼")}
                  </th>
                  <th
                    className="p-4 cursor-pointer"
                    onClick={() => handleSort("balance")}
                  >
                    Balance
                    {sortKey === "balance" &&
                      (sortDirection === "asc" ? "▲" : "▼")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedBalances.map((tokenBalance: TokenBalance) => (
                  <tr
                    key={tokenBalance.projectId.toString()}
                    className="border-t"
                  >
                    <td className="p-4">
                      {Number(tokenBalance.projectId) === 0
                        ? "spiral DAO"
                        : tokenBalance.projectId.toString()}
                    </td>

                    <td className="p-4">
                      {tokenBalance.balance.toString()} tokens
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Section>
      )}

      {/* {data?.tokenBalances !== undefined && data.tokenBalances.length !== 0 && (
        <Section title="Your Token Balances">
          <table className="w-full text-left bg-democracy-beige dark:bg-neutral-gray rounded-md overflow-hidden">
            <thead>
              <tr className=" hover:shadow-xl bg-gradient-to-r from-tech-blue to-future-neon">
                <th
                  className="p-4 cursor-pointer"
                  onClick={() => handleSort("projectId")}
                >
                  Project Id
                  {sortKey === "projectId" &&
                    (sortDirection === "asc" ? "▲" : "▼")}
                </th>
                <th
                  className="p-4 cursor-pointer"
                  onClick={() => handleSort("balance")}
                >
                  Balance
                  {sortKey === "balance" &&
                    (sortDirection === "asc" ? "▲" : "▼")}
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedBalances.map((tokenBalance: TokenBalance) => (
                <tr
                  key={tokenBalance.projectId.toString()}
                  className="border-t"
                >
                  <td className="p-4">{tokenBalance.projectId.toString()}</td>
                  <td className="p-4">{tokenBalance.balance.toString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Section>
      )} */}

      {Array.isArray(data?.activeProblems) &&
        data?.activeProblems.length !== 0 && (
          <Section title="Your Problems">
            <button className="btn-primary" onClick={toggleProblemsSection}>
              {isProblemsSectionCollapsed ? "Show Problems" : "Hide Problems"}
            </button>

            {!isProblemsSectionCollapsed && (
              <>
                {data?.activeProblems.map((problem: ActiveProblemType) => {
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
                      userPreviousRating={0}
                      projectId={projectId}
                    />
                  );
                })}
              </>
            )}
          </Section>
        )}

      {/* {Array.isArray(data?.activeProblems) &&
        data?.activeProblems.length !== 0 &&
        data?.activeProblems.some(
          (problem: ActiveProblemType) =>
            problem.isOpenForRating || problem.isOpenForNewSolutions
        ) && (
          <Section title="Active Problems">
            {data?.activeProblems.map((problem: ActiveProblemType) => (
              <ProblemCard
                key={problem.problemId.toString()}
                {...problem}
                solutionCount={problem.solutions.length}
                userAddress={address}
                userPreviousRating={0}
              />
            ))}
          </Section>
        )} */}

      {Array.isArray(data?.activeSolutions) &&
        data?.activeSolutions.length !== 0 && (
          // data?.activeSolutions.some(
          //   (solution: ActiveSolutionType) => solution.isOpenForRating
          // ) &&
          <Section title="Your Solutions">
            <button className="btn-primary" onClick={toggleSolutionsSection}>
              {isSolutionsSectionCollapsed
                ? "Show Solutions"
                : "Hide Solutions"}
            </button>
            {!isSolutionsSectionCollapsed && (
              <>
                {data?.activeSolutions.map((solution: ActiveSolutionType) => (
                  <SolutionCard
                    key={solution.solutionId.toString()}
                    {...solution}
                    userAddress={address}
                    userPreviousRating={0}
                  />
                ))}
              </>
            )}
          </Section>
        )}

      {data?.projects !== undefined && data?.projects.length !== 0 && (
        <Section title="Your Projects">
          <button className="btn-primary" onClick={toggleProjectsSection}>
            {isProjectsSectionCollapsed ? "Show Projects" : "Hide Projects"}
          </button>

          {!isProjectsSectionCollapsed && (
            <>
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
            </>
          )}
        </Section>
      )}

      {/* check id activeManagementOffers not undefined, the length not 0, add: and atleast 1 of the offers active (managementOffer.isActive) */}
      {data?.activeManagementOffers !== undefined &&
        data?.activeManagementOffers.length !== 0 &&
        data?.activeManagementOffers.some(
          (managementOffer: ActiveManagementOfferType) =>
            managementOffer.isActive
        ) && (
          <Section title="Your Management Offers">
            <button
              className="btn-primary"
              onClick={toggleManagementOffersSection}
            >
              {isManagementOffersSectionCollapsed
                ? "Show Management Offers"
                : "Hide Management Offers"}
            </button>

            {!isManagementOffersSectionCollapsed && (
              <>
                {data?.activeManagementOffers.map(
                  (managementOffer: ActiveManagementOfferType) => (
                    <ManagementOfferCard
                      key={managementOffer.offerId.toString()}
                      {...managementOffer}
                      userAddress={address}
                      userPreviousRating={0}
                    />
                  )
                )}
              </>
            )}
          </Section>
        )}

      {data?.tasks !== undefined && data?.tasks.length !== 0 && (
        <Section title="Your Tasks">
          <button className="btn-primary" onClick={toggleTasksSection}>
            {isTasksSectionCollapsed ? "Show Tasks" : "Hide Tasks"}
          </button>

          {!isTasksSectionCollapsed && (
            <>
              {data?.tasks.map((task: Task) => {
                let offersCount = task.taskOffers.length;
                let areProposed = false;
                if (address) {
                  areProposed = task.taskOffers.some(
                    (offer) =>
                      offer.offeror.toLowerCase() === address.toLowerCase()
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
            </>
          )}
        </Section>
      )}

      {data?.taskOffers !== undefined && data?.taskOffers.length !== 0 && (
        <Section title="Proposed Task Offers">
          <button className="btn-primary" onClick={toggleTaskOffersSection}>
            {isTaskOffersSectionCollapsed
              ? "Show Task Offers"
              : "Hide Task Offers"}
          </button>

          {!isTaskOffersSectionCollapsed && (
            <>
              {data?.taskOffers.map((taskOffer: ActiveTaskOffer) => (
                <TaskOfferCard
                  key={taskOffer.offerId.toString()}
                  {...taskOffer}
                  userAddress={address}
                  userPreviousRating={0}
                />
              ))}
            </>
          )}
        </Section>
      )}
      <Footer />
    </div>
  );
}

//   return (
//     <div>
//       <div className="overflow-x-hidden overflow-y-scroll h-screen">
//         <Navbar />

//         <div>
//           <div>
// <section className="section-padding flex flex-col items-center  bg-democracy-beige dark:bg-neutral-gray p-6 rounded-md border-b-4 border-tech-blue">
//   <h1 className="title text-center">
//     Welcome to your Dashboard
//   </h1>
//   <h2 className="subtitle text-center my-4">
//     The Dashboard is where you can see your token balance and
//     all the problems, solutions, projects, management offers and
//     tasks you are involved in.
//   </h2>
// </section>
//           </div>

//           {/* <section className="flex flex-col justify-center items-center">
//             <section className="flex flex-wrap flex-col md:flex-row md:justify-between items-center bg-democracy-beige dark:bg-neutral-gray p-2 md:p-4 rounded-md"></section>
//           </section> */}
//           {/* a section for a table tokenBalances of the user: projectId and balance */}
//           <section className="section-padding flex flex-row items-center gap-5">
//             <h3 className="text-2xl font-bold">Your Token Balances</h3>
//             {data?.tokenBalances.map((tokenBalance: TokenBalance) => (
//               <div
//                 key={tokenBalance.projectId.toString()}
//                 className="flex flex-col items-center justify-center bg-democracy-beige dark:bg-neutral-gray p-2 md:p-4 rounded-md"
//               >
// <h3 className="text-2xl font-bold">
//   Project Id: {tokenBalance.projectId.toString()}
// </h3>
// <h3 className="text-2xl font-bold">
//   Balance: {tokenBalance.balance.toString()}
// </h3>
//               </div>
//             ))}
//           </section>
//           <section className="section-padding flex flex-row items-center gap-5">
//             {data?.activeProblems.map((problem: ActiveProblemType) => (
// <ProblemCard
//   key={problem.problemId.toString()}
//   {...problem}
//   solutionCount={problem.solutions.length}
//   userAddress={address}
//   userPreviousRating={0}
// />
//             ))}
//           </section>
//           <section className="section-padding flex flex-row items-center gap-5">
//             {data?.activeSolutions.map((solution: ActiveSolutionType) => (
// <SolutionCard
//   key={solution.solutionId.toString()}
//   {...solution}
//   userAddress={address}
//   userPreviousRating={0}
// />
//             ))}
//           </section>
//           <section className="section-padding flex flex-row items-center gap-5">
// {data?.projects.map((project: ProjectType) => {
//   if (project.projectId != BigInt(0)) {
//     let managementOffersCount = project.managementOffers.length;
//     let areProposed = false;
//     if (address) {
//       areProposed = project.managementOffers.some(
//         (offer) =>
//           offer.proposer.toLowerCase() === address.toLowerCase()
//       );
//     }
//     let openTasksCount = project.tasks.filter(
//       (task) => task.status === "OPEN"
//     ).length;
//     return (
//       // console.log("project.projectId", project.projectId),
//       <ProjectCard
//         key={project.projectId.toString()}
//         projectId={project.projectId}
//         solutionName={project.solution?.name}
//         problemName={project.solution?.problem.name}
//         managementOffersCount={managementOffersCount}
//         isOpenForManagementProposals={
//           project.isOpenForManagementProposals
//         }
//         tasksCount={project.tasks.length}
//         projectManager={project.projectManager}
//         areProposed={areProposed}
//         openTasksCount={openTasksCount}
//         userAddress={address}
//       />
//     );
//   }
// })}
//           </section>
//           <section className="section-padding flex flex-row items-center gap-5">
//             {data?.activeManagementOffers.length !== 0 && (
//               <h3 className="text-2xl font-bold">Your Management Offers</h3>
//             )}
//             {data?.activeManagementOffers.map(
//               (managementOffer: ActiveManagementOfferType) => (
//                 <ManagementOfferCard
//                   key={managementOffer.offerId.toString()}
//                   {...managementOffer}
//                   userAddress={address}
//                   projectId={managementOffer.projectId}
//                   userPreviousRating={0}
//                 />
//               )
//             )}
//           </section>
//           <section className="section-padding flex flex-row items-center gap-5">
//             {data?.tasks.length !== 0 && (
//               <h3 className="text-2xl font-bold">Your Tasks</h3>
//             )}
//             {data?.tasks.map((task: Task) => {
//               let offersCount = task.taskOffers.length;
//               let areProposed = false;
//               if (address) {
//                 areProposed = task.taskOffers.some(
//                   (offer) =>
//                     offer.offeror.toLowerCase() === address.toLowerCase()
//                 );
//               }
//               return (
//                 <TaskCard
//                   key={task.taskId.toString()}
//                   {...task}
//                   offersCount={offersCount}
//                   userPreviousRating={0}
//                   areProposed={areProposed}
//                 />
//               );
//             })}
//           </section>
//           <section className="section-padding flex flex-col items-center gap-5">
//             {data?.taskOffers.length !== 0 && (
//               <h3 className="text-2xl font-bold">Proposed Task Offers</h3>
//             )}
//             {data?.taskOffers.map((taskOffer: ActiveTaskOffer) => (
//               <TaskOfferCard
//                 key={taskOffer.offerId.toString()}
//                 {...taskOffer}
//                 userAddress={address}
//                 userPreviousRating={0}
//               />
//             ))}
//           </section>
//         </div>
//       </div>
//     </div>
//   );
// }
