import { NFT as NFTType } from "@thirdweb-dev/sdk";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

import styles from "../../styles/Sale.module.css";
import profileStyles from "../../styles/Profile.module.css";
import {
  useContract,
  useCreateAuctionListing,
  useCreateDirectListing,
  Web3Button,
} from "@thirdweb-dev/react";
import {
  MARKETPLACE_ADDRESS,
  NFT_COLLECTION_ADDRESS,
} from "../../const/contractAddresses";
import { useRouter } from "next/router";
import toast, { Toaster } from "react-hot-toast";
import toastStyle from "../../util/toastConfig";

type Props = {
  nft: NFTType;
  contractAddress: string;
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

export default function SaleInfo({ nft, contractAddress }: Props) {
  const router = useRouter();
  // Connect to marketplace contract
  const { contract: marketplace } = useContract(
    MARKETPLACE_ADDRESS,
    "marketplace"
  );
  console.log(nft);
  // useContract is a React hook that returns an object with the contract key.
  // The value of the contract key is an instance of an NFT_COLLECTION on the blockchain.
  // This instance is created from the contract address (NFT_COLLECTION_ADDRESS)
  const { contract: nftCollection } = useContract(contractAddress);

  // Manage form submission state using tabs and conditional rendering
  const [tab, setTab] = useState<"direct" | "auction">("direct");

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

  // User requires to set marketplace approval before listing
  async function checkAndProvideApproval() {
    // Check if approval is required
    try {
      const hasApproval = await nftCollection?.call(
        "isApprovedForAll",
        nft.metadata.owner,
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

  async function handleSubmissionAuction(data: AuctionFormData) {
    await checkAndProvideApproval();
    const startDate = new Date(data.startDate);
    const contractAddress: any = process.env.NEXT_PUBLIC_MOONEY;
    const quantity: any =
      nft.metadata.asset_contract.schema_type === "ERC721" ? 1 : data.quantity;
    const txResult = await marketplace?.auction.createListing({
      assetContractAddress: data.nftContractAddress,
      tokenId: nft.metadata.token_id,
      currencyContractAddress: contractAddress,
      quantity: quantity,
      buyoutPricePerToken: data.buyoutPrice,
      reservePricePerToken: data.floorPrice,
      startTimestamp: startDate,
      listingDurationInSeconds: Math.abs(+new Date(data.endDate) - +startDate),
    });

    return txResult;
  }

  async function handleSubmissionDirect(data: DirectFormData) {
    await checkAndProvideApproval();
    const startDate = new Date(data.startDate);
    const quantity: any =
      nft.metadata.asset_contract.schema_type === "ERC721" ? 1 : data.quantity;

    const contractAddress: any = process.env.NEXT_PUBLIC_MOONEY;
    const txResult = await marketplace?.direct.createListing({
      assetContractAddress: data.nftContractAddress,
      tokenId: nft.metadata.token_id,
      currencyContractAddress: contractAddress,
      quantity,
      buyoutPricePerToken: data.price,
      startTimestamp: startDate,
      listingDurationInSeconds: Math.abs(+new Date(data.endDate) - +startDate),
    });

    return txResult;
  }

  return (
    <>
      <Toaster position="bottom-center" reverseOrder={false} />
      <div className={styles.saleInfoContainer} style={{ marginTop: -42 }}>
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

        {/* Direct listing fields */}
        <div
          className={`${
            tab === "direct"
              ? styles.activeTabContent
              : profileStyles.tabContent
          }`}
          style={{ flexDirection: "column" }}
        >
          <h4 className={styles.formSectionTitle}>When </h4>

          {/* Input field for auction start date */}
          <legend className={styles.legend}> Listing Starts on </legend>
          <input
            className={styles.input}
            type="datetime-local"
            {...registerDirect("startDate")}
            aria-label="Auction Start Date"
          />

          {/* Input field for auction end date */}
          <legend className={styles.legend}> Listing Ends on </legend>
          <input
            className={styles.input}
            type="datetime-local"
            {...registerDirect("endDate")}
            aria-label="Auction End Date"
          />
          <h4 className={styles.formSectionTitle}>Price </h4>

          {/* Input field for buyout price */}
          <legend className={styles.legend}> Price per token</legend>
          <input
            className={styles.input}
            type="number"
            step={0.000001}
            {...registerDirect("price")}
          />
          <legend className={styles.legend}> Quantity</legend>
          <input
            className={styles.input}
            type="number"
            step={0.000001}
            {...registerDirect("quantity")}
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
            onSuccess={(txResult) => {
              toast("Listed Successfully!", {
                icon: "🥳",
                style: toastStyle,
                position: "bottom-center",
              });
              router.push(
                `/collection/${contractAddress}/${nft.metadata.token_id}`
              );
            }}
          >
            Create Direct Listing
          </Web3Button>
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
          <h4 className={styles.formSectionTitle}>When </h4>

          {/* Input field for auction start date */}
          <legend className={styles.legend}> Auction Starts on </legend>
          <input
            className={styles.input}
            type="datetime-local"
            {...registerAuction("startDate")}
            aria-label="Auction Start Date"
          />

          {/* Input field for auction end date */}
          <legend className={styles.legend}> Auction Ends on </legend>
          <input
            className={styles.input}
            type="datetime-local"
            {...registerAuction("endDate")}
            aria-label="Auction End Date"
          />
          <h4 className={styles.formSectionTitle}>Price </h4>

          {/* Input field for minimum bid price */}
          <legend className={styles.legend}> Allow bids starting from </legend>
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
            action={async () => {
              return await handleSubmitAuction(handleSubmissionAuction)();
            }}
            onError={(error) => {
              toast(`Listed Failed! Reason: ${error.cause}`, {
                icon: "❌",
                style: toastStyle,
                position: "bottom-center",
              });
            }}
            onSuccess={(txResult) => {
              toast("Listed Successfully!", {
                icon: "🥳",
                style: toastStyle,
                position: "bottom-center",
              });
              router.push(
                `/collection/${contractAddress}/${nft.metadata.token_id}`
              );
            }}
          >
            Create Auction Listing
          </Web3Button>
        </div>
      </div>
    </>
  );
}
