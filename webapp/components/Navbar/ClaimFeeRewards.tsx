import { useEffect, useState } from "react";
import { useContract, useContractRead, useSigner } from "@thirdweb-dev/react";
import { FEE_DISTRIBUTOR_ADDRESS } from "../../const/config";
import FEE_DISTRIBUTOR_ABI from "../../const/abis/FeeDistributor.json";
import { Contract } from "ethers";

export function ClaimFeeRewards() {
  const signer = useSigner();
  const [feeRewards, setFeeRewards] = useState<number>(0);

  function getRewardsForSigner() {
    if (!signer) return setFeeRewards(0);
    const contract = new Contract(
      FEE_DISTRIBUTOR_ADDRESS,
      FEE_DISTRIBUTOR_ABI as any,
      signer
    );
    contract.callStatic["claim()"]().then((res) =>
      setFeeRewards(res.toNumber())
    );
  }

  useEffect(() => {
    getRewardsForSigner();
  }, [signer]);

  return (
    <div>
      <p>Fee Rewards:</p>
      {feeRewards}
    </div>
  );
}
