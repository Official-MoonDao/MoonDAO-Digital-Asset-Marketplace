import styles from "../../styles/Token.module.css";
import Link from "next/link";
import {
  MediaRenderer,
  ThirdwebNftMedia,
  useActiveListings,
  useContract,
} from "@thirdweb-dev/react";
import Container from "../Container/Container";
import { toast, Toaster } from "react-hot-toast";
import randomColor from "../../util/randomColor";
import Skeleton from "../Skeleton/Skeleton";
import { useEffect, useState } from "react";
import { MARKETPLACE_ADDRESS } from "../../const/contractAddresses";
import toastStyle from "../../util/toastConfig";
const [randomColor1, randomColor2] = [randomColor(), randomColor()];
export default function NFTDetail({ nft, route, user }: any) {
  const contractAddress = nft.metadata.asset_contract.address;
  const [bidValue, setBidValue] = useState<string>();
  // Connect to marketplace smart contract
  const { contract: marketplace, isLoading: loadingContract } = useContract(
    MARKETPLACE_ADDRESS,
    "marketplace"
  );

  const { data: listing, isLoading: loadingListing } = useActiveListings(
    marketplace,
    {
      tokenContract: contractAddress,
      tokenId: nft.metadata.token_id,
    }
  );

  useEffect(() => {
    console.log(listing);
  }, [listing]);

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

    // if (listing) {
    //   txResult = await marketplace?.englishAuctions.makeBid(
    //     auctionListing[0].id,
    //     bidValue
    //   );
    // } else if (directListing?.[0]) {
    //   txResult = await marketplace?.offers.makeOffer({
    //     assetContractAddress: contractAddress,
    //     tokenId: nft.metadata.id,
    //     totalPrice: bidValue,
    //     currencyContractAddress: "0x86A827E4E98081D156D58F4aAb4F2bBa64eAA599",
    //   });
    // } else {
    //   throw new Error("No valid listing found for this NFT");
    // }

    return txResult;
  }

  // async function buyListing() {
  //   let txResult;

  //   if (auctionListing?.[0]) {
  //     txResult = await marketplace?.englishAuctions.buyoutAuction(
  //       auctionListing[0].id
  //     );
  //   } else if (directListing?.[0]) {
  //     txResult = await marketplace?.directListings.buyFromListing(
  //       directListing[0].id,
  //       1
  //     );
  //   } else {
  //     throw new Error("No valid listing found for this NFT");
  //   }
  //   return txResult;
  // }

  return (
    <>
      <Toaster position="bottom-center" reverseOrder={false} />
      <Container maxWidth="lg">
        <div className={styles.container}>
          <div className={styles.metadataContainer}>
            <ThirdwebNftMedia
              metadata={nft.metadata}
              className={styles.image}
            />

            <div className={styles.descriptionContainer}>
              <h3 className={styles.descriptionTitle}>Description</h3>
              <p className={styles.description}>{nft.metadata.description}</p>

              <h3 className={styles.descriptionTitle}>Traits</h3>

              <div className={styles.traitsContainer}>
                {Object.entries(nft?.metadata?.attributes || {}).map(
                  ([key, value]: any) => (
                    <div className={styles.traitContainer} key={key}>
                      <p className={styles.traitName}>{value.trait_type} :</p>
                      <p className={styles.traitValue}>
                        {value.value?.toString() || ""}
                      </p>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>

          <div className={styles.listingContainer}>
            {nft.metadata?.id && (
              <div className={styles.contractMetadataContainer}>
                <MediaRenderer
                  src={nft.metadata.collection.image_url}
                  className={styles.collectionImage}
                />
                <button className={styles.collectionName} onClick={route}>
                  {nft.metadata.collection.name}
                </button>
              </div>
            )}
            <h1 className={styles.title}>{nft.metadata.name}</h1>
            <p className={styles.collectionName}>Token ID #{nft.metadata.id}</p>
            {nft.metadata.asset_contract.schema_name === "ERC721" && (
              <Link
                href={`/profile/${nft.owner}`}
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
                  {nft.metadata.owner ? (
                    <p className={styles.nftOwnerAddress}>
                      {nft.metadata.owner.slice(0, 8)}...
                      {nft.metadata.owner.slice(-4)}
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
              {nft?.metadata?.asset_contract?.schema_name === "ERC721" && (
                <div className={styles.pricingInfo}>
                  <p className={styles.label}>Price</p>
                  <div className={styles.pricingValue}>
                    {loadingContract || loadingListing ? (
                      <Skeleton width="120" height="24" />
                    ) : (
                      <>
                        {listing && listing[0] && (
                          <>
                            {
                              listing[0]?.buyoutCurrencyValuePerToken
                                .displayValue
                            }
                            {" " +
                              listing[0]?.buyoutCurrencyValuePerToken.symbol}
                          </>
                        )}
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
            {nft.metadata.asset_contract.schema_name === "ERC721" ? (
              <>
                {loadingContract || loadingListing ? (
                  <Skeleton width="100%" height="164" />
                ) : (
                  <>
                    {user.mooneyBalance > 0 ? (
                      <>
                        {/* <Web3Button
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
                            auctionListing?.[0]?.minimumBidCurrencyValue
                              ?.displayValue || 0
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
                        </Web3Button> */}
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
                  <div className="w-full overflow-y-scroll max-h-[40vh]">
                    <div>test</div>
                    <div>test</div>
                    <div>test</div>
                    <div>test</div>
                    <div>test</div>
                    <div>test</div>
                    <div>test</div>
                    <div>test</div>
                    <div>test</div>
                    <div>test</div>
                    <div>test</div>
                    <div>test</div>
                    <div>test</div>
                    <div>test</div>
                    <div>test</div>
                    <div>test</div>
                    <div>test</div>
                    <div>test</div>
                    <div>test</div>
                    <div>test</div>
                    <div>test</div>
                    <div>test</div>
                    <div>test</div>
                    <div>test</div>
                    <div>test</div>
                    <div>test</div>
                    <div>test</div>
                    <div>test</div>
                    <div>test</div>
                    <div>test</div>
                    <div>test</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </Container>
    </>
  );
}
