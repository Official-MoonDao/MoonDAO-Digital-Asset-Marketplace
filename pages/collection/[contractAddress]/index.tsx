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
import { MARKETPLACE_ADDRESS } from "../../../const/contractAddresses";
import { useEffect, useState } from "react";
import {
  getAllValidAuctions,
  getAllValidListings,
  useAllCollections,
} from "../../../lib/marketplace-v3";
import { initSDK } from "../../../lib/thirdweb";
import AssetPreview from "../../../components/Collection/AssetPreview";

export default function Collection({
  contractAddress,
  listings,
  auctions,
}: any) {
  const router = useRouter();
  const [assets, setAssets]: any = useState<any>([]);

  useEffect(() => {
    console.log(listings, auctions);
    if (listings || auctions) {
      const uniqueAssets: any = [];
      const filteredAssets: any = [];
      const length: number =
        listings.length > auctions.length ? listings.length : auctions.length;
      for (let i = 0; i < length; i++) {
        if (listings[i] && !uniqueAssets.includes(listings[i][10])) {
          uniqueAssets.push(listings[i][10]);
          filteredAssets.push(listings[i]);
        }
        if (auctions[i] && !uniqueAssets.includes(auctions[i][10])) {
          uniqueAssets.push(auctions[i][10]);
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
                  `/collection/${contractAddress}/${a[10].toString()}`
                )
              }
            >
              <AssetPreview contractAddress={contractAddress} tokenId={a[10]} />
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
