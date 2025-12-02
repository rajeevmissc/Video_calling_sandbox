
import React from "react";

import PhoneChat from "../../Logos/PhoneChat.png";
import ShareStory from "../../Logos/shareStory.png";
import Couple from "../../Logos/couple.png";
import Understood from "../../Logos/Be-stood_new.png";



export default function EmotionalSafeSpace() {
  return (
    <div className="bg-white py-20 px-6 md:px-12 lg:px-20">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-16">
          <span className="inline-block bg-yellow-400 text-gray-900 px-6 py-2 rounded-full font-semibold text-sm">
            ABOUT US
          </span>

          <h2 className="mt-6 text-4xl font-bold leading-tight text-gray-900">
            The Emotional Safe Space
          </h2>
        </div>

        {/*GRID - All cards same height using aspect ratio*/}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

          {/* CARD WRAPPER WITH FIXED RATIO */}
          <div className="rounded-[32px] overflow-hidden">
            <div className="aspect-[4/5] w-full"> 
              <img
                src={PhoneChat}
                className="w-full h-full object-cover rounded-[32px]"
              />
            </div>
          </div>

          <div className="rounded-[32px] overflow-hidden">
            <div className="aspect-[4/5] w-full">
              <img
                src={ShareStory}
                className="w-full h-full object-cover rounded-[32px]"
              />
            </div>
          </div>

          <div className="rounded-[32px] overflow-hidden">
            <div className="aspect-[4/5] w-full">
              <img
                src={Couple}
                className="w-full h-full object-cover rounded-[32px]"
              />
            </div>
          </div>

          <div className="rounded-[32px] overflow-hidden">
            <div className="aspect-[4/5] w-full">
              <img
                src={Understood}
                className="w-full h-full object-cover rounded-[32px]"
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
