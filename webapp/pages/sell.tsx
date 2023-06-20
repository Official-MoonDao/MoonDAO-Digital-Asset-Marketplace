import { ThirdwebNftMedia, useAddress, useContract } from "@thirdweb-dev/react";
import React, { useEffect, useState } from "react";
import Container from "../components/Container/Container";
import tokenPageStyles from "../styles/Token.module.css";
import SaleInfo from "../components/SaleInfo/SaleInfo";
import { useRouter } from "next/router";
import { getAllValidAuctions, getAllValidListings, useUserAssets } from "../lib/marketplace-v3";
import { MARKETPLACE_ADDRESS, NETWORK } from "../const/config";
import SubmitCollection from "../components/SubmitCollection";
import VerticalStar from "../assets/VerticalStar";
export default function Sell() {
  const router = useRouter();
  const address: any = useAddress();
  const [selectedNft, setSelectedNft]: any = useState({ metadata: {} });

  const { contract: marketplace, isLoading: loadingContract }: any = useContract(MARKETPLACE_ADDRESS, "marketplace-v3");

  const [validListings, setValidListings] = useState<any>();
  const [validAuctions, setValidAuctions] = useState<any>();

  const userAssets = useUserAssets(marketplace, validListings, validAuctions, address);

  useEffect(() => {
    if (marketplace && !validListings && !validAuctions) {
      getAllValidListings(marketplace).then((listings: any) => {
        setValidListings(listings);
      });
      getAllValidAuctions(marketplace).then((auctions: any) => {
        setValidAuctions(auctions);
      });
    }
  }, [marketplace]);

  if (!address || !userAssets[0]) {
    return (
      <div className="pt-10 md:pt-12 lg:pt-16 xl:pt-20 m flex flex-col items-center w-full md:pl-36 xl:pl-44 2xl:pl-52 pb-60 xl:pb-72 2xl:pb-96">
        <div className="flex flex-col items-center md:items-start w-full px-5">
          <h2 className="font-GoodTimes tracking-wide flex items-center text-3xl lg:text-4xl bg-clip-text text-transparent bg-gradient-to-br from-moon-gold to-indigo-100">
            Sell NFTs
            <span className="ml-2 lg:ml-4">
              <VerticalStar />
            </span>
          </h2>
          <p className="text-center mt-10 lg:mt-12 opacity-80 text-lg md:text-left text-red-400">
            {!address ? `Please connect your wallet to sell NFTs` : !userAssets[0] && `You do not own any NFTs on the ${NETWORK.name} network.`}
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {!selectedNft?.metadata?.id ? (
        <>
          <h1>Sell NFTs</h1>
          <p>Select which NFT you&rsquo;d like to sell below.</p>
          <div className="flex flex-wrap gap-[5%] mt-[5%]">
            {userAssets[0]?.metadata?.id &&
              userAssets.map(
                (nft: any, i: number) =>
                  nft?.metadata && (
                    <div className="hover:translate-y-[-4%] duration-300 ease-in my-[2.5%] " key={`userNFT-${i}`} onClick={() => setSelectedNft(nft)}>
                      <ThirdwebNftMedia className="rounded-md hover:drop-shadow-[0_10px_20px_#d1d1d1] ease-in duration-300" metadata={nft?.metadata} />
                      <p>{nft.collectionName}</p>
                      <p>{nft.metadata?.name}</p>
                      <p>{nft?.type}</p>
                      {nft.type === "ERC1155" && <p>{"x" + nft.quantityOwned}</p>}
                    </div>
                  )
              )}
          </div>

          {!selectedNft?.metadata?.id && (
            <div className="mt-32">
              <SubmitCollection />
            </div>
          )}
        </>
      ) : (
        <Container maxWidth="lg" className="">
          <div className={tokenPageStyles.container} style={{ marginTop: 0 }}>
            <div className={tokenPageStyles.metadataContainer}>
              <div className={tokenPageStyles.imageContainer}>
                <ThirdwebNftMedia metadata={selectedNft.metadata} className={tokenPageStyles.image} />
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
              <h1 className={tokenPageStyles.title}>{selectedNft.metadata.name}</h1>
              <p className={tokenPageStyles.collectionName}>Token ID #{selectedNft.metadata.token_id}</p>

              <div className={tokenPageStyles.pricingContainer}>
                <SaleInfo nft={selectedNft} contractAddress={selectedNft.collection} router={router} walletAddress={address} />
              </div>
            </div>
          </div>
        </Container>
      )}
    </>
  );
}
