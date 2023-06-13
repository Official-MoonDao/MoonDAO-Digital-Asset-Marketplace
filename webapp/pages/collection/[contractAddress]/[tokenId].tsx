import { MediaRenderer, ThirdwebNftMedia, useAddress, useContract, useContractEvents, useNFT, Web3Button } from "@thirdweb-dev/react";
import React, { useEffect, useState } from "react";
import Container from "../../../components/Container/Container";
import { GetServerSideProps } from "next";
import { DirectListing, NFT } from "@thirdweb-dev/sdk";
import Link from "next/link";
import randomColor from "../../../util/randomColor";
import Skeleton from "../../../components/Skeleton/Skeleton";
import toast, { Toaster } from "react-hot-toast";
import toastStyle from "../../../util/toastConfig";
import { getAllValidAuctions, getAllValidListings, getAllValidOffers, useListingsAndAuctionsForTokenId } from "../../../lib/marketplace-v3";
import { initSDK } from "../../../lib/thirdweb";
import { ETHERSCAN_URL, MARKETPLACE_ADDRESS, MOONEY_DECIMALS } from "../../../const/config";
import { AuctionListing, BigConvert } from "../../../lib/utils";
import Listing from "../../../components/NFT/Listing";
import { useRouter } from "next/router";

import styles from "../../../styles/Token.module.css";

type Props = {
  nft: NFT;
  contractMetadata: any;
  validListings: any;
  validAuctions: any;
  tokenId: number;
};

const [randomColor1, randomColor2] = [randomColor(), randomColor()];

