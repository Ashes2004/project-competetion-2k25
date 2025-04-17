import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./Home.css";
const Home = () => {
  return (
    <div className="min-w-screen">
      <div className="hero pb-16">
        <Navbar />

        <section className="py-20  rounded-lg  mb-8">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-5xl font-bold text-blue-100 mb-4">
              Empowering Research, Innovation, and Entrepreneurship
            </h1>
            <p className="text-lg text-gray-500 mb-8">
              A platform to manage and showcase research projects, intellectual
              property, innovations, and thriving start-ups.
            </p>
            <a
              href="#research"
              className="bg-blue-800 hover:bg-blue-900 text-white font-bold py-3 px-6 rounded-full"
            >
              Explore More
            </a>
          </div>
        </section>
      </div>
      <section className="container w-screen  px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mx-36">
          {/* Research Projects */}
          <div className="bg-white rounded-2xl shadow-lg border border-red-400 p-8 flex flex-col justify-between hover:shadow-2xl transition">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">
                Research Projects
              </h2>
              <p className="text-gray-800 text-sm leading-relaxed">
                Track ongoing research initiatives, key details, and
                collaborations.
              </p>
            </div>
            <button className="mt-6 bg-green-800 hover:bg-green-800 text-white font-semibold py-2 px-5 rounded-lg w-fit">
              View Projects
            </button>
          </div>

          {/* IPR Management */}
          <div className="bg-white rounded-2xl border border-purple-800 shadow-lg p-8 flex flex-col justify-between hover:shadow-2xl transition">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">
                IPR Management
              </h2>
              <p className="text-gray-800 text-sm leading-relaxed">
                Manage patent filings and track their status efficiently.
              </p>
            </div>
            <button className="mt-6 bg-yellow-800 hover:bg-yellow-800 text-white font-semibold py-2 px-5 rounded-lg w-fit">
              View Patents
            </button>
          </div>

          {/* Innovation Tracker */}
          <div className="bg-white rounded-2xl border border-green-800 shadow-lg p-8 flex flex-col justify-between hover:shadow-2xl transition">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">
                Innovation Tracker
              </h2>
              <p className="text-gray-800 text-sm leading-relaxed">
                Discover and learn about the impactful innovations emerging from
                our ecosystem.
              </p>
            </div>
            <button className="mt-6 bg-purple-800 hover:bg-purple-800 text-white font-semibold py-2 px-5 rounded-lg w-fit">
              Explore Innovations
            </button>
          </div>

          {/* Start-up Hub */}
          <div className="bg-white rounded-2xl border border-yellow-800 shadow-lg p-8 flex flex-col justify-between hover:shadow-2xl transition">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">
                Start-up Hub
              </h2>
              <p className="text-gray-800 text-sm leading-relaxed">
                Connect with and learn about the exciting start-ups being
                nurtured here.
              </p>
            </div>
            <button className="mt-6 bg-indigo-800 hover:bg-indigo-800 text-white font-semibold py-2 px-5 rounded-lg w-fit">
              Discover Start-ups
            </button>
          </div>
        </div>
      </section>

      {/*about us section*/}
      <section
        id="about"
        className="container mx-auto px-6 py-16 bg-gradient-to-br from-blue-50 to-gray-100 "
      >
        <h2 className="text-4xl font-extrabold text-blue-800 mb-8 text-center">
          About Us
        </h2>
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-lg text-gray-800 mb-6 leading-relaxed">
            Our platform fosters a vibrant ecosystem for{" "}
            <span className="font-medium text-blue-800">
              research, innovation
            </span>
            , and{" "}
            <span className="font-medium text-blue-800">entrepreneurship</span>.
            We offer tools and resources to efficiently manage projects, protect
            intellectual property, track impactful innovations, and nurture
            start-up growth.
          </p>
          <p className="text-lg text-gray-800 leading-relaxed">
            We strive to unite researchers, innovators, and entrepreneurs to
            drive progress and spark meaningful impact across communities.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
