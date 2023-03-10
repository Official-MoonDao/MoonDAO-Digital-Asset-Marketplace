import {
  useAddress,
  useClaimNFT,
  useContract,
  useMintNFT,
  Web3Button,
} from "@thirdweb-dev/react";
import { BigNumber } from "ethers";
import { useState } from "react";
import { toast } from "react-hot-toast";
import toastStyle from "../../util/toastConfig";
import style from "./ClaimNFT.module.css";
export default function ClaimNFT({ nft, contractAddress }: any) {
  const { contract } = useContract(contractAddress);
  const { mutateAsync: claimNFT, isLoading, error } = useClaimNFT(contract);
  const address = useAddress();

  const [quantity, setQuantity] = useState<number>(0);
  function more() {
    setQuantity(quantity + 1);
  }

  function less() {
    quantity > 0 && setQuantity(quantity - 1);
  }

  return (
    <div className={style.containClaim}>
      {/* <div className={style.row}>
        <p className={style.quantity}>quantity : </p>
        <p>{quantity}</p>
      </div>
      <div className={style.row}>
        <button onClick={less}>{"-"}</button>
        <div style={{ width: "10%" }} />
        <button onClick={more}>{"+"}</button>
      </div> */}

      <Web3Button
        contractAddress={contractAddress}
        action={async () => {
          await claimNFT({
            to: address,
            quantity: 1,
            tokenId: nft.metadata.id,
          });
        }}
        onError={(err) => {
          toast.error(`Claim Failed : ${err.message.slice(0, 118)}`, {
            icon: "❌",
            style: toastStyle,
            position: "bottom-center",
          });
        }}
        onSuccess={() => {
          console.log(error);
          toast.success("You've claimed this NFT!", {
            icon: "✅",
            style: toastStyle,
            position: "bottom-center",
          });
        }}
      >
        Claim NFT
      </Web3Button>
    </div>
  );
}
