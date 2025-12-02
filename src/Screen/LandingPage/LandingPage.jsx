
import LovenlyBackground from './LovenlyBackground';
import WelcomeSection from './WelcomeSection';
import EmotionalSafeSpace from './EmotionalSafeSpace';
import RealFaceSection from './RealFacesSection';
import CorePromise from './CorePromise';
import HowItWorks from './HowItWorks';
import TestimonialsSection from '../HomeScrren/TestimonialsSection';
import OurPromise from './OurPromise';
import HeroSection from './HeroSection';
import StatsSection from './StatesData';
import { Helmet } from "react-helmet-async";
const LandingPage = () => {
  return (
    <>
      <Helmet>
        <title>GetCompanion | Fight Loneliness with Real Human Companionship</title>
        <meta
          name="description"
          content="India’s first emotional-wellbeing and companionship platform offering real conversations, emotional support, and meaningful human connection"
        />
        <meta name="keywords" content="loneliness help India,companionship services India,talk to someone online India.emotional support service,hire a companion India
           senior companionship India,someone to talk to,emotional wellbeing support,stress support India,mental wellness companion,
           companionship services India, talk to someone online India, loneliness help India, emotional support chat India, friendly conversation platform, non-judgmental listener India, instant companion chat, video call companion India, hire a companion India, human connection service, emotional wellbeing support, someone to talk to at night India, virtual friend India, conversation support India, digital companionship India, talk to humans online, emotional bonding platform, Delhi companionship, Bangalore loneliness support, Gurgaon talk service, Mumbai emotional support calls, senior companionship India, emotional support for professionals, breakup support India, stress companionship service
           " />
        <meta property="og:title" content="Talk to Someone Online | Live Companionship & Emotional Support India – GetCompanion" />
        <meta property="og:description" content="Feeling lonely, stressed or emotionally overwhelmed? Connect instantly with verified, friendly companions on GetCompanion for confidential conversations, support, and human connection across India" />
        <meta property="og:image" content="https://res.cloudinary.com/dnnyay9oc/image/upload/v1764412256/GC_Logo_-_Black1.1_1_evfzjn.png" />
        <meta property="og:type" content="website" />
      </Helmet>

      <div>
        <HeroSection />
        <WelcomeSection />
        <LovenlyBackground />
        <EmotionalSafeSpace />
        <RealFaceSection />
        <CorePromise />
        <HowItWorks />
        <TestimonialsSection />
        {/* <StatsSection /> */}
        <OurPromise />
      </div>
    </>
  );
};

export default LandingPage;

