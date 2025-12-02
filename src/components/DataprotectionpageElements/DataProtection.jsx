import React from "react";
import { Helmet } from "react-helmet-async";
const DataProtection = () => {
  return (
<>
 <Helmet>
        <title>Data Protection Policy | Your Privacy is Our Priority</title>
        <meta
          name="description"
          content="Learn how GetCompanion protects your personal data through encryption, privacy safeguards, and compliance with Indian IT laws."
        />
        <meta name="keywords" content="data protection India, privacy policy emotional support, secure platform India, data safety app" />
        <meta property="og:title" content="Your Data. Protected With Care." />
        <meta property="og:description" content="We follow strict compliance and security standards to safeguard your information" />
        <meta property="og:image" content="https://res.cloudinary.com/dnnyay9oc/image/upload/v1764412256/GC_Logo_-_Black1.1_1_evfzjn.png" />
        <meta property="og:type" content="website" />
      </Helmet>
    <div className="font-sans text-gray-800">

      {/* Hero Banner */}
      <div className="relative bg-gray-700 text-white text-center py-20">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{ backgroundImage: "url('/mnt/data/Intro.png')" }}
        ></div>

        <div className="relative">
          <h1 className="text-4xl font-bold">Data Protection Policy</h1>
          <p className="mt-3 text-lg opacity-90">
            For GetCompanion — Owned & Managed by VKSRS CARE PRIVATE LIMITED
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-6 py-12 space-y-12 leading-relaxed">

        {/* 1 – Intro */}
        <section>
          <h2 className="text-2xl font-bold mb-3">1. Introduction</h2>
          <p>
            The <strong>Data Protection Policy</strong> explains how 
            <strong> GetCompanion</strong> (a product of 
            <strong> VKSRS CARE PRIVATE LIMITED</strong>) handles your information.  
            We follow a strict <strong>minimal data collection model</strong> to ensure
            maximum privacy and user safety.
          </p>

          <p className="mt-4">
            We only collect what is absolutely necessary for account access 
            and in-person visit services.  
            We do <strong>NOT</strong> store chat messages, audio calls, or video calls.
          </p>
        </section>

        {/* 2 – What Data We Collect */}
        <section>
          <h2 className="text-2xl font-bold mb-4">2. What Data We Collect</h2>

          <h3 className="text-lg font-semibold">2.1 Basic Information</h3>
          <ul className="list-disc list-inside mt-2">
            <li>Mobile number (for login & verification)</li>
          </ul>

          <h3 className="text-lg font-semibold mt-5">2.2 In-Person Visit Information</h3>
          <p className="mt-2">Only used when you book an offline visit:</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Name (optional)</li>
            <li>Location / Visit address</li>
            <li>Preferred date & time</li>
          </ul>

          <h3 className="text-lg font-semibold mt-5">2.3 What We DO NOT Collect</h3>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li><strong>No chat messages stored</strong></li>
            <li><strong>No audio recordings stored</strong></li>
            <li><strong>No video recordings stored</strong></li>
            <li>No call logs of conversation content</li>
            <li>No personal files or photos are accessed</li>
          </ul>
        </section>

        {/* 3 – Why We Collect Data */}
        <section>
          <h2 className="text-2xl font-bold mb-4">3. Why We Collect This Data</h2>
          <p>The minimal data collected is only for:</p>

          <ul className="list-disc list-inside mt-3 space-y-2">
            <li>Verifying your account using mobile number</li>
            <li>Providing in-person visit services safely</li>
            <li>Contacting you for booking confirmation</li>
            <li>Ensuring platform safety & preventing misuse</li>
          </ul>
        </section>

        {/* 4 – How Data is Protected */}
        <section>
          <h2 className="text-2xl font-bold mb-4">4. How We Protect Your Data</h2>

          <h3 className="text-lg font-semibold">4.1 Encryption</h3>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Secure encrypted communication channels</li>
            <li>Secure OTP verification system</li>
          </ul>

          <h3 className="text-lg font-semibold mt-5">4.2 Infrastructure Safety</h3>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Protected servers & firewall systems</li>
            <li>No unauthorized employee access</li>
            <li>Regular security checks & audits</li>
          </ul>
        </section>

        {/* 5 – Data Sharing Policy */}
        <section>
          <h2 className="text-2xl font-bold mb-4">5. Data Sharing Policy</h2>

          <p className="mb-3">
            GetCompanion does <strong>NOT</strong> sell or share your personal data
            for marketing, promotion, or advertising.
          </p>

          <h3 className="text-lg font-semibold">We only share data when:</h3>
          <ul className="list-disc list-inside mt-2 space-y-2">
            <li>Required by law or court orders</li>
            <li>Needed to prevent fraud or safety risks</li>
            <li>Used for internal operations under strict privacy agreements</li>
          </ul>
        </section>

        {/* 6 – Data Retention */}
        <section>
          <h2 className="text-2xl font-bold mb-4">6. Data Retention</h2>
          <p>
            We store only what is required for providing the service:
          </p>

          <ul className="list-disc list-inside mt-3">
            <li>Mobile number (for login)</li>
            <li>In-person visit details (only for booking purpose)</li>
          </ul>

          <p className="mt-3">
            You may request deletion of your account and details anytime.
          </p>
        </section>

        {/* 7 – Your Rights */}
        <section>
          <h2 className="text-2xl font-bold mb-4">7. Your Rights</h2>

          <ul className="list-disc list-inside space-y-2">
            <li>Right to request deletion of your data</li>
            <li>Right to withdraw consent at any time</li>
            <li>Right to know what information we store</li>
            <li>Right to update or correct your details</li>
          </ul>
        </section>

        {/* 8 – Contact */}
        <section>
          <h2 className="text-2xl font-bold mb-4">8. Contact For Data Protection Queries</h2>
          <p>If you have any privacy concerns or data-related requests, contact:</p>

          <p className="font-semibold mt-3">
            VKSRS CARE PRIVATE LIMITED  
            <br />
            Email: getcompanion@outlook.com 
            <br />
            Phone: +91 7827105511  
            <br />
            India
          </p>
        </section>
      </div>
    </div>
    </>
  );
};

export default DataProtection;
