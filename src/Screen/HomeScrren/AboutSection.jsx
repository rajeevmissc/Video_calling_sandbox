import React, { useState, useEffect } from 'react';
import { Shield, Zap, CreditCard, ChevronRight, CheckCircle } from 'lucide-react';
import { useNavigate } from "react-router-dom";
const AboutSection = () => {
  const [activeCard, setActiveCard] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    setIsVisible(true);
  }, []);

  const features = [
    {
      icon: Shield,
      title: "Vetted Professionals",
      description: "Comprehensive background checks and skills assessment ensure the highest standards of care and trustworthiness.",
      stats: "100% Verified",
      color: "emerald",
      highlights: ["Background Checks", "Skills Assessment", "Continuous Monitoring"]
    },
    {
      icon: Zap,
      title: "Seamless Experience",
      description: "Book premium services in under 60 seconds with intelligent matching algorithms connecting you to the right professional.",
      stats: "<60 Seconds",
      color: "blue",
      highlights: ["Instant Booking", "Smart Matching", "24/7 Support"]
    },
    {
      icon: CreditCard,
      title: "Secure Platform",
      description: "Bank-level encryption protects all transactions with transparent pricing and complete financial protection.",
      stats: "256-bit Encryption",
      color: "purple",
      highlights: ["Encrypted Payments", "Transparent Pricing", "Money-back Guarantee"]
    }
  ];

  const colorMap = {
    emerald: {
      bg: "bg-emerald-50",
      border: "border-emerald-200",
      icon: "bg-emerald-500",
      iconHover: "group-hover:bg-emerald-600",
      text: "text-emerald-600",
      gradient: "from-emerald-500 to-emerald-600",
      badge: "bg-emerald-100 text-emerald-700"
    },
    blue: {
      bg: "bg-blue-50",
      border: "border-blue-200",
      icon: "bg-blue-500",
      iconHover: "group-hover:bg-blue-600",
      text: "text-blue-600",
      gradient: "from-blue-500 to-blue-600",
      badge: "bg-blue-100 text-blue-700"
    },
    purple: {
      bg: "bg-purple-50",
      border: "border-purple-200",
      icon: "bg-purple-500",
      iconHover: "group-hover:bg-purple-600",
      text: "text-purple-600",
      gradient: "from-purple-500 to-purple-600",
      badge: "bg-purple-100 text-purple-700"
    }
  };

  return (
    <section id="about" className="relative py-8 lg:py-12 bg-white overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 max-w-7xl">
        {/* Header Section */}
        <div className={`text-center mb-16 lg:mb-20 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-100 rounded-full mb-6">
            <CheckCircle className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-700">Trusted by 10,000+ families</span>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2 text-center mb-6 tracking-tight">
            Compassionate Care,
            <span className="block mt-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Professional Standards
            </span>
          </h2>

          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            We connect you with certified professionals who provide personalized, dignified care across all aspects of life—from daily assistance to emotional companionship.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => {
            const colors = colorMap[feature.color];
            const Icon = feature.icon;
            const isActive = activeCard === index;

            return (
              <div
                key={index}
                className={`group relative transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                style={{ transitionDelay: `${index * 100}ms` }}
                onMouseEnter={() => setActiveCard(index)}
                onMouseLeave={() => setActiveCard(null)}
              >
                <div className={`relative h-full bg-white border-2 ${colors.border} rounded-2xl p-8 transition-all duration-300 hover:shadow-xl hover:shadow-gray-200/50 hover:-translate-y-1`}>
                  {/* Icon */}
                  <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl ${colors.icon} ${colors.iconHover} transition-all duration-300 mb-6 group-hover:scale-110`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>

                  {/* Stats Badge */}
                  <div className={`inline-block px-3 py-1 ${colors.badge} rounded-full text-xs font-semibold mb-4`}>
                    {feature.stats}
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 leading-relaxed mb-6">
                    {feature.description}
                  </p>

                  {/* Highlights */}
                  <div className={`space-y-2 transition-all duration-300 ${isActive ? 'opacity-100 max-h-40' : 'opacity-0 max-h-0 overflow-hidden'}`}>
                    {feature.highlights.map((highlight, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                        <ChevronRight className={`w-4 h-4 ${colors.text}`} />
                        <span>{highlight}</span>
                      </div>
                    ))}
                  </div>

                  {/* Hover Accent Line */}
                  <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${colors.gradient} rounded-b-xl transition-all duration-300 ${isActive ? 'opacity-100' : 'opacity-0'}`}></div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA Section */}
        <div className={`mt-16 lg:mt-20 text-center transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 p-8 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100 rounded-2xl">
            <div className="text-left">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Ready to get started?
              </h3>
              <p className="text-gray-600">
                Join thousands of families who trust ServiceConnect
              </p>
            </div>
            <button
              onClick={() => navigate("/services")}
              className="shrink-0 px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center gap-2"
            >
              Get Started
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;