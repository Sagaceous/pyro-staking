import React, { useState, useEffect } from 'react';
import '../App.css';
import Heropyro from '../assets/Pyrohero.svg';
import Imageright from '../assets/imageright.svg';
import BackgroundImg from '../assets/backgroundurl.svg';
import Stake from '../assets/stake.svg';
import Unstake from '../assets/unstake.svg';
import { ethers } from 'ethers';
import Externallink from '../assets/external-link.svg';
import axios from 'axios';
import { PYRO_TOKEN, PYRO_TOKEN_ADDRESS, Staking } from '../utils/interact';
import Headandfoot from './Headandfoot';

const getStakingViews = async (provider, account) => {
  const signer = provider.getSigner(account);
  const staking = Staking.connect(signer);
  const [staked, reward, totalStaked] = await Promise.all([
    staking.stakedOf(account),
    staking.rewardOf(account),
    staking.totalStaked(),
  ]);
  return {
    staked: ethers.utils.formatEther(staked),
    reward: ethers.utils.formatEther(reward),
    totalStaked: ethers.utils.formatEther(totalStaked),
  };
};

const addPyroToMetamask = async () => {
  if (!window.ethereum) {
    return false;
  }
  try {
    const added = await window.ethereum.request({
      method: 'wallet_watchAsset',
      params: {
        type: 'ERC20',
        options: {
          address: PYRO_TOKEN_ADDRESS,
          symbol: 'PYRO',
          decimals: 18,
          image: 'https://ata-token.netlify.app/opn.png',
        },
      },
    });
    return added;
  } catch (error) {
    return false;
  }
};

