// "use client";

import { useState, useEffect } from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";

import abi from "../constants/Problems.json";
import addresses from "../constants/networkMapping.json";

import { useContractWrite, useAccount } from "wagmi";
import { useRouter } from "next/navigation";

// Toast notification
import createNotification from "../createNotification.js";

export default function Problem({ id, title, creator }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

  const [heartFilled, setHeartFilled] = useState(false);

  const { address, isConnecting, isDisconnected } = useAccount();
  const router = useRouter();

  const { data, isLoading, isSuccess, write } = useContractWrite({
    address: addresses[4002].Problems[0],
    abi: abi,
    functionName: "rateProblem",
    args: [id, rating],
    onError(error) {
      createNotification(error.metaMessages[0], "error");
    },
    onSuccess(data) {
      createNotification("Rated Successfully", "success");
    },
  });

  useEffect(() => {
    if (rating) {
      if (!address) {
        createNotification("Please connect your wallet to rate", "error");
      } else {
        write();
      }
    }
  }, [rating]);

  return (
    <div
      onClick={() => {
        router.push("/problems/" + id);
      }}
      className="cursor-pointer bg-gray-700 flex flex-col justify-between gap-5 rounded-lg  p-5 px-8 py-4 max-w-sm max-h-xs w-5/6 text-white transition-transform transform-gpu hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="absolute top-5 -right-10 w-10 h-10 rounded-r-full bg-[#3AB3D7] flex items-center">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setHeartFilled(!heartFilled);
          }}
        >
          {heartFilled ? (
            <AiFillHeart style={{ fontSize: 30 }} />
          ) : (
            <AiOutlineHeart style={{ fontSize: 30 }} />
          )}
        </button>
      </div>

      <div className="flex flex-col">
        <span className="self-end">
          {address?.toLowerCase() == creator
            ? "Mine"
            : creator.substr(0, 4) + "..." + creator.substr(creator.length - 4)}
        </span>
        <h2 className="text-lg font-bold mb-5 ">{title}</h2>
        <p className="text-sm line-clamp-6">
          Booking event venues and spaces as a small business owner or startup
          founder is frustrating. Sourcing affordable locations from traditional
          vendors is costly for bootstrapped budgets. Researching multiple
          venues is also clunky and inefficient when you need to compare pricing
          and availability. Coordinating all the venue logistics alongside your
          other event planning takes huge effort. There must be an easier way to
          book great spaces that fit your budget and needs. Venue discovery and
          booking for small events should be much simpler for startups trying to
          make their visions a reality.
        </p>
      </div>
      <div className="flex flex-col items-center justify-center">
        <div className="flex w-5/6 justify-between">
          {[...Array(5)].map((star, index) => {
            index += 1;

            return (
              <button
                type="button"
                key={index}
                className={`z-20 bg-transparent border-none outline-none cursor-pointer ${
                  index <= (hover || rating / 2)
                    ? "text-yellow-300"
                    : "text-gray-300"
                }`}
                onClick={(e) => {
                  setRating(index * 2);
                  e.stopPropagation();
                }}
                onMouseEnter={() => setHover(index)}
                onMouseLeave={() => setHover(rating / 2)}
              >
                <span className="sm:text-5xl text-4xl">&#9733;</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
