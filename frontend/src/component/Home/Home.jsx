import React from "react";
import clouds from "../../assets/clouds.png";
import Component from "../intercome";

const Home = () => {
  return (
    <div>
      <div
        className="h-[70vh] bg-primary bg-cover bg-center"
        style={{ backgroundImage: `url(${clouds})` }}
      >
        <div className="flex h-[70vh] flex-col items-center justify-center">
          <h1 className="p-2 text-white sm:text-3xl lg:text-5xl">
            Messaging when it matters
          </h1>
          <h4 className="p-2 text-white sm:text-sm lg:text-2xl">
            The essential mobile communications platform for high-impact
            organizations.
          </h4>
        </div>
      </div>
      <Component />
    </div>
  );
};

export default Home;
