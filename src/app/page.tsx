import Navbar from "@/src/components/shared/Navbar";
import Hero from "@/src/components/modules/home/Hero";
import FeaturedEvents from "@/src/components/modules/home/FeaturedEvents";
import UpcomingEvents from "@/src/components/modules/home/UpcomingEvents";
import EventCategories from "@/src/components/modules/home/EventCategories";
import CTA from "@/src/components/modules/home/CTA";
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