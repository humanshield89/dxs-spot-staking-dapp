const Web3 = require("web3");

export const getRealProvider = async (ethereum) => {
  let realProvider;

  if (typeof ethereum === "string") {
    if (ethereum.includes("wss")) {
      realProvider = new Web3.providers.WebsocketProvider(ethereum, {
        timeout: 10000,
      });
    } else {
      realProvider = new Web3.providers.HttpProvider(ethereum, {
        timeout: 10000,
      });
    }
  } else {
    realProvider = ethereum;
  }

  return new Web3(realProvider);
};

export const getRealContract = async (address, ethereum, abi, log) => {
  if (!abi) {
    console.log("=========================   log");
  }
  const web3 = await getRealProvider(ethereum);
  return new web3.eth.Contract(abi, address);
};
// helper functions
export const waitForTransaction = async (pendingTxHash, ethereum) => {
  return new Promise(async (resolve, reject) => {
    let receipt;
    do {
      await sleep(2200); // this will be roughly one block on Polygon main net
      receipt = await ethereum.eth
        .getTransactionReceipt(pendingTxHash)
        .catch((error) => reject(error));
    } while (!receipt);
    //await sleep(4000); // lets wait for 2 more blocks to comfirm
    resolve(receipt);
  });
};

export const getNativeTokenBalance = async (ethereum, account) => {
  return ethereum.eth.getBalance(account);
};

export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
