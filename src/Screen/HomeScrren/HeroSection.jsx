import React, { useState } from 'react';
import { Phone, Home, Star, ArrowRight, CheckCircle, Users, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HeroSection = ({ onServiceSelect }) => {
  const [activeCard, setActiveCard] = useState(null);
  const navigate = useNavigate();

  const heroCards = [
      {
      icon: Home,
      title: "In Person Visit",
      subtitle: "Premium In-Home Care",
      description:
        "Book a professional for in-person visit. All experts are verified and background checked.",
      features: ["Verified", "Insured", "Premium Care"],
      gradient: "from-purple-500 to-pink-600",
      iconBg: "bg-white",
      iconColor: "text-purple-500",
      stats: "Background Verified",
      serviceType: "home-visit",
      badge: "Premium"
    },
    {
      icon: MessageCircle,
      title: "Discreet Chat",
      subtitle: "Instant Messaging",
      description:
        "Chat instantly with verified experts in a silent, secure, and private space. Get responses instantly.",
      features: ["Instant Messaging", "Screen sharing", "Confidential & Secure", "Expert Guidance"],
      gradient: "from-sky-500 to-indigo-600",
      iconBg: "bg-white",
      iconColor: "text-sky-500",
      stats: "500+ Chats",
      serviceType: "chat",
      badge: "Trending"
    },
    {
      icon: Phone,
      title: "Discreet Call",
      subtitle: "Audio & Video Calls",
      description:
        "Connect with verified experts instantly through private audio or video calls with full security.",
      features: ["Audio & Video Options", "Screen sharing", "Instant Connect", "Secure & Confidential"],
      gradient: "from-teal-500 to-indigo-600",
      iconBg: "bg-white",
      iconColor: "text-teal-500",
      stats: "300+ Calls",
      serviceType: "call",
      badge: "Highly Rated"
    },
  ];

  const handleServiceClick = (serviceType) => {
    onServiceSelect?.({
      type: serviceType,
      timestamp: new Date().toISOString()
    });

    navigate("/services", {
      state: {
        serviceType,
        timestamp: new Date().toISOString()
      }
    });
  };

  return (
    <section className="relative min-h-screen py-4 lg:py-4 bg-white">

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Heading */}
        <div className="py-2">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 text-center lg:text-left">
            Our <span className="text-indigo-600">Services </span> made for you
          </h2>
          <p className="text-gray-900 mt-1 text-lg md:text-xl text-center lg:text-left">
            Choose that suits you best — chat, call, or home visit.
          </p>
        </div>

        {/* Cards */}
        <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto mt-6">

          {heroCards.map((card, index) => {
            const IconComponent = card.icon;

            return (
              <div
                key={index}
                onClick={() => handleServiceClick(card.serviceType)}
                onMouseEnter={() => setActiveCard(index)}
                onMouseLeave={() => setActiveCard(null)}

                className="
                  relative   /* important for correct badge placement */
                  group bg-[#F0F0F0] rounded-2xl border border-gray-200 shadow-sm 
                  hover:shadow-md transition-all duration-300 cursor-pointer p-8
                "
              >

                {/* Badge */}
                {card.badge && (
                  <div className="absolute top-3 right-3 px-3 py-1 bg-gray-900 text-white text-xs font-medium rounded-full shadow">
                    ⭐ {card.badge}
                  </div>
                )}

                {/* Header */}
                <div className="flex items-start gap-4 mb-5">
                  <div className={`${card.iconBg} w-14 h-14 rounded-xl flex items-center justify-center`}>
                    <IconComponent className={`w-7 h-7 ${card.iconColor}`} />
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{card.title}</h3>
                    <p className="text-sm text-gray-600">{card.subtitle}</p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-600 text-sm leading-relaxed mb-6">
                  {card.description}
                </p>

                {/* Stats + Features */}
                <div className="grid grid-cols-2 gap-6 mb-6">

                  {/* Stats */}
                  <div className="space-y-3">
                    <div className="bg-white rounded-xl p-3">
                      <div className="flex items-center gap-1 mb-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      </div>
                      <p className="text-xs text-gray-700 font-medium">4.9/5 Rating</p>
                    </div>

                    <div className="bg-white rounded-xl p-3">
                      <p className="text-xs text-gray-500">Active Users</p>
                      <p className="text-sm font-semibold text-gray-900">{card.stats}</p>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-2">
                    {card.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-xs text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>

                </div>

                {/* Availability */}
                <div className="bg-white rounded-xl p-3 mb-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-600" />
                      <span className="text-xs font-semibold text-gray-700">Experts Available</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    </div>
                  </div>
                </div>

                {/* CTA Button */}
                <button
                  className="
                    w-full py-3.5 rounded-xl font-semibold text-sm text-white
                    bg-[#282828]
                    hover:shadow-md transform hover:scale-[1.02] transition-all flex items-center justify-center gap-2
                  "
                >
                  {card.serviceType === "chat" ? "Chat with Expert" :
                    card.serviceType === "call" ? "Call Expert" :
                      "Book a In Person Visit"}

                  <ArrowRight className="w-4 h-4" />
                </button>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default HeroSection;
