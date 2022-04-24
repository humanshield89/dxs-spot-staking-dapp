import { getRealContract } from "./generalUtils";

const { FarmAbi } = require("./Abi/FarmAbi");

/**
 * @param provider ethereum provider
 * @param contractAddress location of farm contract
 * @return {Promise<BN>} startTime in Seconds
 */
export const getStartTime = async (provider, contractAddress) => {
  const realContract = await getRealContract(
    contractAddress,
    provider,
    FarmAbi,
    "getStartTime"
  );
  return realContract.methods.startTime().call();
};

/**
 * @param provider ethereum provider
 * @param contractAddress location of farm contract
 * @return {Promise<BN>} endTime in seconds
 */
export const getEndTime = async (provider, contractAddress) => {
  const realContract = await getRealContract(
    contractAddress,
    provider,
    FarmAbi,
    "getEndTime"
  );
  return realContract.methods.endTime().call();
};

/**
 * @param provider ethereum provider
 * @param contractAddress{String} location of farm contract
 * @param pid {Number | String | BN} pool id
 * @param user {string} user address
 * @return {Promise<[{amount,depositTime}]>} amount and deposit time in seconds
 *   from epoch
 */
export const getUserDeposits = async (provider, contractAddress, pid, user) => {
  const realContract = await getRealContract(
    contractAddress,
    provider,
    FarmAbi,
    "getUserDeposits"
  );
  return realContract.methods.getUserDeposits(pid, user).call();
};

/**
 * @param provider ethereum provider
 * @param contractAddress{String} location of farm contract
 * @param pid {Number | String | BN} pool id
 * @param user {string} user address
 * @return {Promise<[{amount,rewardDebt}]>} amount and rewardDebt
 */
export const getUserInfo = async (provider, contractAddress, pid, user) => {
  const realContract = await getRealContract(
    contractAddress,
    provider,
    FarmAbi,
    "getUserInfo"
  );
  return realContract.methods.getUserInfo(pid, user).call();
};

/**
 * @param provider ethereum provider
 * @param contractAddress{String} location of farm contract
 * @param pid {Number | String | BN} pool id
 * @param user {string} user address
 * @return {Promise<BN>} amount of rewards pending for this user
 */
export const getUserPending = async (provider, contractAddress, pid, user) => {
  const realContract = await getRealContract(
    contractAddress,
    provider,
    FarmAbi,
    "getUserPending"
  );
  return realContract.methods.pending(pid, user).call();
};

/**
 * @param provider ethereum provider
 * @param contractAddress{String} location of farm contract
 * @param pid {Number | String | BN} pool id
 * @return {Promise<{lpToken,multiplier,lastRewardTime,accERC20PerShare,stakedAmount,stakeFee,lockPeriod,penalty}>} amount
 *   of rewards pending for this user
 */
export const getPoolInfo = async (provider, contractAddress, pid) => {
  console.log("contractAddress = " + contractAddress);
  console.log("pid = " + pid);
  const realContract = await getRealContract(
    contractAddress,
    provider,
    FarmAbi,
    "getPoolInfo"
  );
  return realContract.methods.poolInfo(pid).call();
};

/**
 * @param provider ethereum provider
 * @param contractAddress location of farm contract
 * @return {Promise<BN>} number of pools
 */
export const getPoolsLength = async (provider, contractAddress) => {
  const realContract = await getRealContract(
    contractAddress,
    provider,
    FarmAbi,
    "getPoolsLength"
  );
  return realContract.methods.poolLength().call();
};

/**
 * @param provider ethereum provider
 * @param contractAddress location of farm contract
 * @return {Promise<BN>} paidOut amount of tokens paid out to stakers (means
 *   tokens claimed)
 */
export const getTotalPaidOut = async (provider, contractAddress) => {
  const realContract = await getRealContract(
    contractAddress,
    provider,
    FarmAbi,
    "getTotalPaidOut"
  );
  return realContract.methods.paidOut().call();
};

/**
 * @param provider ethereum provider
 * @param contractAddress location of farm contract
 * @return {Promise<boolean>} true is farm is paused
 */
export const getIsFarmPaused = async (provider, contractAddress) => {
  const realContract = await getRealContract(
    contractAddress,
    provider,
    FarmAbi,
    "getIsFarmPaused"
  );
  return realContract.methods.paused().call();
};

/**
 * @param provider ethereum provider
 * @param contractAddress location of farm contract
 * @return {Promise<BN>} amount of reward distributed each second
 */
export const getRewardPerSecond = async (provider, contractAddress) => {
  const realContract = await getRealContract(
    contractAddress,
    provider,
    FarmAbi,
    "getRewardPerSecond"
  );
  return realContract.methods.rewardPerSecond().call();
};

/**
 * @param provider ethereum provider
 * @param contractAddress location of farm contract
 * @return {Promise<string>} rewardToken address
 */
export const getRewardPerToken = async (provider, contractAddress) => {
  const realContract = await getRealContract(
    contractAddress,
    provider,
    FarmAbi,
    "getRewardPerToken"
  );
  return realContract.methods.rewardToken().call();
};

/**
 * @param provider ethereum provider
 * @param contractAddress location of farm contract
 * @return {Promise<BN>} totalERC20Rewards
 */
export const getTotalErc20Rewards = async (provider, contractAddress) => {
  const realContract = await getRealContract(
    contractAddress,
    provider,
    FarmAbi,
    "getTotalErc20Rewards"
  );
  return realContract.methods.totalERC20Rewards().call();
};

/**
 * @param provider ethereum provider
 * @param contractAddress location of farm contract
 * @return {Promise<BN>} totalPending rewards across all pools and all users
 */
