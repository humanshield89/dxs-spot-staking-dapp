import React, { createContext, useEffect, useState } from "react";
import { getRealContract } from "../Web3Utils/generalUtils";
import useConnectWallet from "../hooks/useConnectWallet";
import configs from "../utils/config";
import { getToken0PriceInToken1 } from "../Web3Utils/PriceUtils";
import { erc20ABI } from "../Web3Utils/Abi/ERC20Abi";
import { getDecimals } from "../Web3Utils/ERC20Utils";

const DXSContext = createContext({
  configs: configs,
  dxsDecimals: null,
  dxsPrice: null,
  bnbPrice: null,
});

export const DXSProvider = ({ children }) => {
  const [dxsPrice, setDXSPrice] = useState();
  const [dxsDecimals, setDxsDecimals] = useState();
  const [bnbPrice, setBnbPrice] = useState();

  const { getEthProvider, connected, wrongNet } = useConnectWallet();
  const [time, setTime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setTime(performance.now()), 10000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    init();
    if (connected && !wrongNet) {
      initUser();
    }
  }, [connected, time]);

  const initUser = () => {
    //
  };

  useEffect(() => {
    console.log("dxsDecimals = " + dxsDecimals);
    console.log("dxsPrice = " + dxsPrice);
  }, [dxsDecimals, dxsPrice]);

  const init = () => {
    getDXSContract().then(async (contract) => {
      await initPrices(contract);
      setDxsDecimals(await getDecimals(contract));
    });

    if (connected && !wrongNet) {
      initUser();
    }
  };

  const getDXSContract = async () => {
    const provider = await getEthProvider();
    return getRealContract(
      configs.dxsTokenAddress,
      provider,
      erc20ABI,
      "getDXSContract"
    );
  };

  const initPrices = async (contract) => {
    //const decimals = 9;
    const priceInBNB = await getToken0PriceInToken1(
      configs.dxsTokenAddress,
      configs.wBNB,
      configs.lpPairAddress,
      await getEthProvider()
    );
    const bnbPrice = await getToken0PriceInToken1(
      configs.wBNB,
      configs.usdc,
      configs.usdcBNBPair,
      await getEthProvider()
    );
    setBnbPrice(bnbPrice);

    setDXSPrice(bnbPrice * priceInBNB);
  };

  return (
    <DXSContext.Provider
      value={{
        dxsDecimals,
        dxsPrice,
        bnbPrice,
        init,
        configs,
      }}
    >
      {children}
    </DXSContext.Provider>
  );
};

export const DXSConsumer = DXSContext.Consumer;

export default DXSContext;
