"use client";
// Wagmi write
import { useContractWrite, useAccount } from "wagmi";
import addresses from "../../constants/networkMapping.json";
// Toast notification
import createNotification from "../../createNotification.js";
//all the abi
import problemsabi from "../../constants/Problems.json";
import solutionsabi from "../../constants/Solutions.json";
import projectsabi from "../../constants/Projects.json";
import tasksabi from "../../constants/Tasks.json";

import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar.jsx";
import { CustomError } from "@/common.types";

export default function ManagementOffers() {
  const [problemId, setProblemId] = useState("");
  const [solutionId, setsolutionId] = useState("");
  const [name, setName] = useState("");
  const [projectId, setProjectId] = useState("");
  const [taskId, setTaskId] = useState("");

  const { write: writeMeetsRatingCriteria } = useContractWrite({
    address: addresses[4002].Problems[0] as `0x${string}`,
    abi: problemsabi,
    functionName: "meetsRatingCriteria",
    args: [problemId],
    onError(error: CustomError) {
      createNotification(
        error.metaMessages ? error.metaMessages[0] : "An error occurred",
        "error"
      );
    },
    onSuccess(data) {
      createNotification("Dont Forget to Check", "success");
    },
  });

  const { write: writeProposeSolution } = useContractWrite({
    address: addresses[4002].Solutions[0] as `0x${string}`,
    abi: solutionsabi,
    functionName: "proposeSolution",
    args: [problemId, name],
    onError(error: CustomError) {
      createNotification(
        error.metaMessages ? error.metaMessages[0] : "An error occurred",
        "error"
      );
    },
    onSuccess(data) {
      createNotification("Solution Proposed", "success");
    },
  });

  const { write: writeCanBecomeProject } = useContractWrite({
    address: addresses[4002].Solutions[0] as `0x${string}`,
    abi: solutionsabi,
    functionName: "canBecomeProject",
    args: [solutionId],
    onError(error: CustomError) {
      createNotification(
        error.metaMessages ? error.metaMessages[0] : "An error occurred",
        "error"
      );
    },
    onSuccess(data) {
      createNotification("Dont Forget to Check", "success");
    },
  });

  const { write: writeProposeManagementOffer } = useContractWrite({
    address: addresses[4002].Projects[0] as `0x${string}`,
    abi: projectsabi,
    functionName: "proposeManagementOffer",
    args: [projectId],
    onError(error: CustomError) {
      createNotification(
        error.metaMessages ? error.metaMessages[0] : "An error occurred",
        "error"
      );
    },
    onSuccess(data) {
      createNotification("Management Offer Proposed", "success");
    },
  });

  const { write: writeAssignProjectManager } = useContractWrite({
    address: addresses[4002].Projects[0] as `0x${string}`,
    abi: projectsabi,
    functionName: "assignProjectManager",
    args: [projectId],
    onError(error: CustomError) {
      createNotification(
        error.metaMessages ? error.metaMessages[0] : "An error occurred",
        "error"
      );
    },
    onSuccess(data) {
      createNotification("Dont Forget to Check", "success");
    },
  });

  const { write: writeAssignTask } = useContractWrite({
    address: addresses[4002].Tasks[0] as `0x${string}`,
    abi: tasksabi,
    functionName: "assignTask",
    args: [taskId],
    onError(error: CustomError) {
      createNotification(
        error.metaMessages ? error.metaMessages[0] : "An error occurred",
        "error"
      );
    },
    onSuccess(data) {
      createNotification("Dont Forget to Check", "success");
    },
  });

  const { write: writeVerifyTask } = useContractWrite({
    address: addresses[4002].Tasks[0] as `0x${string}`,
    abi: tasksabi,
    functionName: "verifyTask",
    args: [taskId],
    onError(error: CustomError) {
      createNotification(
        error.metaMessages ? error.metaMessages[0] : "An error occurred",
        "error"
      );
    },
    onSuccess(data) {
      createNotification("Dont Forget to Check", "success");
    },
  });

  return (
    <div>
      <div className="overflow-x-hidden overflow-y-scroll h-screen">
        <Navbar />

        <section className="section-padding flex flex-col items-center bg-democracy-beige dark:bg-neutral-gray p-6 rounded-md border-b-4 border-tech-blue">
          <h1 className="title text-center mb-1">Fuuun</h1>
        </section>

        <section className="bottom-submit">
          <h2 className="bottom-submit-text">Problems</h2>
          <input
            type="text"
            placeholder="Problem ID"
            value={problemId}
            onChange={(e) => setProblemId(e.target.value)}
          />
          <button
            className="btn-primary"
            onClick={() => writeMeetsRatingCriteria()}
          >
            Meets Rating Criteria
          </button>
        </section>

        <section className="bottom-submit">
          <h2 className="bottom-submit-text">Solutions</h2>
          <input
            type="text"
            placeholder="Problem ID"
            value={problemId}
            onChange={(e) => setProblemId(e.target.value)}
          />
          <input
            type="text"
            placeholder="Solution ID"
            value={solutionId}
            onChange={(e) => setsolutionId(e.target.value)}
          />
          <input
            type="text"
            placeholder="Solution Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button
            className="btn-primary"
            onClick={() => writeProposeSolution()}
          >
            Propose Solution
          </button>
          <button
            className="btn-primary"
            onClick={() => writeCanBecomeProject()}
          >
            Can Become Project
          </button>
        </section>

        <section className="bottom-submit">
          <h2 className="bottom-submit-text">Projects</h2>
          <input
            type="text"
            placeholder="Project ID"
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
          />
          <button
            className="btn-primary"
            onClick={() => writeProposeManagementOffer()}
          >
            Propose Management Offer
          </button>

          <input
            type="text"
            placeholder="Project ID"
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
          />
          <button
            className="btn-primary"
            onClick={() => writeAssignProjectManager()}
          >
            Assign Project Manager
          </button>
        </section>

        <section className="bottom-submit">
          <h2 className="bottom-submit-text">Tasks</h2>
          <input
            type="text"
            placeholder="Task ID"
            value={taskId}
            onChange={(e) => setTaskId(e.target.value)}
          />
          <button className="btn-primary" onClick={() => writeAssignTask()}>
            Assign Task
          </button>

          <button className="btn-primary" onClick={() => writeVerifyTask()}>
            Verify Task
          </button>
        </section>
      </div>
    </div>
  );
}
