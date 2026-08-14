"use client";

import { useEffect, useRef } from "react";

export function PointerHalo() {
  const haloRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const halo = haloRef.current;

    if (!halo || !finePointer.matches || reducedMotion.matches) return;

    let frame = 0;
    let nextX = -120;
    let nextY = -120;

    const render = () => {
      halo.style.transform = `translate3d(${nextX}px, ${nextY}px, 0)`;
      frame = 0;
    };

    const handlePointerMove = (event: PointerEvent) => {
      nextX = event.clientX;
      nextY = event.clientY;
      halo.dataset.visible = "true";

      if (!frame) frame = window.requestAnimationFrame(render);
    };

    const handlePointerLeave = () => {
      halo.dataset.visible = "false";
    };

    window.addEventListener("pointermove", handlePointerMove, {
      passive: true,
    });
    document.documentElement.addEventListener("mouseleave", handlePointerLeave);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", handlePointerMove);
      document.documentElement.removeEventListener(
        "mouseleave",
        handlePointerLeave,
      );
    };
  }, []);

  return <div aria-hidden="true" className="pointer-halo" ref={haloRef} />;
}
