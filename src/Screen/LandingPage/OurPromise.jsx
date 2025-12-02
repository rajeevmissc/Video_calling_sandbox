import React from "react";

export default function OurPromise() {
  return (
    <div className="w-full py-6 px-6 flex justify-center bg-gradient-to-b from-white via-[#F9FAFD] to-[#FFE3E3]">
      <div className="bg-[#FFE04D] max-w-5xl w-full rounded-[40px] p-10 md:p-16 text-center shadow-md">
        {/* Badge */}
        <span className="bg-white px-6 py-2 rounded-full text-sm font-semibold inline-block mb-8 shadow-sm">
          OUR PROMISE
        </span>

        {/* Text */}
        <p className="text-lg md:text-xl text-gray-800 mb-6 font-medium">
          We can't solve every problem.
        </p>

        <p className="text-2xl md:text-4xl font-bold text-gray-900 leading-snug mb-6">
          But we promise to be there when you<br />
          need someone to listen.
        </p>

        <p className="text-lg md:text-xl text-gray-800 mb-6 font-medium">
          To remind you that you matter.
        </p>

        <p className="text-2xl md:text-4xl font-bold text-gray-900 leading-snug">
          That there's still goodness, laughter,<br />
          and warmth in the world, and you<br />
          deserve it.
        </p>
      </div>
    </div>
  );
}
