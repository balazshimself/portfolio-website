"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import { Footer } from "@/components/ui/modules";
import styles from "./page.module.scss";

const Scene = dynamic(() => import("@/webgl/Scene"), { ssr: false });

export function Layout({ children }) {
  const ref = useRef(null);

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
        <div className={styles.page}>
          <Scene />
        </div>
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
