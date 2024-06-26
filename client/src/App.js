// src/App.js

import React, { useState, useEffect } from "react";
import {getWeb3, getContract} from "./getWeb3";

const App = () => {
  // const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);
  // const [contract, setContract] = useState(null);
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    const initWeb3 = async () => {
      try {
        const web3Instance = await getWeb3();
        const contract = await getContract(web3Instance);
        const accounts = await web3Instance.eth.getAccounts();

        // setWeb3(web3Instance)
        // setContract(contract)
        setAccount(accounts[0]);

        const balance = await contract.methods.getBalance(accounts[0]).call();
        setBalance(balance.toString());
      } catch (error) {
        console.error("Error connecting to web3", error);
      }
    };

    initWeb3();
  }, []);

  return (
    <div className="App">
      <h1>Decentralized Application</h1>
      {account ? (
        <div>
          <p>Connected account: {account}</p>
        </div>
      ) : (
        <button onClick={() => getWeb3()}>Connect Wallet</button>
      )}
      {balance && (
        <div>
          <p>Account balance: {balance} MTC</p>
        </div>
      )}
    </div>
  );
};

export default App;
