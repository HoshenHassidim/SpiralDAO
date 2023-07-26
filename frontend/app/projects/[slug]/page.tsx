"use client"
import { useRouter } from 'next/navigation'
import { useQuery } from "@apollo/client";
import {useState, useEffect} from "react"
import { useAccount, useContractWrite } from 'wagmi'

import abi from "../../../constants/Problems.json";
import addresses from '../../../constants/networkMapping.json'
import createNotification from "../../../createNotification.js";

import RatingTaskStars from "../../../components/RatingTaskStars"
import RatingManagerOfferStars from "../../../components/RatingManagerOfferStars"

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
    const currentProject = data?.projects.find(p => p.projectId === params.slug)

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
			  <div className="overflow-x-hidden h-screen">
      
      		<Navbar />

					<section className="flex flex-col gap-2 justify-center items-center">
          <Link href="/projects" className="mt-5 text-white opacity-80 font-semibold">
					<button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Back</button>
					</Link>

          <section className="projectInfo">

          
        	{params.slug}

          {problemData && data &&
        data.projects.map((project) => {
          if (project.projectId == params.slug) {

          
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
          }
        })}
        </section>
        <section>
          <h2 className="text-xl mt-5">Tasks</h2>
          {data && data.tasks.map((task) => {
            if(task.projectId === params.slug) {
              return <div className="flex flex-col items-center">
                <span>

                {task.taskName}
                </span>
                <span>

                 {task.performer == "0x0000000000000000000000000000000000000000" ? <button onClick={() => {write()}} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Offer to complete Task</button>
 : "Task Performer: " + task.performer}
                </span>
                <div className="flex flex-row">

                <RatingTaskStars  taskId={task.projectId}/>
                </div>
                </div> 
            }
          })}
          </section>

          {currentProject?.isOpenForManagementProposals && (

            <section className="managers">
              <h2 className="text-xl mt-5">Managers</h2>
              
          <div className="flex justify-center">
					  <button onClick={() => {write()}} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Apply for Manager</button>
          </div>

              {data?.activeProjectOffers.map((offer: any) => {
                {console.log(offer)}
            if(offer.projectId === params.slug) {
              return <div className="flex flex-col items-center">
                <span>

                {offer.proposer}
                </span>

                <div className="flex flex-row">

                <RatingManagerOfferStars offerId={offer.offerId}/>
                </div>
                </div> 
            }
          })}
            </section>
          )}

					</section>



        </div>
    	</div>)
}

