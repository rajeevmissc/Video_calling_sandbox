import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

import HappyCouple from "../../Logos/happy_couple.png";
import ElderlyMan from "../../Logos/elderly_man.png";
import YoungWoman from "../../Logos/young_women.png";
import DiverseGroup from "../../Logos/diverse_group.png";

const cardData = [
  { img: ElderlyMan, title: "For Elders", path: "/home" },
  { img: DiverseGroup, title: "For Young Adults", path: "/home" },
  { img: HappyCouple, title: "For Couples", path: "/home" },
  { img: YoungWoman, title: "For Anyone", path: "/home" }
];

export default function RealFacesSection() {
  const navigate = useNavigate();

  return (
    <div className="w-full bg-[#FFE04E] py-20 px-6 flex flex-col items-center">

      <div className="text-sm font-semibold bg-white px-6 py-2 rounded-full shadow-md">
        WHO WE’RE HERE FOR?
      </div>

      <h2 className="text-4xl md:text-5xl font-bold text-center mt-6 mb-14">
        Real Faces, Real Emotions
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl w-full">

        {cardData.map((card, index) => (
          <motion.div
            key={index}
            onClick={() => navigate(card.path)}   // 🔥 Full card clickable
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.15 }}
            className="relative w-full h-[260px] md:h-[320px] rounded-xl overflow-hidden shadow-xl group cursor-pointer"
          >
            <img
              src={card.img}
              className="w-full h-full object-cover transform group-hover:scale-110 transition-all duration-500"
              alt={card.title}
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>

            <div className="absolute bottom-5 left-5 text-white">
              <h3 className="text-2xl font-semibold drop-shadow-xl">{card.title}</h3>
            </div>

            <motion.button
              onClick={(e) => {
                e.stopPropagation(); // prevent click bubbling
                navigate(card.path);
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="
                absolute bottom-5 right-5
                bg-white text-black
                px-5 py-2 rounded-xl font-semibold
                flex items-center gap-2
                shadow-md
                opacity-0 group-hover:opacity-100
                translate-y-4 group-hover:translate-y-0
                transition-all duration-300
              "
            >
              Start Now
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-all duration-300" />
            </motion.button>
          </motion.div>
        ))}

      </div>
    </div>
  );
}
