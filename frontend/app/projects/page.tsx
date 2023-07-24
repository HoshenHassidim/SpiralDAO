"use client"

import Navbar from "../../components/Navbar"
import Project from "../../components/Project"

import Link from 'next/link'
import { AiOutlinePlus } from 'react-icons/ai'

//graph
import type { NextPage } from "next";
import GET_NEW_PROJECTS from "../../constants/subgraphQueryGetProject";
import GET_NEW_PROBLEMS from "../../constants/subgraphQueries";
import { useQuery } from "@apollo/client";
import {useState, useEffect} from "react"
//toast
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function projects () {
  const [error, setError] = useState()
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
    console.log(problemData);
  }
  const notify = () => toast.error(error, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
    });
  useEffect(() => {
    if (error) {

      notify()
      setError("")
    }

  }, [error])

return (
    <div className="overflow-x-hidden">
      
      <Navbar />

        {/* <ToastContainer /> */}
      <section className="flex flex-col items-center justify-center gap-5 p-5">
      {problemData && data &&
        data.projects.map((project) => {
          // <Problem key={project.projectID} id={project.projectID} title={project.name} creator={project.creator} setError={setError}/>
          // project.projectId
          let solution = problemData.activeSolutions.find(p => p.solutionId == project.projectId);
          let problem = problemData.activeProblems.find(p => p.Problems_id == project.projectId);
          return <Project id={solution.solutionId} solutionTitle={solution.name} solutionCreator={solution.creator} problemTitle={problem.name} problemCreator={problem.creator}/>
})}

        
        
      </section>

      {/* <Link className="fixed sm:bottom-5 sm:right-5 bottom-2 right-2" href="/problems/new">
        
          <button className="transition-colors duration-150 bg-[#3AB3D7] hover:bg-blue-500  text-white rounded-full p-2">
            <AiOutlinePlus className="w-8 h-8" /> 
          </button>
        
      </Link> */}

    </div>
)
}