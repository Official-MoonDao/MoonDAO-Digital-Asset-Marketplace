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
        {/* <Component {...pageProps} /> */}
        <div className="flex flex-col items-center justify-center w-full h-[70vh]">
          <p className="text-xl w-3/4">
            {`Thank you for visiting the MoonDAO Marketplace.`}
            <br></br>
            <br></br>
            {`
We're currently undergoing some maintenance to improve your experience. We apologize for any inconvenience this may cause and appreciate your patience.`}
            <br></br>
            Our team is working hard to bring the marketplace back online as
            soon as possible.
          </p>
        </div>
      </Layout>
    </ThirdwebProvider>
  );
}

export default MyApp;
