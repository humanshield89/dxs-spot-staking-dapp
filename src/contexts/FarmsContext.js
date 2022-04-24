import React, { createContext, useEffect, useState } from "react";
import usePrices from "../hooks/usePrices";
import useConnectWallet from "../hooks/useConnectWallet";
import {
  getEndTime,
  getIsFarmPaused,
  getRewardPerSecond,
  getStartTime,
  getTotalMultiplier,
  getTotalPaidOut,
  getTotalPendingRewards,
  hasFarmStarted,
  isActive,
} from "../Web3Utils/farmUtils";
import { getFarms } from "../Web3Utils/farm-core";
import useDXS from "../hooks/useDXS";

const FarmsContext = createContext({
  farmConfig: null,
  globalFarmStats: null,
  initGlobalStats: null,
  isInitGlobalStatsLoaded: false,
  farms: [],
  tvl: null,
});

export const FarmsProvider = ({ farmConfig, children }) => {
  const priceProvider = usePrices();
  const connectWallet = useConnectWallet();
  const dxs = useDXS();

  const [globalFarmStats, setGlobalFarmStats] = useState({
    totalMultipliers: null,
    rewardsPerSecond: null,
    active: null,
    paused: null,
    hasStarted: null,
    inEmergency: null,
  });
  const [isInitGlobalStatsLoaded, setIsInitGlobalStatsLoaded] = useState(false);

  const [farms, setFarms] = useState(farmConfig.farms);
  const [tvl, setTvl] = useState(null);

  useEffect(() => {
    if (!dxs.decimals) return;
    setFarms(farmConfig.farms);
    setIsInitGlobalStatsLoaded(false);
    setGlobalFarmStats({
      totalMultipliers: null,
      rewardsPerSecond: null,
    });
  }, [farmConfig, dxs.decimals]);

  useEffect(() => {
    if (!isInitGlobalStatsLoaded) {
      setIsInitGlobalStatsLoaded(
        globalFarmStats.totalMultipliers && globalFarmStats.rewardsPerSecond
      );
    }
  }, [globalFarmStats]);

  useEffect(() => {
    if ((priceProvider.loaded, dxs.decimals, priceProvider.lpPrices)) {
      initFarms();
    }
  }, [priceProvider.loaded, dxs.decimals]);

  useEffect(() => {
    let tempTvl = 0;
    farms.forEach((farm) => {
      tempTvl = tempTvl + farm.tvl;
    });
    setTvl(tempTvl ? tempTvl : 0);
  }, [farms]);

  const initFarms = async () => {
    setFarms(
      await getFarms(
        await connectWallet.getEthProvider(),
        globalFarmStats.rewardsPerSecond,
        globalFarmStats.totalMultipliers,
        await priceProvider.getLPPricesPrice(),
        dxs.dxsPrice,
        dxs.dxsDecimals,
        farmConfig
      )
    );
  };

  const initGlobalStats = async (withUpdate) => {
    let rewardsPerSecond = globalFarmStats.rewardsPerSecond;
    if (!globalFarmStats.rewardsPerSecond || withUpdate) {
      rewardsPerSecond = await getRewardPerSecond(
        await connectWallet.getEthProvider(),
        farmConfig.address
      );
      setGlobalFarmStats({ ...globalFarmStats, rewardsPerSecond });
    }

    let totalMultipliers = globalFarmStats.totalMultipliers;
    if (!globalFarmStats.totalMultipliers || withUpdate) {
      totalMultipliers = await getTotalMultiplier(
        await connectWallet.getEthProvider(),
        farmConfig.address
      );
      setGlobalFarmStats({ ...globalFarmStats, totalMultipliers });
    }

    const active = await isActive(
      await connectWallet.getEthProvider(),
      farmConfig.address
    );
    const paused = await getIsFarmPaused(
      await connectWallet.getEthProvider(),
      farmConfig.address
    );
    const startTime = await getStartTime(
      await connectWallet.getEthProvider(),
      farmConfig.address
    );
    const endTime = await getEndTime(
      await connectWallet.getEthProvider(),
      farmConfig.address
    );
    const hasStarted = await hasFarmStarted(
      await connectWallet.getEthProvider(),
      farmConfig.address
    );

    const totalClaimed = await getTotalPaidOut(
      await connectWallet.getEthProvider(),
      farmConfig.address
    );

    const totalPending = await getTotalPendingRewards(
      await connectWallet.getEthProvider(),
      farmConfig.address
    );

    setGlobalFarmStats((prev) => {
      return {
        ...prev,
        totalMultipliers,
        rewardsPerSecond,
        active,
        startTime,
        endTime,
        paused,
        hasStarted,
        totalClaimed,
        totalPending,
      };
    });
    return {
      rewardsPerSecond,
      totalMultipliers,
    };
  };

  useEffect(() => {
    initGlobalStats();
  }, [farmConfig]);

  return (
    <FarmsContext.Provider
      value={{
        farmConfig,
        globalFarmStats,
        isInitGlobalStatsLoaded,
        initGlobalStats,
        farms,
        tvl,
      }}
    >
      {children}
    </FarmsContext.Provider>
  );
};

export const FarmsConsumer = FarmsContext.Consumer;

export default FarmsContext;
