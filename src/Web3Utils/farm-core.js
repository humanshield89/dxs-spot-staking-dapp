import BigNumber from "bignumber.js";
import { getEndTime, getPoolInfo } from "./farmUtils";
import { getRealContract } from "./generalUtils";
import { FarmAbi } from "./Abi/FarmAbi";
const { rpcUrl, chainId } = require("../utils/config");
const Web3 = require("web3");
const YEAR_SECONDS = 31536000;

let web3 = new Web3(rpcUrl);
const { BN } = web3.utils;

/**
 *
 * @param provider
 * @param rewardsPerSecond
 * @param totalMultipliers
 * @param lpPrices
 * @param rewardTokenPrice
 * @param rewardTokenDecimals
 * @param farmConfig
 * @returns {Promise<*[]>}
 */
export const getFarms = async (
  provider,
  rewardsPerSecond,
  totalMultipliers,
  lpPrices,
  rewardTokenPrice,
  rewardTokenDecimals,
  farmConfig
) => {
  const pools = [...farmConfig.farms];

  for (let i = 0; i < farmConfig.farms.length; i++) {
    const farm = farmConfig.farms[i];
    console.log("farm = " + farm);
    pools[i] = await getFarmDetails(
      farm,
      rewardsPerSecond,
      totalMultipliers,
      farmConfig.address,
      provider,
      lpPrices[i],
      rewardTokenPrice,
      rewardTokenDecimals
    );
  }
  console.log(pools);
  return pools;
};
/**
 *
 * @param farm
 * @param rewardsPerSecond
 * @param totalMultipliers
 * @param farmAddress
 * @param provider
 * @param lpTokenPrice
 * @param rewardTokenPrice
 * @param rewardTokenDecimals
 * @return {Promise<{rewardsPerYear: number, lockPeriod: *, accERC20PerShare: *, lpToken: *, multiplier: *, lastRewardTime: *, penalty: *, active: boolean, tvl: number, apy: (number|BigNumber), totalStaked: string}>}
 */
export const getFarmDetails = async (
  farm,
  rewardsPerSecond,
  totalMultipliers,
  farmAddress,
  provider,
  lpTokenPrice,
  rewardTokenPrice,
  rewardTokenDecimals
) => {
  console.log("totalMultipliers = " + totalMultipliers);

  let pool = await getPoolInfo(provider, farmAddress, farm.pid);
  console.log("pool.stakedAmount = " + pool.stakedAmount);

  const poolDistPerSecond =
    (pool.multiplier / totalMultipliers) * rewardsPerSecond;
  console.log("poolDistPerSecond = " + poolDistPerSecond);
  console.log("rewardTokenPrice = " + rewardTokenPrice);

  const rewardsValuePerYear =
    (poolDistPerSecond * YEAR_SECONDS * rewardTokenPrice) /
    10 ** rewardTokenDecimals;
  console.log("rewardsValuePerYear = " + rewardsValuePerYear);
  const active = (await getEndTime(provider, farmAddress)) > Date.now() / 1000;
  const totalStakedValue =
    (pool.stakedAmount * lpTokenPrice) / 10 ** farm.stakedToken.decimals;
  console.log("totalStakedValue = " + totalStakedValue);

  console.log("active = " + active);
  const apy =
    pool.stakedAmount == 0
      ? 999999999
      : active
      ? (rewardsValuePerYear * 100) / totalStakedValue
      : new BigNumber("0");
  console.log("apy = " + apy);
  return {
    ...farm,
    ...pool,
    lpToken: pool.lpToken,
    active: active,
    multiplier: pool.multiplier,
    lastRewardTime: pool.lastRewardTime,
    accERC20PerShare: pool.accERC20PerShare,
    totalStaked: pool.stakedAmount,
    lockPeriod: pool.lockPeriod,
    penalty: pool.penalty,
    stakeFee: pool.stakeFee,
    tvl: totalStakedValue,
    rewardsPerYear: rewardsValuePerYear,
    poolDistPerSecond,
    poolDistributePerSecond: poolDistPerSecond,
    apy: apy,
  };
};

/**
 *
 * @param pendingTxHash
 * @returns {Promise<unknown>}
 */
// helper functions
export const waitForTransaction = async (pendingTxHash) => {
  return new Promise(async (resolve, reject) => {
    let receipt;
    do {
      await sleep(2200); // this will be roughly one block on Polygon main net
      receipt = await web3.eth.getTransactionReceipt(pendingTxHash);
    } while (!receipt);
    await sleep(4000); // lets wait for 2 more blocks to comfirm
    resolve(receipt);
  });
};

/**
 *
 * @param ms
 * @returns {Promise<unknown>}
 */
export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
