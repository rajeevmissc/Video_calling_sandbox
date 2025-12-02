import React, { useState, useEffect, useRef } from "react";
import {
  X,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Zap,
  Gift,
  TrendingUp,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const MinimalCardSlider = ({
  isVisible = true,
  onClose,
  autoPlay = true,
  autoPlayDelay = 5000,
  onNavigateToWallet,
  onNavigateToServices,
  onNavigateToShare,
}) => {
  const [isOpen, setIsOpen] = useState(isVisible);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying] = useState(autoPlay);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const autoPlayRef = useRef(null);
  const navigate = useNavigate();

  /* -----------------------------------------
      CARD DATA
  ------------------------------------------*/
  const cards = [
    {
      id: 1,
      icon: Gift,
      tag: "New User Offer",
      title: "Free 2-Minute Trial",
      description:
        "Experience our platform with complimentary talk and chat access for new users",
      cta: "Start Free Trial",
      action: "services",
      color: "blue",
      stats: { label: "Benefit", value: "No Credit Card Required" },
    },
    {
      id: 2,
      icon: Zap,
      tag: "Bonus Credits",
      title: "Get More on Every Recharge",
      description:
        "Earn additional talk and chat time with each wallet recharge",
      cta: "Recharge Now",
      action: "wallet",
      color: "purple",
      stats: { label: "Advantage", value: "More Value, Every Time" },
    },
    {
      id: 3,
      icon: TrendingUp,
      tag: "Referral Rewards",
      title: "Refer Friends, Earn ₹200",
      description:
        "Your friend gets ₹200 wallet credit free when they join through your referral",
      cta: "Share & Earn",
      action: "share",
      color: "emerald",
      stats: { label: "Reward", value: "Unlimited Referrals" },
    },
  ];

  const colorThemes = {
    blue: {
      tag: "bg-blue-100 text-blue-700",
      icon: "bg-blue-100 text-blue-600",
    },
    purple: {
      tag: "bg-purple-100 text-purple-700",
      icon: "bg-purple-100 text-purple-600",
    },
    emerald: {
      tag: "bg-emerald-100 text-emerald-700",
      icon: "bg-emerald-100 text-emerald-600",
    },
  };

  /* -----------------------------------------
      GET VISIBLE CARDS (ALWAYS SHOW 3)
  ------------------------------------------*/
  const getVisibleCards = () => {
    const visible = [];
    for (let i = 0; i < 3; i++) {
      const index = (currentIndex + i) % cards.length;
      visible.push(cards[index]);
    }
    return visible;
  };

  /* -----------------------------------------
      NAVIGATION
  ------------------------------------------*/
  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % cards.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
  };

  useEffect(() => {
    if (currentIndex < 0) setCurrentIndex(cards.length - 1);
    if (currentIndex >= cards.length) setCurrentIndex(0);
  }, [currentIndex, cards.length]);

  /* -----------------------------------------
      AUTO-PLAY
  ------------------------------------------*/
  useEffect(() => {
    if (isPlaying && cards.length > 3) {
      autoPlayRef.current = setInterval(nextSlide, autoPlayDelay);
      return () => clearInterval(autoPlayRef.current);
    }
  }, [isPlaying, autoPlayDelay]);

  /* -----------------------------------------
      TOUCH SWIPE (MOBILE)
  ------------------------------------------*/
  const handleTouchStart = (e) => setTouchStart(e.targetTouches[0].clientX);
  const handleTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    if (distance > 50) nextSlide();
    if (distance < -50) prevSlide();

    setTouchStart(0);
    setTouchEnd(0);
  };

  /* -----------------------------------------
      CARD BUTTON ACTION
  ------------------------------------------*/
  const handleCardAction = (action) => {
    switch (action) {
      case "wallet":
        if (onNavigateToWallet) onNavigateToWallet();
        else navigate("/wallet");
        break;

      case "services":
        if (onNavigateToServices) onNavigateToServices();
        else navigate("/services");
        break;

      case "share":
        if (onNavigateToShare) onNavigateToShare();
        else if (navigator.share) {
          navigator
            .share({
              title: "Join and Earn Rewards",
              text: "Get ₹200 wallet credit for joining!",
              url: window.location.href,
            })
            .catch(() => {});
        } else {
          alert("Sharing not supported on this device");
        }
        break;

      default:
        console.warn("Unknown card action:", action);
    }
  };

  if (!isOpen) return null;

  const visibleCards = getVisibleCards();

  return (
    <section
      className="pb-8 sm:py-12 bg-gradient-to-b from-white via-gray-50 to-white"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="relative">
          {/* HEADER */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Special Offers
              </h2>
              <p className="text-gray-600 mt-1 text-xl md:text-2xl">
                Exclusive deals just for you
              </p>
            </div>

            {onClose && (
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            )}
          </div>

          {/* CARDS GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {visibleCards.map((card, idx) => {
              const theme = colorThemes[card.color];
              const Icon = card.icon;

              return (
                <div
                  key={`${card.id}-${idx}`}
                  className={`bg-[#F0F0F0] border rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
                    idx > 0 ? "hidden sm:block" : ""
                  } ${idx > 1 ? "hidden lg:block" : ""}`}
                >
                  {/* Tag */}
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className={`${theme.tag} text-xs font-semibold px-3 py-1 rounded-full`}
                    >
                      {card.tag}
                    </span>
                    <div className={`${theme.icon} p-2 rounded-lg`}>
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {card.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {card.description}
                  </p>

                  {/* Stats */}
                  <div className="bg-white rounded-lg p-3 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        {card.stats.label}
                      </span>
                      <span className="text-sm font-bold text-gray-900">
                        {card.stats.value}
                      </span>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <button
                    onClick={() => handleCardAction(card.action)}
                    className="w-full bg-[#1A1A1A] px-4 py-3 rounded-xl font-semibold text-sm flex items-center justify-center space-x-2 transition-all duration-200 group"
                  >
                    <span className="text-white">{card.cta}</span>
                    <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              );
            })}
          </div>

          {/* NAVIGATION CONTROLS */}
          {cards.length > 3 && (
            <div className="flex items-center justify-center space-x-4 mt-4">
              {/* Prev */}
              <button
                onClick={prevSlide}
                className="p-3 bg-white border border-gray-200 rounded-full hover:bg-gray-50 transition-colors shadow-sm"
                aria-label="Previous"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>

              {/* Indicators */}
              <div className="flex space-x-2">
                {cards.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      index === currentIndex
                        ? "w-8 bg-gray-900"
                        : "w-2 bg-gray-300 hover:bg-gray-400"
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>

              {/* Next */}
              <button
                onClick={nextSlide}
                className="p-3 bg-white border border-gray-200 rounded-full hover:bg-gray-50 transition-colors shadow-sm"
                aria-label="Next"
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default MinimalCardSlider;
