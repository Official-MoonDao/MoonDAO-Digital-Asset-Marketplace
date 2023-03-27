import styles from "../../../components/NFT/NFT.module.css";
import { GetServerSideProps } from "next";
import Container from "../../../components/Container/Container";
import { getCollection, getCollectionAssets } from "../../../lib/opensea";
import { useRouter } from "next/router";
import {
  ThirdwebNftMedia,
  useActiveListings,
  useContract,
} from "@thirdweb-dev/react";
import { MARKETPLACE_ADDRESS } from "../../../const/contractAddresses";
import { useEffect, useState } from "react";

export default function Collection({ contractAddress }: any) {
  const router = useRouter();
  const { contract: marketplace }: any = useContract(MARKETPLACE_ADDRESS);
  const { data: listings, isLoading: listingsLoading } = useActiveListings(
    marketplace,
    { tokenContract: contractAddress }
  );
  const [assets, setAssets]: any = useState<any>([]);

  useEffect(() => {
    if (listings && listings[0]) {
      const uniqueAssets: any = [];
      const filteredAssets = listings.filter(
        (l: any) =>
          !uniqueAssets.includes(l.tokenId.toString()) &&
          uniqueAssets.push(l.tokenId.toString())
      );
      setAssets(filteredAssets);
    }
    console.log(listings);
  }, [listings]);
  return (
    <Container maxWidth="lg" className="">
      <p className={styles.nftName}></p>
      <div className="flex flex-wrap gap-[5%] mt-[5%]">
        {assets &&
          assets[0] &&
          assets.map((listing: any, i: number) => (
            <div
              className="hover:translate-y-[-4%] duration-300 ease-in my-[2.5%] "
              key={`asset-${i}`}
              onClick={() =>
                router.push(
                  `/collection/${contractAddress}/${listing.tokenId.toString()}`
                )
              }
            >
              <ThirdwebNftMedia
                className="rounded-md hover:drop-shadow-[0_10px_20px_#d1d1d1] ease-in duration-300"
                metadata={listing.asset}
              />
            </div>
          ))}
      </div>
    </Container>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const contractAddress = context.params?.contractAddress as string;

  return {
    props: {
      contractAddress,
    },
  };
};
