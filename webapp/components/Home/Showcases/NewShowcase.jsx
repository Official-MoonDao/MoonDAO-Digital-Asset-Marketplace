import NewCollectionThumbnail from "./NewCollectionThumbnail";
import SectionHeader from "../../Layout/SectionHeader";
import CollectionPreview from "../../Collection/CollectionPreview";
{
  /*TODO: Add button for carousel*/
}

export default function NewShowcase({
  collections,
  validListings,
  validAuctions,
}) {
  //Add a skeleton here
  if (!collections) return <></>;

  return (
    <div className="mt-12 md:mt-16 md:mb-12  flex flex-col items-center">
      <SectionHeader title={"New collections"} />

      <section className="mt-10 md:mt-16 flex flex-col gap-10 md:grid md:grid-cols-2 md:grid-flow-row md:gap-12 xl:grid-cols-3 xl:gap-20">
        {collections
          .slice(collections.length <= 3 ? -collections.length : 0, 3)
          .map((collection, index) => (
            <NewCollectionThumbnail
              key={"new-collection-thumbnail-" + index}
              collection={collection}
              validListings={validListings}
              validAuctions={validAuctions}
            />
          ))}
      </section>
    </div>
  );
}
