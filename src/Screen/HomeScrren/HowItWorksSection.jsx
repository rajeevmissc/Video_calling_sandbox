import React, { useState, useEffect } from 'react';
import { Smartphone, Settings, Users, MessageCircle, Shield, ArrowRight, CheckCircle, Clock } from 'lucide-react';

const HowItWorksSection = () => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      step: "01",
      title: "Sign Up with Mobile",
      icon: Smartphone,
      color: "blue",
      detail: "Quick mobile registration"
    },
    {
      step: "02", 
      title: "Select Communication Mode",
      icon: Settings,
      color: "emerald",
      detail: "Chat, Call or In-Person"
    },
    {
      step: "03",
      title: "Match Service Provider", 
      icon: Users,
      color: "purple",
      detail: "AI-powered matching"
    },
    {
      step: "04",
      title: "Connect & Communicate",
      icon: MessageCircle,
      color: "orange",
      detail: "Start your service"
    },
    {
      step: "05",
      title: "Secure Service Delivery",
      icon: Shield,
      color: "indigo",
      detail: "Safe & guaranteed"
    }
  ];

  const colorStyles = {
    blue: {
      bg: 'bg-blue-50',
      icon: 'bg-blue-500',
      badge: 'bg-blue-100 text-blue-700',
      gradient: 'from-blue-500 to-blue-600'
    },
    emerald: {
      bg: 'bg-emerald-50',
      icon: 'bg-emerald-500',
      badge: 'bg-emerald-100 text-emerald-700',
      gradient: 'from-emerald-500 to-emerald-600'
    },
    purple: {
      bg: 'bg-purple-50',
      icon: 'bg-purple-500',
      badge: 'bg-purple-100 text-purple-700',
      gradient: 'from-purple-500 to-purple-600'
    },
    orange: {
      bg: 'bg-orange-50',
      icon: 'bg-orange-500',
      badge: 'bg-orange-100 text-orange-700',
      gradient: 'from-orange-500 to-orange-600'
    },
    indigo: {
      bg: 'bg-indigo-50',
      icon: 'bg-indigo-500',
      badge: 'bg-indigo-100 text-indigo-700',
      gradient: 'from-indigo-500 to-indigo-600'
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleNavigate = () => {
    window.location.href = '/services';
  };

  return (
    <section id="how-it-works" className="py-8 lg:py-12 bg-gradient-to-b from-white via-gray-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-100 rounded-full mb-6">
            <Clock className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-700">Get Started in Under 5 Minutes</span>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2 text-center mb-6 tracking-tight">
            How It
            <span className="ml-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Works
            </span>
          </h2>
          
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
            Our streamlined process connects you with the perfect care professional in just minutes
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-16 max-w-5xl mx-auto">
          <div className="relative">
            {/* Background line */}
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 transform -translate-y-1/2"></div>
            
            {/* Active progress line */}
            <div 
              className="absolute top-1/2 left-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 transform -translate-y-1/2 transition-all duration-1000 ease-out"
              style={{ width: `${(activeStep / (steps.length - 1)) * 100}%` }}
            ></div>

            {/* Step indicators */}
            <div className="relative flex justify-between">
              {steps.map((step, index) => {
                const styles = colorStyles[step.color];
                return (
                  <button
                    key={index}
                    onClick={() => setActiveStep(index)}
                    className={`w-10 h-10 rounded-full border-2 transition-all duration-300 flex items-center justify-center font-semibold text-sm ${
                      index <= activeStep 
                        ? `${styles.icon} border-transparent text-white scale-110 shadow-lg` 
                        : 'bg-white border-gray-300 text-gray-400 hover:border-gray-400'
                    }`}
                  >
                    {index < activeStep ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      step.step
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Steps Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-16">
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            const isActive = index === activeStep;
            const styles = colorStyles[step.color];
            
            return (
              <div 
                key={index}
                onClick={() => setActiveStep(index)}
                className={`group cursor-pointer bg-white border-2 border-gray-200 rounded-2xl p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ${
                  isActive ? 'shadow-xl -translate-y-1 border-blue-300' : ''
                }`}
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 ${styles.icon} rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md ${
                    isActive ? 'scale-110' : 'group-hover:scale-110'
                  } transition-transform duration-300`}>
                    {step.step}
                  </div>
                  
                  {index < activeStep && (
                    <CheckCircle className="w-5 h-5 text-green-500 fill-current" />
                  )}
                </div>

                {/* Icon */}
                <div className={`w-14 h-14 ${styles.bg} rounded-xl flex items-center justify-center mb-4 ${
                  isActive ? 'scale-110' : 'group-hover:scale-110'
                } transition-transform duration-300`}>
                  <IconComponent className="w-6 h-6 text-gray-700" />
                </div>

                {/* Detail Badge */}
                <div className="mb-3">
                  <span className={`inline-block text-xs font-medium ${styles.badge} px-3 py-1 rounded-full`}>
                    {step.detail}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {step.title}
                </h3>

                {/* Active Indicator */}
                {isActive && (
                  <div className="flex items-center gap-2 text-blue-600 text-sm font-medium mt-3">
                    <span>Active</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;