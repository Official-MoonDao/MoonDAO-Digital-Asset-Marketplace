/** Replace the values below with the addresses of your smart contracts. */

// 1. Set up the network your smart contracts are deployed to.
// First, import the chain from the package, then set the NETWORK variable to the chain.
import { Chain, Mumbai, Polygon } from "@thirdweb-dev/chains";

export const NETWORK: Chain =
  process.env.NEXT_PUBLIC_NETWORK === "matic" ? Polygon : Mumbai;

// 2. The address of the marketplace V3 smart contract.
// Deploy your own: https://thirdweb.com/thirdweb.eth/MarketplaceV3
export const SUBGRAPH_URL: string =
  NETWORK === Polygon
    ? "https://api.studio.thegraph.com/query/38443/moondao-marketplace-l2/v0.0.1" //Matic
    : "https://api.studio.thegraph.com/query/38443/moondao-marketplace-test-l2/v0.0.2"; //Mumbai

export const MARKETPLACE_ADDRESS: string =
  NETWORK === Polygon
    ? "0xC1114342c0857661814adA2f1B5700363D6576F1" //Matic
    : "0x2ade7e5C953873ebe5417D62319334F7975A9595"; //Mumbai

export const ETHERSCAN_URL: string =
  NETWORK === Polygon
    ? "https://polygonscan.com/" //Matic
    : "https://mumbai.polygonscan.com/"; //Mumbai

export const L2_MOONEY_ADDRESS: string =
  NETWORK === Polygon
    ? "0x74Ac7664ABb1C8fa152D41bb60e311a663a41C7E" //Matic
    : "0xDE870ca93467A914160e6a6ddC75535cA7647534"; //Mumbai

export const MOONEY_DECIMALS: number = 10 ** 18;

export const ZERO_ADDRESS: string =
  "0x0000000000000000000000000000000000000000";

// MoonDAO Featured Collection (Matic) : 0x4211D79026720711b1483BF238f040B45E9Ba934

// MoonDAO Platform Fee Split Burn/Treasury: 0x714Fd33848e40b0aC21Eb838CC092Dd5a8608688
