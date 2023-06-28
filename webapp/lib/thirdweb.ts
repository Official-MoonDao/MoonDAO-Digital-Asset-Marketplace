import { ThirdwebSDK } from "@thirdweb-dev/sdk";

export function initSDK() {
  return new ThirdwebSDK(process.env.NEXT_PUBLIC_NETWORK || "mumbai");
}
