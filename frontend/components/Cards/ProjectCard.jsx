import { useState } from "react";
import { useContractWrite, useAccount } from "wagmi";
import { useRouter } from "next/navigation";
import createNotification from "../../createNotification.js";
import abi from "../../constants/Projects.json";
import addresses from "../../constants/networkMapping.json";

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
    <div className="card">
      <div className="flex justify-between items-start mb-4">
        <span className="text-democracy-beige text-xs">
          Project ID: {projectId}
        </span>
      </div>

      <h3 className="name text-xl sm:text-3xl font-semibold mb-2">
        Problem: {problemName}
      </h3>
      <h4 className="description mb-4 text-base sm:text-lg text-democracy-beige">
        Solution: {solutionName}
      </h4>

      {isOpenForManagementProposals ? (
        <div className="mb-4">
          <p className="small-text text-democracy-beige text-xs mb-2">
            {managementOffersCount} offers to manage
          </p>
          <div className="flex flex-col items-center justify-center">
            <button
              className="btn-primary mt-3"
              onClick={() => router.push(`/managementOffers/${projectId}`)}
            >
              View Offers
            </button>
            {areProposed === true ? (
              <p className="small-text text-democracy-beige text-xs mb-2">
                You have already offered to manage this project
              </p>
            ) : (
              <button
                className="btn-primary mt-3"
                onClick={() => {
                  if (userAddress) {
                    write();
                  } else {
                    createNotification("Please connect your wallet", "error");
                  }
                }}
              >
                Offer to Manage
              </button>
            )}
          </div>
        </div>
      ) : (
        <p className="text-xs font-bold mb-4 text-white">
          Manager:{" "}
          {userAddress?.toLowerCase() === projectManager
            ? "You"
            : projectManager.substr(0, 4) +
              "..." +
              projectManager.substr(projectManager.length - 4)}
        </p>
      )}

      {tasksCount != 0 && (
        <div className="mb-4">
          <p className="small-text text-democracy-beige text-xs mb-2">
            {tasksCount} tasks
          </p>
        </div>
      )}

      {openTasksCount != 0 && (
        <div className="mb-4">
          <p className="small-text text-democracy-beige text-xs mb-2">
            {openTasksCount} open tasks
          </p>
          <div className="flex items-center justify-center">
            {!isManager() && (
              <button
                className="btn-primary mt-3"
                onClick={() => router.push(`/projectTasks/${projectId}`)}
              >
                View Tasks
              </button>
            )}
          </div>
        </div>
      )}

      {isManager() && (
        <div className="mb-4">
          <div className="flex items-center justify-center">
            <button
              className="btn-primary mt-3"
              onClick={() => router.push(`/projectTasks/${projectId}`)}
            >
              Manage Project
            </button>
          </div>
        </div>
      )}
    </div>
  );

  // return (
  //   <div className="card">
  //     <span className="self-end">{`Project ID: ${projectId}`}</span>
  //     <h3 className="title">{`Problem: ${problemName}`}</h3>
  //     <h4 className="subtitle">{`Solution: ${solutionName}`}</h4>

  //     {isOpenForManagementProposals ? (
  //       <div>
  //         <p className="small-text">{`${managementOffersCount} offers to manage`}</p>
  //         <button
  //           className="btn-primary mt-2"
  //           onClick={() => router.push(`/managementOffers/${projectId}`)}
  //         >
  //           View Offers
  //         </button>
  //         {areProposed === true ? (
  //           <p className="small-text">{`You have already offered to manage this project`}</p>
  //         ) : (
  //           <button
  //             className="btn-primary mt-2"
  //             onClick={() => {
  //               if (userAddress) {
  //                 write();
  //               } else {
  //                 createNotification("Please connect your wallet", "error");
  //               }
  //             }}
  //           >
  //             Offer to Manage
  //           </button>
  //         )}
  //       </div>
  //     ) : (
  //       <p className="small-text">{`Manager: ${
  //         userAddress?.toLowerCase() === projectManager
  //           ? "You"
  //           : projectManager.substr(0, 4) +
  //             "..." +
  //             projectManager.substr(projectManager.length - 4)
  //       }
  //       `}</p>
  //     )}

  //     {tasksCount != 0 && (
  //       <div>
  //         <p className="small-text">{`${tasksCount} tasks`}</p>
  //         {/* <button
  //           className="btn-primary mt-2"
  //           onClick={() => router.push(`/tasks/${projectId}`)} // Adjust this path to correctly point to the tasks page.
  //         >
  //           View Open Tasks
  //         </button> */}
  //       </div>
  //     )}

  //     {openTasksCount != 0 && (
  //       <div>
  //         <p className="small-text">{`${openTasksCount} open tasks`}</p>
  //         {!isManager() && (
  //           <button
  //             className="btn-primary mt-2"
  //             onClick={() => router.push(`/projectTasks/${projectId}`)} // Adjust this path to correctly point to the tasks page.
  //           >
  //             View Tasks
  //           </button>
  //         )}
  //       </div>
  //     )}

  //     {isManager() && (
  //       <button
  //         className="btn-primary mt-2"
  //         onClick={() => router.push(`/projectTasks/${projectId}`)}
  //       >
  //         Manage Project
  //       </button>
  //     )}

  //     {/* <button
  //       className="btn-secondary mt-2"
  //       onClick={() => router.push(`/projectDetails/${projectId}`)} // Adjust this path to correctly point to the project details page.
  //     >
  //       More Details
  //     </button> */}
  //   </div>
  // );
}
