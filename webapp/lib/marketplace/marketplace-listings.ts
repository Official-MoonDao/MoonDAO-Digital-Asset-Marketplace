import { MarketplaceV3 } from "@thirdweb-dev/sdk";
import { serializable } from "../utils";

//Get all auctions including expired & closed auctions from marketplace
export async function getAllAuctions(marketplace: MarketplaceV3) {
  try {
    const totalAuctions = await marketplace.call("totalAuctions");
    const auctions = await marketplace.call(
      "getAllAuctions",
      0,
      totalAuctions?.toNumber() - 1 >= 0 ? totalAuctions?.toNumber() - 1 : 0
    );
    return serializable(auctions);
  } catch (err) {
    console.log(err);
    return [];
  }
}

//Get all valid listings from marketplace
export async function getAllValidListings(marketplace: MarketplaceV3) {
  try {
    const totalListings = await marketplace.call("totalListings");
    const listings = await marketplace.call(
      "getAllValidListings",
      0,
      totalListings?.toNumber() - 1 >= 0 ? totalListings?.toNumber() - 1 : 0
    );
    return serializable(listings);
  } catch (err) {
    console.log(err);
    return [];
  }
}

//Get all valid auctions from marketplace
export async function getAllValidAuctions(marketplace: MarketplaceV3) {
  try {
    const totalAuctions = await marketplace.call("totalAuctions");
    const auctions = await marketplace.call(
      "getAllValidAuctions",
      0,
      totalAuctions?.toNumber() - 1 >= 0 ? totalAuctions?.toNumber() - 1 : 0
    );
    return serializable(auctions);
  } catch (err) {
    console.log(err);
    return [];
  }
}
