// "use client";

import { useState, useEffect } from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import abi from "../constants/Solutions.json";
import addresses from "../constants/networkMapping.json";
import { useContractWrite, useAccount } from "wagmi";
import { useRouter } from "next/navigation";
import createNotification from "../createNotification.js";

export default function SolutionCard({
  id,
  title,
  creator,
  ratingCount,
  isOpenForRating,
  userAddress,
  // status,
  userPreviousRating,
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
    args: [id, rating],
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

  if (!isOpenForRating) return null; // Don't render if none are true

  return (
    <div className="cursor-pointer bg-neutral-gray flex flex-col justify-between gap-5 rounded-lg p-6 px-8 py-4 max-w-sm max-h-xs w-5/6 text-white transition-transform transform-gpu hover:shadow-xl hover:bg-gradient-to-r hover:from-tech-blue hover:to-future-neon">
      <span className="self-end">
        {userAddress?.toLowerCase() === creator
          ? "Mine"
          : creator.substr(0, 4) + "..." + creator.substr(creator.length - 4)}
      </span>
      <p className="body-text">{id}</p>
      <h3 className="title">{title}</h3>
      <p className="body-text">Brief description</p>
      <p className="small-text">{ratingCount} ratings</p>

      {isOpenForRating && (
        <div>
          {/* <button className="btn-primary">Rank</button> */}
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

      {/* {isOpenForNewSolutions && !isOpenForRating && (
        <button
          className="btn-primary"
          onClick={() => router.push("/engage/" + id)}
        >
          Propose/View Solutions
        </button>
      )} */}
    </div>
  );
}
