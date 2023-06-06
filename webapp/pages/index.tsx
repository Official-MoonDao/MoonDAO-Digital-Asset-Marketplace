import type { NextPage } from "next";
import Hero from "../components/Home/Hero";
import CollectionShowcase from "../components/Home/CollectionShowcase";
import TrendingShowcase from "../components/Home/TrendingShowcase";
import NewShowcase from "../components/Home/NewShowcase";

const Home: NextPage = () => {
  return (
    <main className="flex flex-col items-center px-6 md:px-10">
      <Hero />
      <CollectionShowcase />
      <TrendingShowcase />
      <NewShowcase />
    </main>
  );
};

export default Home;
