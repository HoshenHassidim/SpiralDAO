// import Connect from '../components/Connect'
// import Web3Button from "@web3modal/react"
// export default function Home() {
//   return (
//     <main className="flex h-full justify-center items-center">
//       <button className="bg-gray-500 p-2 rounded-md">Connect</button>
//       <button className="bg-gray-500 p-2 rounded-md">Register member</button>
//       <Web3Button />
//     </main>
//   )
// }


// "use client"
// import React, { useState, useEffect } from "react";
// import Web3Modal from "web3modal";
// import WalletConnectProvider from "@walletconnect/web3-provider";
// import { MetaMaskConnector } from '@wagmi/core/connectors/metaMask'



// export default function App() {
//   const [provider, setProvider] = useState(null);
//   const [account, setAccount] = useState(null);
//   const [web3Modal, setWeb3Modal] = useState(null);
//   const connector = new MetaMaskConnector()



//   useEffect(() => {
//     /* Create a web3Modal instance and store it in state */
//     const web3ModalInstance = new Web3Modal({
//       network: "mainnet",
//       cacheProvider: true,
//       providerOptions: {
//         walletconnect: {
//           package: WalletConnectProvider,
//           options: {
//             infuraId: "INFURA_ID",
//           },
//         },
//       },
//     });
//     setWeb3Modal(web3ModalInstance);

//     if (web3ModalInstance.cachedProvider) {
//       web3ModalInstance.connect().then((provider) => {
//         setProvider(provider);
//         provider.request({ method: "eth_requestAccounts" }).then((accounts) => {
//           setAccount(accounts[0]);
//         });
//       });
//     }
//   }, []);

//   const handleConnect = async () => {
//     if(web3Modal){
//       const provider = await web3Modal.connect();
//       setProvider(provider);
//       const accounts = await provider.request({ method: "eth_requestAccounts" });
//       setAccount(accounts[0]);
//     }
//   };

//   const handleDisconnect = async () => {
//     if(web3Modal && provider){
//       await provider.close();
//       await web3Modal.clearCachedProvider();
//       setProvider(null);
//       setAccount(null);
//     }
//   };

//   return (
//     <div>
//       <h1>Wallet Connect Example</h1>
//       {provider ? (
//         <div>
//           <p>Connected with {provider.connector ? provider.connector.name: '<connector_name>'}</p>
//           <p>Account: {account}</p>
//           <button onClick={handleDisconnect}>Disconnect</button>
//         </div>
//       ) : (
//         <button onClick={handleConnect}>Connect Wallet</button>
//       )}
//     </div>
//   );
// }

// "use client"
// import { ConnectButton } from '@rainbow-me/rainbowkit';
// import type { NextPage } from 'next';
// import Head from 'next/head';
// // import styles from '../styles/Home.module.css';

// const Home: NextPage = () => {
//   return (
//     <div className={styles.container}>
//       <Head>
//         <title>RainbowKit App</title>
//         <meta
//           content="Generated by @rainbow-me/create-rainbowkit"
//           name="description"
//         />
//         <link href="/favicon.ico" rel="icon" />
//       </Head>

//       <main className={styles.main}>
//         <ConnectButton />

//         <h1 className={styles.title}>
//           Welcome to <a href="">RainbowKit</a> + <a href="">wagmi</a> +{' '}
//           <a href="https://nextjs.org">Next.js!</a>
//         </h1>

//         <p className={styles.description}>
//           Get started by editing{' '}
//           <code className={styles.code}>pages/index.tsx</code>
//         </p>

//         <div className={styles.grid}>
//           <a className={styles.card} href="https://rainbowkit.com">
//             <h2>RainbowKit Documentation &rarr;</h2>
//             <p>Learn how to customize your wallet connection flow.</p>
//           </a>

//           <a className={styles.card} href="https://wagmi.sh">
//             <h2>wagmi Documentation &rarr;</h2>
//             <p>Learn how to interact with Ethereum.</p>
//           </a>

//           <a
//             className={styles.card}
//             href="https://github.com/rainbow-me/rainbowkit/tree/main/examples"
//           >
//             <h2>RainbowKit Examples &rarr;</h2>
//             <p>Discover boilerplate example RainbowKit projects.</p>
//           </a>

//           <a className={styles.card} href="https://nextjs.org/docs">
//             <h2>Next.js Documentation &rarr;</h2>
//             <p>Find in-depth information about Next.js features and API.</p>
//           </a>

//           <a
//             className={styles.card}
//             href="https://github.com/vercel/next.js/tree/canary/examples"
//           >
//             <h2>Next.js Examples &rarr;</h2>
//             <p>Discover and deploy boilerplate example Next.js projects.</p>
//           </a>

//           <a
//             className={styles.card}
//             href="https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
//           >
//             <h2>Deploy &rarr;</h2>
//             <p>
//               Instantly deploy your Next.js site to a public URL with Vercel.
//             </p>
//           </a>
//         </div>
//       </main>

//       <footer className={styles.footer}>
//         <a href="https://rainbow.me" rel="noopener noreferrer" target="_blank">
//           Made with ❤️ by your frens at 🌈
//         </a>
//       </footer>
//     </div>
//   );
// };

// export default Home;
"use client"

import { Web3Button } from "@web3modal/react";
import {useEffect, useState} from "react"

// components
import GetProblemCounter from "../components/GetProblemCounter";
import RegisterMember from "../components/RegisterMember"

import { useContractWrite, usePrepareContractWrite, useWaitForTransaction, useAccount, useContractRead } from 'wagmi'


export default function home() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  //Address:
  const { address, isConnecting, isDisconnected } = useAccount()
  

  if(!mounted) return <></>
 

  return (
    <div className="mt-5 flex flex-col gap-2 justify-center items-center h-full">
      {/* <div>{address}</div> */}
      <Web3Button /> 

      {/* <GetProblemCounter /> */}
      <RegisterMember />
 
    </div>
  )
  
}
