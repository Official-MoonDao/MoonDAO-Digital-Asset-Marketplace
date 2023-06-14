import { initSDK } from "../lib/thirdweb";
import { MARKETPLACE_ADDRESS } from "../const/config";
import {
  getAllValidAuctions,
  getAllValidListings,
} from "../lib/marketplace-v3";

import { DirectListing, AuctionListing } from "../lib/utils";
import { useEffect, useRef, useState } from "react";
import VerticalStar from "../assets/VerticalStar";
import { useFilter } from "../lib/marketplace-subgraph";
import CollectionGrid from "../components/Collection/CollectionGrid";
import AssetPreview from "../components/Collection/AssetPreview";
import { useRouter } from "next/router";
import CollectionPreview from "../components/Collection/CollectionPreview";

interface FilteredListingsPageProps {
  validListings: DirectListing[];
  validAuctions: AuctionListing[];
}

export default function Buy({
  validListings,
  validAuctions,
}: FilteredListingsPageProps) {
  const router = useRouter();
  const filterSelectionRef: any = useRef();
  const [filter, setFilter] = useState<any>({
    type: "",
    assetOrCollection: "",
  });

  const { collections: filteredCollections, assets: filteredAssets } =
    useFilter(filter?.type, validListings, validAuctions);

  function filterTypeChange(e: any) {
    setFilter({ ...filter, type: e.target.value });
  }

  function assetTypeChange() {
    filter.assetOrCollection === "asset"
      ? setFilter({ ...filter, assetOrCollection: "collection" })
      : setFilter({ ...filter, assetOrCollection: "asset" });
  }

  useEffect(() => {
    if (filterSelectionRef.current && router.query) {
      const { filterType, assetType } = router.query;
      setFilter({
        type: filterType || "all",
        assetOrCollection: assetType || "asset",
      });
      filterSelectionRef.current.value = filterType || "all";
    }
  }, [router.query]);

  return (
    <div className="pt-10 md:pt-12 lg:pt-16 xl:pt-20 m flex flex-col items-center w-full">
      <div className="flex flex-col items-center md:items-start">
        {/*Title*/}
        <h2 className="font-GoodTimes tracking-wide flex items-center text-3xl lg:text-4xl bg-clip-text text-transparent bg-gradient-to-br from-moon-secondary to-indigo-100">
          Buy NFTs
          <span className="ml-2 lg:ml-4">
            <VerticalStar />
          </span>
        </h2>
        <div className="flex gap-[10%] w-full py-4">
          <div className="flex gap-2">
            <div className="flex flex-col divide-y-2 text-left gap-1 font-bold">
              <p>Assets</p>
              <p>Collections</p>
            </div>
            <div
              className={`flex w-8 h-14 ${
                filter.assetOrCollection === "asset"
                  ? "bg-moon-gold"
                  : "bg-moon-secondary"
              } rounded-full ease-in-ease-out duration-150`}
              onClick={assetTypeChange}
            >
              <button
                className={`${
                  filter.assetOrCollection === "collection" && "translate-y-6"
                } w-8 h-8 bg-white rounded-full ease-in-ease-out duration-150`}
              ></button>
            </div>
          </div>
          <select
            className="font-bold rounded-sm pl-2 w-[200px]"
            onChange={(e) => filterTypeChange(e)}
            ref={filterSelectionRef}
            defaultValue={router.query.filterType || "all"}
          >
            <option value="all">All</option>
            <option value="trending">Trending</option>
            {filter.assetOrCollection === "asset" && (
              <option value="expiring">Expiring Soon</option>
            )}
          </select>
        </div>
        <p className="my-[14px] lg:mt-6">
          {filter.assetOrCollection === "asset"
            ? "Pick an Asset"
            : "Pick from a collection"}
        </p>
        {/*Collection Grid with coollection preview components inside*/}
        {filter.type !== "" && (
          <div className="flex flex-col md:flex-row gap-4 w-full">
            {filter.assetOrCollection === "collection" && (
              <>
                {filteredCollections?.map((collection: any, i: number) => (
                  <CollectionPreview
                    key={`collection-preview-${i}`}
                    collection={collection}
                  />
                ))}
              </>
            )}
            {filter.assetOrCollection === "asset" && (
              <>
                {filteredAssets?.map(
                  (l: DirectListing | AuctionListing, i: number) => (
                    <AssetPreview
                      key={`filtered-asset-preview-${i}`}
                      contractAddress={l.assetContract}
                      tokenId={l.tokenId}
                      validListings={validListings}
                      validAuctions={validAuctions}
                    />
                  )
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export async function getStaticProps() {
  const sdk = initSDK();
  const marketplace = await sdk.getContract(MARKETPLACE_ADDRESS);
  const validListings: DirectListing[] = await getAllValidListings(marketplace);
  const validAuctions: AuctionListing[] = await getAllValidAuctions(
    marketplace
  );
  return {
    props: {
      validListings,
      validAuctions,
    },
    revalidate: 60,
  };
}
