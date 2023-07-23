// "use client"
import {useState} from "react"
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';



export default function Problem({title}) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

  const [heartFilled, setHeartFilled] = useState(false); 



    return (
      // bg-[#3AB3D7]
        <div className="bg-gray-700 flex flex-col justify-between gap-5 rounded-lg  p-5 px-8 py-4 max-w-sm max-h-xs w-5/6 text-white transition-transform transform-gpu hover:-translate-y-1 hover:shadow-lg">
         <div className="absolute top-5 -right-10 w-10 h-10 rounded-r-full bg-[#3AB3D7] flex items-center">
          {/* <AiFillHeart className="ml-2 text-red-500 text-2xl" />  */}
        <button onClick={() => setHeartFilled(!heartFilled)}>
          {heartFilled ? (
            <AiFillHeart style={{fontSize: 30}} />
          ) : (
            <AiOutlineHeart style={{fontSize: 30}} />
          )}
        </button>
        </div>



          <div className="">

            <h2 className="text-lg font-bold mb-5 ">{title}</h2>
            <p className="text-sm line-clamp-6">Booking event venues and spaces as a small business owner or startup founder is frustrating. Sourcing affordable locations from traditional vendors is costly for bootstrapped budgets. Researching multiple venues is also clunky and inefficient when you need to compare pricing and availability. Coordinating all the venue logistics alongside your other event planning takes huge effort. There must be an easier way to book great spaces that fit your budget and needs. Venue discovery and booking for small events should be much simpler for startups trying to make their visions a reality.</p>
          </div>
          <div className="flex flex-col items-center justify-center">

          

            <div className="flex w-5/6 justify-between">
            
              {[...Array(5)].map((star, index) => {

                index += 1;

                return (
                  <button
                    type="button" 
                    key={index}
                    className={`bg-transparent border-none outline-none cursor-pointer ${index <= (hover || rating) ? 'text-yellow-300' : 'text-gray-300'}`}
                    onClick={() => setRating(index)}
                    onMouseEnter={() => setHover(index)} 
                    onMouseLeave={() => setHover(rating)}
                  >
                  <span className="sm:text-5xl text-4xl">&#9733;</span>
                  </button>
                );
              })}
            
            </div>


            
          </div>

        </div>
    )
}


