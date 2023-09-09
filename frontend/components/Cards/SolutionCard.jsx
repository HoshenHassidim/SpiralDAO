// "use client";

import { useState, useEffect } from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import abi from "../../constants/Solutions.json";
import addresses from "../../constants/networkMapping.json";
import { useContractWrite, useAccount } from "wagmi";
import { useRouter } from "next/navigation";
import createNotification from "../../createNotification.js";

export default function SolutionCard({
  solutionId,
  name,
  creator,
  ratingCount,
  isOpenForRating,
  userAddress,
  // status,
  userPreviousRating,
  hasProject,
}) {
  const [rating, setRating] = useState(userPreviousRating);
  const [previousRating, setPreviousRating] = useState(userPreviousRating);
  const [hover, setHover] = useState(0);
  const { address } = useAccount();
  const router = useRouter();

  const { write } = useContractWrite({
    address: addresses[4002].Solutions[0],
    abi: abi,
    functionName: "rateSolution",
    args: [solutionId, rating],
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

  // if (!isOpenForRating) return null; // Don't render if none are true
  return (
    <div className="card">
      <div className="flex justify-between items-start mb-4">
        <span className="text-democracy-beige text-xs">
          By{" "}
          {userAddress?.toLowerCase() === creator
            ? "Mine"
            : creator.substr(0, 4) + "..." + creator.substr(creator.length - 4)}
        </span>
        <span className="text-democracy-beige text-xs">{solutionId}</span>
      </div>

      <h3 className="name text-lg sm:text-3xl font-semibold mb-2">{name}</h3>
      <p className="description mb-4 text-sm text-democracy-beige">
        [Here will be Brief Description]
      </p>

      {/* <p className="text-xs font-bold mb-4 text-white">{status()}</p> */}

      {isOpenForRating && (
        <div className="mb-4">
          <p className="small-text text-democracy-beige text-xs mb-2">
            {ratingCount} ratings
          </p>
          <div className="flex items-center justify-center">
            {[...Array(5)].map((star, index) => {
              index += 1;
              if (!(userAddress?.toLowerCase() === creator)) {
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
      )}

      {hasProject && (
        <div className="mb-4">
          <div className="flex items-center justify-center">
            <button
              className="btn-primary mt-3"
              onClick={() => router.push(`/projects/${solutionId}`)}
            >
              View Project
            </button>
          </div>
        </div>
      )}

      {!hasProject && !isOpenForRating && (
        <p className="text-democracy-beige text-sm mb-2">Closed</p>
      )}
    </div>
  );

  //   return (
  //     <div className="card">
  //       <span className="self-end">
  //         {userAddress?.toLowerCase() === creator
  //           ? "Mine"
  //           : creator.substr(0, 4) + "..." + creator.substr(creator.length - 4)}
  //       </span>
  //       <p className="body-text">{solutionId}</p>
  //       <h3 className="name">{name}</h3>
  //       <p className="body-text">Brief description</p>
  //       <p className="small-text">{ratingCount} ratings</p>

  //       {isOpenForRating && (
  //         <div>
  //           {/* <button className="btn-primary">Rank</button> */}
  //           <div className="flex items-center justify-center">
  //             {[...Array(5)].map((star, index) => {
  //               index += 1;
  //               if (!(userAddress?.toLowerCase() === creator)) {
  //                 return (
  //                   <button
  //                     type="button"
  //                     key={index}
  //                     onClick={() => setRating(index * 2)}
  //                     className={`z-20 bg-transparent border-none outline-none cursor-pointer ${
  //                       index <= (hover || rating / 2)
  //                         ? "text-yellow-300"
  //                         : "text-gray-300"
  //                     }`}
  //                     onMouseEnter={() => setHover(index)}
  //                     onMouseLeave={() =>
  //                       setHover(rating / 2 || userPreviousRating / 2)
  //                     }
  //                   >
  //                     <span
  //                       className={`sm:text-5xl text-4xl ${
  //                         index <= (hover || rating / 2 || userPreviousRating / 2)
  //                           ? "text-yellow-300"
  //                           : "text-gray-300"
  //                       }`}
  //                     >
  //                       &#9733;
  //                     </span>
  //                   </button>
  //                 );
  //               } else return null;
  //             })}
  //           </div>
  //         </div>
  //       )}

  //       {hasProject && (
  //         <button
  //           className="btn-primary"
  //           onClick={() => router.push(`/projects/${solutionId}`)}
  //         >
  //           View Project
  //         </button>
  //       )}

  //       {!hasProject && !isOpenForRating && <p className="body-text">Closed</p>}
  //     </div>
  //   );
}
