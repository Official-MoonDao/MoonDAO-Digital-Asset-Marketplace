import styles from "../../../components/NFT/NFT.module.css";
import { GetServerSideProps } from "next";
import Container from "../../../components/Container/Container";
import { getCollection, getCollectionAssets } from "../../../lib/opensea";
import { useRouter } from "next/router";
import { ThirdwebNftMedia } from "@thirdweb-dev/react";

export default function Collection({ assets }: any) {
  console.log(assets);
  const router = useRouter();
  return (
    <Container maxWidth="lg">
      <p className={styles.nftName}></p>
      <div className="flex flex-wrap gap-[5%] mt-[5%]">
        {assets[0] &&
          assets.map((nft: any, i: number) => (
            <div
              className="hover:translate-y-[-4%] duration-300 ease-in my-[2.5%] "
              key={`nft-${i}`}
              onClick={() =>
                router.push(
                  `/collection/${nft.asset_contract.address}/${nft.token_id}`
                )
              }
            >
              <ThirdwebNftMedia
                className="rounded-md hover:drop-shadow-[0_10px_20px_#d1d1d1] ease-in duration-300"
                metadata={{
                  name: nft.name,
                  image: nft.image_url,
                  description: nft.description,
                  external_url: nft.external_link,
                  animation_url: nft.animation_url,
                }}
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
    },
  };
};