const Hero = ({ account, provider }) => {
  const [val1, setVal1] = React.useState({ min: 0, max: 100 });
  const [balance, setBalance] = useState('');
  const [claimed, setClaimed] = useState(false);
  const [views, setViews] = useState({});
  const [stake, setStake] = useState('');
  const [withdraw, setWithdraw] = useState('');

  const handleStake = async (event) => {
    event.preventDefault();
    const signer = provider.getSigner(account);
    const amount = ethers.utils.parseEther(stake);

    const pyroToken = PYRO_TOKEN.connect(signer);
    const allowance = await pyroToken.allowance(account, Staking.address);
    if (allowance.lt(amount)) {
      const tx = await pyroToken.approve(Staking.address, amount);
      await tx.wait();
    }

    const staking = Staking.connect(signer);

    const tx = await staking.stake(amount, {
      gasLimit: 1_000_000,
    });
    await tx.wait();
  };

  const getBalanceandClaimed = async (account, provider) => {
    const pyroToken = PYRO_TOKEN.connect(provider);
    const [balance, claimed] = await Promise.all([
      pyroToken.balanceOf(account),
      pyroToken.hasClaimed(account),
    ]);
    return [ethers.utils.formatEther(balance), claimed];
  };

  const claim = async () => {
    const signer = provider.getSigner();
    const pyroToken = PYRO_TOKEN.connect(signer);
    const tx = await pyroToken.claim({
      gasLimit: 1_000_000,
    });
    const receipt = await tx.wait();
    console.log(receipt);

    getBalanceandClaimed(account, provider)
      .then((balance, claimed) => {
        setBalance(balance);
        setClaimed(claimed);
      })
      .catch(console.error);
  };

  useEffect(() => {
    getBalanceandClaimed(account, provider)
      .then(([balance, claimed]) => {
        setBalance(balance);
        setClaimed(claimed);
      })
      .catch(console.error);
  }, [provider, account]);

  console.log(balance);

  useEffect(() => {
    getStakingViews(account, provider).then(setViews).catch(console.error);
  }, [account, provider]);

  return (
    <div className="main relative lg:left-20 lg:top-10">
      <div className="absolute flex flex-row lg:space-x-[50px] lg:ml-[220px] space-x-[10px] ml-[30px] ">
        <div className="grid1 relative w-[240px] lg:w-[296px]">
          <div>
            <p className="amount absolute top-3 left-2 text-amount ml-1">
              Holder Amount Staked
            </p>
            <img
              src={Heropyro}
              className="vector absolute top-10 ml-1"
              alt=""
            />
            <h2 className="dollar top-16 px-4 py-2 ml-1 lg:text-2xl text-xl">
              $0,000,000.00
            </h2>
            <img
              src={Imageright}
              className="absolute top-3 right-0 pr-5 pt-1"
              alt=""
            />
          </div>
        </div>
        <div className="grid2 relative w-[240px] lg:w-[296px]">
          <div>
            <p className="amount absolute top-3 left-2 ml-1 text-amount">
              Holder Amount Earned
            </p>
            <img
              src={Heropyro}
              className="vector absolute top-10 ml-1"
              alt=""
            />
            <h2 className="dollar top-16 px-4 py-2 ml-1 lg:text-2xl text-xl">
              $0,000,000.00
            </h2>
            <img
              src={Imageright}
              className="absolute top-3 right-0 pr-5 pt-1"
              alt=""
            />
          </div>
        </div>
        <div className="grid3 relative w-[240px] lg:w-[296px]">
          <div>
            <p className="amount absolute top-3 left-2 ml-1 text-amount">
              Unlock Time
            </p>
            <h2 className="time top-10 px-4 py-2 ml-[7px] text-2xl lg:text-[25px] lg:tracking-[2px]">
              59 : 49 : 39 : 29{' '}
            </h2>
            <div className="timeline flex items-center ml-1 pt-20 mt-1 lg:space-x-4 space-x-1 text-[10px]">
              <p className="pl-5">Days</p>
              <p className="pl-5">Hours</p>
              <p className="pl-5">Mins</p>
              <p className="pl-5">Secs</p>
            </div>
            <img
              src={Imageright}
              className="absolute top-3 right-0 pr-5 pt-1"
              alt=""
            />
          </div>
        </div>
      </div>
      <div className="largegrid1 relative lg:ml-[220px] ml-[30px] lg:w-[475px] w-[350px]">
        <h2 className="stake absolute top-8 ml-2 px-4 py-2">Stake</h2>
        <button onClick={claim}>CLAIM SOME</button>
        <h2 className="balance absolute top-8 right-7 py-2">
          Balance: {balance || '0.0'}
        </h2>
        <div className="divider mt-24 lg:w-[420px] w-[310px] ml-7 h-[2px]"></div>
        <div className="inputamount ml-2">
          <img className="mt-[2px]" src={BackgroundImg} alt="" />
          <input
            className="number mt-5 ml-4 rounded-lg"
            placeholder="0.00"
            type="number"
            value={stake}
            onChange={(e) => setStake(e.target.value)}
          />
        </div>

        <div>
          <input
            className="slider mt-10 ml-7"
            type="range"
            min={0}
            max={100}
            value={val1}
            onChange={(ev, v) => setVal1(v)}
          />
          <button className="absolute max rounded-lg ml-5 mt-9">Max</button>
        </div>
        <div className="flex mt-16 ml-5 items-center space-x-8">
          <div className="relative">
            <button>
              <img src={Stake} alt="" />
              <div className="stake1" onClick={handleStake}>STAKE</div>
            </button>
          </div>
          <div className="relative">
            <button>
              <img src={Unstake} alt="" />
              <div className="stake2">UNSTAKE</div>
            </button>
          </div>
        </div>
      </div>
      <div className="smallgrid1 relative lg:w-[475px] w-[350px] lg:left-[735.65px] left-[400px]">
        <div>
          <p className="totalpyro absolute top-8 left-4">
            Total Pyro Staked By All Holders
          </p>
          <p className="totalpyro1 absolute flex items-center mt-16 ml-[19px]">
            <img className="mr-2 w-[80px]" src={Heropyro} alt="" />
            $000,000,000
          </p>
          <p className="totalpyro2 absolute top-28 mt-2 right-4">
            USDT value: $0,000.00
          </p>
        </div>
      </div>
      <div className="smallgrid2 relative lg:left-[735.65px] left-[400px] lg:w-[475px] w-[350px]">
        <div className="flex lg:space-x-[217px] space-x-[94px] mt-4">
          <h3 className="same1 ml-[18px]">More Info</h3>
          <p className="same2 flex items-center">
            View Pyro on Etherscan{' '}
            <img className="ml-[3px]" src={Externallink} alt="" />
          </p>
        </div>
        <div className="divider absolute h-[2px] top-[55px] ml-5 w-[91%]"></div>
        <div className="flex items-center lg:space-x-[173px] space-x-[50px] mt-10">
          <h3 className="same1 ml-[18px]">Staking Instructions</h3>
          <p className="same2 flex first-letter">
            View Instructions <img className="ml-1" src={Externallink} alt="" />
          </p>
        </div>

        <p className="same1 absolute ml-[18px] mt-7">PYRO APR</p>
        <div className="percent absolute ml-[395px] mt-4"></div>
        <p className="absolute same3 lg:ml-[400px] ml-[290px] mt-7">10.0%</p>
      </div>
    </div>
  );
};

export default Hero;
