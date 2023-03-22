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
import { useEffect } from "react";

export default function Collection({ assets, contractAddress }: any) {
  console.log(assets);
  const router = useRouter();
  const { contract: marketplace }: any = useContract(MARKETPLACE_ADDRESS);
  const { data: listings, isLoading: listingsLoading } = useActiveListings(
    marketplace,
    { tokenContract: contractAddress }
  );
  useEffect(() => {
    console.log(listings);
  }, [listings]);
  return (
    <Container maxWidth="lg">
      <p className={styles.nftName}></p>
      <div className="flex flex-wrap gap-[5%] mt-[5%]">
        {listings &&
          listings[0] &&
          listings.map((asset: any, i: number) => (
            <div
              className="hover:translate-y-[-4%] duration-300 ease-in my-[2.5%] "
              key={`asset-${i}`}
              onClick={() =>
                router.push(`/collection/${contractAddress}/${asset.token_id}`)
              }
            >
              <ThirdwebNftMedia
                className="rounded-md hover:drop-shadow-[0_10px_20px_#d1d1d1] ease-in duration-300"
                metadata={asset}
              />
            </div>
          ))}
      </div>
    </Container>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const contractAddress = context.params?.contractAddress as string;
  const { assets } = await getCollectionAssets(contractAddress);

  return {
    props: {
      assets,
      contractAddress,
    },
  };
};
