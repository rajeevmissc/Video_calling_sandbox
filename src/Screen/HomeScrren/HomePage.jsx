
import { useState, useEffect } from 'react';
import Header from '../../components/Header/Header';
import PromotionalSlider from './PromotionalBanner';
import HeroSection from './HeroSection';
import ServicesSection from './ServicesSection';
import TestimonialsSection from './TestimonialsSection';
import ExpertsSection from './ExpertsSection';
import { Helmet } from "react-helmet-async";
const Homepage = () => {
  const [isVisible, setIsVisible] = useState({});
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(prev => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('[id]').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <Helmet>
        <title>Your Human-Connection & Emotional Support Platform | GetCompanion</title>
        <meta
          name="description"
          content="Discover a platform designed to heal loneliness with private chats, audio/video calls, in-person sessions, and verified Happiness Executives ensuring confidentiality and care."
        />
        <meta name="keywords" content="emotional support platform India, loneliness therapy India, chat support service, video companionship, private conversation support, verified companions India" />
        <meta property="og:title" content="Your Emotional Support Platform" />
        <meta property="og:description" content="Reconnect with yourself through private chats, calls and in-person companionship sessions." />
        <meta property="og:image" content="https://res.cloudinary.com/dnnyay9oc/image/upload/v1764412256/GC_Logo_-_Black1.1_1_evfzjn.png" />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <Header />
        <main>
          <HeroSection isVisible={isVisible} />
          <ExpertsSection />
          <ServicesSection />
          <PromotionalSlider
            autoPlayDelay={2000}        // 2 seconds per slide
            showControls={true}         // Show navigation
            pauseOnHover={true}         // Pause on mouse hover
            infiniteLoop={true}         // Loop slides
          />
          <TestimonialsSection />
        </main>
      </div>
    </>
  );
};

export default Homepage;



