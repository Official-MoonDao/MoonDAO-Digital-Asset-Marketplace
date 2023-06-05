import { useState } from "react";
import { ConnectWallet, useAddress } from "@thirdweb-dev/react";
import LogoSmall from "../../assets/LogoSmall";
import Hamburger from "../../assets/Hamburger";
import Image from "next/image";
import Link from "next/link";
import NetworkError from "./NetworkError";
import Search from "./Search";
import { ClaimFeeRewards } from "./ClaimFeeRewards";

/**
 * Navigation bar that shows up on all pages.
 * Rendered in _app.tsx file above the page content.
 */
export function Navbar() {
  const [mobileMenu, setMobileMenu] = useState(false);

  const address = useAddress();
  return (
    <div className="py-4 pl-4 pr-3 md:bg-white md:bg-opacity-5 lg:py-5 lg:px-[30px]">
      <NetworkError />
      <nav className="flex items-center justify-between">
        {/*Logo and search */}
        <div className="flex items-center gap-4 lg:gap-7 xl:gap-9 2xl:gap-11">
          <Link href="/" className="lg:hidden">
            <LogoSmall />
          </Link>
          <Link href="/" className="hidden lg:block">
            <Image src="/MoonDAOLogo.png" alt="MoonDAO Logo" width={146} height={42} />
          </Link>
          <Search />
        </div>

          {/*Mobile menu*/}
        <div className="flex gap-4 sm:items-center md:hidden">
          {/*Logo upon activation */}
          {address && (
            <div className="absolute sm: top-16 right-2">
              <Link className="" href={`/profile/${address}`}>
                <Image className="hover:scale-105 transition-all duration-150" src="/user-icon.png" width={32} height={32} alt="Profile" />
              </Link>
              {/*<ClaimFeeRewards />*/}
            </div>
          )}
          <div className="">
            <button className="" onClick={() => setMobileMenu(!mobileMenu)}>
              <Hamburger />
            </button>
            <ul
              className={`${
                mobileMenu ? "block" : "hidden"
              } text-gray-200 transition-all flex border border-indigo-300 shadow shadow-indigo-700 flex-col items-start px-6 gap-12 py-5 duration-150 top-10 right-5 z-10 h-[250px] w-[250px] bg-gradient-to-br from-slate-900 via-main-background to-indigo-900 rounded-xl absolute`}
            >
              <li>
                <Link href="/buy" className="hover:scale-105 hover:text-white inline-block text-lg">
                  Buy
                </Link>
              </li>
              <li>
                <Link href="/sell" className="hover:scale-105 hover:text-white inline-block text-lg">
                  Sell
                </Link>
              </li>
              <li>
                <ConnectWallet className="connect-button" />
              </li>
            </ul>
          </div>
        </div>

        {/*Desktop buy, sell and Connect*/}
        <div className="hidden md:flex items-center">
          <div className="flex gap-7 lg:gap-9 xl:gap-14 2xl:gap-16">
            <Link href="/buy" className="hover:scale-105 hover:text-indigo-200 inline-block text-lg lg:text-xl transition-all duration-150">
              Buy
            </Link>
            <Link href="/sell" className="hover:scale-105 hover:text-indigo-200 inline-block text-lg lg:text-xl transition-all duration-150">
              Sell
            </Link>
          </div>
          <div className="ml-6 lg:ml-8 xl:ml-10 2xl:ml-12">
            <ConnectWallet className="connect-button" />
          </div>
          {address && (
            <div className="ml-4 lg:ml-6">
              <Link className="" href={`/profile/${address}`}>
                <Image className="hover:scale-105 transition-all duration-150" src="/user-icon.png" width={40} height={40} alt="Profile" />
              </Link>
              {/*<ClaimFeeRewards />*/}
            </div>
          )}
        </div>
      </nav>
    </div>
  );
}
