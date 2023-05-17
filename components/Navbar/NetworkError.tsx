import { useNetwork } from "@thirdweb-dev/react";
import { useEffect, useState } from "react";

const chainId = process.env.NEXT_PUBLIC_NETWORK === "mainnet" ? 1 : 80001;

export default function NetworkError() {
  // const network: any = useNetwork();
  // const [error, setError] = useState(false);

  // useEffect(() => {
  //   if (network[0].data.chain !== chainId) {
  //   }
  // }, [network]);
  return <div></div>;
}
