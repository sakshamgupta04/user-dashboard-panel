import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ServiceCard from '../components/ServiceCard';
import { Button } from '../components/ui/button';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  const serviceCards = [
    {
      imageUrl: "/lovable-uploads/102673b8-fb5e-4f01-8905-0f8a782e9666.png",
      title: "Qualitative Analysis",
      desc: "In-depth advanced analysis of faculty qualifications and fitment."
    },
    {
      imageUrl: "/lovable-uploads/04f49cb9-f1df-4f4b-8f6f-909e9743b534.png",
      title: "Fitment Rating",
      desc: "Accurate rating system for prospective faculty members."
    },
    {
      imageUrl: "/lovable-uploads/9acc30fb-df84-466c-91ed-0dbc80032f50.png",
      title: "Data Insights",
      desc: "Detailed insights and reports for better decision making."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#13152b] text-white" style={{fontFamily: 'Inter, sans-serif'}}>
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-20 px-6 md:px-12 flex flex-col md:flex-row items-center max-w-7xl mx-auto">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              <span className="text-purple">people.</span>
              <span className="text-purple-light">ai</span>
            </h1>
            <h2 className="text-2xl md:text-3xl mb-6">AI that finds your perfect hire</h2>
            <p className="mb-8 text-gray-300 max-w-md">
              Revolutionizing faculty recruitment in academic institutions with AI-powered candidate assessment.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button 
                onClick={() => navigate('/login')}
                className="button-gradient rounded-full px-8 py-6 text-white"
              >
                Get Started
              </Button>
              <Button 
                variant="outline" 
                className="rounded-full px-8 py-6 text-white border-purple hover:bg-purple/10"
              >
                Learn More
              </Button>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <img 
              src="/lovable-uploads/fd371c4a-d1bc-4ef0-8908-54a3f01d53d3.png" 
              alt="AI Recruitment" 
              className="w-full max-w-md opacity-90"
            />
          </div>
        </section>

        {/* About Section */}
        <section className="py-20 px-6 md:px-12 bg-black/30">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 mb-10 md:mb-0">
                <img 
                  src="/placeholder.svg" 
                  alt="AI Robot" 
                  className="max-w-sm mx-auto"
                />
              </div>
              <div className="md:w-1/2">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">About</h2>
                <p className="mb-6 text-gray-300">
                  people.ai is the ultimate solution for qualitative analysis and fitment rating of prospective faculty members in academic institutions. Our platform offers comprehensive tools to evaluate and improve the hiring process, ensuring the best fit for your institution.
                </p>
                <p className="mb-8 text-gray-300">
                  With our innovative technology, institutions can easily assess the qualifications and fit of faculty members, streamline recruitment, and make data-driven decisions to enhance academic excellence.
                </p>
                <Button className="rounded-full bg-purple hover:bg-purple-dark px-8">
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Our Services Section */}
        <section className="py-20 px-4 md:px-0 bg-[#13152b]">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-14 text-purple" style={{ fontFamily: 'inherit' }}>
              Our Services
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 justify-center place-items-center">
              {serviceCards.map((service) => (
                <ServiceCard
                  key={service.title}
                  imageUrl={service.imageUrl}
                  title={service.title}
                  desc={service.desc}
                />
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-6 md:px-12 bg-gradient-to-br from-purple/20 to-transparent">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Hiring Process?</h2>
            <p className="mb-8 text-gray-300">
              Join the leading institutions already using people.ai to revolutionize their faculty recruitment.
            </p>
            <Button 
              onClick={() => navigate('/signup')}
              className="button-gradient rounded-full px-10 py-6 text-lg"
            >
              Get Started Today
            </Button>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
