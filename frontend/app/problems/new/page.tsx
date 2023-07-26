"use client";

import Navbar from "../../../components/Navbar";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { useForm, SubmitHandler } from "react-hook-form";



import abi from "../../../constants/Problems.json";
import addresses from '../../../constants/networkMapping.json'

import {
  useContractWrite,
  useAccount,
} from "wagmi";

import createNotification from "../../../createNotification.js";

type Inputs = {
  example: string;
  exampleRequired: string;
};

export default function page() {
  const { register, handleSubmit } = useForm();
  const [name, setName] = useState();
  const [description, setDescription] = useState("");

  const { address, isConnecting, isDisconnected } = useAccount();

  useEffect(() => {
    if (name) {
      if (!address) {
        createNotification("Please connect wallet to post a problem", "error");
      } else {
        write();
        console.log(data);
      }
    }
  }, [name]);
  const onSubmit = async (data: any) => {
    console.log(data);
    await setName(data.title);
    // setDescription(data.description)
    // await write()
  };

  const { data, isLoading, isSuccess, write } = useContractWrite({
    address: addresses[4002].Problems[0],
    abi: abi,
    functionName: "raiseProblem",
    args: [name],
  });

  // Router instance to handle navigation
  const router = useRouter();

  useEffect(() => {
    console.log(isSuccess);
    // Check if the contract write operation was successful
    if (isSuccess) {
      // Redirect to the main page when it is successful
      createNotification("Problem Poster", "success");


      router.push("/problems"); // Replace '/main' with your desired main page URL
      router.refresh();
    }
  }, [isSuccess]);

  return (
    <div className="overflow-x-hidden">
      <Navbar />
      <section className="flex flex-col justify-center items-center h-full m-10">
        <h1 className="text-2xl font-bold">Add a problem</h1>

        <form className="max-w-lg" onSubmit={handleSubmit(onSubmit)}>
          <input
            {...register("title")}
            placeholder="Problem title"
            className="border p-2 w-full mb-4"
          />

          {/* <textarea 
              {...register('description')}
              placeholder="Describe the problem"
              className="border p-2 w-full mb-4 h-32"
            /> */}

          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Submit Problem
          </button>
        </form>
      </section>
    </div>
  );
}
