import { useEffect, useMemo, useState } from "react";
import {
  Web3Button,
  useAddress,
  useChain,
  useNetwork,
  useSigner,
} from "@thirdweb-dev/react";
import FEE_DISTRIBUTOR_ABI from "../../../const/abis/FeeDistributor.json";
import { Contract, ethers } from "ethers";
import Image from "next/image";
import { toast } from "react-hot-toast";
import moment from "moment";

export function ClaimFeeRewards() {
  const signer = useSigner();
  const chain = useChain();
  const address = useAddress();
  const [feeRewards, setFeeRewards] = useState<string>("0");

  const validChain = useMemo(() => {
    return chain?.name?.toLowerCase() === process.env.NEXT_PUBLIC_NETWORK;
  }, [chain]);

  const FeeDistributor = useMemo(() => {
    return new Contract("", FEE_DISTRIBUTOR_ABI as any, signer);
  }, [signer, chain]);

  const nextRevenueDistributionDate = useMemo(() => {
    let nearestWednesday = moment()
      .utcOffset(-new Date().getTimezoneOffset())
      .day(3)
      .set({ hour: 19, minute: 0, second: 0 });

    nearestWednesday =
      nearestWednesday < moment()
        ? nearestWednesday.add(1, "week")
        : nearestWednesday;

    const nextDistributionDate = nearestWednesday.toDate();

    if (nextDistributionDate) {
      const toNextDist = moment.duration(
        moment(nextDistributionDate).diff(moment()),
        "milliseconds"
      );

      if (toNextDist.asMilliseconds() <= 0) {
        return "Now";
      }

      return `${toNextDist.days()}D ${toNextDist.hours()}H ${toNextDist.minutes()}M`;
    }
  }, []);

  async function getRewardsForSigner() {
    const rewards = await FeeDistributor.callStatic["claim(address)"](address);
    setFeeRewards(ethers.utils.formatUnits(rewards.toString(), 18));
  }

  async function claimRewardsForSigner() {
    try {
      const txResult = await FeeDistributor["claim(address)"](address);
      toast.success("Claimed Rewards ✅");
      return txResult;
    } catch (err: any) {
      console.log(err);
      toast.error("Error ❌:" + err.message.slice(0, 25));
    }
  }

  useEffect(() => {
    if (address && validChain && FeeDistributor) {
      getRewardsForSigner();
    }
  }, [address, validChain, FeeDistributor]);

  return (
    <div className="z-10 flex flex-col w-full">
      <p>Fee Rewards:</p>
      <div className="flex gap-2">
        {Number(feeRewards).toFixed(7)}
        <Image src={"/favicon.ico"} width={25} height={25} alt="" />
        <p>MOONEY</p>
      </div>
      <Web3Button
        contractAddress={""}
        contractAbi={FEE_DISTRIBUTOR_ABI as any}
        action={async () => await claimRewardsForSigner()}
        isDisabled={feeRewards === "0"}
      >
        {feeRewards !== "0" ? "Claim Rewards" : "No Rewards to Claim"}
      </Web3Button>
      <div>
        <p>Next Distribution Cycle:</p>
        <p>{nextRevenueDistributionDate || ""}</p>
      </div>
    </div>
  );
}
