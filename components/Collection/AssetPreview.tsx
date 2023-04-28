import { ThirdwebNftMedia, useContract, useNFT } from "@thirdweb-dev/react";
import { useEffect } from "react";

export default function AssetPreview({ contractAddress, tokenId }: any) {
  const { contract } = useContract(contractAddress);
  const { data: nft, isLoading, error } = useNFT(contract, tokenId);

  useEffect(() => {
    console.log(nft);
  }, [nft]);

  if (isLoading) return <div>Loading...</div>;
  if (error || !nft) return <div>NFT not found!</div>;
  return <ThirdwebNftMedia metadata={nft.metadata} />;
}
