import Head from "next/head";

const defaultDescription =
  "The MoonDAO Digital Asset Marketplace is where people can buy or list digital assets (NFTs) for Mooney.";

export default function Metadata({
  title = "",
  description = defaultDescription,
  image,
}: any) {
  return (
    <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>{"Marketplace | " + title}</title>
      <link rel="icon" href="/favicon.png" />
      <meta name="description" content={description} />
      <meta name="theme-color" content="#125c26" />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:site" content="@OfficialMoonDAO" />
      <meta name="twitter:title" content="MoonDAO Marketplace" />
      <meta
        name="twitter:description"
        content="The MoonDAO Digital Asset Marketplace is where people can buy or list digital assets (NFTs) for Mooney."
      />
      {/* <meta
        name="twitter:image"
        content="https://collection-1.thirdweb.dev/og.png"
      /> */}
      <meta property="og:title" content="MoonDAO Marketplace" />
      <meta property="og:description" content="MoonDAO Marketplace" />
      {/* <meta
        property="og:image"
        content="https://collection-1.thirdweb.dev/og.png"
      /> */}
      <meta
        property="og:url"
        content="https://main--moondao-marketplace-test.netlify.app/"
      />
      <meta property="og:site_name" content="MoonDAO Marketplace" />
      <meta property="og:type" content="website" />
    </Head>
  );
}
