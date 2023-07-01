import { useRef, useState } from "react";
import { ConnectWallet, MediaRenderer, useAddress } from "@thirdweb-dev/react";
import LogoSmall from "../../../assets/LogoSmall";
import Hamburger from "../../../assets/Hamburger";
import Image from "next/image";
import Link from "next/link";
import NetworkError from "./NetworkError";
import Search from "./Search";
import { ClaimFeeRewards } from "./ClaimFeeRewards";
import { useClickOutside } from "../../../lib/utils/hooks";
import { useRouter } from "next/router";

/**
 * Navigation bar that shows up on all pages.
 * Rendered in _app.tsx file above the page content.
 */
export function Navbar() {
  const router = useRouter();
  const mobileMenuRef: any = useRef();
  const [mobileMenu, setMobileMenu] = useState(false);

  useClickOutside(mobileMenuRef, mobileMenu, setMobileMenu);

  const address = useAddress();

  function MobileNavButton({ href, label }: any) {
    return (
      <li>
        <button
          className="hover:scale-105 hover:text-orange-500 inline-block text-lg"
          onClick={() => router.push(href).then(() => setMobileMenu(false))}
        >
          {label}
        </button>
      </li>
    );
  }

  return (
    <div className="py-4 pl-4 pr-3 relative z-50 md:bg-white md:bg-opacity-5 lg:py-5 lg:px-[30px]">
      <NetworkError />
      <nav className="flex items-center justify-between">
        {/*Logo and search */}
        <div className="flex items-center gap-4 lg:gap-7 xl:gap-9 2xl:gap-11">
          <Link href="/" className="lg:hidden">
            <LogoSmall />
          </Link>
          <Link href="/" className="hidden lg:block">
            <MediaRenderer
              src="/MoonDAOLogo.png"
              alt="MoonDAO Logo"
              width={"146px"}
              height={"42px"}
            />
          </Link>
          <Search />
        </div>

        {/*Mobile menu*/}
        <div className="flex gap-4 sm:items-center md:hidden z-50">
          {/*Logo upon activation */}
          {address && (
            <div className="absolute sm: top-16 right-2">
              <Link className="" href={`/profile/${address}`}>
                <MediaRenderer
                  className="hover:scale-105 transition-all duration-150"
                  src="/user-icon.png"
                  width={"32px"}
                  height={"32px"}
                  alt="Profile"
                />
              </Link>
              {/*<ClaimFeeRewards />*/}
            </div>
          )}
          <div className="">
            <button
              className="hover:scale-105"
              onClick={() => setMobileMenu(!mobileMenu)}
            >
              <Hamburger />
            </button>
            <ul
              ref={mobileMenuRef}
              className={`${
                mobileMenu ? "block" : "hidden"
              } text-gray-200 transition-all flex border border-gray-100 border-opacity-40 shadow shadow-white flex-col items-start px-6 gap-12 py-5 duration-150 top-2 right-2 z-10 h-[250px] w-[280px] bg-slate-900 rounded-xl absolute`}
            >
              <button
                className="absolute right-4 hover:scale-105"
                onClick={() => setMobileMenu(!mobileMenu)}
              >
                <Hamburger />
              </button>
              <MobileNavButton label="Buy" href="/buy" />
              <MobileNavButton label="Sell" href="/sell" />
              <li>
                <ConnectWallet className="!px-5 !rounded-[2px]" />
              </li>
              {/* <li>{address && <ClaimFeeRewards />}</li> */}
            </ul>
          </div>
        </div>

        {/*Desktop buy, sell and Connect*/}
        <div className="hidden md:flex items-center">
          <div className="flex gap-7 lg:gap-9 xl:gap-14 2xl:gap-16">
            <Link
              href="/buy"
              className="hover:scale-105 hover:text-orange-500 inline-block text-lg lg:text-xl transition-all duration-150"
            >
              Buy
            </Link>
            <Link
              href="/sell"
              className="hover:scale-105 hover:text-orange-500 inline-block text-lg lg:text-xl transition-all duration-150"
            >
              Sell
            </Link>
          </div>
          <div className="ml-6 lg:ml-8 xl:ml-10 2xl:ml-12">
            <ConnectWallet className="connect-button" />
          </div>

          {address && (
            <div className="ml-4 lg:ml-6">
              <Link className="" href={`/profile/${address}`}>
                <MediaRenderer
                  className="hover:scale-105 transition-all duration-150"
                  src="/user-icon.png"
                  width={"40px"}
                  height={"40px"}
                  alt="Profile"
                />
              </Link>
              {/*<ClaimFeeRewards />*/}
              {/* <div className="absolute right-[2%] w-[250px]">
                <ClaimFeeRewards />
              </div> */}
            </div>
          )}
        </div>
      </nav>
    </div>
  );
}
