/** Replace the values below with the addresses of your smart contracts. */

// 1. Set up the network your smart contracts are deployed to.
// First, import the chain from the package, then set the NETWORK variable to the chain.
import { Sepolia, Ethereum } from "@thirdweb-dev/chains";

export const NETWORK =
  process.env.NEXT_PUBLIC_NETWORK === "mainnet" ? Ethereum : Sepolia;

// 2. The address of the marketplace V3 smart contract.
// Deploy your own: https://thirdweb.com/thirdweb.eth/MarketplaceV3
export const MARKETPLACE_ADDRESS =
  process.env.NEXT_PUBLIC_NETWORK === "mainnet"
    ? ""
    : "0x58b9ad08E8967228b121519484cf88D940E581FD"; //sepolia

// 3. The address of your NFT collection smart contract.
export const NFT_COLLECTION_ADDRESS =
  "0xdbb3aaA438e49a93c3E3E213AEbF2F5370993D2d";

// (Optional) Set up the URL of where users can view transactions on
// For example, below, we use Mumbai.polygonscan to view transactions on the Mumbai testnet.
export const ETHERSCAN_URL = "https://sepolia.etherscan.io/";

export const VMOONEY_ADDRESS_SEPOLIA =
  "0xA4F6A4B135b9AF7909442A7a3bF7797b61e609b1";
export const MOONEY_ADDRESS_SEPOLIA =
  "0x85A3C597F43B0cCE657793Cf31b05DF6969FbD2C";

export const VMOONEY_ADDRESS_MAINNET =
  "0xCc71C80d803381FD6Ee984FAff408f8501DB1740";
export const MOONEY_ADDRESS_MAINNET =
  "0x20d4DB1946859E2Adb0e5ACC2eac58047aD41395";
