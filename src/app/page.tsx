import Features from "@/components/LandingPage/Features";
import Footer from "@/components/LandingPage/Footer";
import Hero from "@/components/LandingPage/Hero";
import Integrations from "@/components/LandingPage/Integrations";
import Navbar from "@/components/LandingPage/Navbar";
import Pricing from "@/components/LandingPage/Pricing";

export default function Home() {
  return (
    <div>
      <Navbar />
      <Hero />
      <Features />
      <Integrations />
      <Pricing />
      <Footer />
    </div>
  );
}
