

import React from "react";
import DesignCurve from "../../Logos/DesignCurve.png";

const FullScreenImage = () => {
  return (
    <div className="w-screen  h-screen overflow-hidden">
      <img
        src={DesignCurve}
        className="w-full h-full object-cover"
        alt="fullscreen"
      />
    </div>
  );
};

export default FullScreenImage;
