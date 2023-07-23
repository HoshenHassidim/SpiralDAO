"use client"
import { useRouter } from 'next/navigation'
import { useQuery } from "@apollo/client";
import {useState, useEffect} from "react"

import {Link} from "next/link"

import Navbar from "../../../components/Navbar"


import {GET_PROBLEM} from "../../../constants/subgraphQueries";

export default function ProblemPage({ params }: { params: { slug: string } }) {
    const router = useRouter()
    // const {
    //     loading,
    //     error: subgraphQueryError,
    //     data,
    //   } = useQuery(GET_PROBLEM, {
    //     variables: { id: "4" }
    //   })
    const [problemData, setProblemData] = useState();
      const { loading, error, data } = useQuery(GET_PROBLEM, {
        variables: { id: params.slug },
      });
			// console.log(data.activeProblems[0].name);
    //   if (problemData) {
    //       setProblemData(data)
    //     }


      useEffect(() => {
				if (data) {

					setProblemData(data)
				}
      }, [data])


    return (<div>
			  <div className="overflow-x-hidden">
      
      		<Navbar />

          {/* <Link href="/problems" className="w-full mt-5 text-white opacity-80 font-semibold">
					<button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Back</button> */}
					{/* </Link> */}

					<section className="flex flex-col justify-center items-center">

        	{params.slug}
					<h2 className="text-lg">

					{problemData && problemData.activeProblems.length == 0 ? "Sorry, this problem does not exist" : !error && problemData && problemData.activeProblems.length > 0 && problemData.activeProblems[0].name}
        	
					</h2>
					</section>

        </div>
    	</div>)
}