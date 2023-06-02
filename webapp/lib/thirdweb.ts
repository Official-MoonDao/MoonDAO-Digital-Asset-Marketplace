import { ThirdwebSDK } from "@thirdweb-dev/sdk";

export function initSDK() {
  return new ThirdwebSDK("goerli");
}
