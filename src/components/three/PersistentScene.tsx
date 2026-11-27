"use client";

import dynamic from "next/dynamic";

const PersistentSceneCanvas = dynamic(() => import("./PersistentSceneCanvas"), {
  ssr: false,
  loading: () => (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_75%_25%,rgba(91,140,255,0.14),transparent_55%),radial-gradient(ellipse_at_25%_80%,rgba(155,107,255,0.1),transparent_50%)]"
    />
  ),
});

export function PersistentScene() {
  return <PersistentSceneCanvas />;
}
