import type { NextPage } from "next";
import Hero from "../components/Home/Hero";
import CollectionShowcase from "../components/Home/CollectionShowcase";
import TrendingShowcase from "../components/Home/TrendingShowcase";
import NewShowcase from "../components/Home/NewShowcase";
import Footer from "../components/Footer";

const Home: NextPage = () => {
  return (
    <div className="flex flex-col items-center px-6 md:px-10">
      <Hero />
      <CollectionShowcase />
      <TrendingShowcase />
      <NewShowcase />
      <Footer />
    </div>
  );
};

export default Home;
