import ArrowButton from "../ArrowButton";
import CollectionThumbnail from "../CollectionThumbnail";

export default function CollectionShowcase() {
  return (
    <div className="mt-10 flex flex-col items-center">
      <h2 className="font-GoodTimes text-xl tracking-wide">Popular collections</h2>
      <div className="mt-10 flex flex-col gap-10">
        <CollectionThumbnail id={1} name={"Lorem Ipsum"} img={"/collectionthumbnail1.png"} change={213} floor={20000} volume={50} />
        <CollectionThumbnail id={2} name={"Lorem Ipsum"} img={"/collectionthumbnail1.png"} change={-137} floor={20000} volume={50} />
        <CollectionThumbnail id={3} name={"Lorem Ipsum"} img={"/collectionthumbnail1.png"} change={751} floor={20000} volume={50} />
        <CollectionThumbnail id={4} name={"Lorem Ipsum"} img={"/collectionthumbnail1.png"} change={413} floor={20000} volume={50} />
        <CollectionThumbnail id={5} name={"Lorem Ipsum"} img={"/collectionthumbnail1.png"} change={355} floor={20000} volume={50} />
        <CollectionThumbnail id={6} name={"Lorem Ipsum"} img={"/collectionthumbnail1.png"} change={-125} floor={20000} volume={50} />
      </div>
      <ArrowButton text={"See all"} position={"mt-16"} />
    </div>
  );
}
