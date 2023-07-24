import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import { NETWORK } from "../const/config";

export function initSDK() {
  return new ThirdwebSDK(NETWORK);
}