export const getTotalPendingRewards = async (provider, contractAddress) => {
  const realContract = await getRealContract(
    contractAddress,
    provider,
    FarmAbi,
    "getTotalPendingRewards"
  );
  return realContract.methods.totalPending().call();
};

/**
 * @param provider ethereum provider
 * @param contractAddress location of farm contract
 * @return {Promise<BN>} total multipliers
 */
export const getTotalMultiplier = async (provider, contractAddress) => {
  const realContract = await getRealContract(
    contractAddress,
    provider,
    FarmAbi,
    "getTotalMultiplier"
  );
  return realContract.methods.totalMultiplier().call();
};

/**
 * @param provider ethereum provider
 * @param contractAddress location of farm contract
 * @param index index of the deposit (get it from userInfo obkect)
 * @return {Promise<{amount,depositTime}>} totalPending rewards across all
 *   pools and all users
 */
export const getSingleUserDepositAtIndex = async (
  provider,
  contractAddress,
  index
) => {
  const realContract = await getRealContract(
    contractAddress,
    provider,
    FarmAbi,
    "getStartTime"
  );
  return realContract.methods.usersDeposit(index).call();
};

/**
 * gets the total deposit of a user
 * @param contractAddress
 * @param provider
 * @param pid
 * @param account
 * @returns {Promise<BN>}
 */
export const getStaked = async (contractAddress, provider, pid, account) => {
  const realContract = await getRealContract(
    contractAddress,
    provider,
    FarmAbi,
    "getStartTime"
  );
  return realContract.methods.totalDeposited(pid, account).call();
};

/**
 *
 * @returns {Promise<boolean>}
 * @param contractAddress
 * @param provider
 */
export const isActive = async (provider, contractAddress) => {
  const realContract = await getRealContract(
    contractAddress,
    provider,
    FarmAbi,
    "isActive"
  );
  return (await realContract.methods.endTime().call()) * 1000 > Date.now();
};
/**
 *
 * @returns {Promise<boolean>}
 * @param contractAddress
 * @param provider
 */
export const hasFarmStarted = async (provider, contractAddress) => {
  const realContract = await getRealContract(
    contractAddress,
    provider,
    FarmAbi,
    "isActive"
  );
  const startTime = await realContract.methods.startTime().call();
  return startTime != 0 && startTime * 1000 < Date.now();
};
// Write
/**
 *
 * @param provider
 * @param contractAddress
 * @param pid
 * @param wallet
 * @returns {Promise<*>}
 */
export const harvest = async (provider, contractAddress, pid, wallet) => {
  const realContract = await getRealContract(
    contractAddress,
    provider,
    FarmAbi,
    "isActive"
  );

  const data = realContract.methods.stakeInPool(pid, "0").encodeABI();

  const transactionParams = {
    to: realContract.options.address,
    from: wallet.account,
    data: data,
    chainId: wallet.chainId,
  };

  return wallet.ethereum.request({
    method: "eth_sendTransaction",
    params: [transactionParams],
  });
};
/**
 *
 * @param provider
 * @param contractAddress
 * @param pid
 * @param depositId
 * @param wallet
 * @returns {Promise<*>}
 */
export const withdrawUnlocked = async (
  provider,
  contractAddress,
  pid,
  depositId,
  wallet
) => {
  const realContract = await getRealContract(
    contractAddress,
    provider,
    FarmAbi,
    "isActive"
  );

  const data = realContract.methods
    .withdrawUnlockedDeposit(pid, depositId)
    .encodeABI();

  const transactionParams = {
    to: realContract.options.address,
    from: wallet.account,
    data: data,
    chainId: wallet.chainId,
  };

  return wallet.ethereum.request({
    method: "eth_sendTransaction",
    params: [transactionParams],
  });
};

/**
 *
 * @param provider
 * @param contractAddress
 * @param pid
 * @param depositId
 * @param wallet
 * @returns {Promise<*>}
 */
export const withdrawLocked = async (
  provider,
  contractAddress,
  pid,
  depositId,
  wallet
) => {
  const realContract = await getRealContract(
    contractAddress,
    provider,
    FarmAbi,
    "isActive"
  );

  const data = realContract.methods
    .unstakeWithPenalty(pid, depositId)
    .encodeABI();

  const transactionParams = {
    to: realContract.options.address,
    from: wallet.account,
    data: data,
    chainId: wallet.chainId,
  };

  return wallet.ethereum.request({
    method: "eth_sendTransaction",
    params: [transactionParams],
  });
};

/**
 *
 * @param provider
 * @param contractAddress
 * @param pid
 * @param wallet
 * @returns {Promise<*>}
 */
export const emergencyWithdrawFromFarm = async (
  provider,
  contractAddress,
  pid,
  wallet
) => {
  const realContract = await getRealContract(
    contractAddress,
    provider,
    FarmAbi,
    "isActive"
  );

  const data = realContract.methods.emergencyWithdraw(pid).encodeABI();

  const transactionParams = {
    to: realContract.options.address,
    from: wallet.account,
    data: data,
    chainId: wallet.chainId,
  };

  return wallet.ethereum.request({
    method: "eth_sendTransaction",
    params: [transactionParams],
  });
};
/**
 *
 * @param provider
 * @param contractAddress
 * @param pid
 * @param amount
 * @param wallet
 * @returns {Promise<*>}
 */
export const stake = async (provider, contractAddress, pid, amount, wallet) => {
  const realContract = await getRealContract(
    contractAddress,
    provider,
    FarmAbi,
    "isActive"
  );
  const data = realContract.methods.stakeInPool(pid, amount).encodeABI();

  const transactionParams = {
    to: realContract.options.address,
    from: wallet.account,
    data: data,
    chainId: wallet.chainId,
  };

  return wallet.ethereum.request({
    method: "eth_sendTransaction",
    params: [transactionParams],
  });
};
