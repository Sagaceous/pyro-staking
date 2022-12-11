import React from 'react';
import Vector from '../assets/Vector.svg';
import NewPyro from '../assets/NewPyro.png';
import Nav from '../assets/nav.svg';
import '../App.css';
import Button from '../assets/button.svg';
import Socials from '../assets/social.svg';
import { ethers } from 'ethers';
import { useState, useEffect } from 'react';
import { PYRO_TOKEN, Staking } from '../utils/interact';

const Headandfoot = () => {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);

  const checkAccounts = async () => {
    // if (!window.ethereum) {
    //   return null;
    // }
    const [account] = await window.ethereum.request({
      method: 'eth_accounts',
    });

    window.ethereum.on('accountsChanged', (accounts) => {
      setAccount(accounts[0]);
    });
    return account;
  };

  const requestAccounts = async () => {
    if (!window.ethereum) {
      return null;
    }
    const [account] = await window.ethereum.request({
      method: 'eth_requestAccounts',
    });
    return account;
  };

  useEffect(() => {
    checkAccounts().then(setAccount).catch(console.error);
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(provider);
    }
  }, []);


  return (
    <div>
      <img
        src={Vector}
        className="absolute object-cover w-screen h-screen"
        alt="bg-img"
      />

      <img src={NewPyro} className="absolute bottom-0 right-0" alt="" />
      <img
        src={Nav}
        style={{
          position: 'absolute',
          left: '5.28%',
          right: '80.56%',
          top: '3.91%',
          bottom: '91.22%',
        }}
        alt=""
      />

      <button
        onClick={requestAccounts}
        className="connect relative lg:left-[1100px] left-[500px] top-12 lg:w-[20%] w-[250px] rounded-full p-4 cursor-pointer"
      >
        {account || 'CONNECT WALLET'}
      </button>

      <div className="divider absolute bottom-20 h-[2px] lg:w-[85%] w-[92%] ml-10 lg:ml-28">
        <p className="rights absolute mt-4">
          Pyro Matic @ 2022 All rights reserved.
        </p>
        <p className="powered absolute mt-10">Powered by Pyro</p>
        <img className="absolute right-1 mt-4" src={Socials} alt="" />
      </div>
    </div>
  );
};

export default Headandfoot;
