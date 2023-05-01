import styles from "../../../components/NFT/NFT.module.css";
import { GetServerSideProps } from "next";
import Container from "../../../components/Container/Container";
import { getCollection, getCollectionAssets } from "../../../lib/opensea";
import { useRouter } from "next/router";
import {
  ThirdwebNftMedia,
  useActiveListings,
  useContract,
  useContractRead,
} from "@thirdweb-dev/react";
import { MARKETPLACE_ADDRESS } from "../../../const/config";
import { useEffect, useState } from "react";
import {
  getAllValidAuctions,
  getAllValidListings,
  useAllCollections,
} from "../../../lib/marketplace-v3";
import { initSDK } from "../../../lib/thirdweb";
import AssetPreview from "../../../components/Collection/AssetPreview";
import { BigNumber } from "ethers";
import { BigConvert } from "../../../lib/utils";

export default function Collection({
  contractAddress,
  listings,
  auctions,
}: any) {
  const router = useRouter();
  const [assets, setAssets]: any = useState<any>([]);

  useEffect(() => {
    if (listings || auctions) {
      console.log(listings, auctions);
      const uniqueAssets: any = [];
      const filteredAssets: any = [];
      const length: number =
        listings.length > auctions.length ? listings.length : auctions.length;
      for (let i = 0; i < length; i++) {
        if (
          listings[i] &&
          !uniqueAssets.includes(BigConvert(listings[i][3].hex))
        ) {
          const tokenId: string = BigConvert(listings[i][3].hex);
          uniqueAssets.push(tokenId);
          filteredAssets.push(listings[i]);
        }
        if (
          auctions[i] &&
          !uniqueAssets.includes(BigConvert(auctions[i][3].hex))
        ) {
          const tokenId: string = BigConvert(auctions[i][0].hex);
          uniqueAssets.push(tokenId);
          filteredAssets.push(auctions[i]);
        }
      }
      setAssets(filteredAssets);
    }
  }, [listings, auctions]);

  return (
    <Container maxWidth="lg" className="">
      <p className={styles.nftName}></p>
      <div className="flex flex-wrap gap-[5%] mt-[5%]">
        {assets &&
          assets[0] &&
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
  const listings = await getAllValidListings(marketplace);
  const auctions = await getAllValidAuctions(marketplace);
  return {
    props: { contractAddress, listings, auctions },
  };
}
