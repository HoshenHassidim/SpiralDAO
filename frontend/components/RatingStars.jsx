import {useState} from "react"

export default function RatingStars({setStarRating}) {
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);

    return (
        <>
       
        {[...Array(5)].map((star, index) => {
            index += 1;

            return (
              <button
                type="button"
                key={index}
                className={`bg-transparent border-none outline-none cursor-pointer ${
                  index <= (hover || rating / 2)
                    ? "text-yellow-300"
                    : "text-gray-300"
                }`}
                onClick={(e) => {
                  setStarRating(index * 2);
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
           </>
    )
}