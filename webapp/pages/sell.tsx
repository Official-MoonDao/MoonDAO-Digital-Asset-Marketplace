import { ThirdwebNftMedia, useAddress, useContract } from "@thirdweb-dev/react";
import React, { useEffect, useState } from "react";
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
        <main className="pt-10 md:pt-12 lg:pt-16 xl:pt-20 m flex flex-col items-center w-full">
          <div className="flex flex-col items-center md:items-start px-5">
            <h2 className="font-GoodTimes tracking-wide flex items-center text-3xl lg:text-4xl bg-clip-text text-transparent bg-gradient-to-br from-moon-gold to-indigo-100">
              Sell NFTs
              <span className="ml-2 lg:ml-4">
                <VerticalStar />
              </span>
            </h2>
            <p className="text-center mt-10 lg:mt-12 text-lg md:text-left text-white opacity-80">Select which NFT you want to sell below</p>

            {/*Asset grid */}
            <section className="mt-10 md:mt-16 flex flex-col gap-10 md:grid md:grid-cols-2 md:grid-flow-row md:gap-12 xl:grid-cols-3 xl:gap-14">
              {userAssets[0]?.metadata?.id &&
                userAssets.map(
                  (nft: any, i: number) =>
                    nft?.metadata && (
                      <div
                        className="relative hover:translate-y-[-4%] duration-300 ease-in my-[2.5%] flex flex-col items-center"
                        key={`userNFT-${i}`}
                        onClick={() => setSelectedNft(nft)}
                      >
                        <ThirdwebNftMedia className="rounded-md hover:drop-shadow-[0_10px_20px_#d1d1d1] ease-in duration-300" metadata={nft?.metadata} />
                        {nft.type === "ERC1155" && (
                          <p className="absolute top-3 left-3 text-lg tracking-widest px-2 py-1 bg-moon-gold bg-opacity-80 rounded-xl">
                            {"x" + nft.quantityOwned}
                          </p>
                        )}
                        <div className="bg-gradient-to-br shadow transition-all duration-300 shadow-white from-black via-gray-900 to-black -mt-2 z-50 relative rounded-xl py-3 pl-4 pr-3 w-[290px]">
                          <p className="text-sm opacity-70">{nft.collectionName}</p>
                          <p className="mt-4 font-GoodTimes tracking-wide truncate">{nft.metadata?.name}</p>
                          <p className="text-xs uppercase tracking-widest mt-4 text-moon-gold opacity-70">{nft?.type}</p>
                        </div>
                      </div>
                    )
                )}
            </section>

            {!selectedNft?.metadata?.id && (
              <div className="mt-32">
                <SubmitCollection />
              </div>
            )}
          </div>
        </main>
      ) : (
        <div className="w-full ml-auto mr-auto px-4 mt-[96px] max-w-[1200px]">
          <div className="mt-0 w-full flex flex-col pb-[128px] tablet:flex-row tablet:pb-0 gap-8">
            <div className="flex flex-col flex-1 w-full mt-8 tablet:mt-0">
              <div className="relative">
                <ThirdwebNftMedia metadata={selectedNft.metadata} className="rounded-xl !w-full !h-auto bg-white bg-opacity-[0.04]" />
                <button
                  onClick={() => {
                    setSelectedNft(undefined);
                  }}
                  className="absolute top-[20px] hover:scale-110 transition-all duration-150 opacity-80 hover:opacity-100 right-[20px] text-2xl lg:text-3xl"
                >
                  X
                </button>
              </div>
            </div>

            <div className="relative w-full min-w-0 max-w-full top-0 shrink tablet:sticky tablet:w-full tablet:min-w-[370px] tablet:max-w-[450px] mt-4 tablet:mt-0 mr-4">
              <p className="mx-4 ">You&rsquo;re about to list the following item for sale.</p>

              <h1 className="font-medium text-[32px] font-GoodTimes break-words mt-4 mb-2 mx-4 text-moon-white">{selectedNft.metadata.name}</h1>
              {/*Id not displaying here*/}
              <p className="inline-block font-medium truncate mx-4 mt-4 text-[20px] py-1 px-[10px] rounded-sm bg-moon-secondary bg-opacity-40">
                Token ID #{selectedNft.metadata.token_id}
              </p>

              <div className="flex flex-col w-full grow relative bg-transparent rounded-2xl overflow-hidden mt-8 mb-6">
                <SaleInfo nft={selectedNft} contractAddress={selectedNft.collection} router={router} walletAddress={address} />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
