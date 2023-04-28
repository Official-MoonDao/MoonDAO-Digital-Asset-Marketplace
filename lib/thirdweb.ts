import { Ethereum, Sepolia } from "@thirdweb-dev/chains";
import { ThirdwebSDK } from "@thirdweb-dev/sdk";

export function initSDK() {
  return new ThirdwebSDK(Sepolia);
}
