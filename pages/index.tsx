import type { NextPage } from "next";
import Link from "next/link";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import Scene from "../components/Blockade/Scene";
import Container from "../components/Container/Container";
import { Canvas } from "@react-three/fiber";
import { useState } from "react";
import { createSkybox, getSkyboxById } from "../lib/blockade-labs";
import { SkyboxGenerator } from "../components/Blockade/SkyboxGenerator";
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
