import {
  MediaRenderer,
  ThirdwebNftMedia,
  useAddress,
  useContract,
  useContractEvents,
  useMetadata,
  useNFT,
  Web3Button,
} from "@thirdweb-dev/react";
import React, { useEffect, useState } from "react";
import { GetServerSideProps } from "next";
import Link from "next/link";
import randomColor from "../../../util/randomColor";
import Skeleton from "../../../components/Skeleton/Skeleton";
import toast, { Toaster } from "react-hot-toast";
import toastStyle from "../../../util/toastConfig";
import {
  getAllValidAuctions,
  getAllValidListings,
  useListingsAndAuctionsForTokenId,
} from "../../../lib/marketplace-v3";
import {
  ETHERSCAN_URL,
  MARKETPLACE_ADDRESS,
  MOONEY_DECIMALS,
} from "../../../const/config";
import { DirectListing, AuctionListing } from "../../../lib/utils";
import Listing from "../../../components/NFT/Listing";
import { useRouter } from "next/router";

import styles from "../../../styles/Token.module.css";
import { initSDK } from "../../../lib/thirdweb";
import { getAllDetectedFeatureNames } from "@thirdweb-dev/sdk";
import Metadata from "../../../components/Metadata";

type TokenPageProps = {
  contractAddress: string;
  tokenId: string;
};

const [randomColor1, randomColor2] = [randomColor(), randomColor()];

