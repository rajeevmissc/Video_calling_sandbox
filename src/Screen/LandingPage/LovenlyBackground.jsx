import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
export default function HeroSmallSection() {
  const [hoveredCard, setHoveredCard] = useState(null);
  const navigate = useNavigate();
   const handleServiceClick = (serviceType) => {
    navigate("/services");
  };
  const stats = [
    {
      icon: "💔",
      text: "Loneliness increases the risk of early death as much as smoking 15 cigarettes a day.",
      highlight: "15 cigarettes a day",
      color: "from-red-500 to-orange-500",
      bgColor: "bg-white"
    },
    {
      icon: "🧠",
      text: "People who feel lonely are 64% more likely to develop clinical anxiety or depression.",
      highlight: "64% more likely",
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-white"
    },
    {
      icon: "👥",
      text: "1 in 3 young Indians privately admit they have no one to talk to about their feelings.",
      highlight: "1 in 3 young Indians",
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-white"
    },
    {
      icon: "❤️",
      text: "Loneliness increases the risk of heart disease by 29% and stroke by 32%.",
      highlight: "29% and stroke by 32%.",
      color: "from-red-500 to-rose-500",
      bgColor: "bg-white"
    },
    {
      icon: "👴",
      text: "71% of senior citizens in India report feeling lonely — 50% feel like a burden on their family.",
      highlight: "71% of senior citizens",
      color: "from-amber-500 to-yellow-500",
      bgColor: "bg-white"
    },
    {
      icon: "⚡",
      text: "Humans deprived of emotional connection show 30–40% higher cortisol (stress hormone) — similar to trauma response.",
      highlight: "30–40% higher cortisol",
      color: "from-indigo-500 to-purple-500",
      bgColor: "bg-white"
    }
  ];

  const highlightText = (text, highlight) => {
    const parts = text.split(highlight);
    return (
      <>
        {parts[0]}
        <span className="font-extrabold text-gray-900 bg-yellow-200/60 px-1 rounded">
          {highlight}
        </span>
        {parts[1]}
      </>
    );
  };

  return (
    <div  className="w-full bg-gradient-to-br from-[#0B1A47] via-[#672255] to-[#B34C44] text-white py-16 px-4 sm:px-6 lg:px-10">
      <div className="relative max-w-7xl mx-auto px-6">
        
        {/* Hero Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center max-w-4xl mx-auto"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-block mb-6 px-8 py-3 bg-white/80 backdrop-blur-sm rounded-full border-2 border-blue-200/50 shadow-lg"
          >
            <span className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              ✨ Your Well-being Matters
            </span>
          </motion.div>

          <h1 className="text-3xl sm:text-2xl lg:text-3xl font-bold text-white leading-tight mb-6 tracking-tight">
            Real Companionship,
            <br />
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Whenever You Need It
              </span>
              <motion.div
                className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-full"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              />
            </span>
          </h1>

          <p className="text-base sm:text-lg text-white leading-relaxed max-w-3xl mx-auto font-normal">
            No judgments. No pressure. Just <strong>meaningful conversations</strong>, <strong>genuine warmth</strong>, 
            and trusted companionship from verified Happiness Executives who truly care.
          </p>
        </motion.div>

        {/* Do You Know Section - Highlighted */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="mt-32"
        >
          {/* Alert Banner */}
          <motion.div
            initial={{ scale: 0.95 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            className="relative max-w-4xl mx-auto mb-12 p-8 rounded-3xl bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 shadow-2xl overflow-hidden"
          >
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative flex flex-col sm:flex-row items-center justify-center gap-6 text-center">
              <motion.div
                animate={{ 
                  rotate: [0, -10, 10, -10, 0],
                  scale: [1, 1.1, 1, 1.1, 1]
                }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 2 }}
                className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-xl"
              >
                <span className="text-5xl">⚠️</span>
              </motion.div>
              <div className="text-left">
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2 tracking-tight">
                  Do You Know?
                </h2>
                <p className="text-base sm:text-lg text-white/95 font-medium">
                  The Hidden Epidemic Affecting Millions
                </p>
              </div>
            </div>
          </motion.div>

          <p className="text-center text-base sm:text-lg text-white max-w-3xl mx-auto leading-relaxed mb-16 font-medium">
            These <span className="font-bold text-red-600">alarming statistics</span> reveal how profoundly loneliness impacts our 
            <span className="font-bold text-purple-600"> mental</span>, 
            <span className="font-bold text-blue-600"> physical</span>, and 
            <span className="font-bold text-pink-600"> emotional</span> well-being.
          </p>
        </motion.div>

        {/* Statistics Cards - Larger & More Prominent */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              whileHover={{ y: -8 }}
              onHoverStart={() => setHoveredCard(idx)}
              onHoverEnd={() => setHoveredCard(null)}
              className="group relative"
            >
              {/* Glow Effect on Hover */}
              <motion.div
                className={`absolute -inset-1 bg-gradient-to-r ${stat.color} rounded-3xl blur-xl opacity-0 group-hover:opacity-70 transition-opacity duration-500`}
              />
              
              <div className={`relative h-full p-8 sm:p-10 rounded-3xl bg-white border-2 ${hoveredCard === idx ? 'border-gray-300' : 'border-gray-200'} shadow-xl hover:shadow-2xl transition-all duration-300`}>
                
                {/* Icon and Text in One Line */}
                <div className="flex items-start gap-5">
                  {/* Icon with Animated Background */}
                  <motion.div
                    whileHover={{ scale: 1.15, rotate: 10 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className={`relative flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg group-hover:shadow-2xl transition-shadow`}
                  >
                    <span className="text-3xl">{stat.icon}</span>
                    
                    {/* Pulse Effect */}
                    <motion.div
                      className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${stat.color}`}
                      animate={hoveredCard === idx ? { scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] } : {}}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                  </motion.div>

                  {/* Text with Highlighting */}
                  <p className="text-base sm:text-lg font-semibold text-gray-700 leading-relaxed flex-1">
                    {highlightText(stat.text, stat.highlight)}
                  </p>
                </div>

                {/* Bottom Accent Bar */}
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: hoveredCard === idx ? "100%" : "40%" }}
                  transition={{ duration: 0.5 }}
                  className={`absolute bottom-0 left-0 h-1.5 bg-gradient-to-r ${stat.color} rounded-b-3xl`}
                />

                {/* Corner Decoration */}
                <div className={`absolute top-6 right-6 w-3 h-3 rounded-full bg-gradient-to-br ${stat.color} opacity-50`}></div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Button - Enhanced */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-24 text-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
           onClick={handleServiceClick}
            className="group relative inline-flex items-center gap-3 px-10 py-4 rounded-2xl overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white text-base font-bold shadow-2xl hover:shadow-3xl transition-all"
          >
            <span className="relative z-10">Start Your Healing Journey</span>
            <motion.span
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="relative z-10 text-xl"
            >
              →
            </motion.span>
            
            {/* Shimmer Effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              animate={{ x: ["-100%", "200%"] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
            />
          </motion.button>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mt-6 text-base text-white font-medium"
          >
            🌟 Join <strong>thousands</strong> who found comfort and connection
          </motion.p>
        </motion.div>

      </div>

      {/* Enhanced Animations */}
      <style>{`
        @keyframes blob {
          0%, 100% { 
            transform: translate(0, 0) scale(1) rotate(0deg); 
          }
          33% { 
            transform: translate(40px, -60px) scale(1.15) rotate(120deg); 
          }
          66% { 
            transform: translate(-30px, 30px) scale(0.9) rotate(240deg); 
          }
        }
        .animate-blob {
          animation: blob 8s infinite ease-in-out;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}