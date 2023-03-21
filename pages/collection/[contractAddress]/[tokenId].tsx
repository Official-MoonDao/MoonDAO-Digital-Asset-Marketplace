import { useAddress, useContract } from "@thirdweb-dev/react";
import React, { useEffect, useState } from "react";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { getAsset } from "../../../lib/opensea";
import NFTDetail from "../../../components/NFT/NFTDetail";

type Props = {
  nft: any;
  contractMetadata: any;
};

export default function TokenPage({ nft }: Props) {
  const router = useRouter();

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
    <NFTDetail nft={nft} router={router} user={{ address, mooneyBalance }} />
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const contractAddress = context.params?.contractAddress as string;
  const tokenId = context.params?.tokenId as string;
  const nft: any = await getAsset(contractAddress, tokenId);
  return {
    props: {
      nft: nft || {},
    },
  };
};
