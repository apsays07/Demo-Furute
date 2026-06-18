import Navbar from "@/components/layout/Navbar";
import SiteFooter from "@/components/layout/SiteFooter";

import HeroSection from "./sections/HeroSection";
import ProofStrip from "./sections/ProofStrip";
import WhatWeDoSection from "./sections/WhatWeDoSection";
import ProgramsSection from "./sections/ProgramsSection";
import MentorSection from "./sections/MentorSection";
import ImpactSection from "./sections/ImpactSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import VideoSection from "@/components/home/VideoSection";
import { getTestimonials, getFeaturedVideos } from "@/lib/home";

import styles from "./page.module.css";

export const revalidate = 60;

export default async function Home() {
  const testimonials = await getTestimonials();
  const videos = await getFeaturedVideos();

  return (
    <main className={styles["home-page"]} id="home">
      <Navbar />
      <HeroSection />
      <ProofStrip />
      <WhatWeDoSection />
      <ProgramsSection />
      <MentorSection />
      <ImpactSection />
      <TestimonialsSection testimonials={testimonials} />
      <VideoSection videos={videos} />
      <SiteFooter backTo="#home" />
    </main>
  );
}
