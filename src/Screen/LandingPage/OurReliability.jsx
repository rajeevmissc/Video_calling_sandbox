import React from "react";
import frame1 from "../../Logos/frame1.png";
import frame2 from "../../Logos/frame2.png";
import frame3 from "../../Logos/frame3.png";
import curve_vector from "../../Logos/curve_vector.png";
export default function OurReliability() {
  return (
    <div className="w-full py-24 px-6 md:px-12 bg-white flex flex-col items-center">
      {/* Badge */}
      <span className="bg-[#FFE565] px-5 py-2 rounded-full text-sm font-semibold mb-5">
        OUR RELIABILITY
      </span>

      {/* Heading */}
      <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-3">
        Meet Our Happiness Executives
      </h2>

      <p className="text-gray-600 text-center max-w-2xl mb-16">
        Every Happiness Executive is handpicked, verified, and trained to listen with empathy.
      </p>

      {/* Timeline Section */}
      <div className="relative w-full max-w-6xl">
        {/* Curve Vector */}
        <img
          src={curve_vector} // replace with your curve
          alt="curve"
          className="w-full select-none"
        />

        {/* STEP 1 — LEFT */}
        <div className="absolute left-0 top-[120px] flex items-center gap-4">
          <img
            src={frame1}
            className="w-20 h-20 rounded-full bg-white shadow-md p-4"
            alt="verify"
          />

          <div>
            <h3 className="text-5xl font-extrabold text-gray-300 leading-none">1</h3>
            <h4 className="text-xl font-semibold text-gray-900 mt-1">
              Background Verification
            </h4>
            <p className="text-gray-600 text-sm max-w-xs">
              ID & police verified for your safety.
            </p>
          </div>
        </div>

        {/* STEP 2 — CENTER */}
        <div className="absolute left-1/2 -translate-x-1/2 top-[35px] flex flex-col items-center text-center">
          <img
            src={frame2}
            className="w-24 h-24 rounded-full bg-white shadow-md p-4"
            alt="brain"
          />

          <h3 className="text-5xl font-extrabold text-gray-300 leading-none mt-3">2</h3>
          <h4 className="text-xl font-semibold text-gray-900 mt-1">
            Psychometric Evaluation
          </h4>
          <p className="text-gray-600 text-sm max-w-xs">
            Ensures empathy, positivity, and emotional intelligence.
          </p>
        </div>

        {/* STEP 3 — RIGHT */}
        <div className="absolute right-0 top-[150px] flex flex-col items-end text-right">
          <img
            src={frame3}
            className="w-24 h-24 rounded-full bg-white shadow-md p-4"
            alt="training"
          />

          <h3 className="text-5xl font-extrabold text-gray-300 leading-none mt-3">3</h3>
          <h4 className="text-xl font-semibold text-gray-900 mt-1">
            Training & Supervision
          </h4>
          <p className="text-gray-600 text-sm max-w-xs">
            Continuous learning to keep care consistent.
          </p>
        </div>

      </div>
    </div>
  );
}
