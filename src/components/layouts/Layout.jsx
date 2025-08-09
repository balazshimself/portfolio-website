"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/ui/modules";

const Scene = dynamic(() => import("@/webgl/Scene"), { ssr: false });

export function Layout({ children }) {
  const ref = useRef(null);
  const router = useRouter();

  return (
    <>
      <div
        ref={ref}
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          overflow: "auto",
          touchAction: "auto",
        }}
      >
        {children}
        <Scene />
      </div>
      <Footer
        size={50}
        style={{
          color: "white",
          position: "fixed",
          bottom: "2rem",
          left: "3rem",
          width: "100vw",
          zIndex: 1001,
        }}
      />
    </>
  );
}
