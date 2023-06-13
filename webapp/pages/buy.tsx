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

interface FilteredListingsPageProps {
  validListings: DirectListing[];
  validAuctions: AuctionListing[];
  filterType: string;
  assetType: string;
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
    useFilter(filter, validListings, validAuctions);

  function filterTypeChange(e: any) {
    setFilter({ ...filter, type: e.target.value });
  }

  function assetTypeChange() {
    filter.assetOrCollection === "asset"
      ? setFilter({ ...filter, assetOrCollection: "collection" })
      : setFilter({ ...filter, assetOrCollection: "asset" });
  }

  useEffect(() => {
    if (router.query) {
      const { filterType, assetType } = router.query;
      setFilter({
        type: filterType || "all",
        assetOrCollection: assetType || "asset",
      });
    }
  }, [router.query]);

  if (filter.type === "") {
    return <>loading</>;
  }

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
            <div className="flex flex-col divide-y-2 text-left gap-1">
              <p>Assets</p>
              <p>Collections</p>
            </div>
            <div
              className={`flex w-8 h-14 ${
                filter.assetOrCollection === "asset"
                  ? "bg-[#D7594F]"
                  : "bg-[blue]"
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
            className=""
            onChange={(e) => {
              filterTypeChange(e);
              console.log(filter);
            }}
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
        {/*Collection Grid with coollection preview components inside*/}
        {filter.assetOrCollection === "collection" && (
          <>
            <p className="mt-[14px] lg:mt-6">Pick from a collection</p>
            <CollectionGrid collections={filteredCollections} />
          </>
        )}
        {filter.assetOrCollection === "asset" && (
          <>
            <p className="mt-[14px] lg:mt-6">Pick an asset</p>
            {filteredAssets?.map(
              (l: DirectListing | AuctionListing, i: number) => (
                <AssetPreview
                  key={`filtered-asset-preview-${i}`}
                  contractAddress={l.assetContract}
                  tokenId={l.tokenId}
                />
              )
            )}
          </>
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
