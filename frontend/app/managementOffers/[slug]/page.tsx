"use client";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";

import ManagementOfferCard from "../../../components/Cards/ManagementOfferCard";
// import SubmitManagementOfferModal from "@/components/SubmitManagementOfferModal";
// import ManagementOffersFilters from "@/components/ManagementOffersFiltrer";

// Wagmi write
import { useContractWrite, useAccount } from "wagmi";
import addresses from "../../../constants/networkMapping.json";
// Graph reading
import GET_ManagementOffers_PAGE from "@/constants/subgraphQueries/subgraphQueryGetManagementOffers";
import { useQuery } from "@apollo/client";
// Toast notification
import createNotification from "../../../createNotification.js";
import abi from "../../../constants/Projects.json";
import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "../../../components/Navbar.jsx";
import {
  ActiveManagementOfferType,
  CustomError,
  ProjectType,
  UserManagementOfferRating,
} from "@/common.types.js";

export default function ManagementOffers({
  params,
}: {
  params: { slug: string };
}) {
  const [managementOffer, setManagementOffer] = useState();
  const { register, handleSubmit } = useForm();

  const { address, isConnecting, isDisconnected } = useAccount();
  const [filterEngage, setFilterEngage] = useState("everything");
  const [sortOption, setsortOption] = useState("Newest");
  const [filterRated, setFilterRated] = useState("All");
  const [isClient, setIsClient] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [showManagementOfferModal, setShowManagementOfferModal] =
    useState(false);

  const router = useRouter();

  const { write } = useContractWrite({
    address: addresses[4002].Projects[0] as `0x${string}`,
    abi: abi,
    functionName: "proposeManagementOffer",
    args: [params.slug],
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

  // Fetching the project from id
  const { loading, error, data } = useQuery(GET_ManagementOffers_PAGE, {
    variables: { id: params.slug },
    pollInterval: 500,
  });
  console.log(data);

  function getUserRatingForManagementOffer(managementOfferId: BigInt) {
    if (data && data.userManagementOfferRatings) {
      const userRating = data.userManagementOfferRatings.find(
        (rating: UserManagementOfferRating) =>
          rating.offerId === managementOfferId &&
          rating.rater.toLowerCase() === address?.toLowerCase()
      );
      return userRating ? userRating.rating : 0;
    }
    return 0;
  }

  const filteredManagementOffers =
    data && data.projects[0].managementOffers
      ? data.projects[0].managementOffers.filter(
          (managementOffer: ActiveManagementOfferType) => {
            console.log("managementOffer: ", managementOffer);
            // let meetsStatusCondition = false;
            let meetsCreatorCondition = true;
            let meetsRatingCondition = true;

            // // Handle Status filter
            // switch (filterStatus) {
            //   case "Awaiting Ranking":
            //     meetsStatusCondition =
            //       managementOffer.isOpenForRating && managementOffer.isOpenForManagementProposals;
            //     break;
            //   case "In ManagementOffer Phase":
            //     meetsStatusCondition =
            //       managementOffer.isOpenForManagementProposals && !managementOffer.isOpenForRating;
            //     break;
            //   default: // For "All ManagementOffers"
            //     meetsStatusCondition = true;
            // }

            if (address) {
              // Handle Creator filter
              switch (filterEngage) {
                case "my managementOffers":
                  meetsCreatorCondition =
                    managementOffer.proposer.toLowerCase() ===
                    address?.toLowerCase();
                  break;
                case "not my managementOffer":
                  meetsCreatorCondition = address
                    ? managementOffer.proposer.toLowerCase() !==
                      address.toLowerCase()
                    : true;
                  break;
                default: // For "All ManagementOffers"
                  meetsCreatorCondition = true;
              }
              switch (filterRated) {
                case "Rated":
                  meetsRatingCondition =
                    getUserRatingForManagementOffer(managementOffer.offerId) >
                    0;
                  break;
                case "Not Rated":
                  meetsRatingCondition =
                    getUserRatingForManagementOffer(managementOffer.offerId) ===
                    0;
                  break;
                default: // For "All"
                  meetsRatingCondition = true;
              }
            }

            return (
              // meetsStatusCondition &&
              meetsCreatorCondition && meetsRatingCondition
            );
          }
        )
      : [];

  // Sorting logic based on the managementOfferId (since sorting by date means sorting by managementOffer ID on the backend)
  if (sortOption === "Newest") {
    filteredManagementOffers.sort(
      (a: ActiveManagementOfferType, b: ActiveManagementOfferType) => {
        return b.offerId.valueOf() - a.offerId.valueOf();
      }
    );
  } else {
    filteredManagementOffers.sort(
      (a: ActiveManagementOfferType, b: ActiveManagementOfferType) => {
        return a.offerId.valueOf() - b.offerId.valueOf();
      }
    );
  }

  console.log(filteredManagementOffers);

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

        {/* // Presentation of the project: */}
        <section className="section-padding flex flex-col items-center bg-democracy-beige dark:bg-neutral-gray p-6 rounded-md border-b-4 border-tech-blue">
          <h1 className="title text-center mb-1">Project Challenge</h1>
          <h2 className="text-3xl font-semibold">
            {/* if there no project or it not open looking for manager give masege */}
            {data?.projects.length == 0
              ? "Sorry, this project does not exist"
              : !error &&
                data &&
                data.projects.length > 0 &&
                data.projects[0].name}
          </h2>
          {data?.projects && (
            <h2 className="text-3xl font-semibold">
              {/* if there no project or it not looking for manager give masege */}
              {!data.projects[0].isOpenForManagementProposals
                ? "Sorry, this project is not looking for a manager"
                : !error &&
                  data && (
                    <>
                      {data.projects[0].solution && (
                        <span>{data.projects[0].solution.name}</span>
                      )}
                      <span> Management Offers</span>
                    </>
                  )}
            </h2>
          )}
          <h3 className="text-lg text-tech-blue mt-2">ID: {params.slug}</h3>
          {/* Display the creator of the project if available */}
          {/* <p className="mt-1 text-sm">Created by: {projectCreator}</p> */}
        </section>
        {/* <section className="section-padding flex flex-col items-center">
          <h1 className="title text-center">Dive Deep into This Challenge </h1>
          <h2 className="subtitle text-center my-4">
            Explore the community's proposed managementOffers and share your unique
            perspective or managementOffer to this project.
          </h2>

          project ID:
          {params.slug}
          <h2 className="text-lg">
            {data?.projects.length == 0
              ? "Sorry, this project does not exist"
              : !error &&
                data &&
                data.projects.length > 0 &&
                data.projects[0].name}
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
            {/* <ManagementOffersFilters
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
          {filteredManagementOffers?.length !== 0 && (
            <h3 className="text-2xl font-bold">Proposed ManagementOffers</h3>
          )}
          {filteredManagementOffers?.map(
            (managementOffer: ActiveManagementOfferType) => (
              <ManagementOfferCard
                key={managementOffer.offerId.toString()}
                {...managementOffer}
                userAddress={address}
                projectId={null}
                userPreviousRating={getUserRatingForManagementOffer(
                  managementOffer.offerId
                )}
              />
            )
          )}
        </section>
        <section className="bottom-submit">
          <h2 className="bottom-submit-text">
            Have a unique approach to address this challenge?
          </h2>
          <button className="btn-primary" onClick={() => write()}>
            Propose Your ManagementOffer
          </button>
        </section>
        {/* <SubmitManagementOfferModal
          isOpen={showManagementOfferModal}
          onClose={() => setShowManagementOfferModal(false)}
          managementOfferId={params.slug}
        /> */}
        <div className="floating-submit">
          <div className="floating-submit-text">
            <p className="font-secondary text-xs">See room for innovation?</p>
            <p className="font-secondary text-xs">
              Share your insights and managementOffers with the community.
            </p>
          </div>
          <button className="btn-primary" onClick={() => write()}>
            Submit a ManagementOffer
          </button>
        </div>
      </div>
    </div>
  );
}
