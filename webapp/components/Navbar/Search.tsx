import { useState } from "react";
import Glass from "../../assets/Glass";

export default function Search() {
  const [enabled, setEnabled] = useState<boolean>(false);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  return (
    <div className="relative group">
      <input type="search" className="peer w-[240px] md:w-[260px] lg:w-[300px] xl:w-[390px] 2xl:w-[441px] focus:ring-2 ring-indigo-500 ring-opacity-50 py-[5px] md:py-[7px] pl-10 md:pl-12 pr-3 md:pr-5 text-sm placeholder:text-sm md:text-base md:placeholder:text-base placeholder:opacity-40 rounded-full block border-[0.6px] border-white border-opacity-50 bg-transparent" placeholder="Search Collections"/>
      <span className="absolute top-[7px] left-3 opacity-50 peer-focus:opacity-80 md:hidden">
        <Glass />
      </span>
      <span className="hidden md:block absolute top-[10px] left-4 opacity-50 peer-focus:opacity-80">
        <Glass size={{height:20,width:20}} />
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