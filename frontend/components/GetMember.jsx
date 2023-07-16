// import {abi} from "../../backend/artifacts/contracts/Membership.sol/Membership.json"
import {abi} from "../app/MembershipABI.json"

import { useContractWrite, usePrepareContractWrite, useWaitForTransaction, useAccount, useContractRead } from 'wagmi'

export default function GetMember() {

  const { address, isConnecting, isDisconnected } = useAccount()

      // Get problem counter
  const { data, isError, isLoading } = useContractRead({
    address: '0xdD74D79454306dBd2498811393d198C03aD5558e',
    abi: abi,
    functionName: "getMember",
    args: [address]
  })
  console.log(data)
    return (
        <div>
            {data}
        </div>
    );
}