export default function TokenPage({
  contractAddress,
  tokenId,
}: TokenPageProps) {
  const router = useRouter();
  const address = useAddress();
  const [isOwner, setIsOwner] = useState<boolean>(false);
  //Marketplace
  const [loadingListings, setLoadingListings] = useState<boolean>(true);
  const [validListings, setValidListings] = useState<DirectListing[]>([]);
  const [validAuctions, setValidAuctions] = useState<AuctionListing[]>([]);
  const { contract: marketplace, isLoading: loadingContract }: any =
    useContract(MARKETPLACE_ADDRESS, "marketplace-v3");

  const { listings: directListing, auctions: auctionListing } =
    useListingsAndAuctionsForTokenId(
      validListings,
      validAuctions,
      tokenId,
      contractAddress
    );
  const [currListing, setCurrListing]: any = useState({
    type: "",
    listing: {} as DirectListing | AuctionListing,
  });

  const [winningBid, setWinningBid] = useState<any>();

  const [bidValue, setBidValue] = useState<string>();

  //NFT Collection & Metadata
  const { contract: nftCollection } = useContract(contractAddress);
  const { data: contractMetadata } = useMetadata(nftCollection);
  //NFT data
  const { data: nft }: any = useNFT(nftCollection, tokenId);
  // Load historical transfer events: TODO - more event types like sale
  const { data: transferEvents, isLoading: loadingTransferEvents } =
    useContractEvents(nftCollection, "Transfer", {
      queryFilter: {
        filters: {
          tokenId: tokenId,
        },
        order: "desc",
      },
    });
  async function createBidOrOffer() {
    let txResult;
    if (!currListing) return;

    try {
      if (currListing.type === "auction") {
        txResult = await marketplace?.englishAuctions.makeBid(
          currListing.listing.auctionId,
          bidValue
        );
      } else {
        throw new Error("No valid auction listing found for this NFT");
      }
      setTimeout(() => {
        router.reload();
      }, 5000);
      return txResult;
    } catch (err: any) {
      toast.error(`Bid failed! Reason: ${err.message}`);
    }
  }

  async function buyListing() {
    let txResult;
    try {
      if (currListing.type === "direct") {
        txResult = await marketplace.directListings.buyFromListing(
          currListing.listing.listingId,
          1,
          address
        );
      } else {
        txResult = await marketplace.englishAuctions.buyoutAuction(
          currListing.listing.auctionId
        );
        await marketplace.englishAuctions.executeSale(
          currListing.listing.auctionId
        );
      }
      setTimeout(() => {
        router.reload();
      }, 5000);
      return txResult;
    } catch (err) {
      console.log(err);
    }
  }
  ///set valid listings and auctions
  useEffect(() => {
    if (marketplace) {
      setLoadingListings(true);
      getAllValidListings(marketplace).then((listings: DirectListing[]) => {
        setValidListings(listings);
        setLoadingListings(false);
      });
      getAllValidAuctions(marketplace).then((auctions: AuctionListing[]) => {
        setValidAuctions(auctions);
        setLoadingListings(false);
      });
    }
  }, [marketplace]);

  ///set Current Listing (potentially refactor currListing to useMemo?)
  useEffect(() => {
    if (directListing[0] || auctionListing[0]) {
      const listing = directListing[0]
        ? { type: "direct", listing: directListing[0] }
        : { type: "auction", listing: auctionListing[0] };
      setCurrListing(listing);
    }
  }, [nft, directListing, auctionListing]);

  ///set winning bid
  useEffect(() => {
    //set winning bid if auction
    if (!loadingContract && currListing.type === "auction") {
      (async () => {
        const winningBid = await marketplace?.englishAuctions?.getWinningBid(
          currListing.listing.auctionId
        );
        setWinningBid(winningBid);
        console.log(winningBid);
      })();
    }
    //check if connected wallet is owner of asset
    setIsOwner(currListing.listing.seller === address);
  }, [currListing, address, loadingContract]);

  if (!nft && loadingListings)
    return (
      <>
        <Metadata title={"Asset"} />
        <p>loading</p>
      </>
    );

  return (
    <>
      <Metadata
        title={"Asset"}
        description={nft.metadata.description}
        image={nft.metadata.image}
      />
      <Toaster position="bottom-center" reverseOrder={false} />
      <article className="w-full ml-auto mr-auto px-4 md:mt-24 max-w-[1200px]">
        <div className="w-full flex flex-col gap-8 mt-4 md:mt-32 tablet:flex-row pb-32 tablet:pb-0">
          <div className="flex flex-col flex-1 w-full mt-8 tablet:mt-0">
            <ThirdwebNftMedia
              metadata={nft?.metadata}
              className="!w-full !h-full bg-white bg-opacity-[0.04] rounded-2xl"
            />

            {/*Description*/}
            <div className="px-4">
              <h3 className="mt-8 mb-[15px] text-[23px] font-medium font-GoodTimes text-moon-gold">
                Description
              </h3>

              <p className="font-medium text-base leading-[25px] opacity-80">
                {nft.metadata.description}
              </p>

              {/*Traits*/}
              <h3 className="mt-8 mb-[15px] text-[23px] font-medium font-GoodTimes text-moon-gold">
                Traits
              </h3>

              <div className="flex flex-wrap gap-4 mt-3 bg-white bg-opacity-[0.13] border border-white border-opacity-20">
                {Object.entries(nft?.metadata?.attributes || {}).map(
                  ([key, value]: any) => (
                    <div
                      className="flex flex-col grow gap-1 py-2 px-3 min-w-[128px] min-h-[32px]"
                      key={key}
                    >
                      <p className="m-0 text-white opacity-60">
                        {value.trait_type}
                      </p>
                      <p className="font-semibold m-0 text-white opacity-90">
                        {value.value?.toString() || ""}
                      </p>
                    </div>
                  )
                )}
              </div>

              {/*History*/}
              {currListing?.listing && nft.type === "ERC721" && (
                <>
                  <h3 className="mt-8 mb-[15px] text-[23px] font-medium font-GoodTimes text-moon-gold">
                    History
                  </h3>
                  <div className="flex flex-wrap gap-4 mt-3 bg-white bg-opacity-[0.13] border border-white border-opacity-20">
                    {!loadingTransferEvents &&
                      transferEvents?.map((event, index) => (
                        <div
                          key={event.transaction.transactionHash}
                          className="flex justify-between items-center grow gap-1 py-2 px-3 min-w-[128px] rounded-2xl min-h-[32px]"
                        >
                          <div className="flex flex-col gap-1">
                            <p className="m-0 text-white opacity-60">Event</p>
                            <p className="font-semibold m-0 text-white opacity-90">
                              {
                                // if last event in array, then it's a mint
                                index === transferEvents.length - 1
                                  ? "Mint"
                                  : "Transfer"
                              }
                            </p>
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
              )}
            </div>
          </div>

          {/*Collection title, image and description*/}
          <div className="relative w-full max-w-full top-0 tablet:flex-shrink tablet:sticky tablet:min-w-[370px] tablet:max-w-[450px] tablet:mt-4 tablet:mr-4">
            {contractMetadata && (
              <div className="flex items-center mb-2">
                <Link href={`/collection/${contractAddress}`}>
                  <MediaRenderer
                    src={contractMetadata.image}
                    className="!w-[36px] !h-[36px] rounded-lg mr-4 ml-3 mb-2"
                  />
                  <p className="truncate w-full mx-4 mt-[5px] opacity-50">
                    {contractMetadata.name}
                  </p>
                </Link>
              </div>
            )}
            <h1 className="font-GoodTimes font-medium text-[32px] break-words mb-2 mx-4 text-moon-white">
              {nft.metadata.name}
            </h1>
            <div className="inline-block">
              <p className="font-medium truncate mx-4 mt-4 text-[20px] py-1 px-[10px] rounded-sm bg-moon-secondary bg-opacity-40">
                Token ID #{nft.metadata.id}
              </p>
            </div>

            {currListing?.listing && nft.type === "ERC721" && (
              <Link
                href={`/profile/${currListing?.listing.listingCreator}`}
                className={styles.nftOwnerContainer}
              >
                {/* Random linear gradient circle shape */}
                <div
                  className="mt-4 w-[48px] h-[48px] rounded-[50%] opacity-90 border-2 border-white border-opacity-20"
                  style={{
                    background: `linear-gradient(90deg, ${randomColor1}, ${randomColor2})`,
                  }}
                />
                {/*Nft owner info*/}
                <div className="m-0 p-0 ml-[6px] flex flex-col h-full mt-4">
                  <div>
                    <p className="text-white opacity-60 mt-1 p-[2px]">Seller</p>
                    <p className="font-semibold m-0 text-white text-opacity-90">
                      {currListing?.listing?.seller?.slice(0, 8)}...
                      {currListing?.listing?.seller?.slice(-4)}
                    </p>
                  </div>
                </div>
              </Link>
            )}

            <div className="flex flex-col w-full relative grow bg-transparent rounded-2xl overflow-hidden mt-8 mb-6">
              <div className="p-4 pl-5 rounded-xl bg-white bg-opacity-[0.13] w-full m-0 mb-3">
                {/* Quantity for ERC1155 */}
                {currListing?.listing && nft.type === "ERC1155" && (
                  <>
                    <p className="text-white opacity-60 mt-1 p-[2px]">
                      Quantity
                    </p>
                    <div className="text-[18px] leading-6 font-semibold text-white text-opacity-90 m-0 rounded-lg">
                      {currListing.listing.quantity}
                    </div>
                  </>
                )}
                {/* Pricing information */}
                <p className="text-white opacity-60 mt-1 p-[2px]">Price</p>
                <div className="text-[18px] leading-6 font-semibold text-white text-opacity-90 m-0 rounded-lg">
                  {!currListing ? (
                    <Skeleton width="120" height="24" />
                  ) : (
                    <>
                      {currListing.listing && currListing.type === "direct" ? (
                        <>
                          {+currListing.listing.pricePerToken / MOONEY_DECIMALS}
                          {" " + "MOONEY"}
                        </>
                      ) : currListing.listing &&
                        currListing.type === "auction" ? (
                        <>
                          {+currListing.listing.buyoutBidAmount /
                            MOONEY_DECIMALS}
                          {" " + "MOONEY"}
                        </>
                      ) : (
                        "Not for sale"
                      )}
                    </>
                  )}
                </div>

                {currListing && (
                  <div>
                    {!currListing.listing ? (
                      <Skeleton width="120" height="44" />
                    ) : (
                      <>
                        {currListing.type === "auction" &&
                          currListing.listing && (
                            <>
                              <p
                                className="text-white opacity-60 mt-1 p-[2px]"
                                style={{ marginTop: 12 }}
                              >
                                Bids starting from
                              </p>

                              <div className="text-[18px] leading-6 font-semibold text-white text-opacity-90 m-0 rounded-lg">
                                {+currListing.listing.minimumBidAmount /
                                  MOONEY_DECIMALS}
                                {" " + "MOONEY"}
                              </div>
                              <p
                                className="text-white opacity-60 mt-1 p-[2px]"
                                style={{ marginTop: 12 }}
                              >
                                {"Winning Bid"}
                              </p>
                              <div className="text-[18px] leading-6 font-semibold text-white text-opacity-90 m-0 rounded-lg">
                                {winningBid
                                  ? winningBid.bidAmount / MOONEY_DECIMALS +
                                    " MOONEY"
                                  : "No bids yet"}
                              </div>
                              <p
                                className="text-white opacity-60 mt-1 p-[2px]"
                                style={{ marginTop: 12 }}
                              >
                                {"Expiration"}
                              </p>
                              <div className="text-[18px] leading-6 font-semibold text-white text-opacity-90 m-0 rounded-lg">
                                {new Date(
                                  +currListing.listing.endTimestamp * 1000
                                ).toLocaleDateString() +
                                  " @ " +
                                  new Date(
                                    +currListing.listing.endTimestamp * 1000
                                  ).toLocaleTimeString()}
                              </div>
                            </>
                          )}
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/*Direct listings and auction, hidden if there isn't either via conditional*/}
            {nft.type !== "ERC721" && (
              <div
                className={` ${
                  !directListing[0] && !auctionListing[0] && "hidden"
                } flex flex-col gap-2 px-3 py-2 mb-4`}
              >
                {directListing[0] && (
                  <>
                    <p className="opacity-60 mt-1 p-2 bg-moon-orange text-black rounded-sm">
                      Direct Listings :
                    </p>
                    <div className="max-h-[250px] overflow-y-scroll divide-y-2 divide-moon-gold divide-opacity-30">
                      {directListing[0] &&
                        directListing.map((l: any, i: number) => (
                          <div
                            key={`erc-1155-direct-listing-container-${i}`}
                            className={`flex flex-col mt-1 md:px-2 rounded-sm ${
                              currListing.listing.listingId === l.listingId &&
                              "bg-[#ffffff1d]"
                            }`}
                          >
                            <Listing
                              key={`erc-1155-direct-listing-${i}`}
                              type="direct"
                              listing={l}
                              setCurrListing={setCurrListing}
                            />
                          </div>
                        ))}
                    </div>
                  </>
                )}

                {auctionListing[0] && (
                  <>
                    <p className="opacity-60 mt-1 p-2 bg-moon-orange text-black rounded-sm">
                      Auction Listings :
                    </p>
                    <div
                      className={
                        "max-h-[250px] overflow-y-scroll divide-y-2 divide-moon-gold divide-opacity-25"
                      }
                    >
                      {auctionListing[0] &&
                        auctionListing.map((a: any, i: number) => (
                          <div
                            key={`erc-1155-auction-listing-container-${i}`}
                            className={`flex flex-col mt-1 md:px-2 rounded-sm ${
                              currListing.listing.auctionId === a.auctionId &&
                              "bg-[#ffffff1d]"
                            }`}
                          >
                            <Listing
                              key={`erc-1155-auction-listing-${i}`}
                              type="auction"
                              listing={a}
                              setCurrListing={setCurrListing}
                            />
                          </div>
                        ))}
                    </div>
                  </>
                )}
              </div>
            )}

            {directListing[0] || auctionListing[0] ? (
              <>
                {!currListing.listing.seller ? (
                  <Skeleton width="100%" height="164" />
                ) : (
                  <>
                    {/*Web3 connect button and template in case of listed by user address*/}
                    {isOwner ? (
                      <div>This listing was created by you.</div>
                    ) : (
                      <>
                        <Web3Button
                          contractAddress={MARKETPLACE_ADDRESS}
                          action={async () => await buyListing()}
                          className={`connect-button`}
                          onSuccess={() => {
                            toast(`Purchase success!`, {
                              icon: "✅",
                              style: toastStyle,
                              position: "bottom-center",
                            });
                          }}
                          onError={(e) => {
                            toast(`Purchase failed! Reason: ${e.message}`, {
                              icon: "❌",
                              style: toastStyle,
                              position: "bottom-center",
                            });
                          }}
                        >
                          Buy at asking price
                        </Web3Button>

                        {address && currListing.type === "auction" && (
                          <>
                            <div className="flex items-center justify-center m-0 my-4">
                              <p className="text-sm leading-6 text-white text-opacity-60 m-0">
                                or
                              </p>
                            </div>
                            <input
                              className="block border border-white w-[98%] py-3 px-4 bg-black bg-opacity-70 border-opacity-60 rounded-lg mb-4 ml-[2px]"
                              placeholder={
                                currListing.type === "auction" && winningBid > 0
                                  ? winningBid
                                  : currListing.listing
                                  ? +currListing.listing.minimumBidAmount /
                                    MOONEY_DECIMALS
                                  : 0
                              }
                              type="number"
                              step={0.000001}
                              onChange={(e) => {
                                setBidValue(e.target.value);
                              }}
                            />

                            <Web3Button
                              contractAddress={MARKETPLACE_ADDRESS}
                              action={async () => await createBidOrOffer()}
                              className={`${styles.btn} connect-button`}
                            >
                              Place bid
                            </Web3Button>
                          </>
                        )}
                      </>
                    )}
                  </>
                )}
              </>
            ) : (
              <></>
            )}
          </div>
        </div>
      </article>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const contractAddress = params?.contractAddress;
  const tokenId = params?.tokenId;

  const sdk = initSDK();
  const marketplace: any = await sdk.getContract(MARKETPLACE_ADDRESS);
  const acceptedCollections = await marketplace.roles.get("asset");

  //if no contract address or token id, return 404
  if (!acceptedCollections.includes(contractAddress)) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      contractAddress,
      tokenId,
    },
  };
};
