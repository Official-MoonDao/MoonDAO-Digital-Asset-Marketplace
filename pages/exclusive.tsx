import { SkyboxGenerator } from "../components/Blockade/SkyboxGenerator";
import Container from "../components/Container/Container";

export default function Exclusive() {
  return (
    <Container maxWidth="lg" className="h-[70vh]">
      <SkyboxGenerator />
    </Container>
  );
}
