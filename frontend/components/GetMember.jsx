import {abi} from "../../backend/artifacts/contracts/Membership.sol/Membership.json"

import { useContractWrite, usePrepareContractWrite, useWaitForTransaction, useAccount, useContractRead } from 'wagmi'

export default function GetMember() {

  const { address, isConnecting, isDisconnected } = useAccount()

      // Get problem counter
  const { data, isError, isLoading } = useContractRead({
    address: '0x5fbdb2315678afecb367f032d93f642f64180aa3',
    abi: abi,
    functionName: "getMember",
    args: [address]
  })
    return (
        <div>
            {data}
        </div>
    );
}

