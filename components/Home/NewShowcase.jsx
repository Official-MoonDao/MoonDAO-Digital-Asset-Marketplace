import NewCollectionThumbnail from "../NewCollectionThumbnail";
import SectionHeader from "../SectionHeader";

{/*TODO: Add button for carousel*/}

export default function NewShowcase() {
  return (
    <div className="mt-12 md:mt-16 md:mb-12  flex flex-col items-center">
      <SectionHeader title={"New collections"} />
      <div className="mt-9 flex flex-col items-center lg:hidden">
        <NewCollectionThumbnail name={"Lorem Ipsum"} floor={"20,000"} img={"/newthumbnail.png"} />
      </div>
      <div className="hidden mt-12 lg:flex gap-5">
          <NewCollectionThumbnail name={"Lorem Ipsum"} floor={"20,000"} img={"/newthumbnail.png"} />
          <NewCollectionThumbnail name={"Lorem Ipsum"} floor={"20,000"} img={"/newthumbnail2.png"} />
          <NewCollectionThumbnail name={"Lorem Ipsum"} floor={"20,000"} img={"/newthumbnail3.png"} />
          <div className="hidden xl:block">

          <NewCollectionThumbnail name={"Lorem Ipsum"} floor={"20,000"} img={"/newthumbnail4.png"} />
          </div>
        </div>
    </div>
  );
}
