"use client"
import { useRouter } from 'next/navigation'
import { useQuery } from "@apollo/client";
import {useState, useEffect} from "react"
import { useAccount, useContractWrite } from 'wagmi'

import abi from "../../../constants/Problems.json";
import addresses from '../../../constants/networkMapping.json'
import createNotification from "../../../createNotification.js";


import Link from "next/link"


import Navbar from "../../../components/Navbar"

import GET_NEW_PROJECTS from "../../../constants/subgraphQueryGetProject";
import GET_NEW_PROBLEMS from "../../../constants/subgraphQueries";


export default function ProblemPage({ params }: { params: { slug: string } }) {
    const router = useRouter()
    const { address, isConnecting, isDisconnected } = useAccount()

    // Graph to fetch problems and projects
    const {
      loading,
      error: subgraphQueryError,
      data,
    } = useQuery(GET_NEW_PROJECTS);
  
    const {
      loading: problemLoading,
      error: subgraphQueryErrorProblem,
      data: problemData,
    } = useQuery(GET_NEW_PROBLEMS);
  
    if (data) {
      console.log(data);
    }

  //Wagmi to propose as a offer (manager)
  const { proposedOfferData, isLoading, isSuccess, write } = useContractWrite({
    address: addresses[4002].Projects[0],
    abi: abi,
    functionName: "proposeOffer",
    args: [params.slug],
    onError(error) {
      createNotification(error.metaMessages[0], "error");
    },
    onSuccess(data) {
      createNotification("Successfully proposed for a manager role", "success");
    },
  });

    return (<div>
			  <div className="overflow-x-hidden">
      
      		<Navbar />

					<section className="flex flex-col gap-2 justify-center items-center">
          <Link href="/projects" className="mt-5 text-white opacity-80 font-semibold">
					<button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Back</button>
					</Link>
        	{params.slug}

          {problemData && data &&
        data.projects.map((project) => {
          let solution = problemData.activeSolutions.find(p => p.solutionId == project.projectId);
          let problem = problemData.activeProblems.find(p => p.Problems_id == project.projectId);
          return (
            <div>
            <div className="flex flex-col">
            <span className="self-end">By {address && address.toLowerCase() == problem.creator ? "Mine" : problem.creator.substr(0, 4) + '...' + problem.creator.substr(problem.creator.length -4)}</span>
            <h2 className="text-lg font-bold mb-5 ">{problem.name}</h2>
          </div>
          
          <hr className="mb-3"/>
          <div className="flex flex-col">
            <div className="mb-4 flex flex-row items-center justify-between">

              <h2 className="text-lg">Solution</h2>
              <p className="text-sm self-end">By {address && address.toLowerCase() == solution.creator ? "Mine" : solution.creator.substr(0, 4) + '...' + solution.creator.substr(solution.creator.length -4)}</p>
            </div>
            <p className="text-sm">{solution.name}</p>
          </div>
          </div>
          )
})}

					</section>
          <div className="flex justify-center">
            {data && data.projects.find(item => item.projectId === params.slug).isOpenForManagementProposals && (

					  <button onClick={() => {write()}} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Apply for Manager</button>
            )}
          </div>

        </div>
    	</div>)
}