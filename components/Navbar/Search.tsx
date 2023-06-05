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
  <div>
    {!enabled && !isSearching ? (
      <div onMouseOver={() => setEnabled(true)}>
        <Glass />
       </div>
    ) : (
      <div onMouseLeave={() => setEnabled(false)}>Search</div>
    )}
  </div>
*/
