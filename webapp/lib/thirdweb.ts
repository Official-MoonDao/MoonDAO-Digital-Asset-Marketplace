import { useContract, useMetadata } from "@thirdweb-dev/react";
import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import { useEffect, useMemo, useState } from "react";

export function initSDK() {
  return new ThirdwebSDK("goerli");
}
