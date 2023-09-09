// "use client";

import { useState, useEffect } from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import abi from "../../constants/Projects.json";
import addresses from "../../constants/networkMapping.json";
import { useContractWrite, useAccount } from "wagmi";
import { useRouter } from "next/navigation";
import createNotification from "../../createNotification.js";

export default function ManagementOfferCard({
  offerId,
  proposer,
  ratingCount,
  isActive,
  userAddress,
  userPreviousRating,
  projectId,
}) {
  const [rating, setRating] = useState(userPreviousRating);
  const [previousRating, setPreviousRating] = useState(userPreviousRating);
  const [hover, setHover] = useState(0);
  const { address } = useAccount();
  const router = useRouter();

  const { write } = useContractWrite({
    address: addresses[4002].Projects[0],
    abi: abi,
    functionName: "rateManagementOffer",
    args: [offerId, rating],
    onError(error) {
      createNotification(error.metaMessages[0], "error");
    },
    onSuccess(data) {
      createNotification("Rated Successfully", "success");
    },
  });

  useEffect(() => {
    if (rating !== previousRating) {
      if (!address) {
        createNotification("Please connect your wallet to rate", "error");
      } else {
        write();
        setPreviousRating(rating); // Set the new rating as the previous rating
      }
    }
  }, [rating, previousRating, address]);

  if (!isActive) return null; // Don't render if none are true

  return (
    <div className="card">
      <div className="flex justify-between items-start mb-4">
        <span className="text-democracy-beige text-xs">
          Offer ID: {offerId}
        </span>
        {projectId && (
          <span className="text-democracy-beige text-xs">
            Project ID: {projectId}
          </span>
        )}
      </div>

      <h3 className="name text-lg sm:text-3xl font-semibold mb-2">
        {userAddress?.toLowerCase() === proposer
          ? "My Offer"
          : `Offeror: ${proposer.substr(0, 4)}...${proposer.substr(
              proposer.length - 4
            )}`}
      </h3>

      <p className="description mb-4 text-sm text-democracy-beige">
        [Here will be Overview of offeror's expertise & past achievements]
      </p>
      <p className="text-xs font-bold mb-4 text-white">{ratingCount} ratings</p>

      <div className="mb-4">
        <div className="flex items-center justify-center">
          {[...Array(5)].map((star, index) => {
            index += 1;
            if (!(userAddress?.toLowerCase() === proposer)) {
              return (
                <button
                  type="button"
                  key={index}
                  onClick={() => setRating(index * 2)}
                  className={`z-20 bg-transparent border-none outline-none cursor-pointer ${
                    index <= (hover || rating / 2)
                      ? "text-yellow-300"
                      : "text-gray-300"
                  }`}
                  onMouseEnter={() => setHover(index)}
                  onMouseLeave={() =>
                    setHover(rating / 2 || userPreviousRating / 2)
                  }
                >
                  <span
                    className={`sm:text-5xl text-4xl ${
                      index <= (hover || rating / 2 || userPreviousRating / 2)
                        ? "text-yellow-300"
                        : "text-gray-300"
                    }`}
                  >
                    &#9733;
                  </span>
                </button>
              );
            } else return null;
          })}
        </div>
      </div>
    </div>
  );

  // return (
  //   <div className="card">
  //     <span className="self-end">{`Offer ID: ${offerId}`}</span>
  //     {projectId && (
  //       <span className="self-end">{`Project ID: ${projectId}`}</span>
  //     )}
  //     {/* <p className="body-text">{offerId}</p> */}
  //     <h3 className="title">
  //       {userAddress?.toLowerCase() === proposer
  //         ? "My Offer"
  //         : `Manager: ${proposer.substr(0, 4)}...${proposer.substr(
  //             proposer.length - 4
  //           )}`}
  //     </h3>

  //     <p className="body-text">
  //       [Here will be Overview of offeror's expertise & past achievements]
  //     </p>
  //     <p className="small-text">{ratingCount} ratings</p>

  //     <div>
  //       {/* <button className="btn-primary">Rank</button> */}
  //       <div className="flex items-center justify-center">
  //         {[...Array(5)].map((star, index) => {
  //           index += 1;
  //           if (!(userAddress?.toLowerCase() === proposer)) {
  //             return (
  //               <button
  //                 type="button"
  //                 key={index}
  //                 onClick={() => setRating(index * 2)}
  //                 className={`z-20 bg-transparent border-none outline-none cursor-pointer ${
  //                   index <= (hover || rating / 2)
  //                     ? "text-yellow-300"
  //                     : "text-gray-300"
  //                 }`}
  //                 onMouseEnter={() => setHover(index)}
  //                 onMouseLeave={() =>
  //                   setHover(rating / 2 || userPreviousRating / 2)
  //                 }
  //               >
  //                 <span
  //                   className={`sm:text-5xl text-4xl ${
  //                     index <= (hover || rating / 2 || userPreviousRating / 2)
  //                       ? "text-yellow-300"
  //                       : "text-gray-300"
  //                   }`}
  //                 >
  //                   &#9733;
  //                 </span>
  //               </button>
  //             );
  //           } else return null;
  //         })}
  //       </div>
  //     </div>

  //     {/* {isOpenForNewSolutions && !isOpenForRating && (
  //       <button
  //         className="btn-primary"
  //         onClick={() => router.push("/engage/" + offerId)}
  //       >
  //         Propose/View Solutions
  //       </button>
  //     )} */}
  //   </div>
  // );
}
