import Web3 from "web3";
import MetaCoinArtifact from "./contracts/MetaCoin.json";

const getWeb3 = () =>
    new Promise((resolve, reject) => {
        window.addEventListener("load", async () => {
            const provider = new Web3.providers.HttpProvider("http://127.0.0.1:8545");
            const web3 = new Web3(provider);
            console.log("No web3 instance injected, using Local web3.");
            resolve(web3);

            // if (window.ethereum) {
            //     const web3 = new Web3(window.ethereum);
            //     try {
            //         await window.ethereum.request({ method: 'eth_requestAccounts' });
            //         resolve(web3);
            //     } catch (error) {
            //         reject(error);
            //     }
            //     console.log("aaa.");
            // } else if (window.web3) {
            //     const web3 = window.web3;
            //     console.log("Injected web3 detected.");
            //     resolve(web3);
            // } else {
            //     const provider = new Web3.providers.HttpProvider("http://127.0.0.1:8545");
            //     const web3 = new Web3(provider);
            //     console.log("No web3 instance injected, using Local web3.");
            //     resolve(web3);
            // }
        });
    });

const getContract = async (web3) => {
    const networkId = await web3.eth.net.getId();
    const deployedNetwork = MetaCoinArtifact.networks[networkId];
    const instance = new web3.eth.Contract(MetaCoinArtifact.abi, deployedNetwork && deployedNetwork.address);
    return instance;
};

export { getWeb3, getContract };
