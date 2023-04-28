const openSeaMainnet = "https://api.opensea.io/api/v1";
const openSeaTestnet = "https://testnets-api.opensea.io/api/v1";

export async function getAllUserNFTs(address: any) {
  try {
    const res = await fetch(`${openSeaTestnet}/assets?owner=${address}`);
    const data: any = await res.json();
    console.log(data);
    return data?.assets.map((a: any) => ({
      metadata: { ...a, image: a?.image_url },
    }));
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
    console.log(data);
    return {
      metadata: { ...data, image: data?.image_url },
    };
  } catch (err) {
    console.error(err);
  }
}

export async function getCollection(contractAddress: string) {
  try {
    const res = await fetch(
      `${openSeaTestnet}/asset_contract/${contractAddress}`
    );
    const data = await res.json();
    console.log(data);
    return data;
  } catch (err) {
    console.error(err);
  }
}

export async function getCollectionAssets(contractAddress: string) {
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
