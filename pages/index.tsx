import type { NextPage } from "next";
import Container from "../components/Container/Container";
import { useState } from "react";
const Home: NextPage = () => {
  const [prompt, setPrompt] = useState("");
  const [generation, setGeneration]: any = useState({});
  return (
    <Container maxWidth="lg" className="h-[70vh]">
      <div></div>
    </Container>
  );
};

export default Home;
