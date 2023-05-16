import { ThirdwebNftMedia, useAddress, useContract } from "@thirdweb-dev/react";
import React, { useEffect, useState } from "react";
import Container from "../components/Container/Container";
import tokenPageStyles from "../styles/Token.module.css";
import SaleInfo from "../components/SaleInfo/SaleInfo";
import { getAllUserNFTs } from "../lib/opensea";
import { useRouter } from "next/router";
import { initSDK } from "../lib/thirdweb";
import {
  getAllValidAuctions,
  getAllValidListings,
  useUserCanList,
} from "../lib/marketplace-v3";
import { MARKETPLACE_ADDRESS, NETWORK } from "../const/config";

export default function Sell({ validListings, validAuctions }: any) {
  const router = useRouter();

  const address = useAddress();
  const [userNFTs, setUserNFTs]: any = useState([{ metadata: {} }]);
  const [selectedNft, setSelectedNft]: any = useState({ metadata: {} });

  const { contract: marketplace, isLoading: loadingContract }: any =
    useContract(MARKETPLACE_ADDRESS, "marketplace-v3");

  const userCanList = useUserCanList(marketplace, address || "");

  useEffect(() => {
    if (address && userCanList)
      (async () => {
        //get all nfts owned by user on current network
        const allUserNFTs = await getAllUserNFTs(address);
        setUserNFTs(allUserNFTs);
        console.log(userNFTs);
      })();
  }, [address, userCanList]);

  if (!address) {
    return (
      <Container maxWidth="lg" className="">
        <h1>Sell NFTs</h1>
        <p>{`Please connect your wallet`}</p>
      </Container>
    );
  }

  if (!userCanList) {
    return (
      <Container maxWidth="lg" className="">
        <h1>Sell NFTs</h1>
        <p>{`This wallet does not have permission to list NFTs on the marketplace`}</p>
      </Container>
    );
  }

  if (!userNFTs) {
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
                walletAddress={address}
                validListings={validListings}
                validAuctions={validAuctions}
              />
            </div>
          </div>
        </div>
      )}
    </Container>
  );
}

export async function getServerSideProps() {
  const sdk = initSDK();
  const marketplace = await sdk.getContract(MARKETPLACE_ADDRESS);
  const validListings = (await getAllValidListings(marketplace)) || [];
  const validAuctions = (await getAllValidAuctions(marketplace)) || [];
  return {
    props: { validListings, validAuctions },
  };
}
