import ArrowButton from "../ArrowButton";
export default function Hero() {
  return (
    <div className="mt-10 px-6 flex flex-col items-center pb-12">
      <div className="flex flex-col items-center">
        <img className="w-[290px] rounded-tl-[99px] rounded-br-[99px]" src="android.png" alt="Hero Image" />
        <div className="mt-8 flex gap-5">
          <button className="w-11 h-1 bg-white opacity-20 rounded"></button>
          <button className="w-11 bg-moon-secondary rounded"></button>
          <button className="w-11 h-1 bg-white opacity-20 rounded"></button>
          <button className="w-11 h-1 bg-white opacity-20 rounded"></button>
        </div>
      </div>
      {/*Title, paragraph and button to see all collections*/}
      <div className="mt-16 text-center flex flex-col items-center">
        <h1 className="text-white font-GoodTimes text-[34px]">
          DIGITAL <br />
          ASSET <br />
          MARKETPLACE
        </h1>
        <p className="mt-6 text-moon-orange opacity-50 text-lg  max-w-xs">
          Gorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu
          ad litora torquent.
        </p>

        <ArrowButton text={"Explore collections"} position={"mt-12"} />
      </div>
    </div>
  );
}
