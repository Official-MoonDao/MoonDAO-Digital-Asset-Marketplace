/** Replace the values below with the addresses of your smart contracts. */

// 1. Set up the network your smart contracts are deployed to.
// First, import the chain from the package, then set the NETWORK variable to the chain.
import { Chain, Ethereum, Mumbai } from "@thirdweb-dev/chains";

export const NETWORK: Chain =
  process.env.NEXT_PUBLIC_NETWORK === "mainnet" ? Ethereum : Mumbai;

// 2. The address of the marketplace V3 smart contract.
// Deploy your own: https://thirdweb.com/thirdweb.eth/MarketplaceV3
export const SUBGRAPH_URL: string =
  "https://api.studio.thegraph.com/query/38443/moondao-marketplace-test-l2/v0.0.2";

export const MARKETPLACE_ADDRESS: string =
  "0x2ade7e5C953873ebe5417D62319334F7975A9595"; //Mumbai

export const ETHERSCAN_URL: string =
  NETWORK === Ethereum
    ? "https://polygonscan.com/"
    : "https://mumbai.polygonscan.com/";

export const L2_MOONEY_ADDRESS: string =
  NETWORK === Ethereum
    ? "" //Polygon
    : "0xDE870ca93467A914160e6a6ddC75535cA7647534"; //Mumbai

export const MOONEY_DECIMALS: number = 10 ** 18;

export const ZERO_ADDRESS: string =
  "0x0000000000000000000000000000000000000000";
