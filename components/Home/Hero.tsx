import { useState } from "react";
import HeroImageSelector from "./HeroImageSelector";
import ArrowButton from "../ArrowButton";
import HeroStar from "../../assets/HeroStar";
import FrameDetail from "../../assets/FrameDetail";
import VerticalStar from "../../assets/VerticalStar";

//TODO for the slide selector: Transition between images, automatic change of images after interval.

export default function Hero() {
  // Example data for the Hero slide selector
  let dummyData = [
    { img: "hero.jpg", link: "https://blur.io/" },
    { img: "hero2.png", link: "https://blur.io/" },
    { img: "hero.jpg", link: "https://blur.io/" },
    { img: "hero2.png", link: "https://blur.io/" },
  ];

  // State for the hero, contains link of the collection when clicked and image
  const [currentSlide, setCurrrentSlide] = useState(1);
  const [heroImageArray, setHeroImageArray] = useState(dummyData);

  return (
    <div className="mt-10 flex flex-col items-center pb-12 md:flex-row-reverse md:py-10 lg:pt-12 md:gap-20 xl:gap-28 2xl:gap-40">
      {/*Hero image*/}
      <div className="flex flex-col items-center relative">
        {/*Here goes the link to the collection and the image*/}
        <a target="_blank" href={heroImageArray[currentSlide].link}>
          <img
            className="w-[290px] hover:ring-2 xl:hover:ring-4 ring-moon-orange transition-all duration-300 h-[362px] lg:h-[443.38px] xl:h-[499.58px] 2xl:h-[564px]  object-cover lg:w-[355px] xl:w-[400px] 2xl:w-[536px]  rounded-tl-[99px] rounded-br-[99px]"
            src={heroImageArray[currentSlide].img}
            alt="Hero Image"
          />
        </a>
        {/*Buttons to change slides*/}
        <HeroImageSelector currentSlide={currentSlide} setCurrrentSlide={setCurrrentSlide} />

        {/*Stars and frame detail*/}
        <span className="hidden lg:block lg:absolute top-80 right-64 xl:top-96 xl:right-72 2xl:hidden">
          <HeroStar size={{ width: 217, height: 235 }} />
        </span>
        <span className="hidden 2xl:block absolute -bottom-32 -left-40">
          <HeroStar />
        </span>
        <span className="hidden lg:block lg:absolute top-48 left-[370px] lg:opacity-70 xl:left-[420px] 2xl:left-[550px]">
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
