import React from "react";
import ContactFrom from "./contactFrom";
import FAQ from "./FAQsection";
import { Helmet } from "react-helmet-async";

const HomePage = () => {
  return (
    <>
     <Helmet>
        <title>Contact Us | GetCompanion Support Team</title>
        <meta
          name="description"
          content="Need help with your account, services or bookings? Contact our 24-hour support team for quick assistance"
        />
        <meta name="keywords" content="contact emotional support India, GetCompanion help, customer support companionship app, service help India" />
        <meta property="og:title" content="GetCompanion Support Team" />
        <meta property="og:description" content="We’re here to help you with queries related to bookings, services, and emotional support sessions." />
        <meta property="og:image" content="https://res.cloudinary.com/dnnyay9oc/image/upload/v1764412256/GC_Logo_-_Black1.1_1_evfzjn.png" />
        <meta property="og:type" content="website" />
      </Helmet>
    <div>
      <ContactFrom />
      <FAQ />
    </div>
     </>
  );
};

export default HomePage;



