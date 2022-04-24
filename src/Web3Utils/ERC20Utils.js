import { getRealContract } from "./generalUtils";

const { chainId } = require("../utils/config");

export const getERC20Balance = async (realContract, account) => {
  return realContract.methods.balanceOf(account).call();
};

export const getDecimals = async (realContract) => {
  return realContract.methods.decimals().call();
};

export const getSymbol = async (realContract) => {
  return realContract.methods.symbol().call();
};

export const getName = async (realContract) => {
  return realContract.methods.name().call();
};

export const getTotalSupply = async (realContract) => {
  return realContract.methods.totalSupply().call();
};

export const getAllowance = async (realContract, owner, spender) => {
  return realContract.methods.allowance(owner, spender).call();
};

// write functions

export const approve = async (realContract, spender, amount, wallet) => {
  const data = realContract.methods.approve(spender, amount).encodeABI();

  const transactionParams = {
    to: realContract.options.address,
    from: wallet.account,
    data: data,
    chainId: chainId,
  };

  return wallet.ethereum.request({
    method: "eth_sendTransaction",
    params: [transactionParams],
  });
};

export const addToMetamask = async (
  address,
  symbol,
  decimals,
  image,
  wallet
) => {
  const transactionParams = {
    type: "ERC20", // Initially only supports ERC20, but eventually more!
    options: {
      address: address, // The address that the token is at.
      symbol: symbol, // A ticker symbol or shorthand, up to 5 chars.
      decimals: decimals, // The number of decimals in the token
      image: image, // A string url of the token logo
    },
  };

  return wallet.ethereum.request({
    method: "wallet_watchAsset",
    params: transactionParams,
  });
};
