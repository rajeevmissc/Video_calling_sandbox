// import React from "react";
// import { motion } from "framer-motion";

// import decorativeGirl from "../../Logos/Decorative_girl.png";
// import heart from "../../Logos/heart.png";
// import judgement from "../../Logos/judgement.png";
// import safe from "../../Logos/safe.png";
// import goal from "../../Logos/goal.png";

// export default function CorePromise() {
//   const cards = [
//     {
//       icon: heart,
//       title: "Real Humans, Not Bots",
//       text: "Every Happiness Executive listens and talk with genuine empathy and understanding.",
//     },
//     {
//       icon: judgement,
//       title: "Judgement-Free Zone",
//       text: "Your emotional comfort space. Share freely without fear of judgement.",
//     },
//     {
//       icon: safe,
//       title: "Safe & Private",
//       text: " Educated & Verified Companaion , Secure Chat, Privacy is our Priority.",
//     },
//     {
//       icon: goal,
//       title: "Availablilty",
//       text: "Use what suits you best , Chat, Call or In-Person Visit.",
//     },
//   ];

//   return (
//     <div className="bg-[#FFF5C9] px-4 sm:px-6 py-12 sm:py-16 relative overflow-hidden flex justify-center">

//       {/* BACKGROUND FLOATING BLURS */}
//       <div className="absolute w-60 h-60 sm:w-80 sm:h-80 bg-white/40 blur-[120px] rounded-full -top-10 -left-10 opacity-30"></div>
//       <div className="absolute w-40 h-40 sm:w-64 sm:h-64 bg-white/40 blur-[120px] rounded-full bottom-0 right-0 opacity-30"></div>

//       <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">

//         {/* LEFT SECTION */}
//         <motion.div
//           initial={{ opacity: 0, x: -25 }}
//           whileInView={{ opacity: 1, x: 0 }}
//           transition={{ duration: 0.7 }}
//           viewport={{ once: true }}
//         >
//           <span className="bg-[#FFE565] px-4 py-2 rounded-full text-xs sm:text-sm font-semibold tracking-wide">
//             WHAT MAKES US DIFFERENT
//           </span>

//           <h1 className="text-3xl sm:text-5xl font-extrabold mt-4 mb-6 sm:mb-8 text-gray-900 leading-tight">
//             The Core Promise
//           </h1>

//           <div className="space-y-4 sm:space-y-6">
//             {cards.map((item, index) => (
//               <motion.div
//                 key={index}
//                 initial={{ opacity: 0, y: 20 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.45, delay: index * 0.15 }}
//                 viewport={{ once: true }}
//                 className="
//                   bg-white/70 backdrop-blur-xl 
//                   p-4 sm:p-6 rounded-xl sm:rounded-2xl 
//                   shadow-md hover:shadow-xl 
//                   border border-white/40 
//                   flex gap-3 sm:gap-4 items-start
//                   cursor-default transition-all
//                 "
//               >
//                 <div
//                   className="
//                     w-12 h-12 sm:w-14 sm:h-14 rounded-xl 
//                     bg-gradient-to-br from-orange-100 to-orange-200 
//                     flex items-center justify-center shadow-sm
//                   "
//                 >
//                   <img src={item.icon} alt="icon" className="w-7 h-7 sm:w-8 sm:h-8" />
//                 </div>

//                 <div>
//                   <h2 className="font-semibold text-base sm:text-lg text-gray-900">
//                     {item.title}
//                   </h2>
//                   <p className="text-gray-600 text-xs sm:text-sm mt-1 leading-relaxed">
//                     {item.text}
//                   </p>
//                 </div>
//               </motion.div>
//             ))}
//           </div>
//         </motion.div>

//         {/* RIGHT IMAGE SECTION */}
//         <motion.div
//           initial={{ opacity: 0, scale: 0.9 }}
//           whileInView={{ opacity: 1, scale: 1 }}
//           transition={{ duration: 0.8 }}
//           viewport={{ once: true }}
//           className="relative flex justify-center items-center order-first md:order-none"
//         >
//           <motion.img
//             src={decorativeGirl}
//             alt="Girl"
//             className="w-[75%] max-w-xs sm:max-w-sm md:max-w-md drop-shadow-xl"
//             animate={{ y: [0, -12, 0] }}
//             transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
//           />
//         </motion.div>

//       </div>
//     </div>
//   );
// }



import React from "react";
import { motion } from "framer-motion";
import { Shield, CheckCircle, Lock, Headphones } from "lucide-react";

export default function SafetySection() {
  const items = [
    {
      icon: CheckCircle,
      title: "Background Verified",
      desc: "Police and ID verification for every companion",
    },
    {
      icon: Lock,
      title: "End-to-End Encrypted",
      desc: "Your conversations stay private, always",
    },
    {
      icon: Shield,
      title: "Trained Professionals",
      desc: "Empathy and active listening training",
    },
    {
      icon: Headphones,
      title: "24/7 Support",
      desc: "Our team is always here to help",
    },
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="w-full bg-gradient-to-br from-[#0B1A47] via-[#672255] to-[#B34C44] text-white py-16 px-4 sm:px-6 lg:px-10"
    >
      <div className="max-w-6xl mx-auto text-center">
        
        {/* Top Icon Animation */}
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="flex justify-center mb-4"
        >
          <Shield size={40} className="text-white" />
        </motion.div>

        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 leading-snug">
          Your safety is our priority
        </h2>

        <p className="text-sm sm:text-base lg:text-lg text-white/90 max-w-2xl mx-auto mb-12 leading-relaxed px-2">
          Every Happiness Executive goes through rigorous verification and training.
          We take your trust seriously, and we've built our platform to keep you safe.
        </p>

        {/* Icons Row with Stagger Animation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
          {items.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.12 }}
              whileHover={{ scale: 1.06 }}
              className="flex flex-col items-center text-center px-4 py-4 rounded-xl 
                         transition-all duration-300 hover:shadow-xl hover:shadow-white/20 
                         hover:bg-white/10 cursor-default"
            >
              <motion.div
                whileHover={{ scale: 1.18 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="mb-4"
              >
                <item.icon size={40} className="text-white" />
              </motion.div>

              <h3 className="text-base sm:text-lg font-semibold mb-2">{item.title}</h3>
              <p className="text-xs sm:text-sm text-white/85 leading-relaxed">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

