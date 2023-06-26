import VerticalStar from "../../assets/VerticalStar";
import Metadata from "../Layout/Metadata";
import { NETWORK } from "../../const/config";

const NoAssets = ({ address, userAssets }: any) => {
  return (
    <div className="pt-10 md:pt-12 lg:pt-16 xl:pt-20 m flex flex-col items-center w-full md:pl-36 xl:pl-44 2xl:pl-52 pb-60 xl:pb-72 2xl:pb-96">
      <Metadata title="Sell" />
      <div className="flex flex-col items-center md:items-start w-full px-5">
        <h2 className="font-GoodTimes tracking-wide flex items-center text-3xl lg:text-4xl bg-clip-text text-transparent bg-gradient-to-br from-moon-gold to-indigo-100">
          Sell NFTs
          <span className="ml-2 lg:ml-4">
            <VerticalStar />
          </span>
        </h2>
        <p className="text-center mt-10 lg:mt-12 opacity-80 text-lg md:text-left text-red-400">
          {!address
            ? `Please connect your wallet to sell NFTs`
            : !userAssets[0] &&
              `The marketplace only supports NFTs on the ${NETWORK?.name} network.`}
        </p>
      </div>
    </div>
  );
};

export default NoAssets;
