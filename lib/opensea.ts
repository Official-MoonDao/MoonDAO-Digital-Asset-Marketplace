const openSeaMainnet = "https://api.opensea.io/api/v1";
const openSeaTestnet = "https://testnets-api.opensea.io/api/v1";

export async function getAllUserNFTs(address: string, setUserNFTs: Function) {
  try {
    await fetch(`${openSeaTestnet}/assets?owner=${address}`)
      .then((res) => res.json())
      .then((data) =>
        setUserNFTs(
          data.assets.map((a: any) => ({
            metadata: { ...a, image: a.image_url },
          }))
        )
      );
  } catch (err) {
    console.error(err);
  }
}

export async function getAsset(contractAddress: string, tokenId: string) {
  try {
    const res = await fetch(
      `${openSeaTestnet}/asset/${contractAddress}/${tokenId}`
    );
    const data = await res.json();
    return {
      metadata: { ...data, image: data.image_url },
    };
  } catch (err) {
    console.log(err);
  }
}

export async function getCollection(contractAddress: string) {
  try {
    const res = await fetch(
      `${openSeaTestnet}/assets?asset_contract_address=${contractAddress}`
    );
    const data = await res.json();
    return data;
  } catch (err) {
    console.error(err);
  }
}
