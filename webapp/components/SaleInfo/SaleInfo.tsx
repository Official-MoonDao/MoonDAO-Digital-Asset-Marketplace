
import React, { useState } from "react";
import { useForm } from "react-hook-form";

import styles from "../../styles/Sale.module.css";
import profileStyles from "../../styles/Profile.module.css";
import {
  useContract,
  useContractWrite,
  useCreateAuctionListing,
  Web3Button,
} from "@thirdweb-dev/react";
import toast, { Toaster } from "react-hot-toast";
import toastStyle from "../../util/toastConfig";
import {
  MARKETPLACE_ADDRESS,
  MOONEY_ADDRESS,
  MOONEY_DECIMALS,
  VMOONEY_ADDRESS,
} from "../../const/config";
import { useListingsAndAuctionsForTokenIdAndWallet } from "../../lib/marketplace-v3";

type Props = {
  nft: any;
  contractAddress: string;
  router: any;
  walletAddress: any;
  validListings: any;
  validAuctions: any;
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
  validListings,
  validAuctions,
}: Props) {
  const { contract: marketplace }: any = useContract(
    MARKETPLACE_ADDRESS,
    "marketplace-v3"
  );

  const { contract: vMooneyContract } = useContract(VMOONEY_ADDRESS);

  const { listings, auctions } = useListingsAndAuctionsForTokenIdAndWallet(
    validListings,
    validAuctions,
    nft.metadata.token_id,
    nft.metadata.asset_contract.address,
    walletAddress
  );

  const { mutateAsync: createDirectListing } = useContractWrite(
    marketplace,
    "createListing"
  );
  const { mutateAsync: createAuctionListing }: any =
    useCreateAuctionListing(marketplace);

  const [isListed, setIsListed] = useState();

  const { contract: nftCollection } = useContract(contractAddress);

  // Manage form submission state using tabs and conditional rendering
  const [tab, setTab] = useState<"direct" | "auction">("direct");

  // User requires to set marketplace approval before listing
  async function checkAndProvideApproval() {
    try {
      const hasApproval = await nftCollection?.call(
        "isApprovedForAll",
        walletAddress || nft.metadata.owner,
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
        tokenId: nft.metadata.token_id,
        startDate: new Date(),
        quantity: "0",
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
        tokenId: nft.metadata.token_id,
        quantity: "0",
        startDate: new Date(),
        endDate: new Date(),
        price: "0",
      },
    });

  //handle direct listing
  async function handleSubmissionAuction(data: AuctionFormData) {
    const hasVMooney = await checkAndProvideApproval();
    if (!hasVMooney)
      return toast("You need to have vMooney to list NFTs", {
        icon: "👎",
        style: toastStyle,
        position: "bottom-center",
      });
    if (isListed)
      return toast(`This NFT has already been listed!`, {
        icon: "❌",
        style: toastStyle,
        position: "bottom-center",
      });
    const startDate: any = new Date(data.startDate).valueOf() / 1000;
    const endDate: any = new Date(data.endDate).valueOf() / 1000;

    const auction = {
      assetContract: data.nftContractAddress,
      tokenId: data.tokenId,
      currency: MOONEY_ADDRESS,
      quantity: "1",
      minimumBidAmount: String(+data.floorPrice * MOONEY_DECIMALS),
      buyoutBidAmount: String(+data.buyoutPrice * MOONEY_DECIMALS),
      timeBufferInSeconds: "900", //15 minutes
      bidBufferBps: "500",
      startTimestamp: startDate,
      endTimestamp: endDate,
    };
    const txResult = await marketplace.call("createAuction", auction);
    router.push(`/collection/${data.nftContractAddress}/${data.tokenId}`);
    toast("Listed Successfully!", {
      icon: "🥳",
      style: toastStyle,
      position: "bottom-center",
    });
    return txResult;
  }

  //handle auction listing
  async function handleSubmissionDirect(data: DirectFormData) {
    await checkAndProvideApproval();

    if (isListed)
      return toast(`This NFT has already been listed!`, {
        icon: "❌",
        style: toastStyle,
        position: "bottom-center",
      });
    // console.log(nft.metadata.asset_contract);
    // if (nft.asset_contract?.chain_identifier !== "goerli" || "ethereum") {
    //   toast("This NFT is not supported", {
    //     icon: "👎",
    //     style: toastStyle,
    //     position: "bottom-center",
    //   });
    //   return new Error("Unsupported NFT");
    // }
    const startDate: any = new Date(data.startDate).valueOf() / 1000;
    const endDate: any = new Date(data.endDate).valueOf() / 1000;

    const listing = {
      assetContract: contractAddress,
      tokenId: data.tokenId,
      currency: MOONEY_ADDRESS,
      quantity: "1",
      pricePerToken: String(+data.price * MOONEY_DECIMALS),
      startTimestamp: startDate,
      endTimestamp: endDate,
      reserved: false,
    };
    const txResult = await marketplace.call("createListing", listing);
    router.push(`/collection/${data.nftContractAddress}/${data.tokenId}`);
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
      <div className={styles.saleInfoContainer} style={{ marginTop: -32 }}>
        <div className={profileStyles.tabs}>
          <h3
            className={`${profileStyles.tab} 
        ${tab === "direct" ? profileStyles.activeTab : ""}`}
            onClick={() => setTab("direct")}
          >
            Direct
          </h3>
          <h3
            className={`${profileStyles.tab} 
        ${tab === "auction" ? profileStyles.activeTab : ""}`}
            onClick={() => setTab("auction")}
          >
            Auction
          </h3>
        </div>
        {!validListings && !validAuctions ? (
          <div className="flex w-full justify-center">...loading</div>
        ) : (
          <>
            {isListed ? (
              <div>
                <h4
                  className={styles.formSectionTitle}
                >{`This NFT has already been listed (batch listing for ERC-1155 coming soon)`}</h4>
                <Web3Button
                  contractAddress={MARKETPLACE_ADDRESS}
                  action={async () => {
                    // await handleRemoveListing();
                  }}
                  onSuccess={() => {
                    toast("You have successfully removed the listing", {
                      icon: "✅",
                      style: toastStyle,
                      position: "bottom-center",
                    });
                    router.push(`/buy`);
                  }}
                  onError={(err) => {
                    toast(`Something went wrong : ${err.message}`, {
                      icon: "❌",
                      style: toastStyle,
                      position: "bottom-center",
                    });
                  }}
                >
                  Remove Listing
                </Web3Button>
              </div>
            ) : (
              <>
                {/* Direct listing fields */}

                <div
                  className={`${
                    tab === "direct"
                      ? styles.activeTabContent
                      : profileStyles.tabContent
                  }`}
                  style={{ flexDirection: "column" }}
                >
                  <h4 className={styles.formSectionTitle}>Duration </h4>
                  {/* Input field for auction start date */}
                  <legend className={styles.legend}> Listing Starts on </legend>
                  <input
                    className={styles.input}
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
                  <legend className={styles.legend}> Listing Ends on </legend>
                  <input
                    className={styles.input}
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
                      <h4 className={styles.formSectionTitle}>Price </h4>
                      <legend className={styles.legend}>
                        {" "}
                        Price per token
                      </legend>
                      <input
                        className={styles.input}
                        type="number"
                        step={0.000001}
                        {...registerDirect("price")}
                      />

                      <Web3Button
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
                  className={`${
                    tab === "auction"
                      ? styles.activeTabContent
                      : profileStyles.tabContent
                  }`}
                  style={{ flexDirection: "column" }}
                >
                  <h4 className={styles.formSectionTitle}>Duration </h4>

                  {/* Input field for auction start date */}
                  <legend className={styles.legend}> Auction Starts on </legend>
                  <input
                    className={styles.input}
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
                  <legend className={styles.legend}> Auction Ends on </legend>
                  <input
                    className={styles.input}
                    type="datetime-local"
                    min={new Date(
                      Date.now() - new Date().getTimezoneOffset() * 60000
                    )
                      .toISOString()
                      .slice(0, -8)}
                    {...registerAuction("endDate")}
                    aria-label="Auction End Date"
                  />
                  <h4 className={styles.formSectionTitle}>Price </h4>

                  {/* Input field for minimum bid price */}
                  <legend className={styles.legend}>
                    {" "}
                    Allow bids starting from{" "}
                  </legend>
                  <input
                    className={styles.input}
                    step={0.000001}
                    type="number"
                    {...registerAuction("floorPrice")}
                  />

                  {/* Input field for buyout price */}
                  <legend className={styles.legend}> Buyout price </legend>
                  <input
                    className={styles.input}
                    type="number"
                    step={0.000001}
                    {...registerAuction("buyoutPrice")}
                  />

                  <Web3Button
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
            )}
          </>
        )}
      </div>
    </>
  );
}
