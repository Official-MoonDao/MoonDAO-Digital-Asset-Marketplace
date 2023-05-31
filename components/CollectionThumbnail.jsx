import LogoSmall from "../assets/LogoSmall";

const CollectionThumbnail = ({ id, img, name, floor, volume, change }) => {
  return (
    <a href="">
      {/*Collection link goes on top*/}
      <article className="flex items-center lg:hover:bg-gradient-to-br from-slate-700 to-indigo-700 transition-all duration-150 lg:rounded-xl lg:px-3 lg:py-2 xl:py-3 xl:px-4">
        <div className="flex items-center gap-2 md:gap-3 lg:gap-6">
          <p className="font-bold text-lg">{id}</p>
          <img src={img} alt={`${name} collection image`} className="w-20 h-20 rounded-full object-cover" />
        </div>
        <div className="ml-2 md:ml-4 flex flex-col">
          <h6 className="font-bold lg:text-lg">{name}</h6>
          <p className="mt-2 text-sm flex items-center">
            Floor{" "}
            <span className="ml-2 flex items-center gap-1">
              <LogoSmall size={{ width: 10.54, height: 11.07 }} />
              {floor}
            </span>
          </p>
        </div>
        <div className="ml-3 md:ml-7 lg:ml-14 flex flex-col items-end">
          <p className={`${change < 0 ? "text-amber-600" : "text-emerald-500"} text-lg font-bold`}>
            {change < 0 ? "" : "+"}
            {change}%
          </p>
          <p className="mt-2 text-sm flex items-center gap-1">
            <LogoSmall size={{ width: 10.54, height: 11.07 }} /> {volume}k
          </p>
        </div>
      </article>
    </a>
  );
};

export default CollectionThumbnail;
