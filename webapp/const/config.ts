/** Replace the values below with the addresses of your smart contracts. */

// 1. Set up the network your smart contracts are deployed to.
// First, import the chain from the package, then set the NETWORK variable to the chain.
import { Ethereum, Goerli, Mumbai } from "@thirdweb-dev/chains";

export const NETWORK =
  process.env.NEXT_PUBLIC_NETWORK === "mainnet" ? Ethereum : Goerli;

// 2. The address of the marketplace V3 smart contract.
// Deploy your own: https://thirdweb.com/thirdweb.eth/MarketplaceV3
export const MARKETPLACE_ADDRESS = "0x4234D057e948B5d438e5be3d32290975e40320F9"; //GOERLI

//FeeDistributor contract that distributes a portion of the platform fee to vMooney holders
export const FEE_DISTRIBUTOR_ADDRESS =
  process.env.NEXT_PUBLIC_NETWORK === "mainnet"
    ? ""
    : "0xf2936f9813CB967da9b544d1bF2e0601cd7a3131"; //GOERLI

//Split contract that holds the mooney from the 2% platform fee
export const FEE_DISTRIBUTOR_SPLIT_ADDRESS =
  process.env.NEXT_PUBLIC_NETWORK === "mainnet"
    ? ""
    : "0x4D84E66658cDa987e6a3287A8939969793869551"; //GOERLI

export const ETHERSCAN_URL =
  NETWORK === Ethereum
    ? "https://etherscan.io/"
    : "https://goerli.etherscan.io/";

export const MOONEY_ADDRESS =
  NETWORK === Ethereum
    ? "0x20d4DB1946859E2Adb0e5ACC2eac58047aD41395" //MAINNET
    : "0x86A827E4E98081D156D58F4aAb4F2bBa64eAA599"; //GOERLI

export const VMOONEY_ADDRESS =
  NETWORK === Ethereum
    ? "0xCc71C80d803381FD6Ee984FAff408f8501DB1740" //MAINNET
    : "0x6899EcEeAF3Fb4D5854Dc090F62EA5D97E301664"; //GOERLI

export const MOONEY_DECIMALS = 10 ** 18;
