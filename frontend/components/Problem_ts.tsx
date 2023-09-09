// "use client";

import { useState, useEffect } from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import abi from "../constants/Problems.json";
import addresses from "../constants/networkMapping.json";
import { useContractWrite, useAccount } from "wagmi";
import { useRouter } from "next/navigation";
import createNotification from "../createNotification.js";
import { CustomError, ProblemCardProps } from "@/common.types";

export default function Problem({
  id,
  name,
  creator,
  ratingCount,
  isOpenForRating,
  isOpenForNewSolutions,
  userAddress,
  status,
  userPreviousRating,
}: ProblemCardProps) {
  const [rating, setRating] = useState<BigInt>(userPreviousRating);
  const [previousRating, setPreviousRating] =
    useState<BigInt>(userPreviousRating);
  const [hover, setHover] = useState(0);
  const { address } = useAccount();
  const router = useRouter();

  const { write } = useContractWrite({
    address: addresses[4002].Problems[0] as `0x${string}`,
    abi: abi,
    functionName: "rateProblem",
    args: [id, rating],
    onError(error: CustomError) {
      createNotification(
        error.metaMessages ? error.metaMessages[0] : "An error occurred",
        "error"
      );
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

  if (!(isOpenForRating || isOpenForNewSolutions)) return null; // Don't render if none are true

  return (
    <div className="card">
      <span className="self-end">
        {userAddress?.toLowerCase() === creator
          ? "Mine"
          : creator.substr(0, 4) + "..." + creator.substr(creator.length - 4)}
      </span>
      <p className="body-text">{status}</p>
      <h3 className="title">{name}</h3>
      <p className="body-text">Brief description</p>
      <p className="small-text">{ratingCount.toString()} ratings</p>

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
                    onClick={() => setRating(BigInt(index * 2))}
                    className={`z-20 bg-transparent border-none outline-none cursor-pointer ${
                      index <= (Number(hover) || Number(rating) / 2)
                        ? "text-yellow-300"
                        : "text-gray-300"
                    }`}
                    onMouseEnter={() => setHover(Number(index))}
                    onMouseLeave={() =>
                      setHover(
                        Number(rating) / 2 || Number(userPreviousRating) / 2
                      )
                    }
                  >
                    <span
                      className={`sm:text-5xl text-4xl ${
                        index <=
                        Number(
                          Number(hover || rating) / 2 ||
                            Number(userPreviousRating) / 2
                        )
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

      {isOpenForNewSolutions && !isOpenForRating && (
        <button
          className="btn-primary"
          onClick={() => router.push("/engage/" + id)}
        >
          Propose/View Solutions
        </button>
      )}
    </div>
  );
}
