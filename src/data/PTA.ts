import { TargetAndTransition } from "framer-motion";

const initial: TargetAndTransition = {
  opacity: 0,
  x: "-100%",
  transition: {
    duration: 0.5,
    ease: "easeInOut",
  }
}

const animate: TargetAndTransition = {
  opacity: 1,
  x: "-0%",
  transition: {
    duration: 0.5,
    ease: "easeInOut",
  }
}

const exit: TargetAndTransition = {
  opacity: 0,
  x: "100%",
  transition: {
    duration: 0.5,
    ease: "easeInOut",
  }
}

export const PTA = {
  initial,
  animate,
  exit
}