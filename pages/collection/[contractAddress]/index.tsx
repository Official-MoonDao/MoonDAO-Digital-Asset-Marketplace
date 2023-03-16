import collectionStyles from "../../../styles/Collection.module.css";
import buyStyles from "../../../styles/Buy.module.css";
import styles from "../../../components/NFT/NFT.module.css";
import { GetServerSideProps, GetStaticPaths, GetStaticProps } from "next";
import {
  CHAIN_ID_TO_NAME,
  isFeatureEnabled,
  ThirdwebSDK,
} from "@thirdweb-dev/sdk";
import { MARKETPLACE_ADDRESS, NETWORK } from "../../../const/contractAddresses";
import NFTGrid from "../../../components/NFT/NFTGrid";
import Container from "../../../components/Container/Container";
import { getCollection } from "../../../lib/opensea";
import { useState } from "react";
import { useRouter } from "next/router";
import { ThirdwebNftMedia } from "@thirdweb-dev/react";
export default function Collection({ collection }: any) {
  const router = useRouter();
  return (
    <Container maxWidth="lg">
      <p className={styles.nftName}></p>
      <div className="flex flex-wrap gap-[5%] mt-[5%]">
        {collection[0]?.metadata?.id &&
          collection.map((nft: any, i: number) => (
            <div
              className="hover:translate-y-[-4%] duration-300 ease-in my-[2.5%] "
              key={`userNFT-${i}`}
              onClick={() =>
                router.push(
                  `/collection/${nft.metadata.asset_contract.address}/${nft.metadata.token_id}`
                )
              }
            >
              <ThirdwebNftMedia
                className="rounded-md hover:drop-shadow-[0_10px_20px_#d1d1d1] ease-in duration-300"
                metadata={nft?.metadata}
              />
            </div>
          ))}
      </div>
    </Container>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const contractAddress = context.params?.contractAddress as string;
  const collection = await getCollection(contractAddress);

  return {
    props: {
      collection:
        collection.assets?.map((nft: any) => ({
          metadata: { ...nft, image: nft.image_url },
        })) || {},
    },
  };
};
