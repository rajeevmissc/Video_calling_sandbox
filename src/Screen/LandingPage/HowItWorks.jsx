import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

import frame1 from "../../Logos/loginimage.png";
import frame2 from "../../Logos/serviceimage.png";
import frame3 from "../../Logos/frame3.png";

export default function HowItWorks() {
  const navigate = useNavigate();

  return (
    <div className="w-full bg-white py-16 flex flex-col items-center px-5 md:px-20">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full md:max-w-3xl text-left"
      >
        <span className="bg-[#FFE565] px-5 py-2 rounded-full text-xs sm:text-sm font-semibold mb-4 inline-block">
          HOW IT WORKS
        </span>

        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
          Clarity Through Simplicity
        </h2>

        <p className="text-gray-600 mt-3 text-base sm:text-lg max-w-xl">
          Every Happiness Executive is handpicked, verified, and trained to listen with empathy.
        </p>
      </motion.div>

      {/* Cards */}
      <div className="mt-14 w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 md:gap-10 max-w-7xl">

        {[
          {
            img: frame1,
            title: "Sign Up",
            desc: "Login with mobile number, no personal details asked. Number will be masked for executives.",
            color: "white",
            border: "border-gray-200"
          },
          {
            img: frame2,
            title: "Find Your Companion",
            desc: "Browse verified Happiness Executives near you or online.",
            color: "#FFF5C9",
            border: "border-yellow-200"
          },
          {
            img: frame3,
            title: "Get Happiness",
            desc: "Executives available for calling, chatting & in-person visit.",
            color: "white",
            border: "border-gray-200"
          },
        ].map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.15 }}
            whileHover={{ scale: 1.04, y: -8 }}
            className={`bg-[${item.color}] border ${item.border} rounded-3xl shadow-md p-8 flex flex-col items-center text-center hover:shadow-2xl transition min-h-[360px]`}
          >
            {/* Equal sized images */}
            <div className="w-48 h-48 mb-5 flex items-center justify-center">
              <img src={item.img} alt={item.title} className="object-contain w-full h-full" />
            </div>

            <h3 className="text-lg sm:text-xl font-semibold mb-2">{item.title}</h3>
            <p className="text-gray-600 text-sm">{item.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* Button */}
      <motion.button
        onClick={() => navigate("/home")}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.96 }}
        transition={{ duration: 0.4 }}
        className="mt-12 bg-black text-white px-8 sm:px-10 py-3 rounded-full text-sm font-semibold flex items-center gap-2 shadow-xl hover:bg-gray-900 transition-all"
      >
        Let's Explore
        <ArrowRight className="w-5 h-5" />
      </motion.button>
    </div>
  );
}

