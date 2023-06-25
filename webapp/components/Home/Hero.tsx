import { useState, useEffect } from "react";
import HeroImageSelector from "./HeroImageSelector";
import ArrowButton from "../Layout/ArrowButton";
import HeroStar from "../../assets/HeroStar";
import FrameDetail from "../../assets/FrameDetail";
import VerticalStar from "../../assets/VerticalStar";
import HeroImage from "./HeroImage";
import { AuctionListing, DirectListing } from "../../lib/utils";
import Link from "next/link";

//TODO for the slide selector: Transition between images, automatic change of images after interval.
//TODO adjust blur so it doesnt overlay on top of hero image

export default function Hero({ top4 }: any) {
  // Example data for the Hero slide selector
  // let dummyData = [
  //   { img: "hero.jpg", link: "https://blur.io/" },
  //   { img: "hero2.png", link: "https://blur.io/" },
  //   { img: "hero.jpg", link: "https://blur.io/" },
  //   { img: "hero2.png", link: "https://blur.io/" },
  // ];

  // State for the hero, contains link of the collection when clicked and image
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [heroImageArray, setHeroImageArray] = useState<
    DirectListing[] | AuctionListing[]
  >([]);

  useEffect(() => {
    if (top4[0]) {
      setHeroImageArray(top4);
    }
  }, [top4]);

  useEffect(() => {
    if (heroImageArray.length > 0) {
      const interval = setInterval(() => {
        if (currentSlide === heroImageArray.length - 1) {
          setCurrentSlide(0);
        } else {
          setCurrentSlide(currentSlide + 1);
        }
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [currentSlide, heroImageArray]);

  return (
    <div className="mt-10 flex flex-col items-center pb-12 md:flex-row-reverse md:py-10 lg:pt-12 md:gap-20 xl:gap-28 2xl:gap-40">
      {/*Hero image*/}
      <div className="flex flex-col items-center relative">
        {/*Here goes the link to the collection and the image*/}
        <Link
          href={`/collection/${heroImageArray[currentSlide]?.assetContract}/${heroImageArray[currentSlide]?.tokenId}`}
        >
          <HeroImage asset={heroImageArray[currentSlide]} />
        </Link>
        {/*Buttons to change slides*/}
        <HeroImageSelector
          currentSlide={currentSlide}
          setCurrentSlide={setCurrentSlide}
        />

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
      <div className="relative mt-16 text-center z-10 md:text-left flex flex-col items-center md:mt-2 md:items-start lg:mt-10">
        {/*Blur blob*/}
        <div
          className="absolute overflow-hidden hidden lg:block -z-50 lg:left-[calc(-90%-30rem)] xl:left-[calc(-40%-30rem)] lg:top-[calc(50%-30rem)] 2xl:left-[calc(-5%-30rem)] 2xl:top-[calc(50%-30rem)] transform-gpu blur-[85px] "
          aria-hidden="true"
        >
          <div
            className="relative aspect-[1400/678] rotate-[30deg] bg-gradient-to-tr from-moon-secondary to-orange-600 opacity-[0.15] w-[82.1875rem]"
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
          />
        </div>
        {/*Title and paragraph*/}
        <h1 className="text-white font-GoodTimes text-[34px] md:text-4xl md:tracking-wide md:leading-relaxed lg:text-5xl xl:text-6xl 2xl:text-7xl">
          DIGITAL <br className="md:hidden" />
          ASSET <br />
          <span className="lg:mt-4 lg:inline-block">MARKETPLACE</span>
        </h1>
        <p className="mt-8 md:mt-6 2xl:mt-[26px] lg:mt-7 text-sm leading-6 px-3 md:px-0 text-moon-orange text-md md:text-left lg:text-base xl:text-lg max-w-md xl:max-w-[600px] 2xl:max-w-[658px]">
          {`Whether you're an artist seeking to showcase your unique creations or
          a collector in search of one-of-a-kind digital artifacts, the MoonDAO
          Marketplace offers a seamless and secure environment for buying and
          selling NFTs for MOONEY. Join our thriving community today and embark
          on a journey into the endless possibilities of the digital universe.`}
        </p>

        <ArrowButton
          text={"Explore collections"}
          position={"mt-12 lg:mt-10 2xl:mt-[50px]"}
          link={"/buy?assetType=collection"}
        />
      </div>
    </div>
  );
}
