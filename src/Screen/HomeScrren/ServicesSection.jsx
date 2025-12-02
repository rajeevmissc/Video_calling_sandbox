import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight, TrendingUp } from 'lucide-react';

// Sample service categories data
const serviceCategories = [
  {
  id: 1,
  title: "Emotional Well-being & Support",
  category: "Communication & Emotional Support",
  description: "Professional emotional support and communication services for mental wellness",
  icon: "❤️",
  gradient: "from-pink-500 via-rose-400 to-red-500",
  bgGradient: "from-pink-50 to-red-50",
  services: [
    { skill: "Active listening", price: "₹500/hour", icon: "💬" },
    { skill: "Empathy training", price: "₹800/session", icon: "❤️" },
    { skill: "Conflict resolution", price: "₹1000/session", icon: "🎯" }
  ]
},
  {
    id: 2,
    title: "Arts & Music",
    category: "Arts, Music & Creative Expression",
    description: "Express yourself through music, dance, and creative arts",
    icon: "🎵",
    gradient: "from-purple-500 to-pink-600",
    bgGradient: "from-purple-50 to-pink-50",
    services: [
      { skill: "Bollywood Singing", price: "₹500/hr", icon: "🎤" },
      { skill: "Classical Music", price: "₹600/hr", icon: "🎼" },
      { skill: "Dance Partner", price: "₹450/hr", icon: "💃" }
    ]
  },
  {
    id: 3,
    title: "Wellness & Fitness",
    category: "Sports & Physical Activities",
    description: "Achieve your fitness goals with expert guidance",
    icon: "🧘",
    gradient: "from-emerald-500 to-teal-600",
    bgGradient: "from-emerald-50 to-teal-50",
    services: [
      { skill: "Yoga Partner", price: "₹400/hr", icon: "🧘" },
      { skill: "Meditation Guide", price: "₹350/hr", icon: "🕉️" },
      { skill: "Fitness Trainer", price: "₹500/hr", icon: "💪" }
    ]
  },
  {
    id: 4,
    title: "Emotional Support",
    category: "Communication & Emotional Support",
    description: "Find comfort and understanding through compassionate listening",
    icon: "💬",
    gradient: "from-blue-500 to-indigo-600",
    bgGradient: "from-blue-50 to-indigo-50",
    services: [
      { skill: "Active Listening", price: "₹600/hr", icon: "👂" },
      { skill: "Life Coaching", price: "₹800/hr", icon: "🎯" },
      { skill: "Stress Counseling", price: "₹700/hr", icon: "🧠" }
    ]
  },
  {
    id: 5,
    title: "Learning & Education",
    category: "Education & Skill Development",
    description: "Expand your knowledge with personalized tutoring",
    icon: "📚",
    gradient: "from-amber-500 to-orange-600",
    bgGradient: "from-amber-50 to-orange-50",
    services: [
      { skill: "Language Tutoring", price: "₹450/hr", icon: "🗣️" },
      { skill: "Academic Support", price: "₹500/hr", icon: "📖" },
      { skill: "Skill Training", price: "₹550/hr", icon: "🎓" }
    ]
  },
  {
    id: 6,
    title: "Entertainment",
    category: "Games & Entertainment",
    description: "Enjoy fun activities and engaging entertainment",
    icon: "🎮",
    gradient: "from-rose-500 to-red-600",
    bgGradient: "from-rose-50 to-red-50",
    services: [
      { skill: "Gaming Partner", price: "₹300/hr", icon: "🎮" },
      { skill: "Board Games", price: "₹250/hr", icon: "🎲" },
      { skill: "Card Games", price: "₹200/hr", icon: "🃏" }
    ]
  },
  {
    id: 7,
    title: "Lifestyle Assistance",
    category: "Lifestyle & Practical Help",
    description: "Get help with daily tasks and lifestyle management",
    icon: "🏠",
    gradient: "from-lime-500 to-green-600",
    bgGradient: "from-lime-50 to-green-50",
    services: [
      { skill: "Shopping Companion", price: "₹400/hr", icon: "🛍️" },
      { skill: "Cooking Partner", price: "₹500/hr", icon: "👨‍🍳" },
      { skill: "Organization Help", price: "₹450/hr", icon: "📋" }
    ]
  },
  {
  id: 8,
  title: "Social & Cultural Activities",
  category: "Social & Cultural Engagement",
  description: "Cultural engagement and social companionship services",
  icon: "👥",
  gradient: "from-rose-500 via-pink-400 to-purple-500",
  bgGradient: "from-rose-50 to-purple-50",
  services: [
    { skill: "Bollywood dance", price: "₹800/hour", icon: "💃" },
    { skill: "Classical dance (Kathak, Bharatanatyam)", price: "₹1000/hour", icon: "🕺" },
    { skill: "Folk dance (Bhangra, Garba)", price: "₹700/hour", icon: "🎉" }
  ]
},
{
  id: 9,
  title: "Wellness & Mindfulness",
  category: "Emotional Well-being & Mindfulness",
  description: "Mental wellness and mindfulness practices for inner peace",
  icon: "🌸",
  gradient: "from-teal-500 via-green-400 to-emerald-500",
  bgGradient: "from-teal-50 to-emerald-50",
  services: [
    { skill: "Guided relaxation", price: "₹600/session", icon: "🧘‍♀️" },
    { skill: "Breathing exercises", price: "₹500/session", icon: "💨" },
    { skill: "Gratitude journaling companion", price: "₹400/session", icon: "📝" }
  ]
}
];

const ServicesSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [itemsPerSlide, setItemsPerSlide] = useState(3);

  const handleNavigate = (category) => {
    window.location.href = `/services?skill=${encodeURIComponent(category)}`;
  };

  useEffect(() => {
    const updateItemsPerSlide = () => {
      if (window.innerWidth >= 1024) {
        setItemsPerSlide(3);
      } else if (window.innerWidth >= 640) {
        setItemsPerSlide(2);
      } else {
        setItemsPerSlide(1);
      }
    };

    updateItemsPerSlide();
    window.addEventListener('resize', updateItemsPerSlide);
    return () => window.removeEventListener('resize', updateItemsPerSlide);
  }, []);

  const totalSlides = Math.ceil(serviceCategories.length / itemsPerSlide);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, totalSlides]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
    setIsAutoPlaying(false);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
  };

  return (
    <section id="services" className="py-4 lg:py-4 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Header */}
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2 text-center lg:text-left">
            Our In Person Visit <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Services</span> for you
          </h2>

          <p className="text-gray-900 mt-2 text-lg md:text-xl max-w-2xl mx-auto lg:mx-0">
            Our Happiness Excetive Ready to Serve for you
          </p>
        </div>

        {/* Slider */}
        <div className="relative">
          {totalSlides > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white hover:bg-gray-50 shadow-lg rounded-full p-3 transition-all duration-300 hover:scale-110 border border-gray-200"
                aria-label="Previous"
              >
                <ChevronLeft className="w-6 h-6 text-gray-700" />
              </button>

              <button
                onClick={nextSlide}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white hover:bg-gray-50 shadow-lg rounded-full p-3 transition-all duration-300 hover:scale-110 border border-gray-200"
                aria-label="Next"
              >
                <ChevronRight className="w-6 h-6 text-gray-700" />
              </button>
            </>
          )}

          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-700 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {Array.from({ length: totalSlides }).map((_, slideIndex) => (
                <div key={slideIndex} className="w-full flex-shrink-0">
                  <div className={`grid gap-6 ${itemsPerSlide === 1 ? 'grid-cols-1' :
                      itemsPerSlide === 2 ? 'grid-cols-2' :
                        'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                    }`}>
                    {serviceCategories.slice(slideIndex * itemsPerSlide, (slideIndex + 1) * itemsPerSlide).map((service) => {
                      const minPrice = Math.min(...service.services.map(s => parseInt(s.price.match(/\d+/)[0])));

                      return (
                        <article
                          key={service.id}
                          onClick={() => handleNavigate(service.category)}
                          className="group cursor-pointer bg-[#F0F0F0] border-2 border-gray-200 rounded-2xl p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                          onMouseEnter={() => setIsAutoPlaying(false)}
                        >
                          {/* Header */}
                          <div className="flex items-start gap-4 mb-4">
                            <div className={`flex-shrink-0 w-14 h-14 bg-white rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300`}>
                              {service.icon}
                            </div>

                            <div className="flex-1 min-w-0">
                              <h3 className="text-xl font-bold text-gray-900 mb-1 line-clamp-1">
                                {service.title}
                              </h3>
                              <p className="text-sm text-gray-600 line-clamp-2">
                                {service.description}
                              </p>
                            </div>
                          </div>

                          {/* Services List */}
                          <div className="space-y-2 mb-4 pb-4 border-b border-gray-100">
                            {service.services.map((subService, idx) => (
                              <div
                                key={idx}
                                className="flex items-center justify-between p-2 bg-white rounded-lg hover:bg-gray-100 transition-colors duration-200"
                              >
                                <div className="flex items-center gap-2 flex-1 min-w-0">
                                  <span className="text-base">{subService.icon}</span>
                                  <span className="text-sm font-medium text-gray-700 truncate">
                                    {subService.skill}
                                  </span>
                                </div>
                                <span className="text-xs font-semibold text-gray-900 bg-white px-2 py-1 rounded-full">
                                  {subService.price}
                                </span>
                              </div>
                            ))}
                          </div>

                          {/* Price Info */}
                          <div className="mb-4 p-3 bg-white rounded-lg">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">Starting from</span>
                              <span className="text-lg font-bold text-gray-900">₹{minPrice}+</span>
                            </div>
                          </div>

                          {/* CTA Button */}
                          <button className={`w-full bg-[#1A1A1A] text-white py-3 px-4 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:scale-105 flex items-center justify-center gap-2`}>
                            <span>View All Services</span>
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                          </button>
                        </article>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dots */}
          {totalSlides > 1 && (
            <div className="flex justify-center mt-8 gap-2">
              {Array.from({ length: totalSlides }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentSlide
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 w-8'
                      : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ServicesSlider;