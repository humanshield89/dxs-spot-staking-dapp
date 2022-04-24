const configs = {
  chainId: 56,
  NetworkName: "Binance Smart Chain",
  rpcUrl: "https://bsc-dataseed1.binance.org/",
  explorer: "https://bscscan.com/",

  // project info
  dxsTokenAddress: "0xB0Df5519F460E96117C12Ea667557b161866189c", // put DXS BSC addres here ,

  lpPairAddress: "0x89F4B8c9d80520798f2d898202ec604e140C9AA6", // put DXS-BNB pair address here
  busdPair: "0x33Ee77E1Db9a34a520A897c62242C9C6D319Aeb6",
  usdtPair: "0x33Ee77E1Db9a34a520A897c62242C9C6D319Aeb6",

  wBNB: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
  usdc: "0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d",
  usdcBNBPair: "0xd99c7F6C65857AC913a8f880A4cb84032AB2FC5b",
  deadAddress: "0x000000000000000000000000000000000000dEaD",
  zeroAddress: "0x0000000000000000000000000000000000000000",
  busdAddress: "0xe9e7cea3dedca5984780bafc599bd69add087d56",
  usdtAddress: "0x55d398326f99059fF775485246999027B3197955",

  netAddRequest: {
    method: "wallet_addEthereumChain",
    params: [
      {
        chainId: "0x38",
        chainName: "Binance Smart Chain",
        nativeCurrency: {
          name: "Binance Coin",
          symbol: "BNB",
          decimals: 18,
        },
        blockExplorerUrls: ["https://bscscan.com/"],
        rpcUrls: ["https://bsc-dataseed1.binance.org/"],
      },
    ],
  },
};

const kovanConfigs = {
  chainId: 42,
  NetworkName: "kovan",
  rpcUrl: "https://kovan.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
  explorer: "https://kovan.etherscan.io/",

  // project info
  dxsTokenAddress: "0x5967338dc055E9fcaa342812608C7EbC8571104d", // put DXS BSC addres here ,

  lpPairAddress: "0x02083530FE58d74D656eE7760d0Bff85d394543F", // put DXS-BNB pair address here
  busdPair: "0xE250F6765a76Ee7808b34aCFc8D62Dae2C8BC712",
  usdtPair: "0xAadCbC82c98F29eF7281c74045D5f5af8bCf5B84",

  wBNB: "0xd0A1E359811322d97991E03f863a0C30C2cF029C",
  usdc: "0x964e737c40d4DDFfDDbE326DEc562c0c69a0cCC9",
  usdcBNBPair: "0xFCa3371849D8Ff41ECAe391e88bA555f256157A6",
  deadAddress: "0x000000000000000000000000000000000000dEaD",
  zeroAddress: "0x0000000000000000000000000000000000000000",
  busdAddress: "0xC14c87c6208c6D68f6254D47d8EEC78aA8d65Bd9",
  usdtAddress: "0x964e737c40d4DDFfDDbE326DEc562c0c69a0cCC9",

  netAddRequest: {
    method: "wallet_addEthereumChain",
    params: [
      {
        chainId: "0x2a",
        chainName: "Kovan - Testnet",
        nativeCurrency: {
          name: "Kovan Ethereum",
          symbol: "KETH", // 2-6 characters long
          decimals: 18,
        },
        blockExplorerUrls: ["https://kovan.etherscan.io/"],
        rpcUrls: [
          "https://kovan.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
        ],
      },
    ],
  },
};

module.exports = kovanConfigs; //configs;
