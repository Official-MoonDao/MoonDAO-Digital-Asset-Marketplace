import { useContract, useMetadata } from "@thirdweb-dev/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import randomColor from "../../util/randomColor";
import LogoSmall from "../../assets/LogoSmall";

//TODO: figure out a way to show the real FLOOR price of a collection, showing template value right now
export default function CollectionPreview({ collection }: any) {
  const [collectionDetails, setCollectionDetails] = useState<any>({
    name: "",
    symbol: "",
  });

  const { contract: collectionContract } = useContract(collection.assetContract);
  const { data: metadata } = useMetadata(collectionContract);

  useEffect(() => {
    console.log(metadata);
    console.log(collectionContract);
  }, [metadata]);

  useEffect(() => {
    if (collectionContract)
      (async () => {
        const name = await collectionContract?.call("name");
        const symbol = await collectionContract?.call("symbol");
        console.log(name);
        setCollectionDetails({ name, symbol });
      })();
  }, [collection, collectionContract]);

  return (
    <article className="relative flex flex-col group items-center hover:scale-[1.035] group transition-all duration-150">
      <Link className="flex flex-col group items-center" href={`/collection/${collection.assetContract}`}>
        {metadata?.image ? (
          <Image
            className="z-10 w-[300px] h-[235px] object-cover rounded-t-[6px] rounded-b-[15px] group-hover:ring ring-indigo-200"
            src={metadata.image}
            width={300}
            height={235}
            alt={`${collectionDetails.name} collection thumbnail`}
          />
        ) : (
          <div
            className="z-10 w-[300px] h-[235px] object-cover rounded-t-[6px] rounded-b-[15px] group-hover:ring ring-indigo-200"
            style={{
              backgroundImage: `linear-gradient(90deg, ${randomColor()}, ${randomColor()})`,
            }}
          />
        )}

        <div className="-mt-3 border border-stone-600 group-hover:border-stone-400 w-[300px] lg:w-[350px] h-[100px] flex flex-col items-center text-center rounded-md">
          <h6 className="mt-7 tracking-widest text-indigo-200 group-hover:text-white max-w-[250px] lg:max-w-[320px] text-center truncate">
            {collectionDetails.name}
          </h6>

          <p className="mt-[7px] text-sm flex items-center">
            <span className="opacity-60">Floor</span>
            <span className="ml-[14px] flex items-center gap-[6px]">
              <LogoSmall size={{ height: 11.07, width: 10.54 }} />
              {"20000"}
            </span>
          </p>
        </div>
      </Link>
    </article>
  );
}