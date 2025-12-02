import React, { useState, useEffect } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();

  const scenes = [
    {
      video:
        "https://res.cloudinary.com/dnnyay9oc/video/upload/v1764492826/mainhu_updated_ldfjvt.mp4",
    },
  ];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % scenes.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const scrollToNext = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: "smooth",
    });
  };

  return (
    <div
      className="
    relative w-full 
    h-[225px]        /* mobile height */
    sm:h-screen      /* tablet + desktop */
    overflow-hidden bg-black
  "
    >

      {/* VIDEO (non-clickable layer) */}
      <video
        className="
  absolute inset-0 w-full h-full
  object-contain         /* mobile */
  sm:object-cover        /* tablet and desktop */
  transition-opacity duration-700 pointer-events-none bg-black
"

        key={scenes[index].video}
        src={scenes[index].video}
        autoPlay
        muted
        loop
        playsInline
      />
      <div
        className="
    hidden                 /* hide on mobile */
    sm:flex                /* show on tablet + desktop */
    absolute left-4 sm:left-8 top-[35%] sm:top-[32%] md:top-[30%] 
    flex-col gap-3 transition-all duration-500 ease-out
  "
      >

        {[
          { label: "Explore GetCompanion", path: "/home" },
          { label: "Find Happiness Executive that suits you", path: "/services" }
        ].map((btn, i) => (
          <button
            key={i}
            onClick={() => navigate(btn.path)}
            className="bg-white/15 hover:bg-white/30 backdrop-blur-md text-white px-5 py-2 rounded-full text-sm sm:text-base font-light transition-all duration-300 shadow-lg 
             flex items-center gap-2"
          >
            {btn.label}

            <div className="w-5 h-5 rounded-full border-2 border-white/60 flex items-center justify-center transition-colors animate-bounceLR">
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
            </div>
          </button>
        ))}
      </div>
      <button
        onClick={scrollToNext}
        className="
    hidden                 /* hide on mobile */
    sm:flex                /* show on tablet + desktop */
    absolute right-4 sm:right-6 md:right-8 top-1/2 -translate-y-1/2 
    flex-col items-center gap-2 text-white hover:scale-110 
    transition-transform duration-300 group
  "
      >

        <span className="text-xs sm:text-sm md:text-base font-light tracking-widest vertical-text opacity-80 group-hover:opacity-100 transition-opacity">
          SCROLL
        </span>
        <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full border-2 border-white/60 flex items-center justify-center group-hover:border-white transition-colors animate-bounce">
          <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
        </div>
      </button>
      <style>{`
        .animate-fadeIn {
          animation: fadeIn 0.8s ease-in forwards;
        }
        .delay-300 {
          animation-delay: 0.3s;
          opacity: 0;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-navButton {
          animation: slideIn 0.7s ease forwards;
          opacity: 0;
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }

        .vertical-text {
          writing-mode: vertical-rl;
          text-orientation: mixed;
        }
          @keyframes bounceLR {
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(6px); }
}
.animate-bounceLR {
  animation: bounceLR 0.8s infinite ease-in-out;
}
      `}</style>
    </div>
  );
};

export default HeroSection;
