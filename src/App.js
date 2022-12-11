import Headandfoot from './components/Headandfoot';
import Hero from './components/Hero';
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';


const Balance = ({ provider, account }) => {
  const [balance, setBalance] = useState("");
  useEffect(() => {
    const getBalance = async () => {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const balance = await provider.getBalance(account);
      return ethers.utils.formatEther(balance);
    };
    getBalance().then(setBalance).catch(console.error);
  }, [account, provider]);
};

function App() {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);

  const checkAccounts = async () => {
    if (!window.ethereum) {
      return null;
    }
    const [account] = await window.ethereum.request({
      method: "eth_accounts",
    });
    window.ethereum.on("accountsChanged", accounts => {
      setAccount(accounts[0]);
    });
    return account;
  };

  const requestAccounts = async () => {
    if (!window.ethereum) {
      return null;
    }
    const [account] = await window.ethereum.request({
      method: "eth_requestAccounts",
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
    <>
      <Balance provider={provider} account={account} />
      <Headandfoot provider={provider} account={account}/>
      <Hero provider={provider} account={account}/>
    </>
  );
}

export default App;
