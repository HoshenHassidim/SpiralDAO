// "use client"
import {useState, useEffect} from "react"
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';

import abi from "../constants/Problems.json"
import { useContractWrite, useAccount } from 'wagmi'
import { useRouter } from 'next/navigation';


export default function Project({id, problemTitle, problemCreator, solutionTitle, solutionCreator, setError}) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

  const [heartFilled, setHeartFilled] = useState(false); 

  const { address, isConnecting, isDisconnected } = useAccount()
  const router = useRouter();

  
  const { data, isLoading, isSuccess, write } = useContractWrite({
    address: '0x1eD127C2eD0Bfca9D2Ee3d7e8B5A7944A163af35',
    abi: abi,
    functionName: 'rateProblem',
    args: [id, rating],
    onError(error) {
      // console.log(JSON.stringify(error).match(/Error: (\w+)/))

      setError(error.metaMessages[0]);
    },
  })
  // console.log(data)

  useEffect(() => {
    if (rating) {
      if (!address) {
        setError("Please connect your wallet to rate");
  
      }
      else {

        console.log(rating)
        write()
      }

    }

  }, [rating])

    return (
      // bg-[#3AB3D7]
        <div onClick={() => {router.push('/projects/'+id)}} className="cursor-pointer bg-gray-700 flex flex-col justify-between gap-5 rounded-lg  p-5 px-8 py-4 max-w-sm max-h-xs w-5/6 text-white transition-transform transform-gpu hover:-translate-y-1 hover:shadow-lg">
          <div className="absolute top-5 -right-10 w-10 h-10 rounded-r-full bg-[#3AB3D7] flex items-center">
          <button onClick={(e) => {e.stopPropagation(); setHeartFilled(!heartFilled);}}>
            {heartFilled ? (
              <AiFillHeart style={{fontSize: 30}} />
            ) : (
              <AiOutlineHeart style={{fontSize: 30}} />
            )}
          </button>
          </div>
          <div className="flex flex-col">
            <span className="self-end">{address && address.toLowerCase() == problemCreator ? "Mine" : problemCreator.substr(0, 4) + '...' + problemCreator.substr(problemCreator.length -4)}</span>
            <h2 className="text-lg font-bold mb-5 ">{problemTitle}</h2>
            <p className="text-sm line-clamp-6">Booking event venues and spaces as a small business owner or startup founder is frustrating. Sourcing affordable locations from traditional vendors is costly for bootstrapped budgets. Researching multiple venues is also clunky and inefficient when you need to compare pricing and availability. Coordinating all the venue logistics alongside your other event planning takes huge effort. There must be an easier way to book great spaces that fit your budget and needs. Venue discovery and booking for small events should be much simpler for startups trying to make their visions a reality.</p>
          </div>
          
          <hr className="mb-3"/>
          <div className="flex flex-col">
            <div className="mb-4 flex flex-row items-center justify-between">

              <h2 className="text-lg">Solution</h2>
              <p className="text-sm self-end">By {address && address.toLowerCase() == solutionCreator ? "Mine" : solutionCreator.substr(0, 4) + '...' + solutionCreator.substr(solutionCreator.length -4)}</p>
            </div>
            <p className="text-sm">{solutionTitle}</p>
          </div>
        </div>
    )
}


