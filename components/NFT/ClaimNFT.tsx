import { useClaimNFT, useContract, useMintNFT } from "@thirdweb-dev/react";
import { useState } from "react";

export default function ClaimNFT({ contract, available }: any) {
  const { mutate: claimNFT, isLoading } = useClaimNFT(contract);

  const [quantity, setQuantity] = useState(0);
  function more() {
    quantity < available && setQuantity(quantity + 1);
  }

  function less() {
    quantity > 0 && setQuantity(quantity - 1);
  }
  return (
    <div>
      <>
        <p>quantity : </p>
        <p>{quantity}</p>
        <button onClick={less}>{"-"}</button>
        <button onClick={more}>{"+"}</button>
      </>

      <button onClick={() => {}}>Mint</button>
    </div>
  );
}
