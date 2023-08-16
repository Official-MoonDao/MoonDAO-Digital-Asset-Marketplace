import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import { NETWORK } from "../const/config";

export function initSDK() {
  return new ThirdwebSDK(NETWORK, {
    clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID,
    secretKey: process.env.NEXT_PUBLIC_THIRDWEB_SECRET_KEY,
  });
}
