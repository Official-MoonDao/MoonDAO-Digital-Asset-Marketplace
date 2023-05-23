import { ConnectWallet, useAddress } from "@thirdweb-dev/react";
import LogoSmall from "../../assets/LogoSmall";
import Hamburger from "../../assets/Hamburger"
import Image from "next/image";
import Link from "next/link";
import NetworkError from "./NetworkError";
import Search from "./Search";


/**
 * Navigation bar that shows up on all pages.
 * Rendered in _app.tsx file above the page content.
 */
export function Navbar() {
  const address = useAddress();

  return (
    <div className="py-3 px-5">
      <NetworkError />
      <nav className="flex items-center justify-between">
        {/*Logo and search */}
        <div className="flex items-center gap-4">
        <Link href="/" className="">
          <LogoSmall />
        </Link>
        <Search/>
        </div>
        

        {/*Buy and sell desktop*/}
        <div className="hidden md:flex md:gap-12 md:text-xl">
          <Link href="/buy" className="">
            Buy
          </Link>
          <Link href="/sell" className="">
            Sell
          </Link>
        </div>

        {/*Mobile menu */}
        <div className="md:hidden">
        <Hamburger/>
        </div>


        {/*Connect wallet desktop, upon connect the address gets activated and shows logo */}
        <div className="hidden md:block">
          <div className="">
            <ConnectWallet />
          </div>
          {/*Logo upon activation */}
          {address && (
            <Link className="" href={`/profile/${address}`}>
              <Image className="" src="/user-icon.png" width={42} height={42} alt="Profile" />
            </Link>
          )}
        </div>
      </nav>
    </div>
  );
}
