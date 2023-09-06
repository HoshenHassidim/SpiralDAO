"use client";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";

import TaskCard from "../../../components/TaskCard";
import SubmitTaskModal from "@/components/SubmitTaskModal";
// import TasksFilters from "@/components/TasksFiltrer";

// Wagmi write
import { useContractWrite, useAccount } from "wagmi";
import addresses from "../../../constants/networkMapping.json";
// Graph reading
import GET_PROJECT_TASKS_PAGE from "@/constants/subgraphQueries/subgraphQueryGetProjectForManagerPage";
import { useQuery } from "@apollo/client";
// Toast notification
import createNotification from "../../../createNotification.js";
import abi from "../../../constants/Tasks.json";
import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "../../../components/Navbar.jsx";
import {
  Task,
  CustomError,
  ProjectType,
  UserTaskCompletionRating,
} from "@/common.types.js";

export default function Tasks({ params }: { params: { slug: string } }) {
  const [task, setTask] = useState();
  const { register, handleSubmit } = useForm();

  const { address, isConnecting, isDisconnected } = useAccount();
  const [filterEngage, setFilterEngage] = useState("everything");
  const [sortOption, setsortOption] = useState("Newest");
  const [filterRated, setFilterRated] = useState("All");
  const [isClient, setIsClient] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);

  const router = useRouter();

  const { write } = useContractWrite({
    address: addresses[4002].Projects[0] as `0x${string}`,
    abi: abi,
    functionName: "proposeTask",
    args: [params.slug],
    onError(error: CustomError) {
      createNotification(
        error.metaMessages ? error.metaMessages[0] : "An error occurred",
        "error"
      );
    },
    onSuccess(data) {
      createNotification("Task added", "success");
    },
  });

  // Fetching the project from id
  const { loading, error, data } = useQuery(GET_PROJECT_TASKS_PAGE, {
    variables: { id: params.slug },
    pollInterval: 500,
  });
  // console.log(data);

  function getUserRatingForTaskCompletion(taskId: BigInt) {
    if (data && data.userTaskCompletionRatings) {
      const userRating = data.userTaskCompletionRatings.find(
        (rating: UserTaskCompletionRating) =>
          rating.taskId === taskId &&
          rating.rater.toLowerCase() === address?.toLowerCase()
      );
      return userRating ? userRating.rating : 0;
    }
    return 0;
  }

  //function to check if the user is the manager of the project
  function isManager() {
    if (data && data.projects[0].projectManager) {
      return (
        data.projects[0].projectManager.toLowerCase() === address?.toLowerCase()
      );
    }
    return false;
  }
  const filteredTasks =
    data && data.projects[0].tasks
      ? data.projects[0].tasks.filter((task: Task) => {
          // console.log("task: ", task);
          // let meetsStatusCondition = false;
          let meetsCreatorCondition = true;
          let meetsRatingCondition = true;

          // // Handle Status filter
          // switch (filterStatus) {
          //   case "Awaiting Ranking":
          //     meetsStatusCondition =
          //       task.isOpenForRating && task.isOpenForNewTasks;
          //     break;
          //   case "In Task Phase":
          //     meetsStatusCondition =
          //       task.isOpenForNewTasks && !task.isOpenForRating;
          //     break;
          //   default: // For "All Tasks"
          //     meetsStatusCondition = true;
          // }

          if (address) {
            switch (filterEngage) {
              case "my tasks":
                meetsCreatorCondition =
                  task.performer.toLowerCase() === address?.toLowerCase();
                break;
              case "not my task":
                meetsCreatorCondition = address
                  ? task.performer.toLowerCase() !== address.toLowerCase()
                  : true;
                break;
              default:
                meetsCreatorCondition = true;
            }
            switch (filterRated) {
              case "Rated":
                meetsRatingCondition =
                  getUserRatingForTaskCompletion(task.taskId) > 0;
                break;
              case "Not Rated":
                meetsRatingCondition =
                  getUserRatingForTaskCompletion(task.taskId) === 0;
                break;
              default: // For "All"
                meetsRatingCondition = true;
            }
          }

          return (
            // meetsStatusCondition &&
            meetsCreatorCondition && meetsRatingCondition
          );
        })
      : [];

  // Sorting logic based on the taskId (since sorting by date means sorting by task ID on the backend)
  if (sortOption === "Newest") {
    filteredTasks.sort((a: Task, b: Task) => {
      return b.taskId.valueOf() - a.taskId.valueOf();
    });
  } else {
    filteredTasks.sort((a: Task, b: Task) => {
      return a.taskId.valueOf() - b.taskId.valueOf();
    });
  }

  // console.log(filteredTasks);
  // console.log(
  //   "isManager: ",
  //   isManager()
  // "address: ",
  // address,
  // "manager: ",
  // data?.projects[0].projectManager
  // );

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div>
      <div className="overflow-x-hidden overflow-y-scroll h-screen">
        <Navbar />

        {/* // Presentation of the project: */}
        {isManager() ? (
          <div>
            <section className="section-padding flex flex-col items-center bg-democracy-beige dark:bg-neutral-gray p-6 rounded-md border-b-4 border-tech-blue">
              <h1 className="title text-center mb-1">
                Manage The Project To Success
              </h1>
              <h2 className="text-3xl font-semibold">
                {data?.projects.length == 0
                  ? "Sorry, this project does not exist"
                  : !error &&
                    data &&
                    data.projects.length > 0 &&
                    data.projects[0].name}
              </h2>
              <h3 className="text-lg text-tech-blue mt-2">ID: {params.slug}</h3>
              {/* Display the creator of the project if available */}
              {/* <p className="mt-1 text-sm">Created by: {projectCreator}</p> */}
            </section>

            <section className="bottom-submit">
              <h2 className="bottom-submit-text">
                Have a unique approach to address this challenge?
              </h2>
              <button
                className="btn-primary"
                onClick={() => setShowTaskModal(true)}
              >
                Propose Your Task
              </button>
            </section>
          </div>
        ) : (
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
            {/* Display the creator of the project if available */}
            {/* <p className="mt-1 text-sm">Created by: {projectCreator}</p> */}
          </section>
        )}
        <section className="flex flex-col justify-center items-center">
          <section className="flex flex-wrap flex-col md:flex-row md:justify-between items-center bg-democracy-beige dark:bg-neutral-gray p-2 md:p-4 rounded-md">
            {/* Button to toggle filter visibility on small screens */}
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="md:hidden mb-2"
            >
              {isFilterOpen ? "Hide Filters" : "Show Filters"}
            </button>

            {/* Hide filters on small screens when isFilterOpen is false, always show on larger screens */}
            {/* <TasksFilters
              filterEngage={filterEngage}
              setFilterEngage={setFilterEngage}
              filterRated={filterRated}
              setFilterRated={setFilterRated}
              sortOption={sortOption}
              setsortOption={setsortOption}
              isClient={isClient}
              address={address || null}
              className={isFilterOpen ? "" : "hidden md:flex"}
            /> */}
          </section>
        </section>
        <section className="section-padding flex flex-col items-center gap-5">
          {filteredTasks?.length !== 0 && (
            <h3 className="text-2xl font-bold">Proposed Tasks</h3>
          )}
          {filteredTasks?.map((task: Task) => {
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
                userPreviousRating={getUserRatingForTaskCompletion(task.taskId)}
                areProposed={areProposed}
              />
            );
          })}
        </section>
        <SubmitTaskModal
          isOpen={showTaskModal}
          onClose={() => setShowTaskModal(false)}
          projectId={params.slug}
        />
        {isManager() && (
          <div className="floating-submit">
            <div className="floating-submit-text">
              <p className="font-secondary text-xs">See room for innovation?</p>
              <p className="font-secondary text-xs">
                Share your insights and tasks with the community.
              </p>
            </div>
            <button
              className="btn-primary"
              onClick={() => setShowTaskModal(true)}
            >
              Submit a Task
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
