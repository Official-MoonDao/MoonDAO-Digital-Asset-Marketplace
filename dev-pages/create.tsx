import {
  useAddress,
  useContract,
  useContractWrite,
  useLazyMint,
  useMintNFT,
  useNFTs,
} from "@thirdweb-dev/react";
import { NATIVE_TOKEN_ADDRESS } from "@thirdweb-dev/sdk";
import React, { useRef, useState } from "react";
import Container from "../components/Container/Container";
import { NFT_COLLECTION_ADDRESS } from "../const/contractAddresses";

const NFT_COLLECTIONS = [
  { type: "nft", address: "0xCF7241560C960783E1Bb90f233f8cfF782f7ABa1" },
  { type: "nft-drop", address: "0xdbb3aaA438e49a93c3E3E213AEbF2F5370993D2d" },
];

function Input({ label, placeholder, forwardRef }: any) {
  return (
    <label className="w-full bg-[#1e1e1e9f] p-4 rounded-md">
      {label}
      <input
        className="w-full px-2 text-lg rounded-sm bg-[#1e1e1e]"
        placeholder={placeholder}
        ref={forwardRef}
      />
    </label>
  );
}

export default function Create() {
  const address = useAddress();
  const { contract }: any = useContract(
    "0xBB84a64cF5C3D04789015565a0ec7e4FE79B6238"
  ); //signature drop
  const { mutate: lazyMint } = useLazyMint(contract);

  const nameInputRef: any = useRef();
  const priceInputRef: any = useRef();
  const descInputRef: any = useRef();
  const fileInputRef: any = useRef();

  async function mint() {
    //inputs
    const name = nameInputRef.current.value;
    const price = priceInputRef.current.value;
    const description = descInputRef.current.value;
    const file = fileInputRef.current.files[0];

    //error handling
    if (!address) return handleError("Please connect your wallet");
    if (!name || name.trim() === "" || name.length < 4)
      return handleError("Please enter a name for your NFT");
    if (!price || +price <= 0)
      return handleError("Please enter a price for your NFT");
    if (!description || description.trim() === "")
      return handleError("Please give your NFT a description");
    if (!file) return handleError("Please upload a file");

    //lazy-mint nft to community collection
    const res = lazyMint({
      metadatas: [
        {
          name,
          description,
          image: file,
        },
      ],
    });
    console.log(res);
  }

  const [errorMessage, setErrorMessage] = useState<string>("");

  function Error() {
    return (
      <div>
        <p>{errorMessage}</p>
      </div>
    );
  }

  function handleError(message: string) {
    setErrorMessage(message);
    setTimeout(() => {
      setErrorMessage("");
    }, 5000);
  }

  return (
    <Container maxWidth="lg">
      <h1>Create NFTs</h1>
      <p>Mint your own NFT</p>
      <div className="flex flex-col justify-center items-center w-full mt-[5%] bg-[#d1d1d180] rounded-2xl py-[2%] text-center">
        <h2>Community NFT</h2>
        <p>
          Complete the form to mint a NFT to the MoonDAO Community Collection
        </p>
        {errorMessage !== "" && <Error />}
        <div className="p-[5%] flex flex-col justify-center items-center gap-2 bg-transparent rounded-2xl text-left">
          <input
            type="file"
            accept="image/png, image/jpeg, video/mp4"
            className="w-full bg-[#1e1e1e9f] rounded-2xl"
            ref={fileInputRef}
          />
          <p>{`(accepted files: jpeg, png, mp4)`}</p>
          <Input
            label="Name:"
            placeholder="name your NFT"
            forwardRef={nameInputRef}
          />
          <Input
            label="Description:"
            placeholder="describe your NFT"
            forwardRef={descInputRef}
          />
          <Input
            label="Price:"
            placeholder="amount in MOONEY"
            forwardRef={priceInputRef}
          />
          <button
            onClick={async () => {
              await mint();
            }}
          >
            Mint
          </button>
        </div>
      </div>
    </Container>
  );
}
