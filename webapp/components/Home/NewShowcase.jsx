import NewCollectionThumbnail from "../NewCollectionThumbnail";
import SectionHeader from "../SectionHeader";

{
  /*TODO: Add button for carousel*/
}

export default function NewShowcase({
  collections,
  validListings,
  validAuctions,
}) {
  if (!collections) return <></>;
  return (
    <div className="mt-12 md:mt-16 md:mb-12  flex flex-col items-center">
      <SectionHeader title={"New collections"} />
      <div className="mt-9 flex flex-col items-center lg:hidden">
        <NewCollectionThumbnail
          collection={collections[0]}
          validListings={validListings}
          validAuctions={validAuctions}
        />
      </div>
      <div className="hidden mt-12 lg:flex gap-5">
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
        {collections.length >= 4 && (
          <div className="hidden xl:block">
            <NewCollectionThumbnail
              key={"new-collection-thumbnail-" + 3}
              collection={collections[3]}
              validListings={validListings}
              validAuctions={validAuctions}
            />
          </div>
        )}
      </div>
    </div>
  );
}
