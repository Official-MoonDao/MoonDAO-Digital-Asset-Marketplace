import ArrowButton from "../ArrowButton";
import HeroStar from "../../assets/HeroStar";
import FrameDetail from "../../assets/FrameDetail";
import VerticalStar from "../../assets/VerticalStar";

{
  /*TODO implement buttons to change images*/
}

export default function Hero() {
  return (
    <div className="mt-10 flex flex-col items-center pb-12 md:flex-row-reverse md:py-10 lg:pt-12 md:gap-20 xl:gap-28 2xl:gap-40">
      {/*Hero image*/}
      <div className="flex flex-col items-center relative">
        <img
          className="w-[290px] object-cover lg:w-[355px] xl:w-[400px] 2xl:w-[536px] 2xl:max-h-[564px] rounded-tl-[99px] rounded-br-[99px]"
          src="hero.jpg"
          alt="Hero Image"
        />
        {/*Buttons to change slide, will be abstracted into components and changed, provisional*/}
        <div className="mt-8 flex gap-5 lg:ml-12 lg:mt-6">
          <button className="w-11 lg:w-8 h-1 bg-white opacity-20 rounded"></button>
          <button className="w-11 lg:w-8  bg-moon-secondary rounded"></button>
          <button className="w-11 lg:w-8  h-1 bg-white opacity-20 rounded"></button>
          <button className="w-11 lg:w-8 h-1 bg-white opacity-20 rounded"></button>
        </div>
        {/*Stars and frame detail*/}
        <span className="hidden lg:block lg:absolute top-80 right-64 xl:top-96 xl:right-72 2xl:hidden">
          <HeroStar size={{ width: 217, height: 235 }} />
        </span>
        <span className="hidden 2xl:block absolute -bottom-32 -left-40">
          <HeroStar />
        </span>
        <span className="hidden lg:block lg:absolute top-48 left-[370px] lg:opacity-70 xl:left-[420px]">
          <FrameDetail />
        </span>
        <span className="hidden lg:block 2xl:hidden lg:absolute lg:opacity-30 -top-9 -right-8">
          <VerticalStar />
        </span>
        <span className="hidden 2xl:block lg:absolute lg:opacity-30 -top-14 -right-12">
          <VerticalStar size={{ width: 70, height: 70 }} />
        </span>
      </div>

      {/*Title, paragraph and button to see all collections*/}
      <div className="mt-16 text-center md:text-left flex flex-col items-center md:mt-2 md:items-start lg:mt-10">
        <h1 className="text-white font-GoodTimes text-[34px] lg:text-5xl xl:text-6xl 2xl:text-7xl lg:tracking-wide">
          DIGITAL <br className="md:hidden" />
          ASSET <br />
          <span className="lg:mt-4 lg:inline-block">MARKETPLACE</span>
        </h1>
        <p className="mt-6 2xl:mt-[26px] lg:mt-7 text-moon-orange text-lg md:text-base lg:text-lg max-w-md xl:max-w-[600px] 2xl:max-w-[658px]">
          Gorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu
          ad litora torquent.
        </p>

        <ArrowButton text={"Explore collections"} position={"mt-12 lg:mt-10 2xl:mt-[50px]"} link={"/"} />
      </div>
    </div>
  );
}
