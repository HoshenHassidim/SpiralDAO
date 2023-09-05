import { useState } from "react";
import { useContractWrite, useAccount } from "wagmi";
import { useRouter } from "next/navigation";
import createNotification from "../createNotification.js";
import abi from "../constants/Projects.json";
import addresses from "../constants/networkMapping.json";

export default function ProjectCard({
  projectId,
  problemName,
  solutionName,
  managementOffersCount,
  isOpenForManagementProposals,
  tasksCount,
  projectManager,
  userAddress,
  areProposed,
  openTasksCount,
}) {
  // const { address } = useAccount();
  const router = useRouter();

  const { write } = useContractWrite({
    address: addresses[4002].Projects[0],
    abi: abi,
    functionName: "proposeManagementOffer",
    args: [projectId],
    onError(error) {
      createNotification(error.metaMessages[0], "error");
    },
    onSuccess(data) {
      createNotification("Management Offer Proposed", "success");
    },
  });
  // console.log(areProposed);

  //function to check if the user is the manager of the project
  function isManager() {
    if (projectManager) {
      return projectManager.toLowerCase() === userAddress?.toLowerCase();
    }
    return false;
  }

  return (
    <div className=" bg-neutral-gray flex flex-col justify-between gap-5 rounded-lg p-6 px-8 py-4 max-w-sm w-5/6 text-white transition-transform transform-gpu hover:shadow-xl hover:bg-gradient-to-r hover:from-tech-blue hover:to-future-neon">
      <span className="self-end">{`Project ID: ${projectId}`}</span>
      <h3 className="title">{`Problem: ${problemName}`}</h3>
      <h4 className="subtitle">{`Solution: ${solutionName}`}</h4>

      {isOpenForManagementProposals ? (
        <div>
          <p className="small-text">{`${managementOffersCount} offers to manage`}</p>
          <button
            className="btn-primary mt-2"
            onClick={() => router.push(`/managementOffers/${projectId}`)}
          >
            View Offers
          </button>
          {areProposed === true ? (
            <p className="small-text">{`You have already offered to manage this project`}</p>
          ) : (
            <button className="btn-primary mt-2" onClick={() => write()}>
              Offer to Manage
            </button>
          )}
        </div>
      ) : (
        <p className="small-text">{`Manager: ${
          userAddress?.toLowerCase() === projectManager
            ? "You"
            : projectManager.substr(0, 4) +
              "..." +
              projectManager.substr(projectManager.length - 4)
        }
        `}</p>
      )}

      {tasksCount != 0 && (
        <div>
          <p className="small-text">{`${tasksCount} tasks`}</p>
          {/* <button
            className="btn-primary mt-2"
            onClick={() => router.push(`/tasks/${projectId}`)} // Adjust this path to correctly point to the tasks page.
          >
            View Open Tasks
          </button> */}
        </div>
      )}

      {openTasksCount != 0 && (
        <div>
          <p className="small-text">{`${openTasksCount} open tasks`}</p>
          {!isManager() && (
            <button
              className="btn-primary mt-2"
              onClick={() => router.push(`/ProjectTasks/${projectId}`)} // Adjust this path to correctly point to the tasks page.
            >
              View Tasks
            </button>
          )}
        </div>
      )}

      {isManager() && (
        <button
          className="btn-primary mt-2"
          onClick={() => router.push(`/ProjectTasks/${projectId}`)}
        >
          Manage Project
        </button>
      )}

      {/* <button
        className="btn-secondary mt-2"
        onClick={() => router.push(`/projectDetails/${projectId}`)} // Adjust this path to correctly point to the project details page.
      >
        More Details
      </button> */}
    </div>
  );
}
