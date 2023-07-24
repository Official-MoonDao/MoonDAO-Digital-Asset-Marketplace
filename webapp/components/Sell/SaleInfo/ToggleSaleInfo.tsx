export default function ToggleSaleInfo({ isBatch, setIsBatch }: any) {
  return (
    <div className="flex flex-col items-center md:items-start w-[330px] md:w-[400px]">
      <h1 className="text-xl flex gap-3 font-semibold">
        <span className={`${isBatch && "text-opacity-60"} text-moon-gold`}>Single</span>|
        <span className={`${!isBatch && "text-opacity-60"} text-indigo-400`}>Batch</span>
      </h1>
      <div
        className={`mt-6 md:mt-7 w-[130px] md:w-[170px] h-[25px] rounded-full bg-moon-gold bg-opacity-90 duration-[1s] ease-out ${
          isBatch && "bg-indigo-500"
        }`}
        onClick={() => setIsBatch(!isBatch)}
      >
        <button
          className={`-mt-2 w-[40px] h-[40px] md:w-[43px] md:h-[43px] bg-white rounded-full duration-500 ease-out ${
            isBatch && "translate-x-[100px] md:translate-x-[130px]"
          }`}
        ></button>
      </div>
      <p className="mt-5 text-white opacity-80 text-center md:text-left">
        {isBatch
          ? "Select multiple NFTs to sell at once"
          : "Select a single NFT to sell"}
      </p>
    </div>
  );
}