import React, { createContext, useEffect, useState } from "react";
import useConnectWallet from "../hooks/useConnectWallet";
import useDXS from "../hooks/useDXS";
import { getLPPrice } from "../Web3Utils/PriceUtils";
import configs from "../utils/config";

const PricesContext = createContext({
  lpPrices: null,
  getLPPricesPrice: null,
  loaded: false,
});

export const PricesProvider = ({ farmConfig, children }) => {
  const walletConnection = useConnectWallet();
  const dxs = useDXS();
  const [lpPrices, setLpPrices] = useState();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(false);
  }, [farmConfig]);

  useEffect(() => {
    if (!loaded) {
      let hasLoadd = dxs.dxsPrice;
      farmConfig.farms.forEach(
        (farm, i) => (hasLoadd = hasLoadd && lpPrices && lpPrices[i])
      );
      if (hasLoadd !== loaded) setLoaded(hasLoadd);
    }
  }, [lpPrices, farmConfig, loaded]);

  const getLPPricesPrice = async (forceUpdate) => {
    if (lpPrices && loaded) return lpPrices;

    const lpPrx = await Promise.all(
      farmConfig.farms.map(async (farm) => {
        return getLPPrice(
          farm.stakedToken.address,
          configs.dxsTokenAddress,
          dxs.dxsPrice,
          farm.weight,
          await walletConnection.getEthProvider()
        );
      })
    );
    setLpPrices(lpPrx);
    return lpPrx;
  };

  useEffect(() => {
    if (loaded) getLPPricesPrice();
  }, [farmConfig, loaded]);

  return (
    <PricesContext.Provider
      value={{
        lpPrices,
        loaded,
        getLPPricesPrice,
      }}
    >
      {children}
    </PricesContext.Provider>
  );
};

export const PricesConsumer = PricesContext.Consumer;

export default PricesContext;
