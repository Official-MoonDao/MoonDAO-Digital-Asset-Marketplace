import { useContract, useMetadata } from "@thirdweb-dev/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import randomColor from "../../util/randomColor";
export default function CollectionPreview({ collection }: any) {
  const [collectionDetails, setCollectionDetails] = useState<any>({
    name: "",
    symbol: "",
  });

  const { contract: collectionContract } = useContract(collection[2]);
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
    <div className={"flex flex-col p-4 gap-2"}>
      <Link href={`/collection/${collection[2]}`}>
        {metadata?.image ? (
          <Image
            className="w-[20vw] h-[20vw] rounded-md"
            src={metadata.image}
            width={300}
            height={300}
            alt=""
          />
        ) : (
          <div
            style={{
              backgroundImage: `linear-gradient(90deg, ${randomColor()}, ${randomColor()})`,
              height: "20vw",
              width: "20vw",
            }}
          />
        )}
      </Link>
      <p className="">{collectionDetails.name}</p>
    </div>
  );
}
