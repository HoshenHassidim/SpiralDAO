import { useForm, SubmitHandler } from "react-hook-form";

import abi from "../constants/Tasks.json";
import addresses from '../constants/networkMapping.json'

import {useState} from "react"

// Toast notification
import createNotification from "../createNotification.js";

import { useContractWrite } from "wagmi";


export default function ProjectAddTasks(address, projectId) {
	const { register, handleSubmit } = useForm();
	const [newTask, setNewTask] = useState();
	const [amount, setAmount] = useState();

  // Wagmi propose a solution
  const { raisedSolutionData, isLoading, isSuccess, write } = useContractWrite({
    address: address.address,
    abi: abi,
    functionName: "addTask",
    args: [address.projectId, newTask, amount],
    onError(error) {
      createNotification(error.metaMessages[0], amount);
    },
    onSuccess(data) {
      createNotification("Solution posted", "success");
    },
  });

  // Submitting a solution
  const onSubmit = async (data) => {
    if (!address) {
      createNotification("Please connect wallet to add solution", "error");
    } else {
      await setNewTask(data.task);
      await setAmount(data.amount);
      if (newTask && amount) {
        write();
      }
    }
  };
  return (

		<form className="max-w-lg" onSubmit={handleSubmit(onSubmit)}>
              <input
                {...register("task", { required: true})}
                placeholder="New Task"
                className="border p-2 w-full mb-4"
              />
              <input
                {...register("amount", { required: true})}
                placeholder="Amount"
                className="border p-2 w-full mb-4"
              />

              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Submit Task
              </button>
            </form>
  )
}