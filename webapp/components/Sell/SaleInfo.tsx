import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useContract, Web3Button } from "@thirdweb-dev/react";
import toast, { Toaster } from "react-hot-toast";
import toastStyle from "../../lib/utils/toastConfig";
import {
  MARKETPLACE_ADDRESS,
  MOONEY_ADDRESS,
  MOONEY_DECIMALS,
} from "../../const/config";

type Props = {
  nft: any;
  contractAddress: string;
  router: any;
  walletAddress: any;
};

type AuctionFormData = {
  nftContractAddress: string;
  tokenId: any;
  startDate: Date;
  quantity: string;
  endDate: Date;
  floorPrice: string;
  buyoutPrice: string;
};

type DirectFormData = {
  nftContractAddress: string;
  tokenId: any;
  quantity: string;
  price: string;
  startDate: Date;
  endDate: Date;
};

export default function SaleInfo({
  nft,
  contractAddress,
  router,
  walletAddress,
}: Props) {
  const { contract: marketplace }: any = useContract(
    MARKETPLACE_ADDRESS,
    "marketplace-v3"
  );

  const { contract: nftCollection } = useContract(contractAddress);

  // Manage form submission state using tabs and conditional rendering
  const [tab, setTab] = useState<"direct" | "auction">("direct");

  //Check if user has balance for quanity
  function checkBalance(quantity: string | number) {
    const hasBalance = nft && nft.quantityOwned >= +quantity;
    !hasBalance && toast.error("Insufficient balance");
    return hasBalance;
  }

  // User requires to set marketplace approval before listing
  async function checkAndProvideApproval() {
    try {
      const hasApproval = await nftCollection?.call(
        "isApprovedForAll",
        walletAddress || nft.owner,
        MARKETPLACE_ADDRESS
      );

      // If it is, provide approval
      if (!hasApproval) {
        const txResult = await nftCollection?.call(
          "setApprovalForAll",
          MARKETPLACE_ADDRESS,
          true
        );

        if (txResult) {
          toast.success("Marketplace approval granted", {
            icon: "👍",
            style: toastStyle,
            position: "bottom-center",
          });
        }
      }

      return true;
    } catch (err) {
      console.error(err);
    }
  }

  // Manage form values using react-hook-form library: Auction form
  const { register: registerAuction, handleSubmit: handleSubmitAuction } =
    useForm<AuctionFormData>({
      defaultValues: {
        nftContractAddress: contractAddress,
        tokenId: nft.metadata.id,
        startDate: new Date(),
        quantity: "1",
        endDate: new Date(),
        floorPrice: "0",
        buyoutPrice: "0",
      },
    });

  // Manage form values using react-hook-form library: Direct form
  const { register: registerDirect, handleSubmit: handleSubmitDirect } =
    useForm<DirectFormData>({
      defaultValues: {
        nftContractAddress: contractAddress,
        tokenId: nft.metadata.id,
        quantity: "1",
        startDate: new Date(),
        endDate: new Date(),
        price: "0",
      },
    });

  //handle direct listing
  async function handleSubmissionAuction(data: AuctionFormData) {
    if (!checkBalance(data.quantity)) return;

    await checkAndProvideApproval();
    const startDate: any = new Date(data.startDate).valueOf() / 1000;
    const endDate: any = new Date(data.endDate).valueOf() / 1000;

    const auction = {
      assetContract: data.nftContractAddress,
      tokenId: data.tokenId,
      currency: MOONEY_ADDRESS,
      quantity: nft.type === "ERC1155" ? data.quantity : "1",
      minimumBidAmount: String(+data.floorPrice * MOONEY_DECIMALS),
      buyoutBidAmount: String(+data.buyoutPrice * MOONEY_DECIMALS),
      timeBufferInSeconds: "900", //15 minutes
      bidBufferBps: "500",
      startTimestamp: startDate,
      endTimestamp: endDate,
    };
    const txResult = await marketplace.call("createAuction", auction);
    await router.push(`/collection/${data.nftContractAddress}/${data.tokenId}`);
    toast("Listed Successfully!", {
      icon: "🥳",
      style: toastStyle,
      position: "bottom-center",
    });
    return txResult;
  }

  //handle auction listing
  async function handleSubmissionDirect(data: DirectFormData) {
    console.log(data.quantity);
    if (!checkBalance(data.quantity)) return;
    await checkAndProvideApproval();
    const startDate: any = new Date(data.startDate).valueOf() / 1000;
    const endDate: any = new Date(data.endDate).valueOf() / 1000;
    const listing = {
      assetContract: contractAddress,
      tokenId: data.tokenId,
      currency: MOONEY_ADDRESS,
      quantity: nft.type === "ERC1155" ? data.quantity : "1",
      pricePerToken: String(+data.price * MOONEY_DECIMALS),
      startTimestamp: startDate,
      endTimestamp: endDate,
      reserved: false,
    };
    const txResult = await marketplace.call("createListing", listing);
    await router.push(`/collection/${data.nftContractAddress}/${data.tokenId}`);
    toast("Listed Successfully!", {
      icon: "🥳",
      style: toastStyle,
      position: "bottom-center",
    });
    return txResult;
  }

  return (
    <>
      <Toaster position="bottom-center" reverseOrder={false} />
      <div className="-mt-8">
        <div className="w-full flex justify-start border-b-[1px] border-white border-opacity-60 mt-4 mb-4">
          <h3
            className={`p-4 text-base font-semibold text-white text-opacity-60 cursor-pointer transition-all duration-100 hover:text-opacity-80 ${
              tab === "direct"
                ? "text-opacity-100 border-b-2 border-moon-white"
                : ""
            }`}
            onClick={() => setTab("direct")}
          >
            Direct
          </h3>
          <h3
            className={`p-4 text-base font-semibold text-white text-opacity-60 cursor-pointer transition-all duration-100 hover:text-opacity-80 ${
              tab === "auction"
                ? "text-opacity-100 border-b-2 border-moon-white"
                : ""
            }`}
            onClick={() => setTab("auction")}
          >
            Auction
          </h3>
        </div>
        <>
          <>
            {/* Direct listing fields */}
            <div
              className={`py-2 flex flex-col ${
                tab === "direct"
                  ? "opacity-100"
                  : "hidden opacity-0 h-0 transition-all duration-100"
              }`}
            >
              {/* Input field for ERC1155 quantity */}
              {nft.type === "ERC1155" && (
                <>
                  <legend className="text-white text-opacity-80 m-0 mb-2">
                    {" "}
                    Quantity{" "}
                  </legend>
                  <div className="flex items-center">
                    <input
                      className="block w-[25%] py-3 ml-[2px] px-4 mb-4 bg-transparent border-none text-base rounded-lg ring-1 ring-moon-white ring-opacity-50"
                      type="number"
                      min={1}
                      {...registerDirect("quantity")}
                    />
                    <h3
                      className={`relative right-[-5%] bottom-2 text-2xl ${
                        !nft && "animate-pulse"
                      }`}
                    >{`/ ${nft.quantityOwned || "/ ..."}`}</h3>
                  </div>
                  <p className="text-[80%] italic opacity-60">
                    *list multiple assets as a bundle*
                  </p>
                </>
              )}
              <h4 className="mt-6 mb-3">Duration </h4>
              {/* Input field for auction start date */}
              <legend className="text-white text-opacity-80 m-0 mb-2">
                {" "}
                Listing Starts on{" "}
              </legend>
              <input
                className="block w-[98%] py-3 px-4 mb-4 bg-transparent border-none text-base rounded-lg ml-[2px] ring-1 ring-moon-white ring-opacity-50"
                type="datetime-local"
                min={new Date(
                  Date.now() - new Date().getTimezoneOffset() * 60000
                )
                  .toISOString()
                  .slice(0, -8)}
                {...registerDirect("startDate")}
                aria-label="Auction Start Date"
              />
              {/* Input field for auction end date */}
              <legend className="text-white text-opacity-80 m-0 mb-2">
                {" "}
                Listing Ends on{" "}
              </legend>
              <input
                className="block w-[98%] py-3 px-4 mb-4 bg-transparent border-none text-base rounded-lg ml-[2px] ring-1 ring-moon-white ring-opacity-50"
                type="datetime-local"
                min={new Date(
                  Date.now() - new Date().getTimezoneOffset() * 60000
                )
                  .toISOString()
                  .slice(0, -8)}
                {...registerDirect("endDate")}
                aria-label="Auction End Date"
              />
              {
                <>
                  <h4 className="mt-6 mb-3">Price </h4>
                  <legend className="text-white text-opacity-80 m-0 mb-2">
                    {" "}
                    {"Price for asset or bundle"}
                  </legend>
                  <input
                    className="block w-[98%] py-3 px-4 mb-4 bg-transparent border-none text-base rounded-lg ml-[2px] ring-1 ring-moon-white ring-opacity-50"
                    type="number"
                    step={0.000001}
                    {...registerDirect("price")}
                  />

                  <Web3Button
                    className="connect-button"
                    contractAddress={MARKETPLACE_ADDRESS}
                    action={async () => {
                      await handleSubmitDirect(handleSubmissionDirect)();
                    }}
                    onError={(error) => {
                      toast(`Listed Failed! Reason: ${error.cause}`, {
                        icon: "❌",
                        style: toastStyle,
                        position: "bottom-center",
                      });
                    }}
                  >
                    Create Direct Listing
                  </Web3Button>
                </>
              }
            </div>

            {/* Auction listing fields */}
            <div
              className={`py-2 ${
                tab === "auction"
                  ? "flex flex-col opacity-100"
                  : "hidden opacity-0 h-0 transition-all duration-100"
              }`}
              style={{ flexDirection: "column" }}
            >
              {/* Input field for quantity */}
              {nft.type === "ERC1155" && (
                <>
                  <legend className="text-white text-opacity-80 m-0 mb-2">
                    {" "}
                    Quantity{" "}
                  </legend>
                  <div className="flex items-center">
                    <input
                      className="block w-[25%] py-3 ml-[2px] px-4 mb-4 bg-transparent border-none text-base rounded-lg ring-1 ring-moon-white ring-opacity-50"
                      type="number"
                      min={1}
                      {...registerAuction("quantity")}
                    />
                    <h3
                      className={`relative right-[-5%] bottom-2 text-2xl ${
                        !nft && "animate-pulse"
                      }`}
                    >{`/ ${nft.quantityOwned || "/ ..."}`}</h3>
                  </div>
                  <p className="text-[80%] italic opacity-60">
                    *list multiple assets as a bundle*
                  </p>
                </>
              )}

              <h4 className="mt-6 mb-3">Duration </h4>

              {/* Input field for auction start date */}
              <legend className="text-white text-opacity-80 m-0 mb-2">
                {" "}
                Auction Starts on{" "}
              </legend>
              <input
                className="block w-[98%] py-3 px-4 mb-4 bg-transparent border-none text-base rounded-lg ml-[2px] ring-1 ring-moon-white ring-opacity-50"
                type="datetime-local"
                min={new Date(
                  Date.now() - new Date().getTimezoneOffset() * 60000
                )
                  .toISOString()
                  .slice(0, -8)}
                {...registerAuction("startDate")}
                aria-label="Auction Start Date"
              />

              {/* Input field for auction end date */}
              <legend className="text-white text-opacity-80 m-0 mb-2">
                {" "}
                Auction Ends on{" "}
              </legend>
              <input
                className="block w-[98%] py-3 px-4 mb-4 bg-transparent border-none text-base rounded-lg ml-[2px] ring-1 ring-moon-white ring-opacity-50"
                type="datetime-local"
                min={new Date(
                  Date.now() - new Date().getTimezoneOffset() * 60000
                )
                  .toISOString()
                  .slice(0, -8)}
                {...registerAuction("endDate")}
                aria-label="Auction End Date"
              />
              <h4 className="mt-6 mb-3">Price </h4>

              {/* Input field for minimum bid price */}
              <legend className="text-white text-opacity-80 m-0 mb-2">
                {" "}
                Allow bids starting from{" "}
              </legend>
              <input
                className="block w-[98%] py-3 px-4 mb-4 bg-transparent border-none text-base rounded-lg ml-[2px] ring-1 ring-moon-white ring-opacity-50"
                step={0.000001}
                type="number"
                {...registerAuction("floorPrice")}
              />

              {/* Input field for buyout price */}
              <legend className="text-white text-opacity-80 m-0 mb-2">
                {" "}
                Buyout price{" "}
              </legend>
              <input
                className="block w-[98%] py-3 px-4 mb-4 bg-transparent border-none text-base rounded-lg ml-[2px] ring-1 ring-moon-white ring-opacity-50"
                type="number"
                step={0.000001}
                {...registerAuction("buyoutPrice")}
              />

              <Web3Button
                className="connect-button"
                contractAddress={MARKETPLACE_ADDRESS}
                action={async () =>
                  await handleSubmitAuction(handleSubmissionAuction)()
                }
                onError={(error) => {
                  toast(`Listed Failed! Reason: ${error.cause}`, {
                    icon: "❌",
                    style: toastStyle,
                    position: "bottom-center",
                  });
                }}
              >
                Create Auction Listing
              </Web3Button>
            </div>
          </>
        </>
      </div>
    </>
  );
}
