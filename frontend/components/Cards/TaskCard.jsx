import { useState, useEffect } from "react";
import { useContractWrite, useAccount } from "wagmi";
import { useRouter } from "next/navigation";
import createNotification from "../../createNotification.js";
import abi from "../../constants/Tasks.json";
import addresses from "../../constants/networkMapping.json";

function getPerformerDisplay(userAddress, performer) {
  return userAddress?.toLowerCase() === performer.toLowerCase()
    ? "You"
    : `${performer.substr(0, 6)}...${performer.substr(performer.length - 4)}`;
}

export default function TaskCard({
  taskId,
  projectId,
  status,
  taskName,
  taskValue,
  offersCount,
  performer,
  numberOfCompletionRaters,
  userPreviousRating,
  completionRatingSum,
  areProposed,
}) {
  const [rating, setRating] = useState(userPreviousRating);
  const [previousRating, setPreviousRating] = useState(userPreviousRating);
  const [hover, setHover] = useState(0);
  const { address } = useAccount();
  const router = useRouter();

  const { write: writepropose } = useContractWrite({
    address: addresses[4002].Tasks[0],
    abi: abi,
    functionName: "proposeTaskOffer",
    args: [taskId],
    onError(error) {
      createNotification(error.metaMessages[0], "error");
    },
    onSuccess(data) {
      createNotification("Task Offer Proposed", "success");
    },
  });

  const { write: writeCompleteTask } = useContractWrite({
    address: addresses[4002].Tasks[0],
    abi: abi,
    functionName: "completeTask",
    args: [taskId],
    onError(error) {
      createNotification(error.metaMessages[0], "error");
    },
    onSuccess(data) {
      createNotification("Task Completed", "success");
    },
  });

  const { write: writeRateCompletedTask } = useContractWrite({
    address: addresses[4002].Tasks[0],
    abi: abi,
    functionName: "rateCompletedTask",
    args: [taskId, rating],
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
        writeRateCompletedTask();
        setPreviousRating(rating); // Set the new rating as the previous rating
      }
    }
  }, [rating, previousRating, address]);

  return (
    <div className="card">
      <div className="flex justify-between items-start mb-4">
        <span className="text-democracy-beige text-xs">Task ID: {taskId}</span>
        {projectId !== undefined && (
          <span className="text-democracy-beige text-xs">
            Project ID: {projectId}
          </span>
        )}
      </div>

      <h3 className="name text-xl sm:text-3xl font-semibold mb-2">
        {taskName}
      </h3>
      <p className="description mb-4 text-base sm:text-lg text-democracy-beige">
        Value: {taskValue} Project Tokens
      </p>

      <p className="text-xs font-bold mb-4 text-white">Status: {status}</p>

      {status === "OPEN" && (
        <div className="mb-4">
          <p className="small-text text-democracy-beige text-xs mb-2">
            {offersCount} offers to perform
          </p>
          <div className="flex flex-col items-center justify-center">
            <button
              className="btn-primary mt-3"
              onClick={() => router.push(`/TaskOffers/${taskId}`)}
            >
              View Offers
            </button>
            {areProposed === true ? (
              <p className="small-text text-democracy-beige text-xs mb-2">
                You have already offered to preform this task
              </p>
            ) : (
              <button
                className="btn-primary mt-3"
                onClick={() => {
                  if (address) {
                    writepropose();
                  } else {
                    createNotification("Please connect your wallet", "error");
                  }
                }}
              >
                Offer to Preform
              </button>
            )}
          </div>
        </div>
      )}

      {(status === "IN_PROGRESS" ||
        status === "VERIFICATION" ||
        status === "VERIFIED") && (
        <p className="small-text text-democracy-beige text-xs mb-2">
          Performer: {getPerformerDisplay(address, performer)}
        </p>
      )}

      {status === "IN_PROGRESS" &&
        address?.toLowerCase() === performer?.toLowerCase() && (
          <div className="mb-4">
            <div className="flex items-center justify-center">
              <button
                className="btn-primary mt-3"
                onClick={() => writeCompleteTask()}
              >
                Complete Task
              </button>
            </div>
          </div>
        )}

      {status === "VERIFICATION" && (
        <div className="mb-4">
          <div className="flex items-center justify-center">
            {[...Array(5)].map((star, index) => {
              index += 1;
              if (!(address?.toLowerCase() === performer)) {
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

      {status === "VERIFIED" && (
        <p className="small-text text-democracy-beige text-xs mb-2">
          Rating received:{" "}
          {(completionRatingSum / numberOfCompletionRaters / 2).toFixed(1)}
          /5
        </p>
      )}
    </div>
  );

  // return (
  //   <div className=" card">
  //     <span>{`Task ID: ${taskId}`}</span>
  //     {projectId !== undefined && <span>{`Project ID: ${projectId}`}</span>}
  //     <h3 className="title">{taskName}</h3>
  //     <p className="small-text">Value: {taskValue} Project Tokens</p>
  //     <p>Status: {status}</p>

  //     {status === "OPEN" && (
  //       <div>
  //         <p className="small-text">{`${offersCount} offers to perform`}</p>
  //         <button
  //           className="btn-primary mt-2"
  //           onClick={() => router.push(`/TaskOffers/${taskId}`)}
  //         >
  //           View Offers
  //         </button>
  //         {areProposed === true ? (
  //           <p className="small-text">{`You have already offered to preform this task`}</p>
  //         ) : (
  //           <button
  //             className="btn-primary mt-2"
  //             onClick={() => {
  //               if (address) {
  //                 writepropose();
  //               } else {
  //                 createNotification("Please connect your wallet", "error");
  //               }
  //             }}
  //           >
  //             Offer to Preform
  //           </button>
  //         )}
  //       </div>
  //     )}

  //     {(status === "IN_PROGRESS" ||
  //       status === "VERIFICATION" ||
  //       status === "VERIFIED") && (
  //       <p className="small-text">{`Performer: ${getPerformerDisplay(
  //         address,
  //         performer
  //       )}`}</p>
  //     )}

  //     {status === "IN_PROGRESS" &&
  //       address?.toLowerCase() === performer?.toLowerCase() && (
  //         // <button
  //         //   className="btn-primary mt-2"
  //         //   onClick={() => router.push(`/manageTask/${taskId}`)}
  //         // >
  //         //   Manage Task
  //         // </button>
  //         <button
  //           className="btn-primary mt-2"
  //           onClick={() => writeCompleteTask()}
  //         >
  //           Complete Task
  //         </button>
  //       )}

  //     {status === "VERIFICATION" && (
  //       // Add button or mechanism for rating here
  //       <div>
  //         {/* <p>You can rate the performance of the task.</p> */}
  //         {/* <button className="btn-primary">Rank</button> */}
  //         <div className="flex items-center justify-center">
  //           {[...Array(5)].map((star, index) => {
  //             index += 1;
  //             if (!(address?.toLowerCase() === performer)) {
  //               return (
  //                 <button
  //                   type="button"
  //                   key={index}
  //                   onClick={() => setRating(index * 2)}
  //                   className={`z-20 bg-transparent border-none outline-none cursor-pointer ${
  //                     index <= (hover || rating / 2)
  //                       ? "text-yellow-300"
  //                       : "text-gray-300"
  //                   }`}
  //                   onMouseEnter={() => setHover(index)}
  //                   onMouseLeave={() =>
  //                     setHover(rating / 2 || userPreviousRating / 2)
  //                   }
  //                 >
  //                   <span
  //                     className={`sm:text-5xl text-4xl ${
  //                       index <= (hover || rating / 2 || userPreviousRating / 2)
  //                         ? "text-yellow-300"
  //                         : "text-gray-300"
  //                     }`}
  //                   >
  //                     &#9733;
  //                   </span>
  //                 </button>
  //               );
  //             } else return null;
  //           })}
  //         </div>
  //       </div>
  //     )}

  //     {status === "VERIFIED" && (
  //       <p className="small-text">{`Rating received: ${
  //         completionRatingSum / numberOfCompletionRaters / 2
  //       }/5`}</p>
  //     )}

  //     {/* <button
  //       className="btn-secondary mt-2"
  //       onClick={() => router.push(`/taskDetails/${taskId}`)}
  //     >
  //       More Details
  //     </button> */}
  //   </div>
  // );
}
