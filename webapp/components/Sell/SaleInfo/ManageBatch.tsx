import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

type ManageBatchProps = {
  batchType: "direct" | "auction" | undefined;
  listingBatch: any;
  auctionBatch: any;
};

export default function ManageBatch({
  batchType,
  listingBatch,
  auctionBatch,
}: ManageBatchProps) {
  const [enabled, setEnabled] = useState<boolean>(false);
  const [batch, setBatch] = useState<any[]>();

  useEffect(() => {
    if (batchType === "direct") {
      setBatch(listingBatch.listings);
    } else if (batchType === "auction") {
      setBatch(auctionBatch.auctions);
    }
  }, [batchType, listingBatch.listings, auctionBatch.auctions]);

  function CreateBatch() {
    return (
      <button
        onClick={() => {
          if (batchType === "direct") {
            listingBatch.listAll();
          } else if (batchType === "auction") {
            auctionBatch.listAll();
          }
        }}
      >
        Submit Batch
      </button>
    );
  }

  return (
    <>
      <div className="flex gap-4">
        <button
          onClick={() =>
            !batchType || !batch
              ? toast.error("You haven't added any listings yet")
              : setEnabled(true)
          }
        >
          Manage Batch
        </button>
        <CreateBatch />
      </div>
      {enabled && batchType && (
        <div className="fixed top-[10%] flex flex-col justify-baseline items-center w-3/4 h-3/4 rounded-lg bg-main-background bg-opacity-[0.75] z-[100]">
          <button
            className="text-2xl absolute top-4 right-4 ease-out hover:scale-110"
            onClick={() => setEnabled(false)}
          >
            ✖
          </button>
          <h1>{"Type of Batch:" + batchType}</h1>

          <div className="flex flex-col gap-4">
            {batch &&
              batch.map((item, i) => (
                <div key={"batch-listing-" + i} className="bg-[grey] p-4">
                  <button
                    className="p-2 bg-moon-secondary"
                    onClick={() =>
                      batchType === "direct"
                        ? listingBatch.removeListing(i)
                        : auctionBatch.removeAuction(i)
                    }
                  >
                    remove
                  </button>
                  <p>{"#" + Number(i + 1)}</p>
                  <p>
                    {"Token ID:"}
                    {item.tokenId}
                  </p>
                  <p>
                    {"Asset Contract Address:"}
                    {item.assetContractAddress.slice(0, 6) +
                      "..." +
                      item.assetContractAddress.slice(-4)}
                  </p>

                  {/* quantity */}
                  <p>
                    {"Quantity:"}
                    {item.quantity}
                  </p>

                  {batchType === "direct" ? (
                    <p>
                      {"Price Per Token:"}
                      {item.pricePerToken}
                    </p>
                  ) : (
                    <p>
                      {"Reserve Price:"}
                      {item.buyoutBidAmount}
                    </p>
                  )}
                </div>
              ))}
          </div>
          <button
            className="p-2 bg-moon-secondary absolute bottom-4"
            onClick={() => {
              setBatch(undefined);
              setEnabled(false);
            }}
          >
            Clear All
          </button>
        </div>
      )}
    </>
  );
}
