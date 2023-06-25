import { useEffect, useState } from "react";
import { initSDK } from "../../thirdweb";

export function useCurrBlockNum() {
  const [currBlockNum, setCurrBlockNum] = useState<number | undefined>(
    undefined
  );
  const sdk = initSDK();
  useEffect(() => {
    sdk &&
      sdk
        .getProvider()
        .getBlockNumber()
        .then((blockNumber: number) => {
          setCurrBlockNum(blockNumber);
        });
  }, [sdk]);
  return currBlockNum;
}
