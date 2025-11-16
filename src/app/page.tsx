import Navbar from "@/components/LandingPage/Navbar";
import Hero from "@/components/LandingPage/Hero";
import Features from "@/components/LandingPage/Features";
import Integrations from "@/components/LandingPage/Integrations";
import Pricing from "@/components/LandingPage/Pricing";
import Footer from "@/components/LandingPage/Footer";
import { PrimeReactProvider } from 'primereact/api';

export default function Home() {
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
