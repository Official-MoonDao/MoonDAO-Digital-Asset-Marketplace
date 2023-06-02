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
