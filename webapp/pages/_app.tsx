import type { AppProps } from "next/app";
import { ThirdwebProvider } from "@thirdweb-dev/react";
import NextNProgress from "nextjs-progressbar";
import "../styles/globals.css";
import Layout from "../components/Layout/Layout";
import { NETWORK } from "../const/config";
import {
  metamaskWallet,
  coinbaseWallet,
  safeWallet,
  walletConnect,
} from "@thirdweb-dev/react";
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThirdwebProvider
      clientId={process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID}
      activeChain={NETWORK}
      supportedWallets={[
        metamaskWallet(),
        coinbaseWallet(),
        safeWallet(),
        walletConnect(),
      ]}
    >
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
