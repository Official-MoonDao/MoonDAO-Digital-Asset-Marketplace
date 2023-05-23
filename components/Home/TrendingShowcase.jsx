import ArrowButton from "../ArrowButton";
import TrendingThumbnail from "../TrendingThumbnail"

export default function TrendingShowcase() {
  return (
    <div className="mt-10 flex flex-col items-center">
      <h2 className="font-GoodTimes text-xl tracking-wide">Trending Assets</h2>
      <div className="mt-9 flex flex-col items-center gap-12">
        <TrendingThumbnail img={"./trendingdemo.png"} title={"Lorem Ipsum"} holders={20} floor={20000} number={102}/>
        <TrendingThumbnail img={"./trendingdemo.png"} title={"Lorem Ipsum"} holders={20} floor={20000} number={102}/>
        <TrendingThumbnail img={"./trendingdemo.png"} title={"Lorem Ipsum"} holders={20} floor={20000} number={102}/>
      </div>
      <ArrowButton text="See all" position={"mt-9"} />
    </div>
  );
}
