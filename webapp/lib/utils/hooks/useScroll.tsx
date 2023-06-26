import { useEffect, useState } from "react";
type ScrollProps = {
  scrollX: number;
  scrollY: number;
};
export function useScroll() {
  const [scroll, setScroll] = useState<ScrollProps>({ scrollX: 0, scrollY: 0 });
  function handleScroll() {
    setScroll({ scrollX: window.scrollX, scrollY: window.scrollY });
  }

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return scroll;
}
