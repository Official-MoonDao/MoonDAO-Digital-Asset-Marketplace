import styles from "../../styles/Token.module.css";
import Link from "next/link";
import {
  MediaRenderer,
  ThirdwebNftMedia,
  useContract,
  useUnclaimedNFTSupply,
  useValidDirectListings,
  useValidEnglishAuctions,
  Web3Button,
} from "@thirdweb-dev/react";
import Container from "../Container/Container";
import { toast, Toaster } from "react-hot-toast";
import randomColor from "../../util/randomColor";
import Skeleton from "../Skeleton/Skeleton";
import { useState } from "react";
import { MARKETPLACE_ADDRESS } from "../../const/contractAddresses";
import toastStyle from "../../util/toastConfig";
const [randomColor1, randomColor2] = [randomColor(), randomColor()];
export default function ERC721({
  nft,
  contract,
  contractMetadata,
  route,
  user,
}: any) {
  const { contractAddress } = contractMetadata;
  const [bidValue, setBidValue] = useState<string>();

  // Connect to marketplace smart contract
  const { contract: marketplace, isLoading: loadingContract } = useContract(
    MARKETPLACE_ADDRESS,
    "marketplace-v3"
  );

  const { data: directListing, isLoading: loadingDirect } =
    useValidDirectListings(marketplace, {
      tokenContract: contractAddress,
      tokenId: nft.metadata.id,
    });

  // 2. Load if the NFT is for auction
  const { data: auctionListing, isLoading: loadingAuction } =
    useValidEnglishAuctions(marketplace, {
      tokenContract: contractAddress,
      tokenId: nft.metadata.id,
    });

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

    if (auctionListing?.[0]) {
      txResult = await marketplace?.englishAuctions.makeBid(
        auctionListing[0].id,
        bidValue
      );
    } else if (directListing?.[0]) {
      txResult = await marketplace?.offers.makeOffer({
        assetContractAddress: contractAddress,
        tokenId: nft.metadata.id,
        totalPrice: bidValue,
        currencyContractAddress: "0x86A827E4E98081D156D58F4aAb4F2bBa64eAA599",
      });
    } else {
      throw new Error("No valid listing found for this NFT");
    }

    return txResult;
  }

  async function buyListing() {
    let txResult;

    if (auctionListing?.[0]) {
      txResult = await marketplace?.englishAuctions.buyoutAuction(
        auctionListing[0].id
      );
    } else if (directListing?.[0]) {
      txResult = await marketplace?.directListings.buyFromListing(
        directListing[0].id,
        1
      );
    } else {
      throw new Error("No valid listing found for this NFT");
    }
    return txResult;
  }

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
            {contractMetadata && (
              <div className={styles.contractMetadataContainer}>
                <MediaRenderer
                  src={contractMetadata.image}
                  className={styles.collectionImage}
                />
                <button className={styles.collectionName} onClick={route}>
                  {contractMetadata.name}
                </button>
              </div>
            )}
            <h1 className={styles.title}>{nft.metadata.name}</h1>
            <p className={styles.collectionName}>Token ID #{nft.metadata.id}</p>
            {contractMetadata.type === "ERC721" && (
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
                  <p className={styles.nftOwnerAddress}>
                    {nft.owner.slice(0, 8)}...{nft.owner.slice(-4)}
                  </p>
                </div>
              </Link>
            )}

            <div className={styles.pricingContainer}>
              {/* Pricing information */}
              <div className={styles.pricingInfo}>
                <p className={styles.label}>Mooney Balance</p>
                <div className={styles.pricingValue}>{user.mooneyBalance}</div>
              </div>
              <div className={styles.pricingInfo}>
                <p className={styles.label}>Price</p>
                <div className={styles.pricingValue}>
                  {loadingContract || loadingDirect || loadingAuction ? (
                    <Skeleton width="120" height="24" />
                  ) : (
                    <>
                      {directListing && directListing[0] ? (
                        <>
                          {directListing[0]?.currencyValuePerToken.displayValue}
                          {" " + directListing[0]?.currencyValuePerToken.symbol}
                        </>
                      ) : auctionListing && auctionListing[0] ? (
                        <>
                          {auctionListing[0]?.buyoutCurrencyValue.displayValue}
                          {" " + auctionListing[0]?.buyoutCurrencyValue.symbol}
                        </>
                      ) : (
                        "Not for sale"
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>

            {(contractMetadata.type === "ERC721" && loadingContract) ||
            loadingDirect ||
            loadingAuction ? (
              <Skeleton width="100%" height="164" />
            ) : (
              <>
                {user.mooneyBalance > 0 ? (
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
                    </Web3Button>
                  </>
                ) : (
                  <>
                    <div className={styles.pricingInfo}>
                      <p className={styles.label}>This wallet has no mooney</p>
                      <div className={styles.pricingValue}></div>
                    </div>
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
