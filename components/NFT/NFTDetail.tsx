import styles from "../../styles/Token.module.css";
import styles2 from "./NFT.module.css";
import Link from "next/link";
import {
  ThirdwebNftMedia,
  useContract,
  useContractMetadata,
  useNFT,
  Web3Button,
} from "@thirdweb-dev/react";
import Container from "../Container/Container";
import { Toaster } from "react-hot-toast";
import randomColor from "../../util/randomColor";
import Skeleton from "../Skeleton/Skeleton";
import { useEffect, useState } from "react";
import { MARKETPLACE_ADDRESS } from "../../const/config";
import toastStyle from "../../util/toastConfig";
import { BigConvert } from "../../lib/utils";
import NFTListings from "./NFTListings";
const [randomColor1, randomColor2] = [randomColor(), randomColor()];

export default function NFTDetail({
  tokenId,
  assetListings,
  assetAuctions,
  router,
  user,
  contractAddress,
}: any) {
  // Connect to marketplace smart contract
  const { contract: nftContract } = useContract(contractAddress);
  const { data: nftContractMetadata } = useContractMetadata(nftContract);
  const { data: nft }: any = useNFT(nftContract, tokenId);
  const { contract: marketplace } = useContract(
    MARKETPLACE_ADDRESS,
    "marketplace-v3"
  );

  const [currListing, setCurrListing] = useState<any>([]);
  useEffect(() => {
    console.log("assetListings", assetListings);
    console.log("assetAuctions", assetAuctions);
  }, [assetListings, assetAuctions]);
  return (
    <>
      <Toaster position="bottom-center" reverseOrder={false} />
      <Container maxWidth="lg" className={"mb-4"}>
        <div className="flex pt-4 gap-[5%]">
          <div className="w-1/2">
            {nft && (
              <>
                <ThirdwebNftMedia
                  metadata={nft.metadata}
                  width={"75%"}
                  height={"75%"}
                />
                <p className={styles2.nftName}>{nft.metadata.name}</p>
                <p className={styles2.nftTokenId}>
                  Token ID #{nft.metadata.id}
                </p>
                <p
                  className={styles2.nftTokenId}
                >{`Token Standard: ${nft.type}`}</p>

                <div className={styles.traitsContainer}>
                  {Object.entries(nft?.metadata.attributes || {}).map(
                    ([key, value]: any) => (
                      <div className={styles.traitContainer} key={key}>
                        <p className={styles.traitName}>{value.trait_type} :</p>
                        <p className={styles.traitValue}>{value.value}</p>
                      </div>
                    )
                  )}
                </div>
              </>
            )}
          </div>
          <div className="w-1/2">
            {assetListings[0] || assetAuctions[0] ? (
              <NFTListings
                listings={assetListings}
                auctions={assetAuctions}
                nft={nft}
              />
            ) : (
              <div>loading</div>
            )}
          </div>
        </div>
      </Container>
    </>
  );
}
