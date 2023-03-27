import {
  useActiveListings,
  useAddress,
  useContract,
} from "@thirdweb-dev/react";
import React, { useEffect, useState } from "react";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import NFTDetail from "../../../components/NFT/NFTDetail";
import { MARKETPLACE_ADDRESS } from "../../../const/contractAddresses";
import Container from "../../../components/Container/Container";

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
  const [mooneyBalance, setMooneyBalance] = useState(0);

  //get nft from listing
  const { contract: marketplace }: any = useContract(MARKETPLACE_ADDRESS);
  const { data: listings, isLoading } = useActiveListings(marketplace, {
    tokenContract: contractAddress,
    tokenId: tokenId,
  });

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
      {listings && listings[0] ? (
        <NFTDetail
          contractAddress={contractAddress}
          listings={listings}
          router={router}
          user={{ address, mooneyBalance }}
        />
      ) : (
        <Container maxWidth="lg" className="">
          ...this token has no listings
        </Container>
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
