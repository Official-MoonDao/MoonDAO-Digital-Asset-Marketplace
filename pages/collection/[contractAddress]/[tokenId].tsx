import {
  useActiveListings,
  useAddress,
  useContract,
} from "@thirdweb-dev/react";
import React, { useEffect, useState } from "react";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { getAsset } from "../../../lib/opensea";
import NFTDetail from "../../../components/NFT/NFTDetail";
import { MARKETPLACE_ADDRESS } from "../../../const/contractAddresses";

type Props = {
  contractAddress: string;
  tokenId: string;
};

export default function TokenPage({ contractAddress, tokenId }: Props) {
  const router = useRouter();

  //check wallet for mooney
  const address = useAddress();
  const { contract: mooneyContract } = useContract(
    "0x86A827E4E98081D156D58F4aAb4F2bBa64eAA599"
  );
  const { contract: marketplace } = useContract(MARKETPLACE_ADDRESS);
  const { data: listings, isLoading } = useActiveListings(marketplace, {
    tokenContract: contractAddress,
    tokenId,
  });
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
      {listings && listings[0] && (
        <NFTDetail
          nft={listings[0].asset}
          router={router}
          user={{ address, mooneyBalance }}
        />
      )}
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const contractAddress = context.params?.contractAddress;
  const tokenId = context.params?.tokenId;

  return {
    props: {
      contractAddress,
      tokenId,
    },
  };
};
