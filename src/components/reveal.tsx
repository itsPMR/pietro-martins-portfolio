"use client";

import { LazyMotion, m, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

const loadMotionFeatures = () =>
  import("@/lib/motion-features").then((module) => module.default);

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

export function Reveal({ children, className, delay = 0 }: RevealProps) {
  const shouldReduceMotion = useReducedMotion();
  const canAnimate = shouldReduceMotion === false;

  return (
    <LazyMotion features={loadMotionFeatures} strict>
      <m.div
        className={className}
        initial={
          canAnimate ? { clipPath: "inset(0 0 12% 0)", opacity: 0 } : false
        }
        transition={{
          delay: canAnimate ? delay : 0,
          duration: canAnimate ? 0.7 : 0,
          ease: [0.22, 1, 0.36, 1],
        }}
        viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
        whileInView={{ clipPath: "inset(0 0 0 0)", opacity: 1 }}
      >
        {children}
      </m.div>
    </LazyMotion>
  );
}
