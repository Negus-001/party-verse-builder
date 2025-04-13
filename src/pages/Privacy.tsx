
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/card';

const Privacy = () => {
  return (
    <>
      <Navbar />
      
      <main className="min-h-screen py-24 px-6">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-6 text-center">Privacy Policy</h1>
          <p className="text-center text-muted-foreground mb-12">
            Last updated: April 13, 2024
          </p>
          
          <Card>
            <CardContent className="pt-6 prose max-w-none">
              <p>
                At PartyVerse, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, 
                and safeguard your information when you use our website and services.
              </p>
              
              <h2>1. Information We Collect</h2>
              <p>We collect information that you provide directly to us, including:</p>
              <ul>
                <li>Account information (name, email address, password)</li>
                <li>Profile information (phone number, address, preferences)</li>
                <li>Event information (event details, guest lists, vendor selections)</li>
                <li>Communications with us or other users through our platform</li>
                <li>Payment information when you make purchases</li>
              </ul>
              
              <p>We also automatically collect certain information when you use our services:</p>
              <ul>
                <li>Device information (IP address, browser type, operating system)</li>
                <li>Usage information (pages visited, time spent, actions taken)</li>
                <li>Location information (with your consent)</li>
                <li>Cookies and similar tracking technologies</li>
              </ul>
              
              <h2>2. How We Use Your Information</h2>
              <p>We use the information we collect to:</p>
              <ul>
                <li>Provide, maintain, and improve our services</li>
                <li>Process transactions and send related information</li>
                <li>Generate AI-powered event suggestions personalized to your preferences</li>
                <li>Connect you with vendors and other users</li>
                <li>Send service-related notifications</li>
                <li>Respond to your comments, questions, and requests</li>
                <li>Monitor and analyze trends and usage of our services</li>
                <li>Detect, prevent, and address fraud and other illegal activities</li>
                <li>Personalize your experience and deliver relevant content</li>
              </ul>
              
              <h2>3. Information Sharing and Disclosure</h2>
              <p>We may share your information in the following circumstances:</p>
              <ul>
                <li>With vendors you choose to connect with through our platform</li>
                <li>With third-party service providers who perform services on our behalf</li>
                <li>In response to legal process or government request</li>
                <li>To protect the rights, property, and safety of PartyVerse, our users, and the public</li>
                <li>In connection with a business transfer (merger, acquisition, etc.)</li>
                <li>With your consent or at your direction</li>
              </ul>
              
              <h2>4. Data Security</h2>
              <p>
                We implement appropriate security measures to protect your personal information from unauthorized access, 
                alteration, disclosure, or destruction. However, no method of transmission over the Internet or electronic 
                storage is 100% secure, and we cannot guarantee absolute security.
              </p>
              
              <h2>5. Your Choices</h2>
              <p>You can access and update certain information about you through your account settings. You may also:</p>
              <ul>
                <li>Opt out of receiving promotional emails by following the instructions in those emails</li>
                <li>Update or delete your account information</li>
                <li>Request access to, correction of, or deletion of your personal information</li>
                <li>Object to the processing of your personal information</li>
              </ul>
              
              <h2>6. Children's Privacy</h2>
              <p>
                Our services are not intended for children under 13 years of age, and we do not knowingly collect personal 
                information from children under 13. If we learn we have collected personal information from a child under 13, 
                we will delete that information.
              </p>
              
              <h2>7. Changes to This Privacy Policy</h2>
              <p>
                We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. 
                We will notify you of any material changes by posting the updated policy on our website and updating the 
                "Last updated" date.
              </p>
              
              <h2>8. Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, please contact us at privacy@partyverse.com.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default Privacy;
