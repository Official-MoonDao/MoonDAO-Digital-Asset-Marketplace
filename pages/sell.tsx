import {
  ThirdwebNftMedia,
  useAddress,
  useContract,
  useOwnedNFTs,
} from "@thirdweb-dev/react";
import React, { useState } from "react";
import Container from "../components/Container/Container";
import NFTGrid from "../components/NFT/NFTGrid";
import { NFT_COLLECTION_ADDRESS } from "../const/contractAddresses";
import tokenPageStyles from "../styles/Token.module.css";
import { NFT as NFTType } from "@thirdweb-dev/sdk";
import SaleInfo from "../components/SaleInfo/SaleInfo";
import { collections } from "../collection.config.json";

export default function Sell() {
  // Load all of the NFTs from the NFT Collection
  const address = useAddress();
  const [selectedNft, setSelectedNft] = useState<NFTType>();
  const [selectedContract, setSelectedContract] = useState(
    collections[0].address
  );

  function getOwnedNFTS(contractAddress: string) {
    const { contract } = useContract(contractAddress);
    const { data, isLoading } = useOwnedNFTs(contract, address);
    return { data, isLoading };
  }

  function OwnedNFTs({ collection }: any) {
    const { data, isLoading } = getOwnedNFTS(collection.address);
    return (
      <NFTGrid
        data={data}
        isLoading={isLoading}
        contractAddress={""}
        overrideOnclickBehavior={(nft) => {
          setSelectedNft(nft);
          setSelectedContract(collection.address);
        }}
        emptyText={
          "Looks like you don't own any NFTs in this collection. Head to the buy page to buy some!"
        }
      />
    );
  }

  return (
    <Container maxWidth="lg">
      <h1>Sell NFTs</h1>
      {!selectedNft ? (
        <>
          <p>Select which NFT you&rsquo;d like to sell below.</p>
          {collections.map((c, i) => (
            <div key={`collection-${i}`}>
              <OwnedNFTs collection={c} />
            </div>
          ))}
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
              Token ID #{selectedNft.metadata.id}
            </p>

            <div className={tokenPageStyles.pricingContainer}>
              <SaleInfo nft={selectedNft} contractAddress={selectedContract} />
            </div>
          </div>
        </div>
      )}
    </Container>
  );
}
