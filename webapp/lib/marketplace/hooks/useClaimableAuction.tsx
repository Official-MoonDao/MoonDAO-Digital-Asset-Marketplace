import { useMemo } from "react";
import { MOONEY_DECIMALS, ZERO_ADDRESS } from "../../../const/config";

//Check if closed auction has a payout
export function useClaimableAuction(
  winningBid: number,
  buyoutBidAmount: number,
  endTimestamp: string | number
) {
  const claimable = useMemo(() => {
    console.log(winningBid, buyoutBidAmount, endTimestamp);
    const now = Date.now() / 1000;
    if (winningBid?.bidderAddress === ZERO_ADDRESS) return false;
    return (
      winningBid >= +buyoutBidAmount / MOONEY_DECIMALS ||
      (winningBid > 0 && +endTimestamp < now)
    );
  }, [winningBid, buyoutBidAmount]);
  return claimable;
}
