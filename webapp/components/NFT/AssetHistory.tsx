import Link from "next/link";
import { ETHERSCAN_URL } from "../../const/config";
import { useContractEvents } from "@thirdweb-dev/react";
import { SmartContract } from "@thirdweb-dev/sdk";
import { useCurrBlockNum } from "../../lib/utils/hooks";

interface AssetHistoryProps {
  contract: SmartContract | undefined;
  tokenId: string;
}

export default function AssetHistory({ contract, tokenId }: AssetHistoryProps) {
  const currBlockNum: any = useCurrBlockNum();
  const { data: transferEvents, isLoading: loadingTransferEvents }: any =
    useContractEvents(contract, "Transfer", {
      queryFilter: {
        filters: {
          tokenId: tokenId,
        },
        fromBlock: +currBlockNum - 19999,
        order: "desc",
      },
    });
  return (
    <>
      <h3 className="mt-8 mb-[15px] text-[23px] font-medium font-GoodTimes text-moon-gold">
        History
      </h3>
      <div
        id="asset-transfer-events"
        className="flex flex-wrap gap-4 mt-3 bg-white bg-opacity-[0.13] border border-white border-opacity-20 max-h-[410px] overflow-y-scroll"
      >
        {transferEvents &&
          transferEvents[0] &&
          transferEvents.map((event: any, index: number) => (
            <div
              key={event.transaction.transactionHash}
              className="flex justify-between items-center grow gap-1 py-2 px-3 min-w-[128px] rounded-2xl min-h-[32px]"
            >
              <div className="flex flex-col gap-1">
                <p className="m-0 text-white opacity-60">Event</p>
                {transferEvents && transferEvents[0] ? (
                  <p className="font-semibold m-0 text-white opacity-90">
                    {
                      // if last event in array, then it's a mint
                      "Transfer"
                    }
                  </p>
                ) : (
                  <p className="font-semibold m-0 text-white opacity-90">
                    {event.data}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-1">
                <p className="m-0 text-white opacity-60">From</p>
                <p className="font-semibold m-0 text-white opacity-90">
                  {event.data.from?.slice(0, 4)}...
                  {event.data.from?.slice(-2)}
                </p>
              </div>

              <div className="flex flex-col gap-1">
                <p className="m-0 text-white opacity-60">To</p>
                <p className="font-semibold m-0 text-white opacity-90">
                  {event.data.to?.slice(0, 4)}...
                  {event.data.to?.slice(-2)}
                </p>
              </div>

              <div className="flex flex-col gap-1">
                <Link
                  className="w-[34px] h-[34px] p-2 transition-all duration-150 hover:scale-[1.35]"
                  href={`${ETHERSCAN_URL}/tx/${event.transaction.transactionHash}`}
                  target="_blank"
                >
                  ↗
                </Link>
              </div>
            </div>
          ))}
      </div>
    </>
  );
}
