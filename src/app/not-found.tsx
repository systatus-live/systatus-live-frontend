"use client"

import animation from "@/utils/not-found-animation.json";
import Lottie from "lottie-react";
import Link from "next/link";
import { Button } from "primereact/button";

export default function NotFound() {
  return (
    <div className="flex items-center justify-center h-screen flex-col">
      <div style={{ width: "25rem", height: "25rem", position: "relative" }}>
        <Lottie animationData={animation} loop={true} width={"100%"} />
      </div>
      <Link href="/"><Button label="Home"></Button></Link>
    </div>
  )
}