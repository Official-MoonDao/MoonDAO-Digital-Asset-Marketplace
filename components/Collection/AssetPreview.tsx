import { ThirdwebNftMedia, useContract, useNFT } from "@thirdweb-dev/react";

export default function AssetPreview({ contractAddress, tokenId }: any) {
  const { contract } = useContract(contractAddress);
  const { data: nft, isLoading, error } = useNFT(contract, tokenId);

  if (isLoading) return <div>Loading...</div>;
  if (error || !nft) return <div>NFT not found!</div>;
  return (
    <div className="flex flex-col items-center gap-2 p-4">
      <h3>{nft.metadata.name}</h3>
      <ThirdwebNftMedia metadata={nft.metadata} />
    </div>
  );
}
