import {useState, useEffect} from "react"
import RatingStars from './RatingStars.jsx'
// Wagmi write
import { useContractWrite, useAccount } from "wagmi";
import addresses from '../constants/networkMapping.json'

import abi from "../constants/Projects.json";

import createNotification from "../createNotification.js";



export default function RatingManagerOfferStars(offerId) {

  const [starRating, setStarRating] = useState();
  console.log(offerId)
  console.log("offerId")
  // Wagmi rate a manager offer
  const { ratedSolutionData, isLoadingRated, isSuccessRated, write } = useContractWrite({
      address: addresses[4002].Projects[0],
      abi: abi,
      functionName: "rateOffer",
      args: [offerId.offerId, starRating],
      onError(error) {
        createNotification(error.metaMessages[0], "error");
      },
      onSuccess(data) {
        createNotification("Successfully rated manager", "success");
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