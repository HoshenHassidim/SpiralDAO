import {useState, useEffect} from "react"
import RatingStars from './RatingStars.jsx'
// Wagmi write
import { useContractWrite, useAccount } from "wagmi";
import addresses from '../constants/networkMapping.json'

import abi from "../constants/Tasks.json";

import createNotification from "../createNotification.js";



export default function RatingTaskStars(taskId) {

  const [starRating, setStarRating] = useState();

  // Wagmi rate a task
  const { ratedSolutionData, isLoadingRated, isSuccessRated, write } = useContractWrite({
      address: addresses[4002].Tasks[0],
      abi: abi,
      functionName: "rateTaskOffer",
      args: [taskId.taskId, starRating],
      onError(error) {
        createNotification(error.metaMessages[0], "error");
      },
      onSuccess(data) {
        createNotification("Successfully rated solution", "success");
      },
    });


    

  useEffect(() => {
    if (starRating > 0) {
      write()
    }
    
  }, [starRating])

  return (
      <RatingStars setStarRating={setStarRating} />

  )
}