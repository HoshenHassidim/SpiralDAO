import {abi} from "../../backend/artifacts/contracts/Problems.sol/Problems.json"

import { useContractWrite, usePrepareContractWrite, useWaitForTransaction, useAccount, useContractRead } from 'wagmi'

export default function GetProblemCounter() {

      // Get problem counter
  const { data, isError, isLoading } = useContractRead({
    address: '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0',
    abi: abi,
    functionName: "getProblemCounter",
  })
  console.log(data);
  console.log(isLoading);
    return (
        <div>
            {data}
        </div>
    );
}