"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function Home() {
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
        <div
          className="fixed z-[1000]"
          style={{
            top: "50%",
            left: "3%",
            transform: "translateY(-50%)",
            display: "flex",
            flexDirection: "column",
            gap: 0,
            color: "white",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "1em",
              fontWeight: "bold",
              fontSize: "1.2em",
            }}
          >
            <Badge variant="secondary" className="badge">
              mesh. builder
            </Badge>
            <Badge variant="secondary">dev at Techstars 24' Voovo</Badge>
          </div>
          <span
            style={{
              fontSize: "100px",
              fontFamily: "'Robot Crush', sans-serif",
              margin: 0,
              lineHeight: 1,
            }}
          >
            balazshimself
          </span>
          <div
            style={{
              display: "flex",
              gap: "1em",
              fontSize: "34px",
              whiteSpace: "nowrap",
              fontWeight: "bold",
              margin: 0,
              lineHeight: 1,
            }}
          >
            <span>ML ENGINEER</span>
            <span>SOFTWARE DEVELOPER</span>
          </div>
          <div
            style={{
              fontSize: "2em",
              display: "inline-block",
              width: "fit-content",
              margin: 0,
              lineHeight: 1,
            }}
          >
            I am Balázs, a 22 yo. developer based in Budapest
          </div>

          <div
            style={{
              display: "flex",
              gap: "1em",
              fontWeight: "bold",
              fontSize: "1.2em",
            }}
          >
            <Button
              onClick={() => {
                console.log("hello");
              }}
            >
              Contact Me
            </Button>
            <Button onClick={() => router.push("/about")}>About Me</Button>
          </div>
        </div>
      </div>
    </>
  );
}
