"use client";

import Features from "@/components/LandingPage/Features";
import Footer from "@/components/LandingPage/Footer";
import Hero from "@/components/LandingPage/Hero";
import HowItWorks from "@/components/LandingPage/HowItWorks";
import Integrations from "@/components/LandingPage/Integrations";
import Navbar from "@/components/LandingPage/Navbar";
import Pricing from "@/components/LandingPage/Pricing";
import { GlobalProvider } from "@/providers/GlobalProvider";
import * as cowsay from "cowsay";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    console.info(cowsay.say({ text: "Olá, dev!\nCaso encontre algo estranho neste site\n(além deste aviso), conte pra gente em\nhttps://systatus.live/contact" }), "\n^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^");
  }, []);

  return (
    <GlobalProvider>
      <Navbar />
      <Hero />
      <HowItWorks />
      <Features />
      <Integrations />
      <Pricing />
      <Footer />
    </GlobalProvider>
  );
}
