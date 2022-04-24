import icons from "./tokenIcons";
const { FarmAbi } = require("./Abi/FarmAbi");

const testNetFarms = {
  // TODO put bsc farms here once deployed
  address: "0x7e2b6Ab86E9D9fd120d3B11c5675Aaab614Ee260",
  allowEmergencyUnstake: true, // only shows when farm is paused users will be able to widthraw without penalty all their funds but forfeit the rewards
  abi: FarmAbi,
  farms: [
    {
      name: "DXS-BNB",
      stakedToken: {
        address: "0x02083530FE58d74D656eE7760d0Bff85d394543F",
        symbol: "DXS-BNB",
        name: "DXS-BNB LP",
        icon: icons.dxsBNB,
        decimals: 18,
      },
      weight: 50, // lp token is 50% 50%
      composition: "DXS (50%), BNB (50%)",
      pid: 0,
      tags: "dxs,bnb,lp,pancake",
      buyLink:
        "https://pancakeswap.finance/add/BNB/0xB0Df5519F460E96117C12Ea667557b161866189c",
      active: true,
    },
    {
      name: "DXS-USDT",
      stakedToken: {
        address: "0xE250F6765a76Ee7808b34aCFc8D62Dae2C8BC712",
        symbol: "DXS-USDT",
        name: "DXS-USDT LP",
        icon: icons.dxsBNB,
        decimals: 18,
      },
      weight: 50, // lp token is 50% 50%
      composition: "DXS (50%), USDT (50%)",
      pid: 1,
      tags: "dxs,usdt,lp,pancake",
      buyLink:
        "https://pancakeswap.finance/add/0xB0Df5519F460E96117C12Ea667557b161866189c/0x55d398326f99059fF775485246999027B3197955",
      active: true,
    },
    {
      name: "DXS-BUSD",
      stakedToken: {
        address: "0xAadCbC82c98F29eF7281c74045D5f5af8bCf5B84",
        symbol: "DXS-BUSD",
        name: "DXS-BUSD LP",
        icon: icons.dxsBNB,
        decimals: 18,
      },
      weight: 50, // lp token is 50% 50%
      composition: "DXS (50%), BUSD (50%)",
      pid: 2,
      tags: "dxs,busd,lp,pancake",
      buyLink:
        "https://pancakeswap.finance/add/0xB0Df5519F460E96117C12Ea667557b161866189c/0xe9e7cea3dedca5984780bafc599bd69add087d56",
      active: true,
    },
  ],
};

const mainNetFarms = {
  // TODO put bsc farms here once deployed
  address: "0x7E7C731a6e2D24FD0ea002de7eF1cDBBB6042852",
  allowEmergencyUnstake: true, // only shows when farm is paused users will be able to widthraw without penalty all their funds but forfeit the rewards
  abi: FarmAbi,
  farms: [
    {
      name: "DXS-BNB",
      stakedToken: {
        address: "0x89F4B8c9d80520798f2d898202ec604e140C9AA6",
        symbol: "DXS-BNB",
        name: "DXS-BNB LP",
        icon: icons.dxsBNB,
        decimals: 18,
      },
      weight: 50, // lp token is 50% 50%
      composition: "DXS (50%), BNB (50%)",
      pid: 0,
      tags: "dxs,bnb,lp,pancake",
      buyLink:
        "https://pancakeswap.finance/add/BNB/0xB0Df5519F460E96117C12Ea667557b161866189c",
      active: true,
    },
    {
      name: "DXS-USDT",
      stakedToken: {
        address: "0x7bC2c5A6945D13715E802EcDcbD5E0fDE177692A",
        symbol: "DXS-USDT",
        name: "DXS-USDT LP",
        icon: icons.dxsUsdt,
        decimals: 18,
      },
      weight: 50, // lp token is 50% 50%
      composition: "DXS (50%), USDT (50%)",
      pid: 1,
      tags: "dxs,usdt,lp,pancake",
      buyLink:
        "https://pancakeswap.finance/add/0xB0Df5519F460E96117C12Ea667557b161866189c/0x55d398326f99059fF775485246999027B3197955",
      active: true,
    },
    {
      name: "DXS-BUSD",
      stakedToken: {
        address: "0x33Ee77E1Db9a34a520A897c62242C9C6D319Aeb6",
        symbol: "DXS-BUSD",
        name: "DXS-BUSD LP",
        icon: icons.dxsBusd,
        decimals: 18,
      },
      weight: 50, // lp token is 50% 50%
      composition: "DXS (50%), BUSD (50%)",
      pid: 2,
      tags: "dxs,usdt,lp,pancake",
      buyLink:
        "https://pancakeswap.finance/add/0xB0Df5519F460E96117C12Ea667557b161866189c/0xe9e7cea3dedca5984780bafc599bd69add087d56",
      active: true,
    },
  ],
};

export const currentFarmConfigs = mainNetFarms;
