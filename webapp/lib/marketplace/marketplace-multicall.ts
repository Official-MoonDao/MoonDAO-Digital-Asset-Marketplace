import { Contract } from "ethers";

export async function multiAuctionPayout(
  marketplace: Contract,
  auctionIds: [number]
) {
  try {
    const encodedData = auctionIds.map((id: number) =>
      marketplace.interface.encodeFunctionData("collectAuctionPayout", [id])
    );
    const multicallTx = await marketplace.callStatic.multicall(encodedData);
    return multicallTx;
  } catch (err) {
    console.log(err);
  }
}

export async function multiCancelListings(
  marketplace: Contract,
  auctionIds: [number],
  listingIds: [number]
) {
  try {
    const encodedData = [];
    if (auctionIds.length > 0) {
      encodedData.push(
        ...auctionIds.map((id: number) =>
          marketplace.interface.encodeFunctionData("cancelAuction", [id])
        )
      );
    }
    if (listingIds.length > 0) {
      encodedData.push(
        listingIds.map((id: number) =>
          marketplace.interface.encodeFunctionData("cancelListing", [id])
        )
      );
    }
    const multicallTx = await marketplace.callStatic.multicall(encodedData);
    return multicallTx;
  } catch (err) {
    console.log(err);
  }
}

export async function multiCreateListings(
  marketplace: Contract,
  queuedListings: any,
  queuedAuctions: any
) {
  try {
    const encodedData = [];

    if (queuedListings.length > 0) {
      encodedData.push(
        ...queuedListings.map((listing: any) =>
          marketplace.interface.encodeFunctionData("createListing", [listing])
        )
      );
    }

    if (queuedAuctions.length > 0) {
      encodedData.push(
        ...queuedAuctions.map((auction: any) =>
          marketplace.interface.encodeFunctionData("createAuction", [auction])
        )
      );
    }

    const totalListingGas = Number(
      await queuedListings.reduce(
        async (arr: number, l: any) =>
          arr + (await marketplace.estimateGas.createListing(l))?.toNumber(),
        0
      )
    );

    if (encodedData.length > 0) {
      const multicallTx = await marketplace.multicall(encodedData, {
        gasLimit: totalListingGas,
      });
      return multicallTx;
    } else throw new Error("No data to encode");
  } catch (err) {
    console.log(err);
  }
}
