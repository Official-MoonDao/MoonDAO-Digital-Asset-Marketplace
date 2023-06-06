import type { AppProps } from "next/app";
import { ThirdwebProvider } from "@thirdweb-dev/react";
import { Navbar } from "../components/Navbar/Navbar";
import NextNProgress from "nextjs-progressbar";
import "../styles/globals.css";
import { Goerli } from "@thirdweb-dev/chains";
import { Toaster } from "react-hot-toast";
import Footer from "../components/Footer";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThirdwebProvider activeChain={Goerli}>
      {/* Progress bar when navigating between pages */}

      <NextNProgress color="var(--color-tertiary)" startPosition={0.3} stopDelayMs={200} height={3} showOnShallow={true} />

      {/* Render the navigation menu above each component */}
      <Navbar />
      {/* Render the actual component (page) */}
      <Component {...pageProps} />
      {/* Render the footer below each component (page) */}
      <Footer />
      <Toaster />
    </ThirdwebProvider>
  );
}

export default MyApp;
