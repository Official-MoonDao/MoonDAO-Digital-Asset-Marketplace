import LogoSmall from "../assets/LogoSmall";

const NewCollectionThumbnail = ({ img, name, floor }) => {
  return (
    <article className="relative flex flex-col items-center hover:scale-[1.035] group transition-all duration-150">
      {/*Here goes the collection link*/}
      <a href="">
        <img className="z-10 w-[300px] h-[235px] object-cover rounded-t-[6px] rounded-b-[15px]" src={img} alt={`${name} collection thumbnail`} />
        <div className="-mt-3 border border-stone-900 w-[300px] h-[100px] flex flex-col items-center text-center rounded-md">
          <h6 className="mt-7 tracking-widest group-hover:text-indigo-500">{name}</h6>

          <p className="mt-[7px] text-sm opacity-50 flex items-center">
            Floor
            <span className="ml-[14px] flex items-center gap-[6px] opacity-100">
              <LogoSmall size={{ height: 11.07, width: 10.54 }} />
              {floor}
            </span>
          </p>
        </div>
      </a>
    </article>
  );
};

export default NewCollectionThumbnail;
