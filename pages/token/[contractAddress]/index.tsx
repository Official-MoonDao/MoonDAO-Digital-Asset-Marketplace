import collectionStyles from "../../../styles/Collection.module.css";
import buyStyles from "../../../styles/Buy.module.css";
import styles from "../../../components/NFT/NFT.module.css";
import { GetServerSideProps, GetStaticPaths, GetStaticProps } from "next";
import { CHAIN_ID_TO_NAME, ThirdwebSDK } from "@thirdweb-dev/sdk";
import { MARKETPLACE_ADDRESS, NETWORK } from "../../../const/contractAddresses";
import NFTGrid from "../../../components/NFT/NFTGrid";
import Container from "../../../components/Container/Container";
export default function Collection({ nft, contractMetadata }: any) {
  console.log(nft);
  return (
    <Container maxWidth="lg">
      <p className={styles.nftName}></p>
      <div className={buyStyles.nftGridContainer}>
        <NFTGrid isLoading={nft === null} data={nft} />
      </div>
    </Container>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const contractAddress = context.params?.contractAddress as string;

  const sdk = new ThirdwebSDK(CHAIN_ID_TO_NAME[NETWORK.chainId]);

  const contract: any = await sdk.getContract(contractAddress);

  let contractMetadata;

  try {
    contractMetadata = await contract.metadata.get();
  } catch (e) {}

  let nft;
  if (contract?.erc1155) {
    nft = await contract.erc1155.getAll(contract);
  } else nft = await contract.erc721.getAll(contract);
  console.log(nft);
  return {
    props: {
      nft,
      contractMetadata: contractMetadata || null,
    },
  };
};
