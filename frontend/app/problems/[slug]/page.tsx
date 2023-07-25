"use client"
import { useRouter } from 'next/navigation'
import { useForm, SubmitHandler } from "react-hook-form"

// Wagmi write
import { useContractWrite, useAccount } from 'wagmi'

// Graph reading
import GET_NEW_PROBLEMS from "../../../constants/subgraphQueries";
import GET_PROBLEM from "../../../constants/subgraphQueryGetProblem";
import { useQuery } from "@apollo/client";

// Toast notification
import createNotification from '../../../createNotification.js';




import abi from "../../../constants/Solutions.json"

import {useState, useEffect} from "react"

import Link from "next/link"

import Navbar from "../../../components/Navbar"



export default function ProblemPage({ params }: { params: { slug: string } }) {
    const [solution, setSolution] = useState();
    const { register, handleSubmit } = useForm();

    const { address, isConnecting, isDisconnected } = useAccount()

    const router = useRouter()
    

    // Fetching the problem from id
    const [problemData, setProblemData] = useState();
      const { loading, error, data } = useQuery(GET_PROBLEM, {
        variables: { id: params.slug },
      });

      useEffect(() => {
				if (data) {

					setProblemData(data)
				}
      }, [data])

      // Wagmi propose a solution
      const { raisedSolutionData, isLoading, isSuccess, write } = useContractWrite({
        address: '0x93F1A258Ac704426B4D815416B7131B45dE6E509',
        abi: abi,
        functionName: 'proposeSolution',
        args: [params.slug, solution],
        onError(error) {
          
          createNotification(error.metaMessages[0], "error")
        },
        onSuccess(data) {
          createNotification("Solution posted", "success")
        },
      })
      // Submitting a solution
      const onSubmit = async (data: any) => {
        if (!address) {
          createNotification("Please connect wallet to add solution", "error")

        }
        else {

          await setSolution(data.solution)
          if (solution) {
            write() 
            // console.log(raisedSolutionData)
          }
        }
      }

      // Reading solutions for a problem
      const {
        loading: readSolutionsLoading,
        error: subgraphQueryError,
        data: readSolutionsData,
      } = useQuery(GET_NEW_PROBLEMS);
      
    console.log(readSolutionsData)
    return (<div>
			  <div className="overflow-x-hidden">
      
      		<Navbar />


					<section className="flex flex-col justify-center items-center">
          <Link href="/problems" className="w-full mt-5 text-white opacity-80 font-semibold">
					<button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Back</button>
					</Link>

        	{params.slug}
					<h2 className="text-lg">

					{problemData && problemData.activeProblems.length == 0 ? "Sorry, this problem does not exist" : !error && problemData && problemData.activeProblems.length > 0 && problemData.activeProblems[0].name}
        	
					</h2>
          

          <section className="flex flex-col justify-center items-center h-full m-10">
          <h1 className="text-2xl font-bold">Add a Solution</h1>
          
          <form className="max-w-lg" onSubmit={handleSubmit(onSubmit)}>

            <input 
              {...register('solution')} 
              placeholder="Problem solution"
              className="border p-2 w-full mb-4" 
            />

            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Submit Solution  
            </button>
          </form>
          </section>
      
    
					</section>

          <section className="flex flex-col items-center justify-center gap-4">
            {readSolutionsData?.activeSolutions?.filter(s => s.problemId === params.slug).length !== 0 && <h3 className="text-xl">Solutions</h3>}
          {
            readSolutionsData?.activeSolutions
              ?.filter(s => s.problemId === params.slug)
              ?.map(solution => ( 
                
                <div className="flex flex-col items-center">
                  <p>

                  {address && address.toLowerCase() == solution.creator ? "Mine" : solution.creator.substr(0, 4) + '...' + solution.creator.substr(solution.creator.length -4)}
                  </p>
                  <p>

                  {solution.name}
                  </p>
                </div>
            ))
          }
          </section>

        </div>
    	</div>)
}