import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";

import { ethers } from "hardhat";
import { HardhatUserConfig, subtask, task } from "hardhat/config";
import { HardhatNetworkHDAccountsUserConfig } from "hardhat/types";
import { TASK_COMPILE_SOLIDITY_GET_SOURCE_PATHS } from "hardhat/builtin-tasks/task-names";

import { env } from "./src/constants/env";
import { ETHER } from "./src/constants/constants";

// Print accounts
task("accounts", "Prints the list of accounts", async function(_, hre) {
  // Grab accounts
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// Skip files
subtask(TASK_COMPILE_SOLIDITY_GET_SOURCE_PATHS).setAction(
  async (_, __, runSuper) => {
    const paths = await runSuper();

    return paths.filter((p: string) => !p.endsWith(".skip.sol"));
  }
);

const baseAccounts: HardhatNetworkHDAccountsUserConfig = {
  mnemonic: process.env.PRIVATE_KEY_MNEMONIC,
  initialIndex: 5,
  count: 5,
  accountsBalance: ETHER.multipliedBy(100).toString(10)
};

const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  gasReporter: {
    currency: "USD",
    enabled: !!process.env.REPORT_GAS,
    excludeContracts: [],
    src: "./contracts"
  },
  networks: {
    // myNode: {
    //     url: "http://127.0.0.1:8546",
    //     accounts: baseAccounts
    // },
    hardhat: {
      forking: {
        url: env.ETHEREUM_RPC_URL
        // blockNumber: // TODO: Define block
      },
      accounts: baseAccounts,
      initialBaseFeePerGas: 0
    }
  },
  paths: {
    artifacts: "./artifacts",
    cache: "./cache",
    sources: "./contracts",
    tests: "./test"
  },
  solidity: {
    version: "0.8.7",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  // namedAccounts: {
  //     deployer: {
  //         default: 0,
  //     },
  // },
  typechain: {
    outDir: "types",
    target: "ethers-v5"
  }
  // etherscan: {
  //   apiKey: process.env.ETHERSCAN_API_KEY,
  // },
};

export default config;
