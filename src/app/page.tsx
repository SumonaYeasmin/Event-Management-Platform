import Hero from "@/src/components/home/Hero";
import FeaturedEvents from "@/src/components/home/FeaturedEvents";
import UpcomingEvents from "@/src/components/home/UpcomingEvents";
import EventCategories from "@/src/components/home/EventCategories";
import CTA from "@/src/components/home/CTA";

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedEvents />
      <UpcomingEvents />
      <EventCategories />
      <CTA />
    </>
  );
}