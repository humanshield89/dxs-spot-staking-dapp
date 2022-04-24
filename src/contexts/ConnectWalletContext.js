import React, { createContext, useEffect, useState } from "react";
import { useWallet } from "use-wallet";
import { getRealProvider, waitForTransaction } from "../Web3Utils/generalUtils";
import { chainId, netAddRequest, rpcUrl, explorer } from "../utils/config";
import { useSnackbar } from "notistack";

import ConnectModal from "../components/ConnectModal";
import useSettings from "../hooks/useSettings";

const ConnectWalletContext = createContext({
  switchNetwork: null,
  connect: () => {},
  wrongNet: false,
  connected: false,
  getEthProvider: async () => {},
  disconnect: () => {},
});

export const ConnectWalletProvider = ({ children }) => {
  const wallet = useWallet();
  const { enqueueSnackbar } = useSnackbar();
  const { settings, saveSettings } = useSettings();
  // context
  const [connected, setConnected] = useState(false);
  const [wrongNet, setWrongNet] = useState(false);

  const [open, setOpen] = useState(false);

  // local
  const [lastToast, setLastToast] = useState(0);

  useEffect(() => {
    if (settings.walletConnected && !connected) {
      wallet.connect(
        settings.walletConnection ? settings.walletConnection : undefined
      );
    }
  }, [settings.walletConnected]);

  useEffect(() => {
    if (wallet.status === "connected" && wallet.chainId !== chainId) {
      if (lastToast === 0 || performance.now() - lastToast > 5000) {
        enqueueSnackbar(
          "Unsupported network only available on Binance Smart Chain",
          {
            variant: "error",
            autoHideDuration: 2000,
          }
        );
        setLastToast(performance.now());
      }
      setWrongNet(true);
    } else {
      setWrongNet(false);
    }
    setConnected(wallet.status === "connected" && wallet.chainId == chainId);
  }, [wallet.chainId, wallet.status]);

  const getEthProvider = async () =>
    connected && !wrongNet
      ? getRealProvider(wallet.ethereum)
      : getRealProvider(rpcUrl);

  const switchNetwork = async () => {
    try {
      // try and switch network
      await wallet.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x" + chainId.toString(16) }], // chainId must be
        // in hexadecimal
        // numbers
      });
    } catch (error) {
      // This error code indicates that the chain has not been added to MetaMask
      // if it is not, then lets add it into the user MetaMask
      if (error.code === 4902) {
        try {
          await wallet.ethereum.request(netAddRequest);
        } catch (addError) {
          console.error(addError);
        }
      }
      console.error(error.message);
      enqueueSnackbar(error.message, {
        variant: "error",
        autoHideDuration: 2000,
      });
    }
  };

  const connect = () => {
    setOpen(true);
  };

  const disconnect = () => {
    saveSettings({
      ...settings,
      walletConnected: false,
      walletConnection: "",
    });
    wallet.reset();
    setConnected(false);
    setWrongNet(false);
  };
  return (
    <ConnectWalletContext.Provider
      value={{
        connected,
        wrongNet,
        switchNetwork: switchNetwork,
        connect,
        disconnect,
        getEthProvider,
      }}
    >
      <>
        {children}
        <ConnectModal open={open} setOpen={setOpen} />
      </>
    </ConnectWalletContext.Provider>
  );
};

export const ConnectWalletConsumer = ConnectWalletContext.Consumer;

export default ConnectWalletContext;

export const handleTransactionPromise = async ({
  transactionPromise,
  successMessage,
  enqueueSnackbar,
  ethereum,
}) => {
  let tx;
  try {
    tx = await transactionPromise;
    const receipt = await waitForTransaction(tx, ethereum);

    if (receipt.status) {
      // transaction mined and did not revert
      enqueueSnackbar(successMessage, {
        variant: "success",
        autoHideDuration: 2000,
      });
      return true;
    } else {
      // transaction mined and did revert
      enqueueSnackbar("Transaction Reverted 😢", { variant: "error" });
      return false;
    }
  } catch (error) {
    enqueueSnackbar(error.message + " 😢", { variant: "error" });
    return false;
  }
};