export default function TokenPage({ contractMetadata, validListings, validAuctions, tokenId }: Props) {
  const router = useRouter();
  const address = useAddress();
  const [isOwner, setIsOwner] = useState<boolean>(false);
  //Marketplace
  const { contract: marketplace, isLoading: loadingContract }: any = useContract(MARKETPLACE_ADDRESS, "marketplace-v3");
  //Marketplace data
  const { listings: directListing, auctions: auctionListing } = useListingsAndAuctionsForTokenId(
    validListings,
    validAuctions,
    tokenId,
    contractMetadata.address
  );
  const [currListing, setCurrListing]: any = useState({
    type: "",
    listing: {} as DirectListing | AuctionListing,
  });

  const [winningBid, setWinningBid] = useState<any>();

  const [bidValue, setBidValue] = useState<string>();

  //NFT Collection & NFT
  const { contract: nftCollection } = useContract(contractMetadata.address);
  //NFT data
  const { data: nft }: any = useNFT(nftCollection, tokenId);
  // Load historical transfer events: TODO - more event types like sale
  const { data: transferEvents, isLoading: loadingTransferEvents } = useContractEvents(nftCollection, "Transfer", {
    queryFilter: {
      filters: {
        tokenId: nft?.metadata.id,
      },
      order: "desc",
    },
  });

  async function createBidOrOffer() {
    let txResult;
    if (!currListing) return;
    if (!bidValue) {
      toast(`Please enter a bid value`, {
        icon: "❌",
        style: toastStyle,
        position: "bottom-center",
      });
      return;
    }

    try {
      if (currListing.type === "auction") {
        txResult = await marketplace?.englishAuctions.makeBid(currListing.listing.auctionId, bidValue);
      } else {
        throw new Error("No valid auction listing found for this NFT");
      }
      setTimeout(() => {
        router.reload();
      }, 5000);
      return txResult;
    } catch (err) {
      console.log(err);
    }
  }

  async function buyListing() {
    let txResult;
    try {
      if (currListing.type === "direct") {
        txResult = await marketplace.directListings.buyFromListing(currListing.listing.listingId, 1, address);
      } else {
        txResult = await marketplace.englishAuctions.buyoutAuction(currListing.listing.auctionId);
        await marketplace.englishAuctions.executeSale(currListing.listing.auctionId);
      }
      setTimeout(() => {
        router.reload();
      }, 5000);
      return txResult;
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    if (directListing[0] || auctionListing[0]) {
      const listing = directListing[0] ? { type: "direct", listing: directListing[0] } : { type: "auction", listing: auctionListing[0] };
      setCurrListing(listing);
    }
    console.log(directListing, auctionListing);
  }, [nft, directListing, auctionListing]);

  useEffect(() => {
    //set winning bid if auction
    if (!loadingContract && currListing.type === "auction") {
      (async () => {
        const winningBid = await marketplace?.englishAuctions?.getWinningBid(currListing.listing.auctionId);
        setWinningBid(winningBid);
      })();
    }

    //check if connected wallet is owner of asset
    setIsOwner(currListing.listing.seller === address);
  }, [currListing, address, loadingContract]);

  if (!nft || !currListing || !contractMetadata || loadingContract) return <>loading</>;

  return (
    <>
      <Toaster position="bottom-center" reverseOrder={false} />
      <Container maxWidth="lg" className="">
        <div className={styles.container}>
          <div className={styles.metadataContainer}>
            <ThirdwebNftMedia metadata={nft?.metadata} className={styles.image} />

            {/*Description, traits*/}
            <div className={styles.descriptionContainer}>
              
              <h3 className={styles.descriptionTitle}>Description</h3>
              <p className={styles.description}>{nft.metadata.description}</p>

              <h3 className={styles.descriptionTitle}>Traits</h3>

              <div className={styles.traitsContainer}>
                {Object.entries(nft?.metadata?.attributes || {}).map(([key, value]: any) => (
                  <div className={styles.traitContainer} key={key}>
                    <p className={styles.traitName}>{key}</p>
                    <p className={styles.traitValue}>{value.value?.toString() || ""}</p>
                  </div>
                ))}
              </div>
              {/*History*/}
              <h3 className={styles.descriptionTitle}>History</h3>
              <div className={styles.traitsContainer}>
                {!loadingTransferEvents &&
                  transferEvents?.map((event, index) => (
                    <div key={event.transaction.transactionHash} className={styles.eventsContainer}>
                      <div className={styles.eventContainer}>
                        <p className={styles.traitName}>Event</p>
                        <p className={styles.traitValue}>
                          {
                            // if last event in array, then it's a mint
                            index === transferEvents.length - 1 ? "Mint" : "Transfer"
                          }
                        </p>
                      </div>

                      <div className={styles.eventContainer}>
                        <p className={styles.traitName}>From</p>
                        <p className={styles.traitValue}>
                          {event.data.from?.slice(0, 4)}...
                          {event.data.from?.slice(-2)}
                        </p>
                      </div>

                      <div className={styles.eventContainer}>
                        <p className={styles.traitName}>To</p>
                        <p className={styles.traitValue}>
                          {event.data.to?.slice(0, 4)}...
                          {event.data.to?.slice(-2)}
                        </p>
                      </div>

                      <div className={styles.eventContainer}>
                        <Link className={styles.txHashArrow} href={`${ETHERSCAN_URL}/tx/${event.transaction.transactionHash}`} target="_blank">
                          ↗
                        </Link>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

          </div>

          {/*Collection title, image and description*/}
          <div className={styles.listingContainer}>
            {contractMetadata && (
              <div className={styles.contractMetadataContainer}>
                <Link href={`/collection/${contractMetadata.address}`}>
                  <MediaRenderer src={contractMetadata.image} className={styles.collectionImage} />
                  <p className={`${styles.collectionName}`}>{contractMetadata.name}</p>
                </Link>
              </div>
            )}
            <h1 className={styles.title}>{nft.metadata.name}</h1>
            <div className={styles.tokenIdContainer}>
              <p className={styles.tokenId}>Token ID #{nft.metadata.id}</p>
            </div>

            {currListing?.listing && nft.type === "ERC721" && (
              <Link href={`/profile/${currListing?.listing.listingCreator}`} className={styles.nftOwnerContainer}>
                {/* Random linear gradient circle shape */}
                <div
                  className={styles.nftOwnerImage}
                  style={{
                    background: `linear-gradient(90deg, ${randomColor1}, ${randomColor2})`,
                  }}
                />
                {/*Nft owner info*/}
                <div className={styles.nftOwnerInfo}>
                  <div>
                    <p className={styles.label}>Seller</p>
                    <p className={styles.nftOwnerAddress}>
                      {currListing?.listing?.seller?.slice(0, 8)}...
                      {currListing?.listing?.seller?.slice(-4)}
                    </p>
                  </div>
                </div>
              </Link>
            )}

            <div className={styles.pricingContainer}>
              {/* Pricing information */}
              <div className={styles.pricingInfo}>
                <p className={styles.label}>Price</p>
                <div className={styles.pricingValue}>
                  {!directListing || !auctionListing ? (
                    <Skeleton width="120" height="24" />
                  ) : (
                    <>
                      {directListing && directListing[0] ? (
                        <>
                          {+directListing[0].pricePerToken / MOONEY_DECIMALS}
                          {" " + "MOONEY"}
                        </>
                      ) : auctionListing && auctionListing[0] ? (
                        <>
                          {+auctionListing[0].buyoutBidAmount / MOONEY_DECIMALS}
                          {" " + "MOONEY"}
                        </>
                      ) : (
                        "Not for sale"
                      )}
                    </>
                  )}
                </div>

                {auctionListing[0] && nft.type === "ERC721" && (
                  <div>
                    {!auctionListing ? (
                      <Skeleton width="120" height="24" />
                    ) : (
                      <>
                        {auctionListing && auctionListing[0] && (
                          <>
                            <p className={styles.label} style={{ marginTop: 12 }}>
                              Bids starting from
                            </p>

                            <div className={styles.pricingValue}>
                              {+auctionListing[0].minimumBidAmount / MOONEY_DECIMALS}
                              {" " + "MOONEY"}
                            </div>
                            <p className={styles.label} style={{ marginTop: 12 }}>
                              {"Winning Bid"}
                            </p>
                            <div className={styles.pricingValue}>{winningBid && +BigConvert(winningBid[2]) / MOONEY_DECIMALS + " MOONEY"}</div>
                          </>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>

            {nft.type !== "ERC721" && (
              <div className="flex flex-col p-2 divide-y divide-[grey] border-2 border-[grey] rounded-lg mb-4">
                <div>
                  <p className={styles.label}>Direct Listings :</p>
                  <div>
                    {directListing[0] &&
                      directListing.map((l: any, i: number) => (
                        <div
                          className={`flex flex-col p-2 ${currListing.listing.listingId === l.listingId && "bg-moon-gold"}`}
                          key={`erc-1155-direct-listing-${i}`}
                        >
                          <Listing type="direct" listing={l} setCurrListing={setCurrListing} />
                        </div>
                      ))}
                  </div>
                </div>

                <div>
                  <p className={styles.label}>Auction Listings :</p>
                  <div>
                    {auctionListing[0] &&
                      auctionListing.map((a: any, i: number) => (
                        <div
                          className={`flex flex-col p-2 ${currListing.listing.auctionId === a.auctionId && "bg-moon-gold"}`}
                          key={`erc-1155-auction-listing-${i}`}
                        >
                          <Listing type="auction" listing={a} setCurrListing={setCurrListing} />
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}

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
                      className={`${styles.btn} connect-button`}
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

                    {currListing.type === "auction" && (
                      <>
                        <div className={`${styles.listingTimeContainer} ${styles.or}`}>
                          <p className={styles.listingTime}>or</p>
                        </div>
                        <input
                          className={styles.input}
                          defaultValue={currListing.type === "auction" ? +currListing.listing.minimumBidAmount / MOONEY_DECIMALS : 0}
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
                          onSuccess={() => {
                            toast(`Bid success!`, {
                              icon: "✅",
                              style: toastStyle,
                              position: "bottom-center",
                            });
                          }}
                          onError={(e) => {
                            console.log(e);
                            toast(`Bid failed! Reason: ${e.message}`, {
                              icon: "❌",
                              style: toastStyle,
                              position: "bottom-center",
                            });
                          }}
                        >
                          Place bid
                        </Web3Button>
                      </>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </Container>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const contractAddress = params?.contractAddress;
  const tokenId: any = params?.tokenId;

  const sdk = initSDK();

  const nftContract = await sdk.getContract(contractAddress as string);
  const contractMetadata = await nftContract.metadata.get();

  const marketplace = await sdk.getContract(MARKETPLACE_ADDRESS);
  const validListings = await getAllValidListings(marketplace);
  const validAuctions = await getAllValidAuctions(marketplace);
  const validOffers = await getAllValidOffers(marketplace, tokenId);

  return {
    props: {
      contractMetadata: { ...contractMetadata, address: contractAddress },
      tokenId,
      validListings,
      validAuctions,
      validOffers,
    },
  };
};
