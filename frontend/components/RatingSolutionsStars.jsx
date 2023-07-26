import {useState, useEffect} from "react"
import RatingStars from './RatingStars.jsx'
// Wagmi write
import { useContractWrite, useAccount } from "wagmi";
import addresses from '../constants/networkMapping.json'

import abi from "../constants/Solutions.json";

import createNotification from "../createNotification.js";



export default function RatingSolutionsStars(id) {

  const [starRating, setStarRating] = useState();

  
  // Wagmi rate solution
  const { ratedSolutionData, isLoadingRated, isSuccessRated, write } = useContractWrite({
      address: addresses[4002].Solutions[0],
      abi: abi,
      functionName: "rateSolution",
      args: [id.id, starRating],
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