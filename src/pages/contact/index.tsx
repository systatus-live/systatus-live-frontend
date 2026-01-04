import ContactForm from '@/components/ContactForm';
import Footer from '@/components/LandingPage/Footer';
import Navbar from '@/components/LandingPage/Navbar';
import Head from 'next/head';

export default function Contact() {
  return (
    <>
      <Head>
        <title>Contato • Systatus.Live</title>
      </Head>
      <Navbar />
      <ContactForm />
      <Footer />
    </>
  )
}