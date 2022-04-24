import { getRealContract } from "./generalUtils";
import { erc20ABI } from "./Abi/ERC20Abi";
import { getDecimals, getERC20Balance, getTotalSupply } from "./ERC20Utils";
import BigNumber from "bignumber.js";

/**
 *
 * @param token0Address
 * @param token1Address
 * @param pairAddress
 * @param ethereum
 * @returns {Promise<number>}
 */
export const getToken0PriceInToken1 = async (
  token0Address,
  token1Address,
  pairAddress,
  ethereum
) => {
  const token1Contract = await getRealContract(
    token1Address,
    ethereum,
    erc20ABI
  );

  const token0Contract = await getRealContract(
    token0Address,
    ethereum,
    erc20ABI
  );

  const token1Decimals = await getDecimals(token1Contract);
  const token1Balance = await getERC20Balance(token1Contract, pairAddress);

  const token0Decimals = await getDecimals(token0Contract);
  const token0Balance = await getERC20Balance(token0Contract, pairAddress);

  if (token0Balance == 0) {
    return 0.00000000001;
  }

  const price =
    Number(token1Balance) /
    Number(10 ** token1Decimals) /
    (Number(token0Balance) / Number(10 ** token0Decimals));
  console.log("price for " + token0Address + " = " + price);
  return price;
};

export const getAmountOfTokenInPool = async ({
  LpToken,
  tokenAddress,
  ethereum,
}) => {
  const lpErc20Contract = await getRealContract(
    tokenAddress,
    ethereum,
    erc20ABI
  );
  return await getERC20Balance(lpErc20Contract, LpToken);
};

/**
 * @param lpTokenAddress
 * @param waitedTokenAddress
 * @param priceOfWeightedToken
 * @param weight{Number}
 * @param provider
 * @returns {Promise<number|*>}
 */
export const getLPPrice = async (
  lpTokenAddress,
  waitedTokenAddress,
  priceOfWeightedToken,
  weight,
  provider
) => {
  if (weight === 100) {
    return priceOfWeightedToken;
  }
  const lpContract = await getRealContract(
    lpTokenAddress,
    provider,
    erc20ABI,
    "getLPPrice"
  );
  const weightedTokenContract = await getRealContract(
    waitedTokenAddress,
    provider,
    erc20ABI,
    "getLPPrice+ lpContract"
  );

  const totalPoolSupply = new BigNumber(await getTotalSupply(lpContract));

  const amountofWeightedToken = new BigNumber(
    await getAmountOfTokenInPool({
      LpToken: lpTokenAddress,
      ethereum: provider,
      tokenAddress: waitedTokenAddress,
    })
  );
  const decimals = await getDecimals(weightedTokenContract);
  const LPdecimals = await getDecimals(lpContract);
  console.log(decimals);
  const totalWeightedTpokenValue = amountofWeightedToken
    .times(priceOfWeightedToken)
    .div(10 ** decimals);

  const normalizedSupply = totalPoolSupply / 10 ** LPdecimals;
  const priceOfLP = totalWeightedTpokenValue
    .times(100)
    .div(weight)
    .div(normalizedSupply);

  return Number(priceOfLP);
};
