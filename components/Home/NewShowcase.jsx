import NewCollectionThumbnail from '../NewCollectionThumbnail'
export default function NewShowcase() {
  return (
    <div className="mt-10 flex flex-col items-center">
      <h2 className="font-GoodTimes text-xl tracking-wide">New collections</h2>
      <div className='mt-9 flex flex-col items-center'>
        <NewCollectionThumbnail name={"Lorem Ipsum"} creator={"Cryptic Clan"} img={"/newcollectiondemo.png"}/>
        <div className="mt-8 flex gap-5">
          <button className="w-11 h-1 bg-white opacity-20 rounded"></button>
          <button className="w-11 bg-moon-secondary rounded"></button>
          <button className="w-11 h-1 bg-white opacity-20 rounded"></button>
          <button className="w-11 h-1 bg-white opacity-20 rounded"></button>
        </div>
      </div>
    </div>
  );
}
