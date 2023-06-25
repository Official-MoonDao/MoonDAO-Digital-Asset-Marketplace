import { useEffect, useRef, useState } from "react";
import Glass from "../../../assets/Glass";
import { useSearch } from "../../../lib/marketplace/hooks";
import {
  getAllValidAuctions,
  getAllValidListings,
} from "../../../lib/marketplace/marketplace-listings";
import { ThirdwebNftMedia, useContract } from "@thirdweb-dev/react";
import { MARKETPLACE_ADDRESS } from "../../../const/config";
import Skeleton from "../Skeleton";
import Link from "next/link";

export default function Search() {
  const searchRef: any = useRef();
  const [text, setText] = useState<string>("");

  const { contract: marketplace }: any = useContract(
    MARKETPLACE_ADDRESS,
    "marketplace-v3"
  );

  const [validListings, setValidListings] = useState<any>([]);
  const [validAuctions, setValidAuctions] = useState<any>([]);

  const searchResults = useSearch(text, validListings, validAuctions);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [enabled, setEnabled] = useState<boolean>(false);

  useEffect(() => {
    if (marketplace) {
      getAllValidListings(marketplace).then((listings: any) => {
        setValidListings(listings);
      });
      getAllValidAuctions(marketplace).then((auctions: any) => {
        setValidAuctions(auctions);
      });
    }
  }, [marketplace]);
  return (
    <div className="relative group z-50">
      <div>
        <input
          type="search"
          className={`peer w-[240px] md:w-[260px] lg:w-[300px] xl:w-[390px] 2xl:w-[441px] focus:ring-1 ring-indigo-500 ring-opacity-50 py-[5px] md:py-[7px] pl-10 md:pl-12 pr-3 md:pr-5 text-sm placeholder:text-sm md:text-base md:placeholder:text-base placeholder:opacity-40 block border-[0.6px] border-white border-opacity-50 bg-transparent`}
          placeholder="Search Assets"
          onBlur={(e) => {
            setTimeout(() => {
              setEnabled(false);
            }, 100);
          }}
          onClick={() => setEnabled(true)}
          onChange={(e) => {
            const value = e.target.value.toLowerCase();
            if (!isSearching) setIsSearching(true);
            if (value.trim() !== "") {
              setTimeout(() => {
                if (searchRef.current.value.toLowerCase() === value) {
                  setText(value);
                  setTimeout(() => {
                    setIsSearching(false);
                  }, 50);
                }
              }, 500);
            }
          }}
          ref={searchRef}
        />
        {/*Search result container*/}
        {enabled && searchResults && searchResults[0] && (
          <div className="bg-[#1e1b4b] border-[0.6px] rounded-b-lg border-white border-opacity-50 border-t-0 gap-4 flex flex-col items-start truncate absolute max-h-[400px] w-[240px] md:w-[260px] lg:w-[300px] xl:w-[390px] 2xl:w-[441px]">
            {isSearching ? (
              <Skeleton height="10px" />
            ) : (
              searchResults.map((nft: any, i: number) => (
                <div
                  className="flex items-center hover:bg-indigo-900 w-full px-3 py-2"
                  key={"search-result-" + i}
                >
                  <Link
                    className="flex items-center"
                    href={`/collection/${nft.collection}/${nft.metadata.id}`}
                  >
                    <ThirdwebNftMedia
                      metadata={nft.metadata}
                      width="50px"
                      height="50px"
                      className="rounded-lg"
                    />
                    <p className="pl-3">{nft.metadata.name}</p>
                  </Link>
                </div>
              ))
            )}
          </div>
        )}
      </div>
      <span className="absolute top-[7px] left-3 opacity-50 peer-focus:opacity-80 md:hidden">
        <Glass />
      </span>
      <span className="hidden md:block absolute top-[10px] left-4 opacity-50 peer-focus:opacity-80">
        <Glass size={{ height: 20, width: 20 }} />
      </span>
    </div>
  );
}

/*
import { useEffect, useRef, useState } from "react";
import Glass from "../../assets/Glass";
import { useClickOutside } from "../../lib/utils";

export default function Search() {
  const searchRef: any = useRef();
  const [enabled, setEnabled] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const clickOutsideSearch = useClickOutside(isSearching, searchRef);

  const [search, setSearch] = useState<string>();

  return (
    <div
      className="h-[10%] flex items-center w-[300px]"
      onMouseEnter={() => setEnabled(true)}
    >
      <div className="absolute flex">
        <Glass />
      </div>
      {enabled && clickOutsideSearch && (
        <div className="absolute ml-8 flex gap-2">
          <input
            className="px-2 py-1"
            ref={searchRef}
            onFocus={() => setIsSearching(true)}
            onChange={(e: any) => {
              const value = e.target.value;
              value.trim() !== "" && setSearch(value);
            }}
          />
          <button
            className="abosolute right-2 z-20"
            onClick={() => setEnabled(false)}
          >
            X
          </button>
        </div>
      )}
    </div>
  );
}
*/
