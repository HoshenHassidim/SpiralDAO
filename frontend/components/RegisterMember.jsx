import {abi} from "../../backend/artifacts/contracts/Membership.sol/Membership.json"

import { useContractWrite, usePrepareContractWrite, useWaitForTransaction, useAccount, useContractRead } from 'wagmi'


export default function RegisterMember() {


    const { config, error: prepareError,
        isError: isPrepareError, } = usePrepareContractWrite({
        address: '0x5fbdb2315678afecb367f032d93f642f64180aa3',
        abi: abi,
        functionName: 'registerMember',
        args: ["User1"],
    
      })
    
      const { data, error, isError, write } = useContractWrite(config)
    
      const { isLoading, isSuccess } = useWaitForTransaction({
        hash: data?.hash,
      })


    return (
      <div>
      <button className="p-2 bg-red-500 rounded-lg ml-2 hover:bg-red-300" onClick={() => write()}>
        {isLoading ? 'Registering...' : 'Register as a member'}
      </button>
      {/* {data ? data : "HELLO"} */}
      {isSuccess && (
        <div>
          Successfully registered
        </div>
      )}
    </div>
    )
}