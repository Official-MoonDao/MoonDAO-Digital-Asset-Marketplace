import ArrowButton from "../ArrowButton";
import TrendingThumbnail from "../TrendingThumbnail";
import SectionHeader from "../SectionHeader";

export default function TrendingShowcase() {
  return (
    <div className="mt-14 md:mt-20 flex flex-col items-center">
      <SectionHeader title={"Trending Assets"} />
      {/*
      Will show 4 components from Mobile up to LG screens, where it transforms into a grid
      Incoming data is being sliced before mapping
      */}
      <div className="mt-9 md:mt-12 flex flex-col items-center gap-12 lg:hidden">
        {dummyData.slice(4).map((e, i) => (
          <TrendingThumbnail
            key={i}
            name={e.name}
            img={e.img}
            holders={e.holders}
            floor={e.floor}
            number={e.number}
          />
        ))}
      </div>
      {/*Desktop grid, not slicing*/}
      <div className="hidden lg:mt-20 lg:grid lg:grid-cols-2 lg:grid-flow-row lg:gap-12 xl:grid-cols-3 xl:gap-20">
        {dummyData.map((e, i) => (
          <TrendingThumbnail
            key={i}
            name={e.name}
            img={e.img}
            holders={e.holders}
            floor={e.floor}
            number={e.number}
          />
        ))}
      </div>
      <ArrowButton
        text="See all"
        position={"mt-9 lg:mt-12"}
        link={"/buy?filterType=trending"}
      />
    </div>
  );
}

const dummyData = [
  {
    name: "Lorem Ipsum",
    img: "/trendingthumbnail.png",
    holders: 20,
    floor: 20000,
    number: 102,
    link: "/",
  },
  {
    name: "Lorem Ipsum",
    img: "/trendingthumbnail2.png",
    holders: 20,
    floor: 20000,
    number: 102,
    link: "/",
  },
  {
    name: "Lorem Ipsum",
    img: "/trendingthumbnail3.png",
    holders: 20,
    floor: 20000,
    number: 102,
    link: "/",
  },
  {
    name: "Lorem Ipsum",
    img: "/trendingthumbnail4.png",
    holders: 20,
    floor: 20000,
    number: 102,
    link: "/",
  },
  {
    name: "Lorem Ipsum",
    img: "/trendingthumbnail.png",
    holders: 20,
    floor: 20000,
    number: 102,
    link: "/",
  },
  {
    name: "Lorem Ipsum",
    img: "/trendingthumbnail2.png",
    holders: 20,
    floor: 20000,
    number: 102,
    link: "/",
  },
  {
    name: "Lorem Ipsum",
    img: "/trendingthumbnail3.png",
    holders: 20,
    floor: 20000,
    number: 102,
    link: "/",
  },
  {
    name: "Lorem Ipsum",
    img: "/trendingthumbnail4.png",
    holders: 20,
    floor: 20000,
    number: 102,
    link: "/",
  },
  {
    name: "Lorem Ipsum",
    img: "/trendingthumbnail.png",
    holders: 20,
    floor: 20000,
    number: 102,
    link: "/",
  },
];
