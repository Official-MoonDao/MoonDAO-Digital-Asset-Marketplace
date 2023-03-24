import {
  ThirdwebNftMedia,
  useActiveListings,
  useAddress,
  useContract,
  useOwnedNFTs,
} from "@thirdweb-dev/react";
import React, { useEffect, useState } from "react";
import Container from "../components/Container/Container";
import NFTGrid from "../components/NFT/NFTGrid";
import tokenPageStyles from "../styles/Token.module.css";
import { NFT as NFTType } from "@thirdweb-dev/sdk";
import SaleInfo from "../components/SaleInfo/SaleInfo";
import { collections } from "../collection.config.json";
import { getAllUserNFTs } from "../lib/opensea";
import { GetStaticProps } from "next";
import { useRouter } from "next/router";

export default function Sell() {
  // Load all of the NFTs from the NFT Collection
  const address = useAddress();
  const [userNFTs, setUserNFTs]: any = useState([{ metadata: {} }]);
  const [selectedNft, setSelectedNft]: any = useState({ metadata: {} });
  const router = useRouter();

  useEffect(() => {
    if (address)
      (async () => {
        const allUserNFTs = await getAllUserNFTs(address);
        setUserNFTs(allUserNFTs);
      })();
  }, [address]);

  return (
    <Container maxWidth="lg">
      <h1>Sell NFTs</h1>
      {!selectedNft?.metadata?.id ? (
        <>
          <p>Select which NFT you&rsquo;d like to sell below.</p>
          <div className="flex flex-wrap gap-[5%] mt-[5%]">
            {userNFTs[0]?.metadata?.id &&
              userNFTs.map((nft: any, i: number) => (
                <div
                  className="hover:translate-y-[-4%] duration-300 ease-in my-[2.5%] "
                  key={`userNFT-${i}`}
                  onClick={() => setSelectedNft(nft)}
                >
                  <ThirdwebNftMedia
                    className="rounded-md hover:drop-shadow-[0_10px_20px_#d1d1d1] ease-in duration-300"
                    metadata={nft?.metadata}
                  />
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
                contractAddress={selectedNft.metadata.asset_contract.address}
                router={router}
              />
            </div>
          </div>
        </div>
      )}
    </Container>
  );
}
