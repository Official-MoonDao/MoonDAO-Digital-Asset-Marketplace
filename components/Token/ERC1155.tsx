import styles from "../../styles/Token.module.css";
import Link from "next/link";
import {
  MediaRenderer,
  ThirdwebNftMedia,
  useClaimedNFTs,
  useContract,
  useTotalCirculatingSupply,
  useTotalCount,
  useUnclaimedNFTs,
  useUnclaimedNFTSupply,
} from "@thirdweb-dev/react";
import Container from "../Container/Container";
import { Toaster } from "react-hot-toast";
import randomColor from "../../util/randomColor";
import Skeleton from "../Skeleton/Skeleton";
import { useEffect, useState } from "react";
import ClaimNFT from "../NFT/ClaimNFT";
const [randomColor1, randomColor2] = [randomColor(), randomColor()];
export default function ERC1155({ nft, contractMetadata, route }: any) {
  const { contractAddress } = contractMetadata;
  const { contract }: any = useContract(contractMetadata.contractAddress);
  const [dropSupply, setDropSupply] = useState<number>(0);

  useEffect(() => {
    if (contract)
      (async () => {
        const data = await contract.call("totalSupply", `${nft.metadata.id}`);
        setDropSupply(data.toNumber());
      })();
  }, [contract, nft]);

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
              {/* 
                <h3 className={styles.descriptionTitle}>History</h3>
           
                <div className={styles.traitsContainer}>
                  {transferEvents?.map((event: any, index: any) => (
                    <div
                      key={event.transaction.transactionHash}
                      className={styles.eventsContainer}
                    >
                      <div className={styles.eventContainer}>
                        <p className={styles.traitName}>Event</p>
                        <p className={styles.traitValue}>
                          {
                            // if last event in array, then it's a mint
                            index === transferEvents.length - 1
                              ? "Mint"
                              : "Transfer"
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
                        <Link
                          className={styles.txHashArrow}
                          href={`${ETHERSCAN_URL}/tx/${event.transaction.transactionHash}`}
                          target="_blank"
                        >
                          ↗
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>*/}
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
            <ClaimNFT nft={nft} contractAddress={contractAddress} />
            <div className={styles.pricingContainer}>
              {/* Pricing information */}
              <div className={styles.pricingInfo}>
                <p className={styles.label}>Supply</p>
                <div className={styles.pricingValue}>
                  {!dropSupply ? (
                    <Skeleton width="120" height="24" />
                  ) : (
                    <>{dropSupply}</>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div></div>
      </Container>
    </>
  );
}
