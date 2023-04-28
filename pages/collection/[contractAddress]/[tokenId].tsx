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
import { initSDK } from "../../../lib/thirdweb";
import {
  getAllValidAuctions,
  getAllValidListings,
  useListingsAndAuctionsForTokenId,
} from "../../../lib/marketplace-v3";

type Props = {
  contractAddress: string;
  tokenId: number;
  validListings: any;
  validAuctions: any;
};

export default function TokenPage({
  contractAddress,
  tokenId,
  validListings,
  validAuctions,
}: Props) {
  const router = useRouter();

  //check wallet for mooney
  const address = useAddress();
  const { contract: mooneyContract } = useContract(
    "0x86A827E4E98081D156D58F4aAb4F2bBa64eAA599"
  );
  const [mooneyBalance, setMooneyBalance] = useState(0);

  //get nft from listing
  const { listings, auctions } = useListingsAndAuctionsForTokenId(
    validListings,
    validAuctions,
    tokenId
  );

  useEffect(() => {
    if (mooneyContract && address) {
      (async () => {
        const data = await mooneyContract?.call("balanceOf", address);
        setMooneyBalance(Math.floor(+data?.toString() / 10 ** 18));
      })();
    }
    console.log(validListings);
  }, [mooneyContract, address]);

  return (
    <>
      {listings && listings[0] ? (
        <NFTDetail
          contractAddress={contractAddress}
          tokenId={tokenId}
          assetListings={listings}
          assetAuctions={auctions}
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

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const contractAddress = params?.contractAddress;
  const tokenId = params?.tokenId;
  const sdk = initSDK();
  const marketplace = await sdk.getContract(MARKETPLACE_ADDRESS);
  const validListings = await getAllValidListings(marketplace);
  const validAuctions = await getAllValidAuctions(marketplace);

  return {
    props: {
      contractAddress,
      tokenId,
      validListings,
      validAuctions,
    },
  };
};
