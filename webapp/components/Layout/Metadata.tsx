import Head from "next/head";

const defaultDescription =
  "The MoonDAO Digital Asset Marketplace is where people can buy or list digital assets (NFTs) for Mooney.";

interface MetadataProps {
  title?: string;
  description?: string;
  image?: string;
}

export default function Metadata({
  title = "",
  description = defaultDescription,
  image = "/screenshot.png",
}: MetadataProps) {
  return (
    <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>{"Marketplace | " + title}</title>
      <link rel="icon" href="/favicon.ico" />
      <meta name="description" content={description} />
      <meta name="theme-color" content="#090013" />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:site" content="@OfficialMoonDAO" />
      <meta name="twitter:title" content={"MoonDAO Marketplace | " + title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta property="og:title" content={"MoonDAO Marketplace | " + title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta
        property="og:url"
        content="https://main--moondao-marketplace-test.netlify.app/"
      />
      <meta property="og:site_name" content="MoonDAO Marketplace" />
      <meta property="og:type" content="website" />
    </Head>
  );
}
