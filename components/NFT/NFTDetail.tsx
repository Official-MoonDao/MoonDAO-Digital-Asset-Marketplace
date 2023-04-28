import styles from "../../styles/Token.module.css";
import Link from "next/link";
import {
  ThirdwebNftMedia,
  useContract,
  useContractMetadata,
  useNFT,
  Web3Button,
} from "@thirdweb-dev/react";
import Container from "../Container/Container";
import { toast, Toaster } from "react-hot-toast";
import randomColor from "../../util/randomColor";
import Skeleton from "../Skeleton/Skeleton";
import { useEffect, useState } from "react";
import { MARKETPLACE_ADDRESS } from "../../const/contractAddresses";
import toastStyle from "../../util/toastConfig";
const [randomColor1, randomColor2] = [randomColor(), randomColor()];

export default function NFTDetail({
  tokenId,
  assetListings,
  assetAuctions,
  router,
  user,
  contractAddress,
}: any) {
  const [bidValue, setBidValue] = useState<string>();
  // Connect to marketplace smart contract
  const { contract: nftContract } = useContract(contractAddress);
  const { data: nftContractMetadata } = useContractMetadata(nftContract);
  const { data: nft }: any = useNFT(nftContract, tokenId);
  const { contract: marketplace } = useContract(
    MARKETPLACE_ADDRESS,
    "marketplace-v3"
  );

  const [listings, setListings] = useState<any>([
    ...assetListings,
    ...assetAuctions,
  ]);
  const [currListing, setCurrListing] = useState<any>([]);

  const [maxBid, setMaxBid] = useState<number>(0);

  async function createBidOrOffer() {
    let txResult;
    if (!bidValue || +bidValue < 0) {
      toast(`Please enter a bid value`, {
        icon: "❌",
        style: toastStyle,
        position: "bottom-center",
      });
      return;
    }

    const listing = currListing.id ? currListing : listings[0];

    if (listing.type === 1) {
      // make offer on auction
      txResult = await marketplace?.englishAuctions.makeBid(
        listing.id,
        bidValue
      );
    }

    return txResult;
  }

  async function buyListing() {
    let txResult;
    const selectedListing = currListing.id ? currListing : listings[0];

    if (selectedListing.type === 1) {
      txResult = await marketplace?.englishAuctions.buyoutAuction(
        selectedListing.id
      );
    } else {
      txResult = await marketplace?.directListings.buyFromListing(
        selectedListing.id,
        1,
        user.address
      );
    }
    return txResult;
  }

  async function handleRemoveListing(listingId: string) {
    if (listings) {
      listings[0].type === 0
        ? await marketplace?.directListings.cancelListing(listingId)
        : await marketplace?.englishAuctions.cancelAuction(listingId);

      router.push(`/profile/${user.address}`);
    }
  }

  useEffect(() => {
    if (listings[0].type === 1 || currListing.type === 1) {
      const selectedListing = currListing.id ? currListing : listings[0];
      if (selectedListing) {
        (async () => {
          const offers: any = await marketplace?.getOffers(selectedListing.id);
          const highestOffer: any = offers?.reduce(
            (acc: any, offer: any, i: any) => {
              return Math.max(acc, offer.currencyValue.displayValue);
            },
            [offers[0]?.currencyValue?.displayValue]
          );
          setMaxBid(highestOffer > 0 ? highestOffer : "No bids yet");
        })();
      } else setMaxBid(0);
    }
    console.log(nft);
  }, [listings, currListing, marketplace]);
  //check if contract supports erc1155
  const [contractType, setContractType] = useState<string>("erc721");
  useEffect(() => {
    if (nftContract)
      (async () => {
        const type = (await nftContract.call("supportsInterface", "0xd9b67a26"))
          ? "erc1155"
          : "erc721";
        setContractType(type);
      })();
  }, [nftContract]);

  return (
    <>
      <Toaster position="bottom-center" reverseOrder={false} />
      <Container maxWidth="lg" className={"mb-4"}>
        <div className={styles.container}>
          <div className={styles.metadataContainer}>
            <ThirdwebNftMedia
              metadata={nft?.metadata}
              className={styles.image}
            />

            <div className={styles.descriptionContainer}>
              <h3 className={styles.descriptionTitle}>Description</h3>
              <p className={styles.description}>
                {nft?.metadata.description || "No description provided"}
              </p>

              <h3 className={styles.descriptionTitle}>Traits</h3>

              <div className={styles.traitsContainer}>
                {Object.entries(nft?.metadata.attributes || {}).map(
                  ([key, value]: any) => (
                    <div className={styles.traitContainer} key={key}>
                      <p className={styles.traitName}>{value.trait_type} :</p>
                      <p className={styles.traitValue}>
                        {`${new Date(
                          value.value?.toString() * 1000 -
                            new Date().getTimezoneOffset() * 60000
                        ).toLocaleDateString()} @ ${new Date(
                          value.value?.toString() * 1000 -
                            new Date().getTimezoneOffset() * 60000
                        ).toLocaleTimeString()}`}
                      </p>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>

          <div className={styles.listingContainer}>
            {nft?.metadata.id && (
              <div className={styles.contractMetadataContainer}>
                <button
                  className={styles.collectionName}
                  onClick={() => router.push(`/collection/${contractAddress}`)}
                >
                  {nftContractMetadata?.name}
                </button>
              </div>
            )}
            <h1 className={styles.title}>{nft?.metadata.name}</h1>
            <p className={styles.collectionName}>
              Token ID #{nft?.metadata.id}
            </p>
            {contractType === "erc721" && (
              <Link
                href={`/profile/${listings[0].sellerAddress}`}
                className={styles.nftOwnerContainer}
              >
                {/* Random linear gradient circle shape */}
                <div
                  className={styles.nftOwnerImage}
                  style={{
                    background: `linear-gradient(90deg, ${randomColor1}, ${randomColor2})`,
                  }}
                />
                <div className={styles.nftOwnerInfo}>
                  <p className={styles.label}>Current Owner</p>
                  {nft?.metadata.owner ? (
                    <p className={styles.nftOwnerAddress}>
                      {nft?.metadata.owner.slice(0, 8)}...
                      {nft?.metadata.owner.slice(-4)}
                    </p>
                  ) : (
                    <p className={styles.nftOwnerAddress}>0x000000...0000</p>
                  )}
                </div>
              </Link>
            )}

            <div className={styles.pricingContainer}>
              {/* Pricing information */}
              <div className={styles.pricingInfo}>
                <p className={styles.label}>Mooney Balance</p>
                <div className={styles.pricingValue}>{user.mooneyBalance}</div>
              </div>
              {nftContract && nftContract.erc721 && (
                <div className={styles.pricingInfo}>
                  <p className={styles.label}>Price</p>
                  <div className={styles.pricingValue}>
                    {!listings ? (
                      <Skeleton width="120" height="24" />
                    ) : (
                      <>
                        {listings && listings[0] && (
                          <>
                            {
                              listings[listings.length - 1]
                                ?.buyoutCurrencyValuePerToken.displayValue
                            }
                            {" " +
                              listings[listings.length - 1]
                                ?.buyoutCurrencyValuePerToken.symbol}
                          </>
                        )}
                      </>
                    )}
                  </div>
                </div>
              )}
              <div className={styles.pricingInfo}>
                <p className={styles.label}>Highest bid</p>
                <div className={styles.pricingValue}>{maxBid}</div>
              </div>
              {contractType === "erc721" && (
                <div className={styles.pricingInfo}>
                  <p className={styles.label}>Listing expiration</p>
                  <div className={styles.pricingValue}>
                    {listings[0].type === 1
                      ? `${new Date(
                          listings[0]?.endTimeInEpochSeconds.toString() * 1000 -
                            new Date().getTimezoneOffset() * 60000
                        ).toLocaleDateString()} @ ${new Date(
                          listings[0].endTimeInEpochSeconds.toString() * 1000
                        ).toLocaleTimeString()}`
                      : `${new Date(
                          listings[0]?.secondsUntilEnd.toString() * 1000 -
                            new Date().getTimezoneOffset() * 60000
                        ).toLocaleDateString()} @ ${new Date(
                          listings[0].secondsUntilEnd.toString() * 1000
                        ).toLocaleTimeString()}`}
                  </div>
                </div>
              )}
            </div>
            {nftContract && contractType === "erc721" ? (
              <>
                {!listings ? (
                  <Skeleton width="100%" height="164" />
                ) : (
                  <>
                    {listings[0].sellerAddress === user.address ? (
                      <div>
                        <Web3Button
                          contractAddress={MARKETPLACE_ADDRESS}
                          action={async () =>
                            await handleRemoveListing(listings[0].id)
                          }
                          onSuccess={() => {
                            router.push(`/profile/${user.address}`);
                            toast(`Your listing has been removed!`, {
                              icon: "✅",
                              style: toastStyle,
                              position: "bottom-center",
                            });
                          }}
                          onError={(err) =>
                            toast(`Error : ${err.message}`, {
                              icon: "❌",
                              style: toastStyle,
                              position: "bottom-center",
                            })
                          }
                        >
                          Remove Listing
                        </Web3Button>
                      </div>
                    ) : user.mooneyBalance > 0 ? (
                      <>
                        {listings[0].type === 0 ? (
                          <Web3Button
                            contractAddress={MARKETPLACE_ADDRESS}
                            action={async () => await buyListing()}
                            onSuccess={() => {
                              router.push(`/profile/${user.address}`);
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
                            Buy
                          </Web3Button>
                        ) : (
                          <>
                            <Web3Button
                              contractAddress={MARKETPLACE_ADDRESS}
                              action={async () => await buyListing()}
                              onSuccess={() => {
                                router.push(`/profile/${user.address}`);
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
                            <div
                              className={`${styles.listingTimeContainer} ${styles.or}`}
                            >
                              <p className={styles.listingTime}>or</p>
                            </div>
                            <input
                              className={styles.input}
                              defaultValue={
                                listings[0]?.reservePriceCurrencyValuePerToken
                                  ?.displayValue || 0
                              }
                              min={
                                listings[0]?.reservePriceCurrencyValuePerToken
                                  ?.displayValue || 0
                              }
                              type="number"
                              step={1}
                              onChange={(e) => {
                                setBidValue(e.target.value);
                              }}
                            />
                            <Web3Button
                              contractAddress={MARKETPLACE_ADDRESS}
                              action={async () => await createBidOrOffer()}
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
                    ) : (
                      <>
                        <div className={styles.pricingInfo}>
                          <p className={styles.label}>
                            This wallet has no mooney
                          </p>
                          <div className={styles.pricingValue}></div>
                        </div>
                      </>
                    )}
                  </>
                )}
              </>
            ) : (
              <div className={styles.pricingContainer}>
                <div className={styles.pricingInfo}>
                  {!listings ? (
                    <Skeleton width="100%" height="164" />
                  ) : (
                    <>
                      {listings[0].sellerAddress === user.address && (
                        <div>
                          <Web3Button
                            contractAddress={MARKETPLACE_ADDRESS}
                            action={async () =>
                              await handleRemoveListing(listings[0].id)
                            }
                            onSuccess={() =>
                              router.push(`/profile/${user.address}`)
                            }
                          >
                            Remove Listing
                          </Web3Button>
                        </div>
                      )}
                      <div className="w-full flex flex-col gap-2 overflow-y-scroll max-h-[40vh] my-8 px-2 pb-2">
                        <h1>Listings</h1>
                        {listings.map((l: any, i: number) => (
                          <div
                            key={`listing-${i}`}
                            className={`w-full rounded-sm p-2 bg-[#d1d1d150] ${
                              currListing.key === i && "bg-[#d1d1d180]"
                            }`}
                            onClick={() => setCurrListing({ ...l, key: i })}
                          >
                            <div className={"flex justify-left gap-4"}>
                              <div>
                                <p className={styles.label}>Id</p>
                                <div className={styles.pricingValue}>
                                  {l.id}
                                </div>
                              </div>
                              <div>
                                <p className={styles.label}>Type</p>
                                <div className={styles.pricingValue}>
                                  {l.type === 0 ? "Direct" : "Auction"}
                                </div>
                              </div>
                              <div>
                                <p className={styles.label}>Seller</p>
                                <div className={styles.pricingValue}>
                                  {`${l.sellerAddress.slice(
                                    0,
                                    8
                                  )}...${l.sellerAddress.slice(-4)}`}
                                </div>
                              </div>
                              {l.type === 0 ? (
                                <div>
                                  <p className={styles.label}>Price</p>
                                  <div className={styles.pricingValue}>
                                    {`${Math.floor(
                                      +l.buyoutCurrencyValuePerToken
                                        .displayValue
                                    )} ${l.buyoutCurrencyValuePerToken.symbol}`}
                                  </div>
                                </div>
                              ) : (
                                <div>
                                  <p className={styles.label}>Buyout Price</p>
                                  <div className={styles.pricingValue}>
                                    {`${Math.floor(
                                      +l.buyoutCurrencyValuePerToken
                                        .displayValue
                                    )} ${l.buyoutCurrencyValuePerToken.symbol}`}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
                <div>
                  {currListing.sellerAddress !== user.address &&
                  currListing.asset ? (
                    <>
                      {user.mooneyBalance < 0 ? (
                        <div></div>
                      ) : currListing.type === 0 ? (
                        <Web3Button
                          contractAddress={MARKETPLACE_ADDRESS}
                          action={async () => await buyListing()}
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
                          {`Buy (id: ${currListing.id})`}
                        </Web3Button>
                      ) : (
                        <>
                          <Web3Button
                            contractAddress={MARKETPLACE_ADDRESS}
                            action={async () => await buyListing()}
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
                            {`Buy at asking price (id: ${currListing.id})`}
                          </Web3Button>
                          <div
                            className={`${styles.listingTimeContainer} ${styles.or}`}
                          >
                            <p className={styles.listingTime}>or</p>
                          </div>
                          <input
                            className={styles.input}
                            defaultValue={
                              listings[0]?.reservePriceCurrencyValuePerToken
                                ?.displayValue || 0
                            }
                            min={
                              listings[0]?.reservePriceCurrencyValuePerToken
                                ?.displayValue || 0
                            }
                            type="number"
                            step={1}
                            onChange={(e) => {
                              setBidValue(e.target.value);
                            }}
                          />
                          <Web3Button
                            contractAddress={MARKETPLACE_ADDRESS}
                            action={async () => await createBidOrOffer()}
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
                            {`Place bid (id: ${currListing.id})`}
                          </Web3Button>
                        </>
                      )}
                    </>
                  ) : (
                    <></>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </Container>
    </>
  );
}
