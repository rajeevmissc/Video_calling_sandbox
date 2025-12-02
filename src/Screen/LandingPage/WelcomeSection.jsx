import LEFT_COMBINED_IMAGE from "../../Logos/design_girl.png";
import ICON1 from "../../Logos/companian_icon.png";

import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import { FiHeart, FiShield, FiClock, FiMessageCircle, FiVideo, FiPhoneCall } from "react-icons/fi";

export default function WelcomeSection() {
  const navigate = useNavigate();

  const features = [
    { 
      icon: <FiHeart size={30} />, 
      label: "Real humans, not bots",
      desc: "You talk to emotionally intelligent people — never AI bots."
    },
    { 
      icon: <FiShield size={30} />, 
      label: "Safe & Private",
      desc: "Your conversations remain confidential and secure."
    },
    { 
      icon: <FiClock size={30} />, 
      label: "Judgment-free zone",
      desc: "Share anything without fear, shame, or criticism."
    },
    { 
      icon: <FiClock size={30} />, 
      label: "Anytime you need us",
      desc: "Companions are available  — whenever you need support."
    },
  ];


   const handleServiceClick = () => {
    // onServiceSelect?.({
    //   type: 'chat',
    //   timestamp: new Date().toISOString()
    // });

    navigate("/services", {
      state: {
        serviceType:'chat',
        timestamp: new Date().toISOString()
      }
    });
  };

  return (
    <div className="w-full bg-gradient-to-br from-[#FFF7D1] to-[#FFEFB0] py-10 lg:py-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

        {/* LEFT SIDE */}
        <motion.div
          initial={{ opacity: 0, x: -35 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="flex flex-col items-center lg:items-start text-center lg:text-left"
        >
          <motion.img
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            src={LEFT_COMBINED_IMAGE}
            alt="GetCompanion Illustration"
            className="w-[260px] sm:w-[340px] md:w-[420px] lg:w-[520px] drop-shadow-xl rounded-2xl"
          />

          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mt-6 leading-snug tracking-tight px-2">
            Book Popular Happiness Executives Today
          </h3>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mt-6 w-full sm:w-auto justify-center lg:justify-start">
            <motion.button
              whileHover={{ scale: 1.07 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/home")}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-black text-white text-sm font-semibold shadow-lg hover:bg-gray-900 transition-all"
            >
              Explore GetCompanion →
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.07 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/Services")}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white border border-gray-300 text-gray-800 text-sm font-semibold shadow-md hover:shadow-lg transition-all"
            >
              Get Happiness Executive →
            </motion.button>
          </div>

          {/* Call Button */}
          <motion.button
            whileHover={{ scale: 1.07 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleServiceClick}
            className="w-full sm:w-auto mt-4 px-6 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
          >
            <FiMessageCircle size={20} />
            <FiPhoneCall size={20} />
            <FiVideo size={20} />
            Chat / Audio / Video call →
          </motion.button>
        </motion.div>

        {/* RIGHT SIDE */}
        <motion.div
          initial={{ opacity: 0, x: 35 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="flex flex-col text-center lg:text-left px-2"
        >
          <h1 className="text-3xl sm:text-2xl lg:text-4xl font-extrabold text-gray-900 leading-snug tracking-tight">
            Welcome to{" "}
            <span className="inline-flex items-center gap-2">
              <img src={ICON1} alt="GetCompanion Icon" className="w-7 sm:w-9 h-7 sm:h-9" />
              GetCompanion
            </span>
            <br />
            Because No One Deserves to Feel Alone
          </h1>

          <p className="text-gray-700 mt-4 sm:mt-6 text-base sm:text-lg leading-relaxed px-1">
            GetCompanion is your human connection platform — a safe space to talk, laugh, share, vent, or simply exist with a compassionate Happiness Executive who truly listens.
          </p>

          {/* FEATURES BOXES */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
            }}
            className="grid grid-cols-2 gap-3 sm:gap-5 mt-10"
          >
            {features.map((item, i) => (
              <motion.div
                key={i}
                variants={{
                  hidden: { opacity: 0, y: 25 },
                  visible: { opacity: 1, y: 0 },
                }}
                whileHover={{ scale: 1.06 }}
                className="group relative cursor-pointer p-4 sm:p-5 rounded-2xl bg-white/70 backdrop-blur-xl shadow-lg hover:shadow-2xl transition-all border border-white/40 overflow-hidden"
              >
                {/* ICON + LABEL */}
                <div className="flex items-center gap-3">
                  <span className="text-indigo-600 group-hover:scale-110 transition-all">
                    {item.icon}
                  </span>
                  <span className="font-semibold text-gray-900 text-left text-sm sm:text-base">
                    {item.label}
                  </span>
                </div>

                {/* DESCRIPTION ON HOVER */}
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  transition={{ duration: 0.3 }}
                  className="text-gray-600 text-xs sm:text-sm leading-relaxed mt-3 pr-1 hidden group-hover:block"
                >
                  {item.desc}
                </motion.p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
