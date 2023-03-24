/** Replace the values below with the addresses of your smart contracts. */

// 1. Set up the network your smart contracts are deployed to.
// First, import the chain from the package, then set the NETWORK variable to the chain.
import { Goerli } from "@thirdweb-dev/chains";
export const NETWORK = Goerli;

// 2. The address of the marketplace V3 smart contract.
// Deploy your own: https://thirdweb.com/thirdweb.eth/MarketplaceV3
export const MARKETPLACE_ADDRESS = "0x33Cf4c4c0329fa3e8CAa84113dA9FB6EbD8c2594";

// 3. The address of your NFT collection smart contract.
export const NFT_COLLECTION_ADDRESS =
  "0xdbb3aaA438e49a93c3E3E213AEbF2F5370993D2d";

// (Optional) Set up the URL of where users can view transactions on
// For example, below, we use Mumbai.polygonscan to view transactions on the Mumbai testnet.
export const ETHERSCAN_URL = "https://goerli.etherscan.io/";

export const VMOONEY_ADDRESS_GOERLI =
  "0x6899EcEeAF3Fb4D5854Dc090F62EA5D97E301664";
export const MOONEY_ADDRESS_GOERLI =
  "0x86A827E4E98081D156D58F4aAb4F2bBa64eAA599";

export const VMOONEY_ADDRESS_MAINNET =
  "0xCc71C80d803381FD6Ee984FAff408f8501DB1740";
export const MOONEY_ADDRESS_MAINNET =
  "0x20d4DB1946859E2Adb0e5ACC2eac58047aD41395";
