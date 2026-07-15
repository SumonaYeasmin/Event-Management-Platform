import Navbar from "@/src/components/shared/Navbar";
import Hero from "@/src/components/home/Hero";
import FeaturedEvents from "@/src/components/home/FeaturedEvents";
import UpcomingEvents from "@/src/components/home/UpcomingEvents";
import EventCategories from "@/src/components/home/EventCategories";
import CTA from "@/src/components/home/CTA";
import Footer from "@/src/components/shared/Footer";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <Hero />
      <EventCategories />
      <FeaturedEvents />
      <UpcomingEvents />
      <CTA />
      <Footer />
    </>
  );
}