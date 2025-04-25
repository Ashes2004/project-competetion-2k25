import React, { useState, useEffect } from "react";
import Footer from "../components/Footer";
import { ChevronRight, Star, Zap, Briefcase, BookOpen } from "lucide-react";
import "./Home.css";
import HomeNav from "../components/HomeNav";
import RIISEBotWidget from "./RiiseBot";

const Home = () => {
  const [animatedCount, setAnimatedCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    
    const interval = setInterval(() => {
      setAnimatedCount(prev => {
        if (prev < 500) return prev + 5;
        clearInterval(interval);
        return 500;
      });
    }, 20);
    
    return () => clearInterval(interval);
  }, []);

  const stats = [
    { number: '500+', description: 'Research Projects' },
    { number: '120+', description: 'Patents Filed' },
    { number: '70+', description: 'Innovations' },
    { number: '45+', description: 'Startups Launched' },
  ];

  const serviceCards = [
    {
      title: "Research Projects",
      description: "Track ongoing research initiatives, key details, and collaborations.",
      icon: <BookOpen size={28} className="text-red-500" />,
      borderColor: "border-red-400",
      buttonColor: "bg-red-600 hover:bg-red-700",
      buttonText: "View Projects"
    },
    {
      title: "IPR Management",
      description: "Manage patent filings and track their status efficiently.",
      icon: <Star size={28} className="text-purple-500" />,
      borderColor: "border-purple-500",
      buttonColor: "bg-purple-600 hover:bg-purple-700",
      buttonText: "View Patents"
    },
    {
      title: "Innovation Tracker",
      description: "Discover impactful innovations emerging from our ecosystem.",
      icon: <Zap size={28} className="text-green-500" />,
      borderColor: "border-green-500",
      buttonColor: "bg-green-600 hover:bg-green-700",
      buttonText: "Explore Innovations"
    },
    {
      title: "Start-up Hub",
      description: "Connect with exciting start-ups being nurtured here.",
      icon: <Briefcase size={28} className="text-yellow-500" />,
      borderColor: "border-yellow-500",
      buttonColor: "bg-yellow-600 hover:bg-yellow-700",
      buttonText: "Discover Startups"
    }
  ];


  return (
    <div className="min-w-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="hero min-h-screen flex flex-col relative overflow-hidden">
        <div className="absolute inset-0 bg-blue-900 opacity-90 z-0"></div>
        <div className="absolute inset-0 bg-grid-pattern opacity-10 z-0"></div>
        
        <HomeNav />
        
        <section className="flex-grow flex items-center justify-center z-10 px-4">
          <div className={`container mx-auto max-w-5xl transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="text-center">
              <h1 className="text-5xl text-shadow md:text-6xl font-bold text-white mb-6 leading-tight">
                Empowering <span className="text-blue-300">Research</span>, <span className="text-green-300">Innovation</span>, and <span className="text-yellow-300">Entrepreneurship</span>
              </h1>
              
              <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
                A comprehensive platform to manage and showcase research projects, intellectual property, breakthrough innovations, and thriving start-ups.
              </p>
              
              <div className="flex flex-wrap justify-center gap-4">
                <a href="#services" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-full flex items-center transition-all transform hover:scale-105">
                  Explore Services <ChevronRight size={20} className="ml-1" />
                </a>
                <a href="#about" className="bg-transparent hover:bg-white/10 text-white font-bold py-3 px-8 rounded-full border-2 border-white transition-all transform hover:scale-105">
                  Learn More
                </a>
              </div>
            </div>
          </div>
        </section>

        
        {/* Stats Section */}
        <div className="container mx-auto px-4 pb-12 z-10">
          <div className="bg-white rounded-2xl shadow-xl p-8 -mb-24 grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-blue-800">
                  {index === 0 ? `${animatedCount}+` : stat.number}
                </div>
                <div className="text-gray-600 font-medium mb-20">{stat.description}</div>
              </div>
            ))}
          </div>
        </div>
      </div>


      {/* Services Section */}
      <section id="services" className="container mx-auto px-6 py-32 mt-12">
        <h2 className="text-4xl font-extrabold text-center mb-2 text-gray-800">Our Services</h2>
        <p className="text-center text-gray-600 mb-16 max-w-2xl mx-auto">Comprehensive solutions to support your research and innovation journey</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {serviceCards.map((card, index) => (
            <div 
              key={index} 
              className={`bg-white rounded-2xl shadow-lg border ${card.borderColor} p-6 flex flex-col justify-between hover:shadow-2xl transition-all transform hover:-translate-y-2`}
            >
              <div>
                <div className="mb-4">{card.icon}</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">
                  {card.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-6">
                  {card.description}
                </p>
              </div>
              <button  className={`${card.buttonColor} text-white font-semibold py-2 px-5 rounded-lg w-full transition-all`}>
                {card.buttonText}
              </button>
            </div>
          ))}
        </div>
      </section>
         

      {/* Features Section */}
      <section className="bg-gray-50 py-24">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-extrabold text-center mb-16 text-gray-800">Why Choose Us</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                title: "Streamlined Management",
                description: "Efficient tools to manage research projects, track progress, and collaborate with team members."
              },
              {
                title: "IP Protection",
                description: "Comprehensive system for managing intellectual property rights and patent applications."
              },
              {
                title: "Innovation Showcase",
                description: "Platform to highlight groundbreaking innovations and attract potential partners."
              },
              {
                title: "Startup Support",
                description: "Resources and mentorship to help transform innovations into successful startups."
              },
              {
                title: "Analytics & Insights",
                description: "Data-driven insights to measure impact and guide strategic decisions."
              },
              {
                title: "Global Network",
                description: "Connect with researchers, investors, and innovators worldwide."
              }
            ].map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all">
                <h3 className="text-xl font-bold text-blue-800 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="container mx-auto px-6 py-24">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-extrabold text-blue-800 mb-8 text-center">
            About Us
          </h2>
          
          <div className="text-center">
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              Our platform fosters a vibrant ecosystem for
              <span className="font-medium text-blue-700"> research</span>,
              <span className="font-medium text-green-700"> innovation</span>, and
              <span className="font-medium text-yellow-700"> entrepreneurship</span>.
              We offer cutting-edge tools and resources to efficiently manage projects, protect
              intellectual property, track impactful innovations, and nurture
              start-up growth.
            </p>
            
            <p className="text-lg text-gray-700 mb-10 leading-relaxed">
              We unite researchers, innovators, and entrepreneurs to
              drive progress and create meaningful impact across communities and industries worldwide.
            </p>
            
            <a href="#contact" className="inline-block bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 px-8 rounded-full transition-all transform hover:scale-105">
              Join Our Community
            </a>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-50 py-24">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-extrabold text-center mb-16 text-gray-800">Success Stories</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote: "This platform revolutionized how we manage our research projects and IP assets.",
                author: "Dr. Sarah Chen",
                role: "Research Director"
              },
              {
                quote: "The innovation tracking system helped us identify collaboration opportunities we would have missed.",
                author: "Michael Rodriguez",
                role: "Innovation Lead"
              },
              {
                quote: "From research to startup in 6 months - this ecosystem made it possible.",
                author: "Priya Sharma",
                role: "Startup Founder"
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl shadow-md">
                <div className="text-blue-800 text-4xl mb-4">"</div>
                <p className="text-gray-700 mb-6 italic">{testimonial.quote}</p>
                <div className="font-bold text-gray-800">{testimonial.author}</div>
                <div className="text-gray-500 text-sm">{testimonial.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* CTA Section */}
      <section className="container mx-auto px-6 py-24">
        <div className="bg-blue-800 rounded-3xl overflow-hidden shadow-2xl">
          <div className="p-12 md:p-16 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Transform Your Research and Innovation?</h2>
            <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
              Join our platform and leverage powerful tools to manage research, protect IP, showcase innovations, and build successful startups.
            </p>
            <button className="bg-white text-blue-800 hover:bg-blue-100 font-bold py-3 px-10 rounded-full text-lg transition-all transform hover:scale-105">
              Get Started Today
            </button>
          </div>
        </div>
      </section>
      <RIISEBotWidget position="bottom-right" />
      <Footer />
    </div>
  );
};

export default Home;

