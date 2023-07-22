export default function ToggleSaleInfo({ isBatch, setIsBatch }: any) {
  return (
    <div className="flex flex-col justify-center items-center w-[400px] gap-4">
      <h1 className="text-2xl flex">
        <span className={`${!isBatch && "text-moon-gold"}`}>Single</span>|
        <span className={`${isBatch && "text-indigo-500"}`}>Batch</span>
      </h1>
      <p className="text-white opacity-80 w-full text-center">
        {isBatch
          ? "Select multiple NFTs to sell at once"
          : "Select a single NFT to sell"}
      </p>
      <div
        className={`w-[250px] h-[30px] bg-moon-gold rounded-full bg-moon-gold duration-[1s] ease-out ${
          isBatch && "bg-indigo-500"
        }`}
        onClick={() => setIsBatch(!isBatch)}
      >
        <button
          className={`w-[50px] h-[30px] bg-white rounded-full duration-[1s] ease-out ${
            isBatch && "translate-x-[200px]"
          }`}
        ></button>
      </div>
    </div>
  );
}
