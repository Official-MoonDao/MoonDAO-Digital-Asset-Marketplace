import {
  MediaRenderer,
  ThirdwebNftMedia,
  useAddress,
  useContract,
  useContractEvents,
  useUnclaimedNFTSupply,
  useValidDirectListings,
  useValidEnglishAuctions,
  Web3Button,
} from "@thirdweb-dev/react";
import React, { useEffect, useState } from "react";
import Container from "../../../components/Container/Container";
import { GetStaticProps, GetStaticPaths, GetServerSideProps } from "next";
import {
  CHAIN_ID_TO_NAME,
  isFeatureEnabled,
  NFT,
  ThirdwebSDK,
} from "@thirdweb-dev/sdk";
import {
  ETHERSCAN_URL,
  MARKETPLACE_ADDRESS,
  NETWORK,
  NFT_COLLECTION_ADDRESS,
} from "../../../const/contractAddresses";

import randomColor from "../../../util/randomColor";
import Skeleton from "../../../components/Skeleton/Skeleton";
import toast, { Toaster } from "react-hot-toast";
import toastStyle from "../../../util/toastConfig";
import { useRouter } from "next/router";
import ERC1155 from "../../../components/Token/ERC1155";
import ERC721 from "../../../components/Token/ERC721";

type Props = {
  nft: NFT;
  contractMetadata: any;
};

export default function TokenPage({ nft, contractMetadata }: Props) {
  const router = useRouter();
  if (!nft) return;
  const { contractAddress } = contractMetadata;

  //check wallet for mooney
  const address = useAddress();
  const { contract: mooneyContract } = useContract(
    "0x86A827E4E98081D156D58F4aAb4F2bBa64eAA599"
  );
  const [mooneyBalance, setMooneyBalance] = useState(0);

  useEffect(() => {
    if (mooneyContract && address) {
      (async () => {
        const data = await mooneyContract?.call("balanceOf", address);
        setMooneyBalance(Math.floor(+data?.toString() / 10 ** 18));
      })();
    }
  }, [mooneyContract, address]);

  return (
    <>
      {contractMetadata.type === "ERC1155" ? (
        <ERC1155
          nft={nft}
          contractMetadata={contractMetadata}
          route={() => router.push(`/token/${contractAddress}`)}
          user={{ address, mooneyBalance }}
        />
      ) : (
        <ERC721
          nft={nft}
          contractMetadata={contractMetadata}
          route={() => router.push(`/token/${contractAddress}`)}
          user={{ address, mooneyBalance }}
        />
      )}
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const tokenId = context.params?.tokenId as string;
  const contractAddress = context.params?.contractAddress as string;

  const sdk = new ThirdwebSDK(CHAIN_ID_TO_NAME[NETWORK.chainId]);

  const contract: any = await sdk.getContract(contractAddress);

  let contractMetadata;

  try {
    contractMetadata = {
      ...(await contract.metadata.get()),
      contractAddress,
      type: "",
    };
  } catch (e) {}
  let nft;
  const isERC1155 = isFeatureEnabled(contract.abi, "ERC1155");
  if (isERC1155) {
    nft = await contract.erc1155.get(tokenId);
    contractMetadata.type = "ERC1155";
  } else {
    nft = await contract.erc721.get(tokenId);
    contractMetadata.type = "ERC721";
  }
  return {
    props: {
      nft,
      contractMetadata: contractMetadata || null,
    },
  };
};
