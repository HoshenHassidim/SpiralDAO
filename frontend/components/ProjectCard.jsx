import { useState } from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai"; // You might need different icons
import { useContractWrite, useAccount } from "wagmi";
import { useRouter } from "next/navigation";
import createNotification from "../createNotification.js";
import abi from "../constants/Projects.json";
import addresses from "../constants/networkMapping.json";

export default function Project({
  projectId,
  problemName,
  solutionName,
  status,
  managerOffersCount,
  isLookingForManager,
  tasksCount,
  managerAddress,
  userAddress,
}) {
  const { address } = useAccount();
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

  return (
    <div className="cursor-pointer bg-neutral-gray flex flex-col justify-between gap-5 rounded-lg p-6 px-8 py-4 max-w-sm w-5/6 text-white transition-transform transform-gpu hover:shadow-xl hover:bg-gradient-to-r hover:from-tech-blue hover:to-future-neon">
      <span className="self-end">{`Project ID: ${projectId}`}</span>
      <p className="body-text">{status}</p>
      <h3 className="title">{`Problem: ${problemName}`}</h3>
      <h4 className="subtitle">{`Solution: ${solutionName}`}</h4>

      {isLookingForManager && status === "Initiation" && (
        <div>
          <p className="small-text">{`${managerOffersCount} offers to manage`}</p>
          <button
            className="btn-primary mt-2"
            onClick={() => router.push(`/offers/${projectId}`)}
          >
            View Offers
          </button>
          <button
            className="btn-secondary mt-2"
            onClick={() => router.push(`/offer/${projectId}`)}
          >
            Offer to Manage
          </button>
        </div>
      )}

      {status === "Ongoing" && (
        <div>
          <p className="small-text">{`Manager: ${
            userAddress?.toLowerCase() === managerAddress
              ? "Mine"
              : managerAddress
          }`}</p>
          <p className="small-text">{`${tasksCount} open tasks`}</p>
          <button
            className="btn-primary mt-2"
            onClick={() => router.push(`/project/${projectId}`)}
          >
            More Details
          </button>
        </div>
      )}

      {userAddress?.toLowerCase() === managerAddress && (
        <button
          className="btn-tertiary mt-2"
          onClick={() => router.push(`/manage/${projectId}`)}
        >
          Manage Project
        </button>
      )}
    </div>
  );
}
