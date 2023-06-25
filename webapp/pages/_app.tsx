import type { AppProps } from "next/app";
import { ThirdwebProvider } from "@thirdweb-dev/react";
import { Navbar } from "../components/Layout/Navbar/Navbar";
import NextNProgress from "nextjs-progressbar";
import "../styles/globals.css";
import { Goerli } from "@thirdweb-dev/chains";
import { Toaster } from "react-hot-toast";
import Footer from "../components/Layout/Footer";
import Layout from "../components/Layout/Layout";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThirdwebProvider activeChain={Goerli}>
      {/* Progress bar when navigating between pages */}

      <NextNProgress
        color="var(--color-tertiary)"
        startPosition={0.3}
        stopDelayMs={200}
        height={3}
        showOnShallow={true}
      />
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ThirdwebProvider>
  );
}

export default MyApp;
