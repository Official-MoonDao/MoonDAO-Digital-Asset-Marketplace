import LogoSmall from "../assets/LogoSmall";
const TrendingThumbnail = ({ img, name, holders, number, floor, link}) => {
  return (
    <article className="relative">
      <div className="bg-main-background h-[40px] w-[100px] z-50 rotate-[-32.17deg] absolute -left-8 -top-3"></div>
      <div className="bg-main-background h-[40px] w-[100px] z-50 rotate-[-32.17deg] absolute -right-8 -bottom-3"></div>
      <img className="w-[335px] h-[275px] object-cover object-center -z-20" src={img} alt={`${name} image.`} />
      <div className="bg-gradient-to-r  from-gray-900 via-gray-800 to-gray-700 relative z-10 bg-opacity-10 w-[335px] h-[162px] flex justify-between">
        <div className="pl-6 mt-5 flex flex-col items-start">
          <h6 className="text-lg font-bold">{name}</h6>
          <p className="mt-1 text-sm opacity-60 blend">{holders} owners</p>
          <p className="text-sm mt-5 opacity-70">Floor Price</p>
          <span className="flex items-center gap-2">
            <LogoSmall size={{ width: 10.54, height: 11.07 }} />
            {floor}
          </span>
        </div>
        <div className="mt-5  pr-6 flex flex-col items-end">
          <p className="font-bold text-lg">#{number}</p>
          <button className="mt-[50px] text-xs border-[0.5px] px-[10px] py-[6px] rounded-xl hover:bg-slate-900"><a href={link}>Details</a></button>
        </div>
      </div>
    </article>
  );
};

export default TrendingThumbnail;
