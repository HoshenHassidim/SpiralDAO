// components/SubmitSolutionModal.tsx
import React, { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import abi from "../constants/Solutions.json";
import addresses from "../constants/networkMapping.json";
import { useContractWrite, useAccount } from "wagmi";
import createNotification from "../createNotification.js";
import { useRouter } from "next/navigation";
import { CustomError } from "@/common.types";

interface SubmitSolutionModalProps {
  isOpen: boolean;
  onClose: () => void;
  solutionId: string;
}

const SubmitSolutionModal: React.FC<SubmitSolutionModalProps> = ({
  isOpen,
  onClose,
  solutionId,
}) => {
  if (!isOpen) return null;

  const { register, handleSubmit } = useForm();
  const [name, setName] = useState<string | undefined>();
  const [submitCount, setSubmitCount] = useState(0);

  const { address } = useAccount();

  const { data, isLoading, isSuccess, write } = useContractWrite({
    address: addresses[4002].Solutions[0] as `0x${string}`,
    abi: abi,
    functionName: "proposeSolution",
    args: [solutionId, name],
    onError(error: CustomError) {
      createNotification(
        error.metaMessages ? error.metaMessages[0] : "An error occurred",
        "error"
      );
    },
    onSuccess(data) {
      createNotification("Solution posted", "success");
    },
  });

  const router = useRouter();

  useEffect(() => {
    if (isSuccess) {
      //   createNotification("Solution Posted Successfully", "success");
      onClose();
      //   router.push("/solutions");
      router.refresh();
    }
  }, [isSuccess]);

  const onSubmit = async (data: any) => {
    if (!address) {
      createNotification("Please connect wallet to post a solution", "error");
      return;
    }

    setName(data.solutionTitle);
    setSubmitCount((prevCount) => prevCount + 1);
  };

  useEffect(() => {
    if (name && address) {
      write();
    }
  }, [name, address, submitCount]);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-md">
      <div className="modal-content">
        <h3 className="text-xl mb-4 text-tech-blue dark:text-democracy-beige">
          Submit Your Solution
        </h3>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label
              htmlFor="solutionTitle"
              className="block text-sm mb-2 text-tech-blue dark:text-democracy-beige"
            >
              Solution Title:
            </label>
            <input
              {...register("solutionTitle")}
              type="text"
              id="solutionTitle"
              className="enhanced-input w-full"
              placeholder="Enter the solution title"
            />
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

export default SubmitSolutionModal;
