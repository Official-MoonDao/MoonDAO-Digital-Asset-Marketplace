import LogoSmall from "../assets/LogoSmall";
const TrendingThumbnail = ({ img, title, holders, number, floor }) => {
  return (
    <article className="relative">
      <img className="w-[320px] h-[436px] -z-20" src={img} alt={`${title} image.`} />
      <div className="bg-white relative z-10 bg-opacity-10 -mt-32 w-[320px] h-[128px] flex justify-between">
        <div className="pl-6 pt-3 flex flex-col items-start">
          <h6 className="text-lg font-bold">{title}</h6>
          <p className="mt-1 text-sm opacity-70">{holders} owners</p>
          <p className="text-sm mt-3 opacity-70">Floor Price</p>
          <span className="flex items-center gap-2">
            <LogoSmall size={{ width: 10.54, height: 11.07 }} />
            {floor}
          </span>
        </div>
        <div className="pt-3  pr-6 flex flex-col items-end">
          <p className="font-bold text-lg">#{number}</p>
          <button className="mt-11 text-sm border-[0.5px] px-[10px] py-[6px] rounded-xl">Details</button>
        </div>
      </div>
    </article>
  );
};

export default TrendingThumbnail;
