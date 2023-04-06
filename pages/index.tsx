import type { NextPage } from "next";
import Link from "next/link";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import Scene from "../components/Home/Scene";
import Container from "../components/Container/Container";
import { Canvas } from "@react-three/fiber";
const Home: NextPage = () => {
  return (
    <Container maxWidth="lg" className="h-[70vh]">
      <Scene />
    </Container>
  );
};

export default Home;
