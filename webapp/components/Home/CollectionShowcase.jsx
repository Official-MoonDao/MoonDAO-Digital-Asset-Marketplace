import ArrowButton from "../ArrowButton";
import CollectionThumbnail from "../CollectionThumbnail";
import SectionHeader from "../SectionHeader";

export default function CollectionShowcase({
  collections,
  validListings,
  validAuctions,
}) {
  return (
    <div className="mt-10 md:mt-12 lg:mt-32 2xl:mt-48 m flex flex-col items-center w-full">
      <SectionHeader title="Popular collections" />
      <div className="mt-10 md:mt-16 flex flex-col gap-10 md:grid md:grid-cols-2 md:grid-flow-row md:gap-12 xl:grid-cols-3 xl:gap-14">
        {collections &&
          collections.map((collection, index) => (
            <CollectionThumbnail
              key={"collection-thumbnail-" + index}
              collection={collection}
              validListings={validListings}
              validAuctions={validAuctions}
            />
          ))}
      </div>
      <ArrowButton
        text={"See all"}
        position={"mt-16"}
        link={"/buy?filterType=trending&assetType=collection"}
      />
    </div>
  );
}

const dummyData = [
  {
    name: "Lorem Ipsum",
    img: "/collectionthumbnail1.png",
    change: 213,
    floor: 20000,
    volume: 50,
  },
  {
    name: "Lorem Ipsum",
    img: "/collectionthumbnail2.png",
    change: -137,
    floor: 20000,
    volume: 50,
  },
  {
    name: "Lorem Ipsum",
    img: "/collectionthumbnail3.png",
    change: 751,
    floor: 20000,
    volume: 50,
  },
  {
    name: "Lorem Ipsum",
    img: "/collectionthumbnail1.png",
    change: 456,
    floor: 20000,
    volume: 50,
  },
  {
    name: "Lorem Ipsum",
    img: "/collectionthumbnail2.png",
    change: 125,
    floor: 20000,
    volume: 50,
  },
  {
    name: "Lorem Ipsum",
    img: "/collectionthumbnail3.png",
    change: -352,
    floor: 20000,
    volume: 50,
  },
  {
    name: "Lorem Ipsum",
    img: "/collectionthumbnail1.png",
    change: 843,
    floor: 20000,
    volume: 50,
  },
  {
    name: "Lorem Ipsum",
    img: "/collectionthumbnail2.png",
    change: -743,
    floor: 20000,
    volume: 50,
  },
  {
    name: "Lorem Ipsum",
    img: "/collectionthumbnail3.png",
    change: -352,
    floor: 20000,
    volume: 50,
  },
];
