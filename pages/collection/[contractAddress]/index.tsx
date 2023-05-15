import styles from "../../../components/NFT/NFT.module.css";
import Container from "../../../components/Container/Container";
import { useRouter } from "next/router";
import { MARKETPLACE_ADDRESS } from "../../../const/config";
import { useEffect, useState } from "react";
import {
  getAllValidAuctions,
  getAllValidListings,
  useAllAssets,
} from "../../../lib/marketplace-v3";
import { initSDK } from "../../../lib/thirdweb";
import AssetPreview from "../../../components/Collection/AssetPreview";
import { BigConvert } from "../../../lib/utils";

export default function Collection({
  contractAddress,
  validListings,
  validAuctions,
}: any) {
  const router = useRouter();
  const assets = useAllAssets(validListings, validAuctions);
  return (
    <Container maxWidth="lg" className="">
      <p className={styles.nftName}></p>
      <div className="flex flex-wrap gap-[5%] mt-[5%]">
        {assets[0] &&
          assets.map((a: any, i: number) => (
            <div
              className="hover:translate-y-[-4%] duration-300 ease-in my-[2.5%] "
              key={`asset-${i}`}
              onClick={() =>
                router.push(
                  `/collection/${contractAddress}/${BigConvert(a[3].hex)}`
                )
              }
            >
              <AssetPreview
                contractAddress={contractAddress}
                tokenId={BigConvert(a[3].hex)}
              />
            </div>
          ))}
      </div>
    </Container>
  );
}

export async function getServerSideProps({ params }: any) {
  const contractAddress = params?.contractAddress;
  const sdk = initSDK();
  const marketplace = await sdk.getContract(MARKETPLACE_ADDRESS);
  const validListings = await getAllValidListings(marketplace);
  const validAuctions = await getAllValidAuctions(marketplace);
  return {
    props: { contractAddress, validListings, validAuctions },
  };
}
