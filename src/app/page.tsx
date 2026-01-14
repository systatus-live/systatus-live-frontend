"use client";

import Features from "@/components/LandingPage/Features";
import Footer from "@/components/LandingPage/Footer";
import Hero from "@/components/LandingPage/Hero";
import Integrations from "@/components/LandingPage/Integrations";
import Navbar from "@/components/LandingPage/Navbar";
import Pricing from "@/components/LandingPage/Pricing";
import { PrimeReactProvider } from 'primereact/api';
import * as cowsay from "cowsay";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    console.log(cowsay.say({
      text: "👀 Olá, dev!\nCaso encontre algo estranho (além deste aviso), conte pra gente em\nhttps://systatus.live/contact"
    }))
  }, []);

  return (
    <PrimeReactProvider>
      <Navbar />
      <Hero />
      <Features />
      <Integrations />
      <Pricing />
      <Footer />
    </PrimeReactProvider>
  );
}
