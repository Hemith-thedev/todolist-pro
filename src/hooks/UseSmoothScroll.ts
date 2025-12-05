import Lenis from "lenis";

const UseSmoothScroll = () => {
  const lenis = new Lenis();
  function raf(time: number) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);
}

export default UseSmoothScroll;