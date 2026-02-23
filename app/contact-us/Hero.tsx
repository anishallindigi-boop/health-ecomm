// AboutBanner.tsx
import React from "react";

const Hero: React.FC = () => {
  return (
    <section className="container">
      <img src="/contact-us.jpeg" alt="Contact Hero" className="w-full h-96 object-cover" />

      {/* White title box overlapping image */}
      {/* <div className="absolute left-1/2 bottom-0 translate-x-[-50%] ">
        <div className="bg-white px-40 py-4 shadow-md">
          <h2 className="text-xl md:text-5xl font-medium text-gray-900 text-center">
      Contact Us
          </h2>
        </div>
      </div> */}
    </section>
  );
};

export default Hero;
