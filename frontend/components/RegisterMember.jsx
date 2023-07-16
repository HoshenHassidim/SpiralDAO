// import {abi} from "../../backend/artifacts/contracts/Membership.sol/Membership.json"
import {abi} from "../app/MembershipABI.json"
import {useState} from "react"
import { useContractWrite, usePrepareContractWrite, useWaitForTransaction, useAccount, useContractRead } from 'wagmi'
import GetMember from "./GetMember"


export default function RegisterMember() {
  const [username, setUsername] = useState('')

    // const { config, error: prepareError,
    //     isError: isPrepareError, } = usePrepareContractWrite({
    //     address: '0x5fbdb2315678afecb367f032d93f642f64180aa3',
    //     abi: abi,
    //     functionName: 'registerMember',
    //     args: [username],
    
    //   })
    
    //   const { data, error, isError, write } = useContractWrite(config)
    
    //   const { isLoading, isSuccess } = useWaitForTransaction({
    //     hash: data?.hash,
    //   })

      const handleChange = (e) => {
        // console.log(e.target.value);
        setUsername(e.target.value);
      }

    const { data, isLoading, isSuccess, write } = useContractWrite({
      // address: '0x5fbdb2315678afecb367f032d93f642f64180aa3',
      address: '0xdD74D79454306dBd2498811393d198C03aD5558e',
      abi: abi,
      functionName: 'registerMember',
      args: [username],
    })

    console.log(data)
    console.log("data")


    return (
      <div className="flex flex-col items-center gap-2">
        <input type="text" className="text-black" name="username" value={username} onChange={handleChange} />
      <button className="p-2 bg-blue-500 rounded-lg ml-2 hover:bg-blue-400" onClick={() => write()}>
        {isLoading ? 'Registering...' : 'Register as a member'}
      </button>
      
      <GetMember />
      {/* {data ? data : "HELLO"} */}
      {/* {isSuccess && (
        <div>
          Successfully registered
        </div>
      )} */}
    </div>
    )
}