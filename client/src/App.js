// src/App.js

import React, { useState, useEffect } from "react";
import InputLabel from "./Components/InputLabel";
import TextInput from "./Components/TextInput";
import MainLayout from "./Layouts/MainLayout";
import { getWeb3, getContract } from "./getWeb3";

const App = () => {
  const [web3, setWeb3] = useState(null);
  const [accountInfos, setAccounts] = useState([]);
  const [contract, setContract] = useState(null);

  const [sender, setSender] = useState(null);
  const [receiver, setReceiver] = useState(null);
  const [amount, setAmount] = useState(0);

  const [transactionStatus, setTransactionStatus] = useState({});

  useEffect(() => {
    const initWeb3 = async () => {
      try {
        const web3Instance = await getWeb3();
        const contract = await getContract(web3Instance);

        setWeb3(web3Instance)
        setContract(contract)

        const accounts = await web3Instance.eth.getAccounts();
        const accountInfos = []
        for (let account of accounts) {
          accountInfos.push({
            account: account,
            balance: (await contract.methods.getBalance(account).call()).toString(),
            ether: (await contract.methods.getBalanceInEth(account).call()).toString()
          })
        }
        setAccounts(accountInfos);
      } catch (error) {
        console.error("Error connecting to web3", error);
      }
    };

    initWeb3();
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();
    sendCoin(receiver, amount, sender)
  };

  const sendCoin = async (receiver, amount, account) => {
    try {
      setTransactionStatus({ caption: 'Pending...', style: 'bg-cyan-500' });

      const receipt = await contract.methods.sendCoin(receiver, amount).send({ from: account });

      const events = receipt.events.TransferResult;
      const success = events ? events.returnValues.success : false;

      if (!success) throw new Error('Amount exceeded')

      setTransactionStatus({ caption: 'Transaction successful', style: 'bg-emerald-500' });

      const accounts = await web3.eth.getAccounts();
      const accountInfos = []
      for (let account of accounts) {
        accountInfos.push({
          account: account,
          balance: (await contract.methods.getBalance(account).call()).toString(),
          ether: (await contract.methods.getBalanceInEth(account).call()).toString()
        })
      }
      setAccounts(accountInfos);
    } catch (error) {
      setTransactionStatus({ caption: error.message, style: 'bg-red-500' });
    }
  };

  return (
    <MainLayout
      header={
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
            Decentralized Application
          </h2>
        </div>
      }
    >
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          {transactionStatus.caption && (
            <div className={transactionStatus.style + " py-2 px-4 text-white rounded mb-4"}>
              {transactionStatus.caption}
            </div>
          )}
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
            {accountInfos ? (
              <div className="p-6 text-gray-900 dark:text-gray-100">
                <table className="mt-3 w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-500">
                    <tr>
                      <th className="px-3 py-3">No</th>
                      <th className="px-3 py-3">Address</th>
                      <th className="px-3 py-3">Balance (MTC)</th>
                      <th className="px-3 py-3">Balance (ETH)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {accountInfos.map((info, i) => (
                      <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                        key={info.account}>
                        <td className="px-3 py-2">
                          {i + 1}
                        </td>
                        <td className="px-3 py-2">
                          {info.account}
                        </td>
                        <td className="px-3 py-2">
                          {info.balance}
                        </td>
                        <td className="px-3 py-2">
                          {info.ether}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <form
                  onSubmit={onSubmit}
                  className="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg"
                >
                  <div className="mt-4">
                    <div className="flex space-x-4">
                      <div className="w-5/12">
                        <InputLabel
                          htmlFor="sender_address"
                          value="Sender Address">
                        </InputLabel>
                        <TextInput
                          id="sender_address"
                          type="text"
                          className="mt-1 block w-full"
                          onChange={(e) => setSender(e.target.value)}
                        />
                      </div>
                      <div className="w-5/12">
                        <InputLabel
                          htmlFor="receiver_address"
                          value="Receiver Address">
                        </InputLabel>
                        <TextInput
                          id="receiver_address"
                          type="text"
                          className="mt-1 block w-full"
                          onChange={(e) => setReceiver(e.target.value)}
                        />
                      </div>
                      <div className="w-1/6">
                        <InputLabel
                          htmlFor="amount"
                          value="Amount (MTC)">
                        </InputLabel>
                        <TextInput
                          id="amount"
                          type="text"
                          className="mt-1 block w-full"
                          onChange={(e) => setAmount(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 text-right">
                    <button className="bg-emerald-500 py-1 px-3 text-white rounded shadow transition-all hover:bg-emerald-600">send</button>
                  </div>
                </form>
              </div>
            ) : (
              <button onClick={() => getWeb3()}>Connect Wallet</button>
            )}
          </div>
        </div>
      </div>

    </MainLayout>
  );
};

export default App;
