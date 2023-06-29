import { useMemo } from "react";
import { MOONEY_DECIMALS } from "../../../const/config";

//Check if closed auction has a payout
export function useClaimableAuction(
  winningBid: number,
  buyoutBidAmount: number,
  endTimestamp: string | number
) {
  const claimable = useMemo(() => {
    console.log(winningBid, buyoutBidAmount, endTimestamp);
    const now = Date.now() / 1000;
    return (
      winningBid >= +buyoutBidAmount / MOONEY_DECIMALS ||
      (winningBid > 0 && +endTimestamp < now)
    );
  }, [winningBid, buyoutBidAmount]);
  return claimable;
}
