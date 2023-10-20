import { ThirdwebProvider } from "@thirdweb-dev/react";
import "../styles/globals.css";
import Layout from "../components/Layout/Layout";
import { NETWORK } from "../const/config";
import {
  metamaskWallet,
  coinbaseWallet,
  safeWallet,
  walletConnect,
} from "@thirdweb-dev/react";

function MyApp({ Component, pageProps }: any) {
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
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ThirdwebProvider>
  );
}

export default MyApp;
