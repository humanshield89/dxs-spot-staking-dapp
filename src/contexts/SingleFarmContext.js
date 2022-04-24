import React, { createContext, useEffect, useState } from "react";
import { useWallet } from "use-wallet";
import { getFarmDetails, sleep } from "../Web3Utils/farm-core";
import {
  getAllowance,
  getERC20Balance as getBalance,
} from "../Web3Utils/ERC20Utils";
import useFarms from "../hooks/useFarms";
import useConnectWallet from "../hooks/useConnectWallet";
import usePrices from "../hooks/usePrices";
import { getRealContract } from "../Web3Utils/generalUtils";
import useDXS from "../hooks/useDXS";
import * as configs from "../utils/config";
import {
  getStaked,
  getUserDeposits,
  getUserPending,
} from "../Web3Utils/farmUtils";

const { erc20ABI } = require("../Web3Utils/Abi/ERC20Abi");

const SingleFarmContext = createContext({
  farm: null,
  userInfo: null,
  updateUserInfo: null,
  updateFarmInfo: null,
  waitForApproval: null,
  waitForDepositOrWithdrawal: null,
  waitForClaim: null,
});

export const SingleFarmProvider = ({ pid, children }) => {
  const wallet = useWallet();
  const connectWallet = useConnectWallet();
  const priceProvider = usePrices();
  const dxs = useDXS();

  const { farmConfig, globalFarmStats, isInitGlobalStatsLoaded } = useFarms();

  const [farm, setFarm] = useState(farmConfig.farms[pid]);
  const [userInfo, setUserInfo] = useState(null);

  const [time, setTime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setTime(performance.now()), 60000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    setFarm(farmConfig.farms[pid]);
  }, [farmConfig, pid]);

  useEffect(() => {
    if (isInitGlobalStatsLoaded && dxs.dxsDecimals) {
      updateFarmInfo(pid);
    }
  }, [
    isInitGlobalStatsLoaded,
    farmConfig,
    dxs.dxsDecimals,
    dxs.dxsPrice,
    time,
  ]);

  useEffect(() => {
    updateUserInfo(true);
  }, [
    wallet.account,
    connectWallet.connected,
    dxs.dxsDecimals,
    farm,
    isInitGlobalStatsLoaded,
    time,
  ]);

  const updateFarmInfo = async () => {
    const { rewardsPerSecond, totalMultipliers } = globalFarmStats;
    const lpPrices = await priceProvider.getLPPricesPrice();

    const farmRes = await getFarmDetails(
      farm,
      rewardsPerSecond,
      totalMultipliers,
      farmConfig.address,
      await connectWallet.getEthProvider(),
      lpPrices[farm.pid],
      dxs.dxsPrice,
      dxs.dxsDecimals
    );

    setFarm(farmRes);
  };

  const updateUserInfo = async (foreground) => {
    if (foreground) {
      setUserInfo(null);
    }
    let userInfo = {};
    /*
    let userInfo = {
      pid: pid,
      staked: 0,
      balance: 0,
      pending: 0,
      allowance: 0,
      shareRatio: 0,
      weeklyRewards: 0,
      deposits: [],
    };
    /
   */
    if (connectWallet.connected && !connectWallet.wrongNet && wallet.account) {
      const erc20 = await getRealContract(
        farm.stakedToken.address,
        wallet.ethereum,
        erc20ABI
      );
      const dxsContract = await getRealContract(
        configs.dxsTokenAddress,
        wallet.ethereum,
        erc20ABI
      );

      let deposits = await getUserDeposits(
        await connectWallet.getEthProvider(),
        farmConfig.address,
        farm.pid,
        wallet.account
      ).catch((error) => {
        console.log(error.message);
      });

      deposits = deposits.map((d) => {
        return {
          ...d,
          unlockTime:
            Number(d.depositTime) + Number(farm.lockPeriod) * 24 * 60 * 60,
        };
      });

      const staked = await getStaked(
        farmConfig.address,
        await connectWallet.getEthProvider(),
        farm.pid,
        wallet.account
      );

      const myShareRatio = Number(staked) / Number(farm.totalStaked);
      userInfo = {
        pid: pid,
        staked: staked,
        dciBalance: await getBalance(dxsContract, wallet.account),
        balance: await getBalance(erc20, wallet.account),
        pending: await getUserPending(
          await connectWallet.getEthProvider(),
          farmConfig.address,
          pid,
          wallet.account
        ),
        allowance: await getAllowance(
          erc20,
          wallet.account,
          farmConfig.address
        ),
        shareRatio: isNaN(myShareRatio) ? 0 : myShareRatio,
        yearlyRewardsValue: farm.rewardsPerYear * myShareRatio,
        deposits,
      };
    }
    setUserInfo(userInfo);
  };

  const waitForClaim = async () => {
    const oldBalance = Number(userInfo.pending);

    let currBalance = Number(
      await getUserPending(
        await connectWallet.getEthProvider(),
        farmConfig.address,
        pid,
        wallet.account
      )
    );
    do {
      currBalance = Number(
        await getUserPending(
          await connectWallet.getEthProvider(),
          farmConfig.address,
          pid,
          wallet.account
        )
      );
      await sleep(3000);
    } while (currBalance === oldBalance);
  };

  const waitForDepositOrWithdrawal = async () => {
    const oldDeposit = Number(userInfo.staked);

    let currStake = Number(
      await getStaked(
        farmConfig.address,
        await connectWallet.getEthProvider(),
        pid,
        wallet.account
      )
    );
    do {
      currStake = Number(
        await getStaked(
          farmConfig.address,
          await connectWallet.getEthProvider(),
          pid,
          wallet.account
        )
      );
      await sleep(5000); // wait for more blocks
    } while (currStake === oldDeposit);
  };

  const waitForApproval = async () => {
    const erc20 = await getRealContract(
      farm.stakedToken.address,
      wallet.ethereum,
      erc20ABI
    );
    let allowance = 0;
    do {
      allowance = Number(
        await getAllowance(erc20, wallet.account, farmConfig.address)
      );
      await sleep(2300); // one block
    } while (allowance === 0);
  };

  return (
    <SingleFarmContext.Provider
      value={{
        farm,
        userInfo,
        updateUserInfo,
        updateFarmInfo,
        waitForApproval,
        waitForDepositOrWithdrawal,
        waitForClaim,
      }}
    >
      {children}
    </SingleFarmContext.Provider>
  );
};

export const SingleFarmConsumer = SingleFarmContext.Consumer;

export default SingleFarmContext;
