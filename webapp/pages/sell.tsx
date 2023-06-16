import { ThirdwebNftMedia, useAddress, useContract } from "@thirdweb-dev/react";
import React, { useEffect, useState } from "react";
import Container from "../components/Container/Container";
import tokenPageStyles from "../styles/Token.module.css";
import SaleInfo from "../components/SaleInfo/SaleInfo";
import { useRouter } from "next/router";
import {
  getAllValidAuctions,
  getAllValidListings,
  useUserAssets,
} from "../lib/marketplace-v3";
import { MARKETPLACE_ADDRESS, NETWORK } from "../const/config";

export default function Sell() {
  const router = useRouter();
  const address: any = useAddress();
  const [selectedNft, setSelectedNft]: any = useState({ metadata: {} });

  const { contract: marketplace, isLoading: loadingContract }: any =
    useContract(MARKETPLACE_ADDRESS, "marketplace-v3");

  const [validListings, setValidListings] = useState([]);
  const [validAuctions, setValidAuctions] = useState([]);

  const userAssets = useUserAssets(
    marketplace,
    validListings,
    validAuctions,
    address
  );

  useEffect(() => {
    if (marketplace) {
      getAllValidListings(marketplace).then((listings: any) => {
        setValidListings(listings);
      });
      getAllValidAuctions(marketplace).then((auctions: any) => {
        setValidAuctions(auctions);
      });
    }
  }, [marketplace]);

  if (!address) {
    return (
      <Container maxWidth="lg" className="">
        <h1>Sell NFTs</h1>
        <p>{`Please connect your wallet`}</p>
      </Container>
    );
  }

  if (!userAssets) {
    return (
      <Container maxWidth="lg" className="">
        <h1>Sell NFTs</h1>
        <p>{`You do not own any NFTs on ${NETWORK.name}`}</p>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" className="">
      <h1>Sell NFTs</h1>
      {!selectedNft?.metadata?.id ? (
        <>
          <p>Select which NFT you&rsquo;d like to sell below.</p>
          <div className="flex flex-wrap gap-[5%] mt-[5%]">
            {userAssets[0]?.metadata?.id &&
              userAssets.map((nft: any, i: number) => (
                <div
                  className="hover:translate-y-[-4%] duration-300 ease-in my-[2.5%] "
                  key={`userNFT-${i}`}
                  onClick={() => setSelectedNft(nft)}
                >
                  <ThirdwebNftMedia
                    className="rounded-md hover:drop-shadow-[0_10px_20px_#d1d1d1] ease-in duration-300"
                    metadata={nft?.metadata}
                  />
                  <p>{nft.collectionName}</p>
                  <p>{nft.metadata.name}</p>
                  <p>{nft.type}</p>
                  {nft.type === "ERC1155" && <p>{"x" + nft.quantityOwned}</p>}
                </div>
              ))}
          </div>
        </>
      ) : (
        <div className={tokenPageStyles.container} style={{ marginTop: 0 }}>
          <div className={tokenPageStyles.metadataContainer}>
            <div className={tokenPageStyles.imageContainer}>
              <ThirdwebNftMedia
                metadata={selectedNft.metadata}
                className={tokenPageStyles.image}
              />
              <button
                onClick={() => {
                  setSelectedNft(undefined);
                }}
                className={tokenPageStyles.crossButton}
              >
                X
              </button>
            </div>
          </div>

          <div className={tokenPageStyles.listingContainer}>
            <p>You&rsquo;re about to list the following item for sale.</p>
            <h1 className={tokenPageStyles.title}>
              {selectedNft.metadata.name}
            </h1>
            <p className={tokenPageStyles.collectionName}>
              Token ID #{selectedNft.metadata.token_id}
            </p>

            <div className={tokenPageStyles.pricingContainer}>
              <SaleInfo
                nft={selectedNft}
                contractAddress={selectedNft.collection}
                router={router}
                walletAddress={address}
              />
            </div>
          </div>
        </div>
      )}
    </Container>
  );
}
