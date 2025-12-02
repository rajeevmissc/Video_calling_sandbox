import React, { useState, useEffect } from 'react';
import Whitelogo from "../Logos/SVG/White.svg";
import {
  Mail,
  Phone,
  Clock,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Heart,
  Shield,
  Award,
  Users,
  ArrowUp,
  Send,
  Star,
  CheckCircle
} from 'lucide-react';
import { useNavigate } from "react-router-dom";
const Footer = () => {
  const [email, setEmail] = useState('');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [hoveredService, setHoveredService] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navi = () => {
    navigate("/home"); // This will navigate to the Home page
  };


  const footerLinks = {
    quickLinks: [
      { name: "Contact Us", href: "/contact-us", icon: Mail },
      { name: "Privacy Policy", href: "/privacy-policy", icon: Shield },
      { name: "Terms & Conditions", href: "/terms-and-conditions", icon: Users },
      { name: "Feedback", href: "/feedback", icon: Star }
    ],
   services: [
  {
    name: "In-Person Visit",
    href: "/services",
    type: "visit",
    description: "Meet our Happiness Executive in person for support, activities, and meaningful engagement."
  },
  {
    name: "Discreet Chat",
    href: "/services",
    type: "chat",
    description: "Connect with a Happiness Executive through seamless text-based conversations anytime."
  },
  {
    name: "Discreet Audio call",
    href: "/services",
    type: "call",
    description: "Talk with a Happiness Executive via clear audio for real-time emotional support."
  },
  {
    name: "Discreet Video Call",
    href: "/services",
    type: "video",
    description: "Talk with a Happiness Executive via clear video for real-time emotional support."
  }
],


    support: [
      { name: "Help Center", href: "/contact-us", icon: CheckCircle },
      { name: "FAQs", href: "/faq", icon: CheckCircle },
    ]
  };

  const socialLinks = [
    { name: "Facebook", icon: Facebook, href: "#", color: "hover:text-blue-500" },
    { name: "Instagram", icon: Instagram, href: "https://share.google/eRqYno2YYjNEXqcRK", color: "hover:text-pink-500" },
    { name: "LinkedIn", icon: Linkedin, href: "#", color: "hover:text-blue-600" },
    { name: "YouTube", icon: Youtube, href: "#", color: "hover:text-red-500" }
  ];


  const handleServiceClick = (serviceType) => {
  // onServiceSelect?.({
  //   type: serviceType,
  //   timestamp: new Date().toISOString()
  // });

  navigate("/services", {
    state: {
      serviceType,
      timestamp: new Date().toISOString()
    }
  });
};



  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-32 right-20 w-24 h-24 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-1/3 w-20 h-20 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>
      {/* Main Footer Content */}
      <div className="relative py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6 sm:gap-8 mb-8 sm:mb-12">

            {/* Company Info - Enhanced */}
            <div className="sm:col-span-2 lg:col-span-2">
              <div className="group">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="relative">
                    <img src={Whitelogo} alt="ServiceConnect Logo" className="h-10 sm:h-12 relative" />
                  </div>
                </div>
                <h1 className="text-2xl font-bold mt-4 mb-8 text-white-800"> You deserve to be heard. Let's start new experience. </h1>
                <button
                  onClick={navi}
                  className="group bg-white text-gray-800 border border-gray-300 px-4 py-2 rounded-lg text-sm shadow-sm hover:shadow-md transition-all flex items-center gap-2"
                >
                  Get Started
                  <span className="transition-all transform translate-x-0 opacity-0 group-hover:translate-x-1 group-hover:opacity-100">
                    →
                  </span>
                </button>



                {/* Contact Info with Icons */}
                <div className="space-y-3 mb-6 mt-6">
                  <div className="flex items-center space-x-3 group cursor-pointer">
                    <div className="p-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg group-hover:scale-110 transition-transform duration-300">
                      <Mail size={16} className="text-white" />
                    </div>
                    <span className="text-gray-400 group-hover:text-white transition-colors duration-300">
                      getcompanion@outlook.com
                    </span>
                  </div>

                  <div className="flex items-center space-x-3 group cursor-pointer">
                    <div className="p-2 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg group-hover:scale-110 transition-transform duration-300">
                      <Phone size={16} className="text-white" />
                    </div>
                    <span className="text-gray-400 group-hover:text-white transition-colors duration-300">
                      +917827105511
                    </span>
                  </div>
                </div>

                {/* Social Media Links */}
                <div className="flex space-x-3">
                  {socialLinks.map((social, index) => {
                    const IconComponent = social.icon;
                    return (
                      <a
                        key={social.name}
                        href={social.href}
                        className={`p-3 bg-gray-800 hover:bg-gray-700 rounded-xl transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 ${social.color}`}
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <IconComponent size={20} />
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Quick Links - Enhanced */}
            <div className="transform hover:scale-105 transition-transform duration-300">
              <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                <div className="w-1 h-6 bg-gradient-to-b from-indigo-500 to-purple-500 rounded"></div>
                <span>Quick Links</span>
              </h3>
              <ul className="space-y-3 text-gray-400 text-sm sm:text-base">
                {footerLinks.quickLinks.map((link, index) => {
                  const IconComponent = link.icon;
                  return (
                    <li key={index} style={{ animationDelay: `${index * 100}ms` }}>
                      <a
                        href={link.href}
                        className="group flex items-center space-x-3 hover:text-white transition-all duration-300 transform hover:translate-x-2"
                      >
                        <IconComponent size={16} className="text-indigo-500 group-hover:scale-110 transition-transform duration-300" />
                        <span>{link.name}</span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Services - Enhanced with Tooltips */}
            <div className="transform hover:scale-105 transition-transform duration-300">
              <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                <div className="w-1 h-6 bg-gradient-to-b from-purple-500 to-pink-500 rounded"></div>
                <span>Services</span>
              </h3>
            <ul className="space-y-3 text-gray-400 text-sm sm:text-base">
  {footerLinks.services.map((service, index) => (
    <li
      key={index}
      className="relative"
      style={{ animationDelay: `${index * 100}ms` }}
      onMouseEnter={() => setHoveredService(index)}
      onMouseLeave={() => setHoveredService(null)}
    >
      <button
        onClick={() => handleServiceClick(service.type)}
        className="group flex items-center space-x-3 hover:text-white transition-all duration-300 transform hover:translate-x-2 text-left w-full"
      >
        <div className="w-2 h-2 bg-purple-500 rounded-full group-hover:scale-150 transition-transform duration-300"></div>
        <span>{service.name}</span>
      </button>

      {/* Tooltip */}
      {hoveredService === index && (
        <div className="absolute left-0 bottom-full mb-2 px-3 py-2 bg-gray-800 rounded-lg text-xs text-white shadow-lg border border-gray-700 whitespace-nowrap z-10 animate-fadeIn">
          {service.description}
          <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
        </div>
      )}
    </li>
  ))}
</ul>

            </div>

            {/* Support - Enhanced */}
            <div className="transform hover:scale-105 transition-transform duration-300">
              <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                <div className="w-1 h-6 bg-gradient-to-b from-pink-500 to-rose-500 rounded"></div>
                <span>Support</span>
              </h3>
              <ul className="space-y-3 text-gray-400 text-sm sm:text-base">
                {footerLinks.support.map((link, index) => {
                  const IconComponent = link.icon;
                  return (
                    <li key={index} style={{ animationDelay: `${index * 100}ms` }}>
                      <a
                        href={link.href}
                        className="group flex items-center space-x-3 hover:text-white transition-all duration-300 transform hover:translate-x-2"
                      >
                        <IconComponent size={16} className="text-pink-500 group-hover:scale-110 transition-transform duration-300" />
                        <span>{link.name}</span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="border-t border-gray-800 pt-8 mb-8">
            <div className="flex flex-wrap items-center justify-center gap-8 text-gray-400">
              <div className="flex items-center space-x-2 group">
                <Shield className="text-green-500 group-hover:scale-110 transition-transform duration-300" size={20} />
                <span className="text-sm">Verified Happiness Executive</span>
              </div>
              <div className="flex items-center space-x-2 group">
                <Heart className="text-pink-500 group-hover:scale-110 transition-transform duration-300" size={20} />
                <span className="text-sm">Compassionate Care</span>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-gray-800 pt-6 sm:pt-8 text-center">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-gray-400 text-sm sm:text-base">
                &copy; 2025 VKSRS CARE PRIVATE LIMITED. All rights reserved.
              </p>
              <p className="text-gray-500 text-sm italic">
                Enriching lives through compassionate care and trusted connections.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-6 right-6 p-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full shadow-lg transition-all duration-300 transform z-50 ${showScrollTop
          ? 'opacity-100 translate-y-0 scale-100 hover:scale-110 hover:shadow-xl'
          : 'opacity-0 translate-y-4 scale-90 pointer-events-none'
          }`}
      >
        <ArrowUp size={20} className="animate-bounce" />
      </button>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
      `}</style>
    </footer>
  );
};

export default Footer;