"use client";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";

import TaskOfferCard from "../../../components/Cards/TaskOfferCard";
// import SubmitTaskOfferModal from "@/components/SubmitTaskOfferModal";
// import TaskOffersFilters from "@/components/TaskOffersFiltrer";

// Wagmi write
import { useContractWrite, useAccount } from "wagmi";
import addresses from "../../../constants/networkMapping.json";
// Graph reading
import GET_TaskOffers_PAGE from "@/constants/subgraphQueries/subgraphQueryGetTaskOffers";
import { useQuery } from "@apollo/client";
// Toast notification
import createNotification from "../../../createNotification.js";
import abi from "../../../constants/Tasks.json";
import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "../../../components/Navbar.jsx";
import {
  ActiveTaskOffer,
  CustomError,
  Task,
  UserTaskOfferRating,
} from "@/common.types.js";
import { Noto_Sans_Telugu } from "next/font/google";

export default function TaskOffers({ params }: { params: { slug: string } }) {
  const [taskOffer, setTaskOffer] = useState();
  const { register, handleSubmit } = useForm();

  const { address, isConnecting, isDisconnected } = useAccount();
  const [filterEngage, setFilterEngage] = useState("everything");
  const [sortOption, setsortOption] = useState("Newest");
  const [filterRated, setFilterRated] = useState("All");
  const [isClient, setIsClient] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [showTaskOfferModal, setShowTaskOfferModal] = useState(false);

  const router = useRouter();

  const { write } = useContractWrite({
    address: addresses[4002].Tasks[0] as `0x${string}`,
    abi: abi,
    functionName: "proposeTaskOffer",
    args: [params.slug],
    onError(error: CustomError) {
      createNotification(
        error.metaMessages ? error.metaMessages[0] : "An error occurred",
        "error"
      );
    },
    onSuccess(data) {
      createNotification("Task Offer Proposed", "success");
    },
  });

  // Fetching the task from id
  const { loading, error, data } = useQuery(GET_TaskOffers_PAGE, {
    variables: { id: params.slug },
    pollInterval: 500,
  });
  console.log(data);

  function getUserRatingForTaskOffer(taskOfferId: BigInt) {
    if (data && data.userTaskOfferRatings) {
      const userRating = data.userTaskOfferRatings.find(
        (rating: UserTaskOfferRating) =>
          rating.offerId === taskOfferId &&
          rating.rater.toLowerCase() === address?.toLowerCase()
      );
      return userRating ? userRating.rating : 0;
    }
    return 0;
  }

  const filteredTaskOffers =
    data && data.tasks[0].taskOffers
      ? data.tasks[0].taskOffers.filter((taskOffer: ActiveTaskOffer) => {
          console.log("taskOffer: ", taskOffer);
          // let meetsStatusCondition = false;
          let meetsCreatorCondition = true;
          let meetsRatingCondition = true;

          // // Handle Status filter
          // switch (filterStatus) {
          //   case "Awaiting Ranking":
          //     meetsStatusCondition =
          //       taskOffer.isOpenForRating && taskOffer.isOpenForTaskProposals;
          //     break;
          //   case "In TaskOffer Phase":
          //     meetsStatusCondition =
          //       taskOffer.isOpenForTaskProposals && !taskOffer.isOpenForRating;
          //     break;
          //   default: // For "All TaskOffers"
          //     meetsStatusCondition = true;
          // }

          if (address) {
            // Handle Creator filter
            switch (filterEngage) {
              case "my taskOffers":
                meetsCreatorCondition =
                  taskOffer.offeror.toLowerCase() === address?.toLowerCase();
                break;
              case "not my taskOffer":
                meetsCreatorCondition = address
                  ? taskOffer.offeror.toLowerCase() !== address.toLowerCase()
                  : true;
                break;
              default: // For "All TaskOffers"
                meetsCreatorCondition = true;
            }
            switch (filterRated) {
              case "Rated":
                meetsRatingCondition =
                  getUserRatingForTaskOffer(taskOffer.offerId) > 0;
                break;
              case "Not Rated":
                meetsRatingCondition =
                  getUserRatingForTaskOffer(taskOffer.offerId) === 0;
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

  // Sorting logic based on the taskOfferId (since sorting by date means sorting by taskOffer ID on the backend)
  if (sortOption === "Newest") {
    filteredTaskOffers.sort((a: ActiveTaskOffer, b: ActiveTaskOffer) => {
      return b.offerId.valueOf() - a.offerId.valueOf();
    });
  } else {
    filteredTaskOffers.sort((a: ActiveTaskOffer, b: ActiveTaskOffer) => {
      return a.offerId.valueOf() - b.offerId.valueOf();
    });
  }

  console.log(filteredTaskOffers);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div>
      <div className="overflow-x-hidden overflow-y-scroll h-screen">
        <Navbar />

        {/* <Link
          href="/engage"
          className="mt-5 text-white opacity-80 font-semibold"
        >
          <button className="btn-primary top-[6rem] left-2 fixed ">
            Back to Engage
          </button>
        </Link> */}
        {/* <Link
          href="/engage"
          className="w-full mt-5 text-white opacity-80 font-semibold"
        >
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Back to Engage
          </button>
        </Link> */}

        {/* // Presentation of the task: */}
        <section className="section-padding flex flex-col items-center bg-democracy-beige dark:bg-neutral-gray p-6 rounded-md border-b-4 border-tech-blue">
          <h1 className="title text-center mb-1">Task Challenge</h1>
          <h2 className="text-3xl font-semibold">
            {/* if there no task or it not open looking for performer give masege */}
            {data?.tasks.length == 0
              ? "Sorry, this task does not exist"
              : !error && data && data.tasks.length > 0 && data.tasks[0].name}
          </h2>
          {data?.tasks && (
            <h2 className="text-3xl font-semibold">
              {/* if there no task or it not looking for performer give masege */}
              {data.tasks[0].status != "OPEN"
                ? "Sorry, this task is not looking for a performer"
                : !error &&
                  data && (
                    <>
                      {data.tasks[0] && <span>{data.tasks[0].taskName}</span>}
                      <span> Task Offers</span>
                    </>
                  )}
            </h2>
          )}
          <h3 className="text-lg text-tech-blue mt-2">ID: {params.slug}</h3>
          {/* Display the creator of the task if available */}
          {/* <p className="mt-1 text-sm">Created by: {taskCreator}</p> */}
        </section>
        {/* <section className="section-padding flex flex-col items-center">
          <h1 className="title text-center">Dive Deep into This Challenge </h1>
          <h2 className="subtitle text-center my-4">
            Explore the community's proposed taskOffers and share your unique
            perspective or taskOffer to this task.
          </h2>

          task ID:
          {params.slug}
          <h2 className="text-lg">
            {data?.tasks.length == 0
              ? "Sorry, this task does not exist"
              : !error &&
                data &&
                data.tasks.length > 0 &&
                data.tasks[0].name}
          </h2>
        </section> */}
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
            {/* <TaskOffersFilters
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
          {filteredTaskOffers?.length !== 0 && (
            <h3 className="text-2xl font-bold">Proposed Task Offers</h3>
          )}
          {filteredTaskOffers?.map((taskOffer: ActiveTaskOffer) => (
            <TaskOfferCard
              key={taskOffer.offerId.toString()}
              {...taskOffer}
              userAddress={address}
              taskId={null}
              userPreviousRating={getUserRatingForTaskOffer(taskOffer.offerId)}
            />
          ))}
        </section>
        <section className="bottom-submit">
          <h2 className="bottom-submit-text">
            Have a unique approach to address this challenge?
          </h2>
          <button className="btn-primary" onClick={() => write()}>
            Propose Your TaskOffer
          </button>
        </section>
        {/* <SubmitTaskOfferModal
          isOpen={showTaskOfferModal}
          onClose={() => setShowTaskOfferModal(false)}
          taskOfferId={params.slug}
        /> */}
        <div className="floating-submit">
          <div className="floating-submit-text">
            <p className="font-secondary text-xs">See room for innovation?</p>
            <p className="font-secondary text-xs">
              Share your insights and taskOffers with the community.
            </p>
          </div>
          <button className="btn-primary" onClick={() => write()}>
            Submit a TaskOffer
          </button>
        </div>
      </div>
    </div>
  );
}
