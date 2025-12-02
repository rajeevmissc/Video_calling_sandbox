import React, { useState } from 'react';
import { Users, Lock, Award, Shield, CheckCircle, TrendingUp } from 'lucide-react';
import { useNavigate } from "react-router-dom";
const WhyChooseUsSection = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const navigate = useNavigate();
  const badges = [
    {
      icon: Users,
      title: "Vetted Experts",
      description: "Multi-layer screening including background checks, skill assessments, and psychological evaluations",
      color: "emerald",
      stats: "15-Point Verification"
    },
    {
      icon: Lock,
      title: "Military-Grade Security",
      description: "Advanced encryption, secure data handling, and PCI-compliant payment processing",
      color: "blue",
      stats: "256-Bit Encryption"
    },
    {
      icon: Award,
      title: "Satisfaction Guarantee",
      description: "100% satisfaction guarantee with 24/7 support and immediate service replacement if needed",
      color: "orange",
      stats: "100% Guarantee"
    },
    {
      icon: Shield,
      title: "Privacy Assurance",
      description: "HIPAA-compliant data protection with strict confidentiality protocols and secure information handling",
      color: "purple",
      stats: "HIPAA Compliant"
    }
  ];

  const colorStyles = {
    emerald: {
      bg: 'bg-emerald-50',
      icon: 'bg-emerald-500',
      badge: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      stat: 'text-emerald-600',
      progress: 'bg-emerald-500'
    },
    blue: {
      bg: 'bg-blue-50',
      icon: 'bg-blue-500',
      badge: 'bg-blue-100 text-blue-700 border-blue-200',
      stat: 'text-blue-600',
      progress: 'bg-blue-500'
    },
    orange: {
      bg: 'bg-orange-50',
      icon: 'bg-orange-500',
      badge: 'bg-orange-100 text-orange-700 border-orange-200',
      stat: 'text-orange-600',
      progress: 'bg-orange-500'
    },
    purple: {
      bg: 'bg-purple-50',
      icon: 'bg-purple-500',
      badge: 'bg-purple-100 text-purple-700 border-purple-200',
      stat: 'text-purple-600',
      progress: 'bg-purple-500'
    }
  };

  return (
    <section id="why-choose-us" className="py-8 lg:py-12 bg-gradient-to-b from-white via-gray-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-full mb-6">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span className="text-sm font-medium text-emerald-700">Trusted by 50,000+ Families</span>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2 text-center mb-6 tracking-tight">
            Why Choose
            <span className="ml-2 bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
              ServiceConnect
            </span>
          </h2>

          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
            Experience the difference that genuine care, professional expertise, and unwavering commitment make
          </p>
        </div>

        {/* Badges Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {badges.map((badge, index) => {
            const IconComponent = badge.icon;
            const styles = colorStyles[badge.color];
            const isHovered = hoveredIndex === index;

            return (
              <article
                key={index}
                className="bg-white border-2 border-gray-200 rounded-2xl p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Icon */}
                <div className={`w-16 h-16 ${styles.icon} rounded-xl flex items-center justify-center text-white mb-4 ${isHovered ? 'scale-110' : ''
                  } transition-transform duration-300`}>
                  <IconComponent className="w-8 h-8" />
                </div>

                {/* Stats Badge */}
                <div className="mb-4">
                  <span className={`inline-flex items-center px-3 py-1 ${styles.badge} text-xs font-medium rounded-full border`}>
                    <TrendingUp className="w-3 h-3 mr-1" />
                    {badge.stats}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {badge.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  {badge.description}
                </p>

                {/* Trust Score */}
                <div className="pt-4 border-t border-gray-100">
                  <div className="flex justify-between text-xs text-gray-600 mb-2">
                    <span>Trust Score</span>
                    <span className={styles.stat}>99%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div
                      className={`${styles.progress} h-1.5 rounded-full transition-all duration-1000`}
                      style={{ width: isHovered ? '99%' : '85%' }}
                    ></div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Stats Section */}
        <div className="bg-gradient-to-r from-emerald-50 to-blue-50 border border-emerald-100 rounded-2xl p-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-600 mb-1">99.8%</div>
              <div className="text-sm text-gray-600">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-1">24/7</div>
              <div className="text-sm text-gray-600">Support Available</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-1">15-Point</div>
              <div className="text-sm text-gray-600">Verification</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-1">Zero</div>
              <div className="text-sm text-gray-600">Breaches</div>
            </div>
          </div>

          <div className="text-center">
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Join thousands of satisfied families who trust ServiceConnect for their care needs
            </p>
            <button
              onClick={() => navigate("/services")}
              className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-emerald-600 to-blue-600 text-white font-semibold rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
              Experience the Difference
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUsSection;