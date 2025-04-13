
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <>
      <Navbar />
      
      <main className="min-h-screen py-24 px-6">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-6 text-center">About PartyVerse</h1>
          
          <div className="prose prose-lg mx-auto">
            <p>
              PartyVerse is an innovative AI-powered event planning platform designed to transform how people create and manage memorable celebrations. Our mission is to make event planning accessible, enjoyable, and stress-free for everyone.
            </p>
            
            <h2>Our Story</h2>
            <p>
              Founded in 2024, PartyVerse was born from a simple observation: planning events should be as enjoyable as attending them. Our founder, frustrated with the complexities of organizing a wedding, envisioned a platform that would leverage artificial intelligence to simplify every aspect of event planning.
            </p>
            
            <h2>Our Mission</h2>
            <p>
              We're committed to empowering individuals and businesses to create extraordinary events without the extraordinary stress. By combining cutting-edge AI technology with human creativity, we provide personalized suggestions, streamlined planning tools, and connections to top-quality vendors.
            </p>
            
            <h2>How We're Different</h2>
            <ul>
              <li><strong>AI-Powered Recommendations:</strong> Our platform analyzes your preferences and budget to suggest themes, vendors, and activities tailored to your vision.</li>
              <li><strong>All-in-One Platform:</strong> Manage every aspect of your event in one place, from guest lists to vendor bookings.</li>
              <li><strong>Vendor Marketplace:</strong> Connect directly with pre-screened, quality vendors who match your style and budget.</li>
              <li><strong>User-Friendly Design:</strong> Intuitive interfaces make planning enjoyable, whether you're organizing your first event or your fiftieth.</li>
            </ul>
            
            <h2>Our Team</h2>
            <p>
              PartyVerse brings together experts in event planning, technology, and customer experience. Our diverse team shares a passion for creating meaningful celebrations and leveraging technology to enhance human connections.
            </p>
            
            <div className="flex justify-center mt-8">
              <Link to="/contact">
                <Button size="lg">
                  Get in Touch
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default About;
