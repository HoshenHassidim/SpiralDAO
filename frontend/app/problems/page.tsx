"use client";

import Navbar from "../../components/Navbar";
import Problem from "../../components/Problem";
import Link from "next/link";
import { AiOutlinePlus } from "react-icons/ai";
import GET_NEW_PROBLEMS from "../../constants/subgraphQueries";
import { useQuery } from "@apollo/client";
import { useState, useEffect } from "react";
import { ProblemType } from "@/common.types";
import { useAccount } from "wagmi";

export default function ProblemsPage() {
  const { address, isConnecting, isDisconnected } = useAccount();

  const {
    loading,
    error: subgraphQueryError,
    data,
  } = useQuery(GET_NEW_PROBLEMS, {
    // variables: { address: address },
    pollInterval: 500,
  });

  return (
    <div className="overflow-x-hidden">
      <Navbar />
      <section className="flex flex-col items-center justify-center gap-5 p-5">
        {data?.activeProblems.map((problem: ProblemType) => (
          <Problem
            key={problem.problemId}
            id={problem.problemId}
            title={problem.name}
            creator={problem.creator}
          />
        ))}
      </section>

      <Link
        className="fixed sm:bottom-5 sm:right-5 bottom-2 right-2"
        href="/problems/new"
      >
        <button className="transition-colors duration-150 bg-[#3AB3D7] hover:bg-blue-500  text-white rounded-full p-2">
          <AiOutlinePlus className="w-8 h-8" />
        </button>
      </Link>
    </div>
  );
}
