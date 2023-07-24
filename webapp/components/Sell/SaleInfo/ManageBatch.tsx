import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

type ManageBatchProps = {
  batchType: "direct" | "auction" | undefined;
  listingBatch: any;
  auctionBatch: any;
};

export default function ManageBatch({ batchType, listingBatch, auctionBatch }: ManageBatchProps) {
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
        className="bg-moon-secondary px-3 py-1 rounded-lg shadow shadow-white hover:scale-[1.03] transition-all duration-150 font-medium"
      >
        Submit Batch
      </button>
    );
  }
  console.log(batch);
  return (
    <>
      {/* Manage and submit*/}
      <div className="flex gap-5 mt-5 items-center justify-center md:justify-start">
        <button
          onClick={() => (!batchType || !batch ? toast.error("You haven't added any listings yet") : setEnabled(!enabled))}
          className="bg-indigo-600 px-3 py-1 rounded-lg shadow shadow-white hover:scale-[1.03] transition-all duration-150 font-medium"
        >
          {!enabled ? "Manage Batch" : "Finish Managing"}
        </button>
        <CreateBatch />
      </div>
      {/*Manage batch*/}
      {enabled && batchType && (
        <div className="mt-6 flex flex-col justify-center items-center md:items-start">
          <h6 className="text-lg">
            Type of Batch: <span className="text-xl uppercase tracking-widest text-moon-gold">{batchType}</span>
          </h6>
          <div className="mt-10 flex flex-col gap-10 md:grid md:grid-cols-2 md:grid-flow-row md:gap-12 xl:grid-cols-3 xl:gap-14">
            {batch &&
              batch.map((item, i) => (
                <div
                  key={"batch-listing-" + i}
                  className="hover:ring-1 shadow shadow-moon-orange ring-moon-gold bg-gradient-to-br from-indigo-900 via-black to-indigo-900 rounded-lg w-[320px] h-[170px] px-3 pl-4 flex items-center relative"
                >
                  {/*Replace for IMAGE here, add 120px Width and Height, 'rounded-2xl' and 'object-cover' to the image*/}
                  <div className="h-[120px] w-[120px] bg-gradient-to-br from-slate-900 to-indigo-900 rounded-2xl"></div>

                  <div className="ml-5 text-sm font-mono flex flex-col items-center gap-3 text-center px-1">
                    <p className="absolute -left-2 z-50 -top-4 text-lg tracking-widest font-extrabold bg-moon-gold rounded-lg px-1 py-1">
                      {"#" + Number(i + 1)}
                    </p>
                    <button
                      className="absolute -top-[8px] -right-[5px] text-gray-100 h-8 w-8 font-bold bg-red-600 rounded-full hover:scale-110 transition-all duration-150"
                      onClick={() => (batchType === "direct" ? listingBatch.removeListing(i) : auctionBatch.removeAuction(i))}
                    >
                      X
                    </button>
                    <p className="uppercase">
                      {"Token ID"}
                      <span className="block truncate max-w-[110px] text-moon-gold font-bold">{item.tokenId}</span>
                    </p>

                    {/* quantity */}
                    <p className="uppercase">
                      {"Quantity"}
                      <span className="block truncate max-w-[110px] text-moon-gold font-bold">{item.quantity}</span>
                    </p>

                    {batchType === "direct" ? (
                      <p className="uppercase">
                        {"Price Per NFT"}
                        <span className="block truncate max-w-[110px] text-moon-gold font-bold">{item.pricePerToken}</span>
                      </p>
                    ) : (
                      <p className="uppercase">
                        {"Reserve Price"}
                        <span className="block truncate max-w-[110px] text-moon-gold font-bold">{item.buyoutBidAmount}</span>
                      </p>
                    )}

                    {/* 
                    <p>
                      {"Contract Address:"}
                      {item.assetContractAddress.slice(0, 6) + "..." + item.assetContractAddress.slice(-4)}
                    </p>                    
                    */}
                  </div>
                </div>
              ))}
          </div>
          <div className="mt-5 flex gap-3">
            <button
              className="px-3 py-1 bg-red-600 rounded-lg transition-all hover:scale-[1.03] duration-150"
              onClick={() => {
                setBatch(undefined);
                setEnabled(false);
              }}
            >
              Clear All
            </button>
          </div>
        </div>
      )}
    </>
  );
}
