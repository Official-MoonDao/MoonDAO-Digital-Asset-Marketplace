import { initSDK } from "../../../lib/thirdweb";
import { MARKETPLACE_ADDRESS } from "../../../const/config";
import {
  getAllValidAuctions,
  getAllValidListings,
  useAllCollections,
} from "../../../lib/marketplace-v3";

import {
  DirectListing,
  AuctionListing,
} from "../../../lib/utils";
import { useEffect, useRef, useState } from "react";
import VerticalStar from "../../../assets/VerticalStar";
import { useFilter } from "../../../lib/marketplace-subgraph";
import CollectionGrid from "../../../components/Collection/CollectionGrid";

interface FilteredListingsPageProps {
  validListings: DirectListing[];
  validAuctions: AuctionListing[];
  filterType:string,
  assetType:string
}

export default function FilteredListingsPage({
  validListings,
  validAuctions,
  filterType,
  assetType,
}: FilteredListingsPageProps) {
  
  const filterSelectionRef:any = useRef();
  const [filter, setFilter] = useState<any>({type: filterType, assetOrCollection: assetType});

  const collections = useAllCollections(validListings, validAuctions);

  const {collections: filteredCollections, assets: filteredAssets} = useFilter(filter, collections, validListings, validAuctions);

  function filterTypeChange(e:any){
    setFilter({...filter, type: e.target.value});
  }

  function assetTypeChange(){
    filter.assetOrCollection === "asset" ? setFilter({...filter, assetOrCollection: "collection"}) : setFilter({...filter, assetOrCollection: "asset"})
  }

  useEffect(()=>{
    if(filterSelectionRef.current){
      filterSelectionRef.current.value = filter.type;
    }
  },[filterSelectionRef])

  return (
  <div className="pt-10 md:pt-12 lg:pt-16 xl:pt-20 m flex flex-col items-center w-full">
      <div className="flex flex-col items-center md:items-start">
        {/*Title*/}
        <h2 className="font-GoodTimes tracking-wide flex items-center text-3xl lg:text-4xl bg-clip-text text-transparent bg-gradient-to-br from-moon-secondary to-indigo-100">
          Filter NFTs
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
          <div className={`flex w-8 h-14 ${filter.assetOrCollection === "asset" ? "bg-[#D7594F]" : "bg-[blue]"} rounded-full ease-in-ease-out duration-150`} onClick={assetTypeChange}>
            <button className={`${filter.assetOrCollection === "collection" && "translate-y-6"} w-8 h-8 bg-white rounded-full ease-in-ease-out duration-150`} ></button>
          </div>
          </div>
          <select className="" onChange={(e)=> filterTypeChange(e)} ref={filterSelectionRef}>
            <option value="all">All</option>
            <option value="trending">Trending</option>
            <option value="expiring">Expiring Soon</option>
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
            <p className="mt-[14px] lg:mt-6">No assets available at this time.</p>
            </>
        )}
      </div>
    </div>
  );
}

export async function getServerSideProps(context: any) {
  const { filterType, assetType } = context.query;
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
      filterType : filterType || "all",
      assetType : assetType || "asset"
    },
  };
}
