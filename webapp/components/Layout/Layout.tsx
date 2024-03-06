import { Toaster } from "react-hot-toast";
import Footer from "./Footer";
import { Navbar } from "./Navbar/Navbar";

export default function Layout({ children }: any) {
  return (
    <div id="app-layout">
      <Navbar />
      <Toaster position="bottom-center" reverseOrder={false} />
      {children}
      <Footer />
    </div>
  );
}
