// components/SubmitTaskModal.tsx
import React, { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import abi from "../constants/Tasks.json";
import addresses from "../constants/networkMapping.json";
import { useContractWrite, useAccount } from "wagmi";
import createNotification from "../createNotification.js";
import { useRouter } from "next/navigation";
import { CustomError } from "@/common.types";

const MinTaskValue = 1000;

interface SubmitTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
}

const SubmitTaskModal: React.FC<SubmitTaskModalProps> = ({
  isOpen,
  onClose,
  projectId,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [name, setName] = useState<string | undefined>();
  const [taskValue, setTaskValue] = useState<number | undefined>();
  const [submitCount, setSubmitCount] = useState(0);

  const { address } = useAccount();

  const { data, isLoading, isSuccess, write } = useContractWrite({
    address: addresses[4002].Tasks[0] as `0x${string}`,
    abi: abi,
    functionName: "addTask",
    args: [projectId, name, taskValue],
    onError(error: CustomError) {
      createNotification(
        error.metaMessages ? error.metaMessages[0] : "An error occurred",
        "error"
      );
    },
    onSuccess(data) {
      createNotification("Task posted", "success");
    },
  });

  const router = useRouter();

  useEffect(() => {
    if (isSuccess) {
      //   createNotification("Task Posted Successfully", "success");
      onClose();
      //   router.push("/tasks");
      router.refresh();
    }
  }, [isSuccess]);

  const onSubmit = async (data: any) => {
    if (!address) {
      createNotification("Please connect wallet to post a task", "error");
      return;
    }
    if (data.taskValue <= MinTaskValue) {
      createNotification(
        `Task value should be more than ${MinTaskValue}`,
        "error"
      );
      return;
    }

    setName(data.taskTitle);
    setTaskValue(data.taskValue);
    setSubmitCount((prevCount) => prevCount + 1);
  };

  useEffect(() => {
    if (name && address) {
      write();
    }
  }, [name, address, submitCount]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-md">
      <div className="modal-content">
        <h3 className="text-xl mb-4 text-tech-blue dark:text-democracy-beige">
          Submit Your Task
        </h3>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label
              htmlFor="taskTitle"
              className="block text-sm mb-2 text-tech-blue dark:text-democracy-beige"
            >
              Task Title:
            </label>
            <input
              {...register("taskTitle")}
              type="text"
              id="taskTitle"
              className="enhanced-input w-full"
              placeholder="Enter the task title"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="taskValue"
              className="block text-sm mb-2 text-tech-blue dark:text-democracy-beige"
            >
              Task Value:
            </label>
            <input
              {...register("taskValue", {
                validate: (value) =>
                  value > MinTaskValue ||
                  `Minimum value should be more than ${MinTaskValue}`,
              })}
              type="number"
              id="taskValue"
              className="enhanced-input w-full"
              placeholder={`Enter the task value (should be more than ${MinTaskValue})`}
            />
            {errors.taskValue?.message && (
              <p className="text-red-500 text-xs mt-1">
                {errors.taskValue.message as string}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              className="btn-primary-inverted"
              onClick={onClose}
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubmitTaskModal;
