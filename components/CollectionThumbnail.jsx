import LogoSmall from "../assets/LogoSmall";

const CollectionThumbnail = ({ id, img, name, floor, volume, change }) => {
  return (
    <article className="flex items-center">
      <div className="flex items-center gap-2">
        <p className="font-bold text-lg">{id}</p>
        <img src={img} alt={`${name} collection image`} className="w-20 h-20 rounded-full object-cover" />
      </div>
      <div className="ml-2 flex flex-col">
        <h6 className="font-bold">{name}</h6>
        <p className="mt-2 text-sm flex items-center">
          Floor <span className="ml-2 flex items-center gap-1">
            <LogoSmall size={{ width: 10.54, height: 11.07 }} />
          {floor}
            
            </span>
        </p>
      </div>
      <div className="ml-3 flex flex-col items-end">
        <p className={`${change < 0 ? "text-red-600" : "text-emerald-500"} text-lg font-bold`}>
          {change < 0 ? "" : "+"}
          {change}%
        </p>
        <p className="mt-2 text-sm flex items-center gap-1"><LogoSmall size={{ width: 10.54, height: 11.07 }} /> {volume}k</p>
      </div>
    </article>
  );
};

export default CollectionThumbnail;
